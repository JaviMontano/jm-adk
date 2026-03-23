#!/usr/bin/env node
/**
 * generate-dashboard.js — MetodologIA SDD Dashboard Generator
 *
 * Reads project artifacts (.specify/, specs/, CONSTITUTION.md, PREMISE.md)
 * and generates a branded single-file HTML dashboard.
 *
 * Usage: node scripts/generate-dashboard.js <project-path> [--output <path>]
 *
 * Reads design tokens from: references/design-tokens.json
 * Uses template from: scripts/dashboard-template.html
 *
 * Exit codes: 0=success, 1=missing path, 2=missing template, 4=permission, 5=parse error
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// ─── Args ───
const args = process.argv.slice(2);
const projectPath = args.find(a => !a.startsWith('--'));
const outputIdx = args.indexOf('--output');
const outputPath = outputIdx >= 0 ? args[outputIdx + 1] : null;

if (!projectPath) {
  console.error('Usage: node generate-dashboard.js <project-path> [--output <path>]');
  process.exit(1);
}

const SCRIPT_DIR = __dirname;
const TEMPLATE_PATH = path.join(SCRIPT_DIR, 'dashboard-template.html');
const TOKENS_PATH = path.join(SCRIPT_DIR, '..', 'references', 'design-tokens.json');

if (!fs.existsSync(TEMPLATE_PATH)) {
  console.error('Template not found: ' + TEMPLATE_PATH);
  process.exit(2);
}

// ─── Helpers ───
function readFile(filePath) {
  try { return fs.readFileSync(filePath, 'utf8'); } catch { return null; }
}

function readJSON(filePath) {
  const content = readFile(filePath);
  if (!content) return null;
  try { return JSON.parse(content); } catch { return null; }
}

function listDir(dirPath) {
  try { return fs.readdirSync(dirPath); } catch { return []; }
}

function sha256(content) {
  return crypto.createHash('sha256').update(content, 'utf8').digest('hex');
}

// ─── Parsers (ported from upstream IIC/kit) ───

function parseSpecStories(specContent) {
  if (!specContent) return [];
  const stories = [];
  const storyRegex = /^###\s+User Story\s+(\d+)\s*[-–—]\s*(.+?)(?:\s*\(Priority:\s*(P\d)\))?$/gm;
  let match;
  while ((match = storyRegex.exec(specContent)) !== null) {
    const id = 'US' + match[1];
    const title = match[2].trim();
    const priority = match[3] || 'P3';
    // Count scenarios
    const storySection = specContent.substring(match.index);
    const nextStory = storySection.indexOf('\n### User Story', 10);
    const block = nextStory > 0 ? storySection.substring(0, nextStory) : storySection;
    const scenarioCount = (block.match(/\*\*Given\*\*/g) || []).length;
    stories.push({ id, title, priority, scenarioCount, body: block.substring(0, 500) });
  }
  return stories;
}

function parseTasks(tasksContent) {
  if (!tasksContent) return [];
  const tasks = [];
  const taskRegex = /^- \[([ x])\]\s+(T\d+)\s*(?:\[P\])?\s*(?:\[(US\d+)\])?\s*(?:\[(BUG-\d+)\])?\s*(.+)$/gm;
  let match;
  while ((match = taskRegex.exec(tasksContent)) !== null) {
    tasks.push({
      checked: match[1] === 'x',
      id: match[2],
      storyTag: match[3] || null,
      bugTag: match[4] || null,
      description: match[5].trim(),
      isBugFix: !!match[4]
    });
  }
  return tasks;
}

function parseRequirements(specContent) {
  if (!specContent) return { requirements: [], successCriteria: [] };
  const requirements = [];
  const successCriteria = [];
  const frRegex = /\*\*(FR-\d+)\*\*[:\s]+(.+)/g;
  const scRegex = /\*\*(SC-\d+)\*\*[:\s]+(.+)/g;
  let m;
  while ((m = frRegex.exec(specContent)) !== null) {
    requirements.push({ id: m[1], text: m[2].trim().substring(0, 120) });
  }
  while ((m = scRegex.exec(specContent)) !== null) {
    successCriteria.push({ id: m[1], text: m[2].trim().substring(0, 120) });
  }
  return { requirements, successCriteria };
}

