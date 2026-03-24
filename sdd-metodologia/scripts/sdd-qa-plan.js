#!/usr/bin/env node
/**
 * sdd-qa-plan.js — Generate QA-PLAN.md and .specify/qa-plan.json
 *
 * Reads CONSTITUTION.md, scans specs/*, computes quality metrics,
 * checks quality gates (G1/G2/G3), and writes a QA Plan report
 * plus a JSON counterpart for dashboard consumption.
 *
 * Usage: node scripts/sdd-qa-plan.js <project-path>
 * Exit:  0=success, 1=missing project path, 2=no specs directory
 */

const fs = require('fs');
const path = require('path');

// ── Helpers (same pattern as generate-command-center-data.js) ──

function readFile(p) { try { return fs.readFileSync(p, 'utf8'); } catch { return null; } }
function readJSON(p) { const c = readFile(p); try { return JSON.parse(c); } catch { return null; } }
function listDir(p) { try { return fs.readdirSync(p); } catch { return []; } }

function isDir(p) {
  try { return fs.statSync(p).isDirectory(); } catch { return false; }
}

function countPattern(text, pattern) {
  if (!text) return 0;
  return (text.match(pattern) || []).length;
}

function countCheckboxes(text) {
  if (!text) return { checked: 0, total: 0 };
  const total = countPattern(text, /- \[.\]/g);
  const checked = countPattern(text, /- \[x\]/gi);
  return { checked, total };
}

// ── Argument validation ──

const projectPath = process.argv[2];
if (!projectPath) {
  console.error('Error: missing project path. Usage: node sdd-qa-plan.js <project-path>');
  process.exit(1);
}

const specsDir = path.join(projectPath, 'specs');
if (!fs.existsSync(specsDir) || !isDir(specsDir)) {
  console.error(`Error: specs directory not found at ${specsDir}`);
  process.exit(2);
}

const specifyDir = path.join(projectPath, '.specify');
const now = new Date().toISOString();

// ── 1. Read CONSTITUTION.md ──

const constitutionPath = path.join(projectPath, 'CONSTITUTION.md');
const constitutionContent = readFile(constitutionPath);

let constitutionVersion = 'unknown';
let qualityGates = { G1: 'Not defined', G2: 'Not defined', G3: 'Not defined' };
let dodPerPhase = {};
let evidenceTagRules = [];

