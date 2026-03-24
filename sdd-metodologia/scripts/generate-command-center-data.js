#!/usr/bin/env node
/**
 * generate-command-center-data.js — Generate shared/data.js for SDD ALM
 *
 * Scans the project for: specs, constitution, premise, tasks, tests,
 * RAG memories, session logs, health history, sentinel state, and
 * workspace files. Produces window.DASHBOARD_DATA for all 7 ALM views.
 *
 * Usage: node scripts/generate-command-center-data.js <project-path>
 * Output: <project-path>/.specify/shared/data.js
 */

const fs = require('fs');
const path = require('path');

const projectPath = process.argv[2] || '.';
const specsDir = path.join(projectPath, 'specs');
const specifyDir = path.join(projectPath, '.specify');
const outputDir = path.join(specifyDir, 'shared');
const outputFile = path.join(outputDir, 'data.js');

function readJSON(fp) {
  try { return JSON.parse(fs.readFileSync(fp, 'utf8')); } catch { return null; }
}
function readFile(fp) {
  try { return fs.readFileSync(fp, 'utf8'); } catch { return null; }
}
function fileStat(fp) {
  try { const s = fs.statSync(fp); return { size: s.size, mtime: s.mtime.toISOString() }; } catch { return null; }
}

// ── Scan features ──
const features = [];
if (fs.existsSync(specsDir)) {
  fs.readdirSync(specsDir).filter(d => {
    const full = path.join(specsDir, d);
    return fs.statSync(full).isDirectory() && !d.startsWith('.');
  }).forEach(dir => {
    const fd = path.join(specsDir, dir);
    const specContent = readFile(path.join(fd, 'spec.md'));
    const planContent = readFile(path.join(fd, 'plan.md'));
    const tasksContent = readFile(path.join(fd, 'tasks.md'));
    const checklistContent = readFile(path.join(fd, 'checklists', 'checklist.md')) || readFile(path.join(fd, 'checklist.md'));
    const analysisContent = readFile(path.join(fd, 'analysis.md'));
    const hasTests = fs.existsSync(path.join(fd, 'tests'));

    // Count requirements
    const frCount = specContent ? (specContent.match(/FR-\d+/g) || []).length : 0;
    const usCount = specContent ? (specContent.match(/US-\d+/g) || []).length : 0;
    const scCount = specContent ? (specContent.match(/SC-\d+/g) || []).length : 0;

    // Count tasks
    let totalTasks = 0, completedTasks = 0;
    if (tasksContent) {
      totalTasks = (tasksContent.match(/- \[.\]/g) || []).length;
      completedTasks = (tasksContent.match(/- \[x\]/gi) || []).length;
    }

    // Count test scenarios
    let testCount = 0;
    if (hasTests) {
      try {
        const testFiles = fs.readdirSync(path.join(fd, 'tests', 'features')).filter(f => f.endsWith('.feature'));
        testFiles.forEach(tf => {
          const content = readFile(path.join(fd, 'tests', 'features', tf));
          if (content) testCount += (content.match(/Scenario/g) || []).length;
        });
      } catch { /* ignore */ }
    }

    // Determine phase
    let phase = 'init';
    if (specContent) phase = 'user-specs';
    if (planContent) phase = 'technical-specs';
    if (checklistContent) phase = 'bdd-analysis';
    if (hasTests) phase = 'test';
    if (tasksContent) phase = 'task';
    if (analysisContent) phase = 'organize-plan';
    if (completedTasks === totalTasks && totalTasks > 0) phase = 'complete';

    features.push({
      id: dir,
      name: dir.replace(/^\d+-/, '').replace(/-/g, ' '),
      phase,
      spec: !!specContent, plan: !!planContent, tasks: !!tasksContent,
      tests: hasTests, checklist: !!checklistContent, analysis: !!analysisContent,
      frCount, usCount, scCount, testCount,
      totalTasks, completedTasks,
      progress: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
      status: completedTasks === totalTasks && totalTasks > 0 ? 'complete' : totalTasks > 0 ? 'in_progress' : 'pending'
    });
  });
}