function parseConstitution(content) {
  if (!content) return { principles: [], version: null, exists: false };
  const principles = [];
  const principleRegex = /^#{1,3}\s+(?:(\w+)\.)?\s*(.+)/gm;
  let m;
  while ((m = principleRegex.exec(content)) !== null) {
    const num = m[1] || String(principles.length + 1);
    const name = m[2].trim();
    if (name.length < 80 && !name.includes('---')) {
      const level = content.substring(m.index, m.index + 500).includes('MUST') ? 'MUST' : 'SHOULD';
      principles.push({ number: num, name, text: '', rationale: '', level });
    }
  }
  // Version
  const versionMatch = content.match(/Version:\s*([\d.]+)/i);
  const version = versionMatch ? { version: versionMatch[1], ratified: '', lastAmended: '' } : null;
  return { principles: principles.slice(0, 30), version, exists: true };
}

function parseChecklists(checklistDir) {
  const files = [];
  const entries = listDir(checklistDir).filter(f => f.endsWith('.md'));
  for (const filename of entries) {
    const content = readFile(path.join(checklistDir, filename));
    if (!content) continue;
    const items = [];
    const lines = content.split('\n');
    let category = '';
    for (const line of lines) {
      const catMatch = line.match(/^#{2,4}\s+(.+)/);
      if (catMatch) { category = catMatch[1]; continue; }
      const itemMatch = line.match(/^- \[([ x])\]\s+(.+)/);
      if (itemMatch) {
        items.push({ checked: itemMatch[1] === 'x', text: itemMatch[2], category, tags: [], chkId: null });
      }
    }
    const checked = items.filter(i => i.checked).length;
    const total = items.length;
    const pct = total > 0 ? Math.round((checked / total) * 100) : 0;
    const color = pct === 100 ? 'green' : pct >= 67 ? 'yellow' : 'red';
    files.push({ name: filename.replace('.md', ''), filename, total, checked, items, percentage: pct, color });
  }
  const worstColor = files.some(f => f.color === 'red') ? 'red' : files.some(f => f.color === 'yellow') ? 'yellow' : 'green';
  const gateStatus = worstColor === 'green' ? 'open' : 'blocked';
  const gateLabel = gateStatus === 'open' ? 'GATE: OPEN' : 'GATE: BLOCKED';
  return { files, gate: { status: gateStatus, level: worstColor, label: gateLabel } };
}

function parseFeatureFiles(featuresDir) {
  const featureFiles = listDir(featuresDir).filter(f => f.endsWith('.feature'));
  const testSpecs = [];
  for (const file of featureFiles) {
    const content = readFile(path.join(featuresDir, file));
    if (!content) continue;
    const scenarioRegex = /^\s*Scenario(?:\s+Outline)?:\s*(.+)/gm;
    let m;
    while ((m = scenarioRegex.exec(content)) !== null) {
      const id = 'TS-' + String(testSpecs.length + 1).padStart(3, '0');
      testSpecs.push({ id, title: m[1].trim(), type: 'acceptance', priority: 'P3', traceability: [] });
    }
  }
  // Compute hash
  const allContent = featureFiles.map(f => readFile(path.join(featuresDir, f)) || '').join('\n');
  const hash = allContent ? sha256(allContent) : null;
  return { testSpecs, hash };
}

// ─── Feature Detection ───
function detectFeatures(specsDir) {
  const features = [];
  const dirs = listDir(specsDir).filter(d => {
    const fullPath = path.join(specsDir, d);
    return fs.statSync(fullPath).isDirectory() && /^\d{3}-/.test(d);
  });
  for (const dir of dirs.sort()) {
    const featurePath = path.join(specsDir, dir);
    const specFile = readFile(path.join(featurePath, 'spec.md'));
    const tasksFile = readFile(path.join(featurePath, 'tasks.md'));
    const tasks = parseTasks(tasksFile);
    const checked = tasks.filter(t => t.checked).length;
    const total = tasks.length;
    features.push({
      id: dir,
      name: dir.replace(/^\d+-/, '').replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
      stories: parseSpecStories(specFile).length,
      progress: `${checked}/${total}`,
      lastActive: Date.now()
    });
  }
  return features;
}

// ─── Pipeline State ───
function computePipeline(featurePath) {
  const phases = [
    { id: 'constitution', name: 'Constitution', file: null, check: () => fs.existsSync(path.join(projectPath, 'CONSTITUTION.md')) },
    { id: 'spec', name: 'Spec', file: 'spec.md' },
    { id: 'plan', name: 'Plan', file: 'plan.md' },
    { id: 'checklist', name: 'Checklist', dir: 'checklists' },
    { id: 'testify', name: 'Testify', dir: 'tests/features' },
    { id: 'tasks', name: 'Tasks', file: 'tasks.md' },
    { id: 'analyze', name: 'Analyze', file: 'analysis.md' },
    { id: 'implement', name: 'Implement', file: 'tasks.md' }
  ];
  return {
    phases: phases.map(p => {
      let status = 'not_started';
      if (p.check) {
        status = p.check() ? 'complete' : 'not_started';
      } else if (p.file) {
        status = fs.existsSync(path.join(featurePath, p.file)) ? 'complete' : 'not_started';
      } else if (p.dir) {
        const dir = path.join(featurePath, p.dir);
        status = fs.existsSync(dir) && listDir(dir).length > 0 ? 'complete' : 'not_started';
      }
      // Implementation progress
      if (p.id === 'implement' && status === 'complete') {
        const tasksContent = readFile(path.join(featurePath, 'tasks.md'));
        const tasks = parseTasks(tasksContent);
        const done = tasks.filter(t => t.checked).length;
        if (done === 0) status = 'not_started';
        else if (done < tasks.length) status = 'in_progress';
      }
      return {
        id: p.id,
        name: p.name,
        status,
        progress: null,
        optional: p.id === 'checklist' || p.id === 'analyze',
        clarifications: 0,
        clarificationEntries: []
      };
    })
  };
}

// ─── Board State ───
function computeBoard(featurePath) {
  const tasksContent = readFile(path.join(featurePath, 'tasks.md'));
  const allTasks = parseTasks(tasksContent);
  // Group by story
  const storyMap = {};
  const unassigned = [];
  for (const t of allTasks) {
    const key = t.storyTag || t.bugTag || null;
    if (key) {
      if (!storyMap[key]) storyMap[key] = { id: key, title: key, priority: 'P3', tasks: [] };
      storyMap[key].tasks.push(t);
    } else {
      unassigned.push(t);
    }
  }
  const cards = Object.values(storyMap);
  if (unassigned.length > 0) {
    cards.push({ id: 'Unassigned', title: 'Unassigned Tasks', priority: 'P3', tasks: unassigned });
  }
  const todo = [], in_progress = [], done = [];
  for (const card of cards) {
    const checked = card.tasks.filter(t => t.checked).length;
    const total = card.tasks.length;
    card.progress = `${checked}/${total}`;
    if (checked === total && total > 0) done.push({ ...card, column: 'done' });
    else if (checked > 0) in_progress.push({ ...card, column: 'in_progress' });
    else todo.push({ ...card, column: 'todo' });
  }
  // Integrity
  const featuresDir = path.join(featurePath, 'tests', 'features');
  const { hash } = fs.existsSync(featuresDir) ? parseFeatureFiles(featuresDir) : { hash: null };
  const ctx = readJSON(path.join(featurePath, 'context.json')) || readJSON(path.join(projectPath, '.specify', 'context.json'));
  const storedHash = ctx?.testify?.assertionHash || null;
  let integrityStatus = 'missing';
  if (hash && storedHash) integrityStatus = hash === storedHash ? 'valid' : 'tampered';
  else if (hash) integrityStatus = 'valid';

  return { todo, in_progress, done, integrity: { status: integrityStatus, currentHash: hash, storedHash } };
}

// ─── Insights & Lifecycle Loaders ───

function loadInsightsData(specifyDir, features, featureData) {
  const historyPath = path.join(specifyDir, 'health-history.json');
  const history = readJSON(historyPath);
  if (!history) return null;

  // Backward compat: old format is array, new has .snapshots
  const snapshots = Array.isArray(history) ? history : (history.snapshots || []);
  if (snapshots.length === 0) return null;

  // Compute trend from last 10 snapshots
  const recent = snapshots.slice(-10);
  const healthTrend = recent.map(s => ({ timestamp: s.timestamp, score: s.score || 0, featureId: s.featureId }));

  // Risk indicators from latest snapshot
  const latest = snapshots[snapshots.length - 1];
  const risks = latest.risks || [];
  const staleArtifacts = latest.staleArtifacts || [];

  // Compute recommendations
  const recommendations = [];
  for (const risk of risks) {
    if (/no tests|untested/i.test(risk)) recommendations.push({ command: '/sdd:test', reason: risk, priority: 'HIGH' });
    else if (/stale|not modified/i.test(risk)) recommendations.push({ command: '/sdd:spec', reason: risk, priority: 'MEDIUM' });
    else if (/constitution/i.test(risk)) recommendations.push({ command: '/sdd:00-constitution', reason: risk, priority: 'HIGH' });
    else if (/tampered|integrity/i.test(risk)) recommendations.push({ command: '/sdd:verify', reason: risk, priority: 'CRITICAL' });
    else recommendations.push({ command: '/sdd:status', reason: risk, priority: 'LOW' });
  }

  // Score trend indicator
  let trendDirection = 'stable';
  if (recent.length >= 2) {
    const delta = recent[recent.length - 1].score - recent[0].score;
    if (delta > 5) trendDirection = 'improving';
    else if (delta < -5) trendDirection = 'declining';
  }

  return {
    healthTrend,
    currentScore: latest.score || 0,
    trendDirection,
    risks,
    staleArtifacts,
    recommendations,
    snapshotCount: snapshots.length
  };
}

function loadTraceabilityIndex(specifyDir) {
  return readJSON(path.join(specifyDir, 'traceability-index.json')) || null;
}

function loadPhaseVelocity(specifyDir) {
  const data = readJSON(path.join(specifyDir, 'phase-velocity.json'));
  if (!data || !data.features) return null;

  const phases = ['constitution', 'spec', 'plan', 'checklist', 'testify', 'tasks', 'analyze', 'implement'];
  const velocityByPhase = {};

  for (const [featureId, featurePhases] of Object.entries(data.features)) {
    for (const phase of phases) {
      const p = featurePhases[phase];
      if (p && p.started && p.completed) {
        const days = (new Date(p.completed) - new Date(p.started)) / (1000 * 60 * 60 * 24);
        if (!velocityByPhase[phase]) velocityByPhase[phase] = [];
        velocityByPhase[phase].push(days);
      }
    }
  }

  const velocity = phases.map(phase => {
    const durations = velocityByPhase[phase] || [];
    const avgDays = durations.length > 0 ? durations.reduce((a, b) => a + b, 0) / durations.length : null;
    return { phase, avgDays, sampleCount: durations.length };
  }).filter(v => v.avgDays !== null);

  // Identify bottleneck
  let maxDays = 0;
  for (const v of velocity) {
    if (v.avgDays > maxDays) maxDays = v.avgDays;
  }
  for (const v of velocity) {
    v.isBottleneck = v.avgDays === maxDays && maxDays > 0;
  }

  return { velocity, features: data.features };
}

function computeSmartNavState(features, featureData) {
  if (features.length === 0) return { nextAction: { command: '/sdd:spec', reason: 'No features yet', phase: null }, phaseColors: {} };

  // Use first feature's pipeline
  const firstFeature = features[0];
  const fd = featureData[firstFeature.id];
  if (!fd || !fd.pipeline) return null;

  const phases = fd.pipeline.phases || [];
  const phaseColors = {};
  let nextAction = null;

  for (const phase of phases) {
    if (phase.status === 'complete') phaseColors[phase.id] = 'blue';
    else if (phase.status === 'in_progress') phaseColors[phase.id] = 'gold';
    else phaseColors[phase.id] = 'muted';
  }

  // Find first incomplete phase
  const phaseToCommand = {
    constitution: '/sdd:00-constitution',
    spec: '/sdd:spec',
    plan: '/sdd:plan',
    checklist: '/sdd:check',
    testify: '/sdd:test',
    tasks: '/sdd:tasks',
    analyze: '/sdd:analyze',
    implement: '/sdd:impl'
  };

  for (const phase of phases) {
    if (phase.status !== 'complete') {
      nextAction = {
        command: phaseToCommand[phase.id] || '/sdd:status',
        reason: `Phase "${phase.name}" is ${phase.status === 'in_progress' ? 'in progress' : 'not started'}`,
        phase: phase.id
      };
      phaseColors[phase.id] = phase.status === 'in_progress' ? 'gold' : 'next';
      break;
    }
  }

  if (!nextAction) {
    nextAction = { command: '/sdd:dashboard', reason: 'All phases complete!', phase: null };
  }

  return { nextAction, phaseColors, activeFeature: firstFeature.id };
}

// ─── Filesystem & RAG Memory ───

function buildFilesystemTree(dirPath, basePath, depth) {
  if (depth > 5) return [];
  const entries = listDir(dirPath);
  const result = [];

  const SKIP = new Set(['node_modules', '.git', '.cache', 'dist', '.DS_Store']);

  for (const name of entries.sort()) {
    if (SKIP.has(name)) continue;
    const fullPath = path.join(dirPath, name);
    const relPath = path.relative(basePath, fullPath);

    try {
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        const children = buildFilesystemTree(fullPath, basePath, depth + 1);
        result.push({
          name, path: relPath, type: 'dir',
          children,
          fileCount: children.reduce((n, c) => n + (c.type === 'dir' ? c.fileCount : 1), 0)
        });
      } else {
        const ext = name.split('.').pop().toLowerCase();
        let category = 'other';
        if (name === 'CONSTITUTION.md') category = 'constitution';
        else if (name === 'PREMISE.md') category = 'premise';
        else if (name.startsWith('rag-memory-of-')) category = 'rag-memory';
        else if (name === 'spec.md') category = 'spec';
        else if (name === 'plan.md') category = 'plan';
        else if (name === 'tasks.md') category = 'tasks';
        else if (name === 'analysis.md') category = 'analysis';
        else if (ext === 'feature') category = 'test';
        else if (ext === 'json') category = 'config';
        else if (ext === 'md') category = 'doc';
        else if (['js', 'ts', 'py', 'sh'].includes(ext)) category = 'code';
        else if (['html', 'css'].includes(ext)) category = 'web';

        const age = Math.floor((Date.now() - stat.mtimeMs) / (1000 * 60 * 60 * 24));
        result.push({
          name, path: relPath, type: 'file', category,
          size: stat.size, mtime: stat.mtime.toISOString(),
          ageDays: age
        });
      }
    } catch { /* skip unreadable */ }
  }
  return result;
}