if (constitutionContent) {
  // Extract version from frontmatter or heading
  const vMatch = constitutionContent.match(/version:\s*["']?([^"'\n]+)/i)
    || constitutionContent.match(/# .+v([\d.]+)/i);
  if (vMatch) constitutionVersion = vMatch[1].trim();

  // Extract quality gates
  const g1Match = constitutionContent.match(/G1[:\s—–-]+([^\n]+)/i);
  const g2Match = constitutionContent.match(/G2[:\s—–-]+([^\n]+)/i);
  const g3Match = constitutionContent.match(/G3[:\s—–-]+([^\n]+)/i);
  if (g1Match) qualityGates.G1 = g1Match[1].trim();
  if (g2Match) qualityGates.G2 = g2Match[1].trim();
  if (g3Match) qualityGates.G3 = g3Match[1].trim();

  // Extract DoD per phase (lines like "Phase N:" or "## Phase N")
  const dodRegex = /(?:phase|fase)\s+(\d+)[:\s—–-]+([^\n]+)/gi;
  let dodMatch;
  while ((dodMatch = dodRegex.exec(constitutionContent)) !== null) {
    dodPerPhase[`phase_${dodMatch[1]}`] = dodMatch[2].trim();
  }

  // Extract evidence tag rules
  const tagRegex = /\[(?:CÓDIGO|CONFIG|DOC|INFERENCIA|SUPUESTO)\]/g;
  const tags = constitutionContent.match(tagRegex);
  if (tags) evidenceTagRules = [...new Set(tags)];
}

// ── 2. Scan specs/* features ──

const featureDirs = listDir(specsDir).filter(d => isDir(path.join(specsDir, d)) && !d.startsWith('.'));

const features = featureDirs.map(dir => {
  const fd = path.join(specsDir, dir);

  // Read core artifacts
  const specContent = readFile(path.join(fd, 'spec.md'));
  const planContent = readFile(path.join(fd, 'plan.md'));
  const analysisContent = readFile(path.join(fd, 'analysis.md'));

  // Count requirement IDs
  const frCount = countPattern(specContent, /FR-\d+/g);
  const scCount = countPattern(specContent, /SC-\d+/g);
  const usCount = countPattern(specContent, /US-\d+/g);

  // Read QA sub-artifacts
  const acContent = readFile(path.join(fd, 'qa', 'acceptance-criteria.md'));
  const tcContent = readFile(path.join(fd, 'qa', 'test-coverage.md'));
  const qcContent = readFile(path.join(fd, 'qa', 'quality-checklist.md'))
    || readFile(path.join(fd, 'checklists', 'checklist.md'))
    || readFile(path.join(fd, 'checklist.md'));

  // Acceptance criteria
  const ac = countCheckboxes(acContent);

  // Test coverage: count FR-XXX lines that have a TS or test reference
  let coveredFR = 0, totalFRForCoverage = frCount;
  if (tcContent) {
    const tcLines = tcContent.split('\n');
    const frLines = tcLines.filter(l => /FR-\d+/i.test(l));
    totalFRForCoverage = frLines.length || frCount;
    coveredFR = frLines.filter(l => /TS-\d+|test|covered|✓|\[x\]/i.test(l)).length;
  }

  // Checklist completion
  const checklist = countCheckboxes(qcContent);

  // Determine phase from context.json or file presence
  const ctxPath = path.join(fd, 'context.json')
    || path.join(projectPath, '.specify', 'context.json');
  const featureCtx = readJSON(path.join(fd, 'context.json'));
  const globalCtx = readJSON(path.join(projectPath, '.specify', 'context.json'));

  let phase = 0;
  if (featureCtx && featureCtx.phase != null) {
    phase = featureCtx.phase;
  } else if (globalCtx && globalCtx.currentFeature === dir && globalCtx.phase != null) {
    phase = globalCtx.phase;
  } else {
    // Infer from file presence
    if (analysisContent) phase = 6;
    else if (fs.existsSync(path.join(fd, 'tasks.md'))) phase = 5;
    else if (fs.existsSync(path.join(fd, 'tests')) || fs.existsSync(path.join(fd, 'scenarios'))) phase = 4;
    else if (qcContent) phase = 3;
    else if (planContent) phase = 2;
    else if (specContent) phase = 1;
  }

  // Health score from analysis
  let healthScore = null;
  if (analysisContent) {
    const hMatch = analysisContent.match(/health[_\s-]*score[:\s]+(\d+)/i);
    if (hMatch) healthScore = parseInt(hMatch[1], 10);
  }

  return {
    name: dir,
    phase,
    hasSpec: !!specContent,
    hasPlan: !!planContent,
    hasAnalysis: !!analysisContent,
    hasAcceptanceCriteria: !!acContent,
    hasTestCoverage: !!tcContent,
    hasChecklist: !!qcContent,
    healthScore,
    counts: { fr: frCount, sc: scCount, us: usCount },
    ac: { checked: ac.checked, total: ac.total },
    testCoverage: { covered: coveredFR, total: totalFRForCoverage },
    checklist: { checked: checklist.checked, total: checklist.total }
  };
});

// ── 3. Compute global metrics ──

const totalFeatures = features.length;
const featuresWithAC = features.filter(f => f.hasAcceptanceCriteria).length;
const acCoverage = totalFeatures > 0 ? (featuresWithAC / totalFeatures * 100) : 0;

const totalFR = features.reduce((s, f) => s + f.counts.fr, 0);
const coveredFR = features.reduce((s, f) => s + f.testCoverage.covered, 0);
const testCoverage = totalFR > 0 ? (coveredFR / totalFR * 100) : 0;

const checklistPcts = features
  .filter(f => f.checklist.total > 0)
  .map(f => f.checklist.checked / f.checklist.total * 100);
const avgChecklist = checklistPcts.length > 0
  ? checklistPcts.reduce((a, b) => a + b, 0) / checklistPcts.length : 0;

// DoD status per phase
const dodStatus = {};
for (let p = 0; p <= 8; p++) {
  const inPhase = features.filter(f => f.phase >= p);
  dodStatus[`phase_${p}`] = {
    total: inPhase.length,
    description: dodPerPhase[`phase_${p}`] || '—'
  };
}

// ── 4. Check quality gates ──

function checkG1(features) {
  const applicable = features.filter(f => f.phase > 2);
  const passing = applicable.filter(f => f.hasSpec && f.hasPlan);
  return {
    applicable: applicable.length,
    passing: passing.length,
    pass: applicable.length === 0 || passing.length === applicable.length,
    failing: applicable.filter(f => !(f.hasSpec && f.hasPlan)).map(f => f.name)
  };
}

function checkG2(features) {
  const applicable = features.filter(f => f.phase > 6);
  const passing = applicable.filter(f => f.hasAnalysis && (f.healthScore == null || f.healthScore >= 95));
  return {
    applicable: applicable.length,
    passing: passing.length,
    pass: applicable.length === 0 || passing.length === applicable.length,
    failing: applicable.filter(f => !(f.hasAnalysis && (f.healthScore == null || f.healthScore >= 95))).map(f => f.name)
  };
}

function checkG3(features) {
  const applicable = features.filter(f => f.phase > 7);
  const passing = applicable.filter(f =>
    f.checklist.total > 0 && f.checklist.checked === f.checklist.total
  );
  return {
    applicable: applicable.length,
    passing: passing.length,
    pass: applicable.length === 0 || passing.length === applicable.length,
    failing: applicable.filter(f =>
      !(f.checklist.total > 0 && f.checklist.checked === f.checklist.total)
    ).map(f => f.name)
  };
}

const gates = {
  G1: checkG1(features),
  G2: checkG2(features),
  G3: checkG3(features)
};

// ── 5. Write QA-PLAN.md ──

function pct(n) { return n.toFixed(1); }
function gateIcon(g) { return g.pass ? 'PASS' : 'FAIL'; }

const md = `# QA Plan

> **Version**: 1.0 | **Generated**: ${now}
> **Constitution version**: ${constitutionVersion}
> **Features scanned**: ${totalFeatures}

---

## 1. Global Definition of Done

| Phase | DoD Criteria |
|-------|-------------|
${Object.keys(dodStatus).sort().map(k => {
  const num = k.replace('phase_', '');
  return `| Phase ${num} | ${dodStatus[k].description} |`;
}).join('\n')}

---

## 2. Global Acceptance Criteria

| Metric | Value |
|--------|-------|
| Features with AC defined | ${featuresWithAC} / ${totalFeatures} (${pct(acCoverage)}%) |
| Total FR across project | ${totalFR} |
| FR with test coverage | ${coveredFR} / ${totalFR} (${pct(testCoverage)}%) |
| Avg checklist completion | ${pct(avgChecklist)}% |

---

## 3. Quality Gate Registry

| Gate | Rule | Applicable | Passing | Status | Failing |
|------|------|-----------|---------|--------|---------|
| G1 | spec.md + plan.md (phase > 2) | ${gates.G1.applicable} | ${gates.G1.passing} | ${gateIcon(gates.G1)} | ${gates.G1.failing.join(', ') || '—'} |
| G2 | analysis.md + health >= 95 (phase > 6) | ${gates.G2.applicable} | ${gates.G2.passing} | ${gateIcon(gates.G2)} | ${gates.G2.failing.join(', ') || '—'} |
| G3 | all tasks checked + tests (phase > 7) | ${gates.G3.applicable} | ${gates.G3.passing} | ${gateIcon(gates.G3)} | ${gates.G3.failing.join(', ') || '—'} |

---

## 4. Feature Quality Registry

| Feature | Phase | FR | SC | US | AC (checked/total) | Test Cov | Checklist | Health |
|---------|-------|----|----|----|---------------------|----------|-----------|--------|
${features.map(f => {
  const acStr = f.ac.total > 0 ? `${f.ac.checked}/${f.ac.total}` : '—';
  const tcStr = f.testCoverage.total > 0 ? `${f.testCoverage.covered}/${f.testCoverage.total}` : '—';
  const clStr = f.checklist.total > 0 ? `${f.checklist.checked}/${f.checklist.total}` : '—';
  const hsStr = f.healthScore != null ? `${f.healthScore}%` : '—';
  return `| ${f.name} | ${f.phase} | ${f.counts.fr} | ${f.counts.sc} | ${f.counts.us} | ${acStr} | ${tcStr} | ${clStr} | ${hsStr} |`;
}).join('\n')}

---

## 5. Sub-QA Artifacts Index

| Feature | acceptance-criteria.md | test-coverage.md | quality-checklist.md | spec.md | plan.md | analysis.md |
|---------|----------------------|-------------------|----------------------|---------|---------|-------------|
${features.map(f => {
  const y = 'YES', n = '—';
  return `| ${f.name} | ${f.hasAcceptanceCriteria ? y : n} | ${f.hasTestCoverage ? y : n} | ${f.hasChecklist ? y : n} | ${f.hasSpec ? y : n} | ${f.hasPlan ? y : n} | ${f.hasAnalysis ? y : n} |`;
}).join('\n')}

---

*Generated by sdd-qa-plan.js*
`;

fs.writeFileSync(path.join(projectPath, 'QA-PLAN.md'), md, 'utf8');

// ── 6. Write .specify/qa-plan.json ──

if (!fs.existsSync(specifyDir)) {
  fs.mkdirSync(specifyDir, { recursive: true });
}

const jsonData = {
  version: '1.0',
  generatedAt: now,
  constitutionVersion,
  metrics: {
    totalFeatures,
    acCoverage: parseFloat(pct(acCoverage)),
    testCoverage: parseFloat(pct(testCoverage)),
    avgChecklistCompletion: parseFloat(pct(avgChecklist)),
    totalFR,
    coveredFR
  },
  qualityGates: {
    definitions: qualityGates,
    status: gates
  },
  dodPerPhase: dodStatus,
  evidenceTagRules,
  features
};

fs.writeFileSync(path.join(specifyDir, 'qa-plan.json'), JSON.stringify(jsonData, null, 2), 'utf8');

// ── Summary ──

console.log(
  `QA Plan generated: ${totalFeatures} features, ` +
  `AC coverage ${pct(acCoverage)}%, ` +
  `test coverage ${pct(testCoverage)}%`
);