// ── Constitution ──
const constitutionContent = readFile(path.join(projectPath, 'CONSTITUTION.md'));
const principles = [];
if (constitutionContent) {
  const matches = constitutionContent.matchAll(/###\s+([\w.]+)\.\s+(.+)/g);
  for (const m of matches) {
    const level = constitutionContent.includes(`${m[2]}`) && constitutionContent.includes('NON-NEGOTIABLE') ? 'MUST' : 'SHOULD';
    principles.push({ number: m[1], name: m[2].trim(), level });
  }
}

// ── Premise ──
const hasPremise = fs.existsSync(path.join(projectPath, 'PREMISE.md'));

// ── Score history ──
const scoreHistory = readJSON(path.join(specifyDir, 'health-history.json'))
  || readJSON(path.join(specifyDir, 'score-history.json')) || [];

// ── Sentinel state ──
const sentinel = readJSON(path.join(specifyDir, 'sentinel-state.json')) || {};

// ── Session log ──
const sessionLogData = readJSON(path.join(specifyDir, 'session-log.json'));
const sessionLog = sessionLogData ? (sessionLogData.events || []).slice(-20) : [];

// ── RAG memories ──
const ragMemories = [];
const ragDir = path.join(specifyDir, 'rag-memory');
if (fs.existsSync(ragDir)) {
  fs.readdirSync(ragDir).filter(f => f.startsWith('rag-memory-of-')).forEach(f => {
    const content = readFile(path.join(ragDir, f));
    const abstract = content ? (content.match(/## Abstract\n([\s\S]*?)(?=\n## )/)?.[1] || '').trim().slice(0, 200) : '';
    const type = content ? (content.match(/type:\s*(.+)/)?.[1] || 'text').trim() : 'text';
    ragMemories.push({ filename: f, type, abstract, ...fileStat(path.join(ragDir, f)) });
  });
}

// ── Workspace file tree ──
function scanDir(dir, prefix, depth) {
  if (depth > 3) return [];
  const entries = [];
  try {
    fs.readdirSync(dir).filter(f => !f.startsWith('.')).slice(0, 50).forEach(f => {
      const full = path.join(dir, f);
      const stat = fs.statSync(full);
      const rel = prefix ? `${prefix}/${f}` : f;
      if (stat.isDirectory()) {
        entries.push({ name: f, path: rel, type: 'dir', children: scanDir(full, rel, depth + 1) });
      } else {
        entries.push({ name: f, path: rel, type: 'file', size: stat.size, mtime: stat.mtime.toISOString() });
      }
    });
  } catch { /* ignore */ }
  return entries;
}

const workspaceTree = [];
// Scan key project directories
['specs', '.specify', 'workspace'].forEach(d => {
  const full = path.join(projectPath, d);
  if (fs.existsSync(full)) {
    workspaceTree.push({ name: d, path: d, type: 'dir', children: scanDir(full, d, 0) });
  }
});
// Add root governance files
['CONSTITUTION.md', 'PREMISE.md', 'tasklog.md', 'changelog.md', 'decision-log.md'].forEach(f => {
  const stat = fileStat(path.join(projectPath, f));
  if (stat) workspaceTree.push({ name: f, path: f, type: 'file', ...stat });
});

// ── Operational logs ──
const tasklogContent = readFile(path.join(projectPath, 'tasklog.md'));
const changelogContent = readFile(path.join(projectPath, 'changelog.md'));
const decisionLogContent = readFile(path.join(projectPath, 'decision-log.md'));
const operationalLogs = {
  tasklog: { exists: !!tasklogContent, entries: tasklogContent ? (tasklogContent.match(/\|[^|]+\|[^|]+\|/g) || []).length : 0 },
  changelog: { exists: !!changelogContent, entries: changelogContent ? (changelogContent.match(/^- \*\*/gm) || []).length : 0 },
  decisionLog: { exists: !!decisionLogContent, entries: decisionLogContent ? (decisionLogContent.match(/## DEC-/g) || []).length : 0 },
};

// ── Knowledge graph ──
const kgraph = readJSON(path.join(specifyDir, 'knowledge-graph.json'));

// ── QA Plan (from sdd-qa-plan.js output) ──
const qaplan = readJSON(path.join(specifyDir, 'qa-plan.json'));

// ── Backlog (from backlog.md or backlog.json) ──
const backlogJSON = readJSON(path.join(specifyDir, 'backlog.json')) || [];
const backlogMd = readFile(path.join(projectPath, 'backlog.md'));
const backlog = backlogJSON.length > 0 ? backlogJSON : [];
if (backlog.length === 0 && backlogMd) {
  const rows = backlogMd.matchAll(/\|\s*(BL-\d+)\s*\|\s*([^|]+)\s*\|\s*([^|]+)\s*\|\s*([^|]+)\s*\|/g);
  for (const r of rows) backlog.push({ id: r[1].trim(), name: r[2].trim(), priority: r[3].trim(), status: r[4].trim() });
}

// ── Structured operational log entries ──
function parseChangelog(content) {
  if (!content) return [];
  const entries = [];
  const re = /^##?\s*(\d{4}-\d{2}-\d{2})\s*[-–]\s*\*?\*?\[?(\w+)\]?\*?\*?:?\s*(.+)/gm;
  let m; while ((m = re.exec(content))) entries.push({ date: m[1], type: m[2].toLowerCase(), description: m[3].trim() });
  return entries.slice(-30);
}
function parseTasklog(content) {
  if (!content) return [];
  const entries = [];
  const re = /\|\s*(TL-\d+)\s*\|\s*([^|]+)\s*\|\s*(\w[\w-]*)\s*\|\s*([^|]*)\s*\|\s*([^|]*)\s*\|/g;
  let m; while ((m = re.exec(content))) entries.push({ id: m[1].trim(), task: m[2].trim(), status: m[3].trim(), owner: m[4].trim(), opened: m[5].trim() });
  return entries;
}
function parseDecisionLog(content) {
  if (!content) return [];
  const entries = [];
  const re = /## (DEC-\d+)[:\s]*(.+)\n([\s\S]*?)(?=\n## DEC-|\n## [A-Z]|$)/g;
  let m; while ((m = re.exec(content))) {
    const body = m[3];
    const status = (body.match(/status:\s*(\w+)/i) || ['', 'proposed'])[1].toLowerCase();
    const context = (body.match(/context:\s*(.+)/i) || ['', ''])[1].trim();
    const decision = (body.match(/decision:\s*(.+)/i) || ['', ''])[1].trim();
    entries.push({ id: m[1], title: m[2].trim(), status, context, decision });
  }
  return entries;
}

const changelogEntries = parseChangelog(changelogContent);
const tasklogEntries = parseTasklog(tasklogContent);
const decisionLogEntries = parseDecisionLog(decisionLogContent);

// ── Per-feature taskItems with frRef (for FR drill-down) ──
features.forEach(f => {
  const tasksContent = readFile(path.join(specsDir, f.id, 'tasks.md'));
  if (!tasksContent) { f.taskItems = []; return; }
  const items = [];
  const re = /- \[([ xX])\]\s*(T-\d+)?\s*(.+?)(?:\s*\[?(FR-\d+)\]?)?$/gm;
  let m; while ((m = re.exec(tasksContent))) {
    const status = m[1].trim() === 'x' || m[1].trim() === 'X' ? 'done' : 'todo';
    const frRef = m[4] || null;
    items.push({ id: m[2] || `T-${items.length+1}`, title: m[3].trim(), status, frRef });
  }
  f.taskItems = items;

  // Also extract structured requirements with linked tests
  const specContent = readFile(path.join(specsDir, f.id, 'spec.md'));
  if (specContent) {
    const reqs = [];
    const frRe = /(?:^|\n)\*?\*?(FR-\d+)\*?\*?[:\s]*(.+)/g;
    let rm; while ((rm = frRe.exec(specContent))) {
      const linkedTests = items.filter(t => t.frRef === rm[1]).length > 0 ? 'covered' : 'orphan';
      reqs.push({ id: rm[1], title: rm[2].trim(), status: linkedTests });
    }
    if (reqs.length > 0) f.requirements = reqs;
  }
});

// ── Health score ──
const avgProgress = features.length > 0
  ? Math.round(features.reduce((sum, f) => sum + f.progress, 0) / features.length) : 0;

// ── Assemble ──
const data = {
  isDemo: false, // Real project data — demo badge hidden
  generatedAt: new Date().toISOString(),
  project: { name: path.basename(path.resolve(projectPath)) },
  premise: hasPremise ? { name: path.basename(path.resolve(projectPath)) } : null,
  insights: {
    healthScore: avgProgress,
    scoreHistory: Array.isArray(scoreHistory) ? scoreHistory : [],
  },
  features,
  constitution: principles.length > 0 ? { principles } : null,
  governance: { principles: { length: principles.length }, operationalLogs },
  quality: {
    passRate: features.length > 0 ? Math.round(features.filter(f => f.tests).length / features.length * 100) : 0,
    totalTests: features.reduce((s, f) => s + f.testCount, 0),
    totalFR: features.reduce((s, f) => s + f.frCount, 0),
  },
  workspace: {
    tree: workspaceTree,
    ragMemories,
    fileCount: workspaceTree.reduce(function countFiles(sum, node) {
      if (node.type === 'file') return sum + 1;
      return (node.children || []).reduce(countFiles, sum + 1);
    }, 0),
  },
  knowledgeGraph: kgraph ? {
    nodes: (kgraph.nodes || []).length,
    edges: (kgraph.edges || []).length,
    orphans: (kgraph.orphans || []).length,
  } : null,
  backlog,
  qaplan: qaplan || null,
  changelog: changelogEntries,
  tasklog: tasklogEntries,
  decisionLog: decisionLogEntries,
  sentinel,
  sessionLog,
  smartNav: features.some(f => f.status !== 'complete') ? {
    message: `${features.filter(f => f.status !== 'complete').length} feature(s) in progress`,
    command: '/sdd:status',
    action: 'Check pipeline status'
  } : null,
  summary: {
    totalFeatures: features.length,
    completeFeatures: features.filter(f => f.status === 'complete').length,
    totalTasks: features.reduce((s, f) => s + f.totalTasks, 0),
    completedTasks: features.reduce((s, f) => s + f.completedTasks, 0),
  }
};

// ── Write ──
fs.mkdirSync(outputDir, { recursive: true });
fs.writeFileSync(outputFile, `/* SDD ALM Data — Generated ${data.generatedAt} */\nwindow.DASHBOARD_DATA = ${JSON.stringify(data, null, 2)};\n`);

console.log(`ALM data: ${outputFile}`);
console.log(`  Features: ${data.summary.totalFeatures} (${data.summary.completeFeatures} complete)`);
console.log(`  Tasks: ${data.summary.completedTasks}/${data.summary.totalTasks}`);
console.log(`  Requirements: ${data.quality.totalFR} FR, ${data.quality.totalTests} tests`);
console.log(`  Workspace: ${data.workspace.fileCount} files, ${ragMemories.length} RAG memories`);
console.log(`  Health: ${data.insights.healthScore}%`);