function loadRagMemories(ragDir) {
  if (!fs.existsSync(ragDir)) return [];
  const files = listDir(ragDir).filter(f => f.startsWith('rag-memory-of-') && f.endsWith('.md'));
  return files.map(f => {
    const content = readFile(path.join(ragDir, f)) || '';
    // Extract abstract from ## Abstract section
    const abstractMatch = content.match(/## Abstract\n\n([^\n]+)/);
    const abstract = abstractMatch ? abstractMatch[1].replace(/^>\s*/, '') : '';
    // Extract type from frontmatter
    const typeMatch = content.match(/type:\s*(\w+)/);
    const type = typeMatch ? typeMatch[1] : 'unknown';
    const capturedMatch = content.match(/captured:\s*(.+)/);
    const captured = capturedMatch ? capturedMatch[1].trim() : '';
    return { filename: f, abstract, type, captured, size: content.length };
  });
}

function loadSessionLog(specifyDir) {
  return readJSON(path.join(specifyDir, 'session-log.json')) || null;
}

function buildFilesystemData(projectPath) {
  const tree = buildFilesystemTree(projectPath, projectPath, 0);
  const ragDir = path.join(projectPath, '.specify', 'rag-memory');
  const ragMemories = loadRagMemories(ragDir);

  // Compute stats
  let totalFiles = 0, totalDirs = 0, totalSize = 0;
  function countRecursive(nodes) {
    for (const n of nodes) {
      if (n.type === 'dir') { totalDirs++; countRecursive(n.children || []); }
      else { totalFiles++; totalSize += (n.size || 0); }
    }
  }
  countRecursive(tree);

  return {
    tree,
    stats: { totalFiles, totalDirs, totalSize, ragMemoryCount: ragMemories.length },
    ragMemories
  };
}

// ─── Main ───
try {
  const specsDir = path.join(projectPath, 'specs');
  const specifyDir = path.join(projectPath, '.specify');

  // Also check for .specify/features/ pattern (flat layout)
  const features = fs.existsSync(specsDir) ? detectFeatures(specsDir) :
    fs.existsSync(path.join(specifyDir, 'features')) ? [{ id: 'default', name: 'Project', stories: 0, progress: '0/0', lastActive: Date.now() }] :
    [];

  const constitution = parseConstitution(readFile(path.join(projectPath, 'CONSTITUTION.md')));
  const premise = { content: readFile(path.join(projectPath, 'PREMISE.md')) || '', exists: fs.existsSync(path.join(projectPath, 'PREMISE.md')) };

  const featureData = {};
  for (const feature of features) {
    const featurePath = path.join(specsDir, feature.id);
    if (!fs.existsSync(featurePath)) continue;
    const specContent = readFile(path.join(featurePath, 'spec.md'));
    const { requirements, successCriteria } = parseRequirements(specContent);
    featureData[feature.id] = {
      board: computeBoard(featurePath),
      pipeline: computePipeline(featurePath),
      storyMap: {
        stories: parseSpecStories(specContent),
        requirements,
        successCriteria,
        clarifications: [],
        edges: []
      },
      planView: { techContext: [], fileStructure: null, diagram: { nodes: [], edges: [], raw: '' }, tesslTiles: [], exists: fs.existsSync(path.join(featurePath, 'plan.md')) },
      checklist: parseChecklists(path.join(featurePath, 'checklists')),
      testify: { requirements, testSpecs: [], tasks: [], edges: [], gaps: { untestedRequirements: [], unimplementedTests: [] }, pyramid: { acceptance: { count: 0, ids: [] }, contract: { count: 0, ids: [] }, validation: { count: 0, ids: [] } }, integrity: { status: 'missing', currentHash: null, storedHash: null }, exists: false },
      analyze: { healthScore: null, heatmap: { columns: [], rows: [] }, issues: [], metrics: null, constitutionAlignment: [], exists: false },
      bugs: { exists: false, bugs: [], orphanedTasks: [], summary: { total: 0, open: 0, fixed: 0, highestOpenSeverity: null, bySeverity: {} }, repoUrl: null }
    };
  }

  // ─── Insights & Lifecycle Data (nullable for graceful degradation) ───
  const insights = loadInsightsData(specifyDir, features, featureData);
  const traceability = loadTraceabilityIndex(specifyDir);
  const timeline = loadPhaseVelocity(specifyDir);
  const smartNav = computeSmartNavState(features, featureData);
  const filesystem = buildFilesystemData(projectPath);
  const sessionLog = loadSessionLog(specifyDir);

  const dashboardData = {
    meta: { projectPath: path.resolve(projectPath), generatedAt: new Date().toISOString() },
    features,
    constitution,
    premise,
    featureData,
    insights,
    traceability,
    timeline,
    smartNav,
    filesystem,
    sessionLog
  };

  // Read template and inject data
  let template = fs.readFileSync(TEMPLATE_PATH, 'utf8');
  const dataScript = `<script>window.DASHBOARD_DATA = ${JSON.stringify(dashboardData)};</script>`;
  template = template.replace('<!-- DASHBOARD_DATA_INJECTION_POINT -->', dataScript);

  // Write output
  const outFile = outputPath || path.join(specifyDir, 'dashboard.html');
  const outDir = path.dirname(outFile);
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  // Atomic write
  const tmpFile = outFile + '.tmp';
  fs.writeFileSync(tmpFile, template, 'utf8');
  fs.renameSync(tmpFile, outFile);

  console.log(`Dashboard generated: ${outFile}`);
  console.log(`Features: ${features.length}`);
  console.log(`Constitution: ${constitution.exists ? 'yes' : 'no'}`);
  console.log(`Premise: ${premise.exists ? 'yes' : 'no'}`);
  process.exit(0);
} catch (err) {
  console.error('Dashboard generation failed:', err.message);
  process.exit(5);
}
