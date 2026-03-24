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

// ── Health score ──
const avgProgress = features.length > 0
  ? Math.round(features.reduce((sum, f) => sum + f.progress, 0) / features.length) : 0;

// ── Assemble ──
const data = {
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
