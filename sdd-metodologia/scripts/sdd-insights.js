#!/usr/bin/env node
/**
 * sdd-insights.js — MetodologIA SDD Insights Computation Engine
 *
 * Computes health scores, phase velocity, traceability chains,
 * risk indicators, and smart recommendations for SDD projects.
 *
 * Usage: node scripts/sdd-insights.js <project-path> [--report] [--snapshot] [--json]
 *
 * Exit codes: 0=success, 1=missing path, 2=no features, 3=write error, 5=parse error
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// ─── Args ───
const args = process.argv.slice(2);
const projectPath = args.find(a => !a.startsWith('--'));
const flagReport = args.includes('--report');
const flagSnapshot = args.includes('--snapshot');
const flagJSON = args.includes('--json');

if (!projectPath) {
  console.error('Usage: node sdd-insights.js <project-path> [--report] [--snapshot] [--json]');
  process.exit(1);
}

// ─── Helpers (reused from generate-dashboard.js) ───

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

function atomicWrite(filePath, data) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const tmp = filePath + '.tmp';
  fs.writeFileSync(tmp, typeof data === 'string' ? data : JSON.stringify(data, null, 2), 'utf8');
  fs.renameSync(tmp, filePath);
}

// ─── Parsers (ported from generate-dashboard.js) ───

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

function parseTasks(tasksContent) {
  if (!tasksContent) return [];
  const tasks = [];
  const taskRegex = /^- \[([ x])\]\s+(T\d+)\s*(?:\[P\])?\s*(?:\[(US\d+)\])?\s*(?:\[(BUG-\d+)\])?\s*(.+)$/gm;
  let m;
  while ((m = taskRegex.exec(tasksContent)) !== null) {
    tasks.push({
      checked: m[1] === 'x',
      id: m[2],
      storyTag: m[3] || null,
      bugTag: m[4] || null,
      description: m[5].trim(),
      isBugFix: !!m[4]
    });
  }
  return tasks;
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
      principles.push({ number: num, name });
    }
  }
  const versionMatch = content.match(/Version:\s*([\d.]+)/i);
  const version = versionMatch ? versionMatch[1] : null;
  return { principles: principles.slice(0, 30), version, exists: true };
}

function parseFeatureFiles(featuresDir) {
  const featureFiles = listDir(featuresDir).filter(f => f.endsWith('.feature'));
  const testSpecs = [];
  for (const file of featureFiles) {
    const content = readFile(path.join(featuresDir, file));
    if (!content) continue;
    // Extract tags like @FR-001 above scenarios
    const scenarioRegex = /(?:(@[\w-]+(?:\s+@[\w-]+)*)\s*\n\s*)?Scenario(?:\s+Outline)?:\s*(.+)/gm;
    let m;
    while ((m = scenarioRegex.exec(content)) !== null) {
      const tags = m[1] ? m[1].match(/@[\w-]+/g).map(t => t.substring(1)) : [];
      const id = 'TS-' + String(testSpecs.length + 1).padStart(3, '0');
      const frRefs = tags.filter(t => /^FR-\d+$/.test(t));
      testSpecs.push({ id, title: m[2].trim(), tags, frRefs });
    }
  }
  return testSpecs;
}

function detectFeatures(specsDir) {
  const dirs = listDir(specsDir).filter(d => {
    const fullPath = path.join(specsDir, d);
    try { return fs.statSync(fullPath).isDirectory() && /^\d{3}-/.test(d); } catch { return false; }
  });
  return dirs.sort();
}

// ─── 1. Health Score ───

function computeHealthScore(featurePath, constitutionData) {
  const specContent = readFile(path.join(featurePath, 'spec.md'));
  const tasksContent = readFile(path.join(featurePath, 'tasks.md'));
  const featuresDir = path.join(featurePath, 'tests', 'features');

  const { requirements } = parseRequirements(specContent);
  const tasks = parseTasks(tasksContent);
  const testSpecs = fs.existsSync(featuresDir) ? parseFeatureFiles(featuresDir) : [];

  const frIds = requirements.map(r => r.id);
  const totalFR = frIds.length;

  // Factor 1: specCoverage — % of FR-NNN that have at least one task referencing them
  let specCoveredCount = 0;
  if (totalFR > 0) {
    for (const fr of frIds) {
      const hasTask = tasks.some(t => t.description.includes(fr) || t.storyTag === fr);
      if (hasTask) specCoveredCount++;
    }
  }
  const specCoverage = totalFR > 0 ? Math.round((specCoveredCount / totalFR) * 100) : 0;

  // Factor 2: testCoverage — % of FR-NNN that have at least one TS-NNN
  let testCoveredCount = 0;
  if (totalFR > 0) {
    for (const fr of frIds) {
      const hasTest = testSpecs.some(ts => ts.frRefs.includes(fr) || ts.title.includes(fr));
      if (hasTest) testCoveredCount++;
    }
  }
  const testCoverage = totalFR > 0 ? Math.round((testCoveredCount / totalFR) * 100) : 0;

  // Factor 3: taskCompletion — % of tasks checked
  const totalTasks = tasks.length;
  const checkedTasks = tasks.filter(t => t.checked).length;
  const taskCompletion = totalTasks > 0 ? Math.round((checkedTasks / totalTasks) * 100) : 0;

  // Factor 4: constitutionAlignment — 100% if exists and principles referenced in spec
  let constitutionAlignment = 0;
  if (constitutionData.exists) {
    if (constitutionData.principles.length === 0) {
      constitutionAlignment = 100; // exists but no parseable principles = pass
    } else if (specContent) {
      let referenced = 0;
      for (const p of constitutionData.principles) {
        // Check if principle name appears in spec or tasks
        const needle = p.name.toLowerCase();
        if (specContent.toLowerCase().includes(needle)) referenced++;
      }
      constitutionAlignment = Math.round((referenced / constitutionData.principles.length) * 100);
    }
  }

  // Weighted score: 25% each factor
  const score = Math.round(
    (specCoverage * 0.25) +
    (testCoverage * 0.25) +
    (taskCompletion * 0.25) +
    (constitutionAlignment * 0.25)
  );

  return {
    score,
    factors: {
      specCoverage: Math.round(specCoverage * 0.25),
      testCoverage: Math.round(testCoverage * 0.25),
      taskCompletion: Math.round(taskCompletion * 0.25),
      constitutionAlignment: Math.round(constitutionAlignment * 0.25)
    },
    raw: { specCoverage, testCoverage, taskCompletion, constitutionAlignment },
    meta: {
      totalRequirements: totalFR,
      totalTasks,
      checkedTasks,
      totalTestSpecs: testSpecs.length,
      specCoveredFR: specCoveredCount,
      testCoveredFR: testCoveredCount
    }
  };
}

// ─── 2. Phase Velocity ───

function computePhaseVelocity(velocityData) {
  if (!velocityData || !velocityData.features) return [];
  const results = [];

  // Aggregate across all features
  const phaseAgg = {};
  for (const featureId of Object.keys(velocityData.features)) {
    const phases = velocityData.features[featureId];
    for (const [phaseId, timing] of Object.entries(phases)) {
      if (!timing.started || !timing.completed) continue;
      const start = new Date(timing.started).getTime();
      const end = new Date(timing.completed).getTime();
      if (isNaN(start) || isNaN(end) || end <= start) continue;
      const days = (end - start) / (1000 * 60 * 60 * 24);
      if (!phaseAgg[phaseId]) phaseAgg[phaseId] = [];
      phaseAgg[phaseId].push(days);
    }
  }

  let maxAvg = 0;
  let bottleneckPhase = null;

  for (const [phase, durations] of Object.entries(phaseAgg)) {
    const avgDays = durations.reduce((a, b) => a + b, 0) / durations.length;
    const rounded = Math.round(avgDays * 100) / 100;
    results.push({ phase, avgDays: rounded, samples: durations.length, isBottleneck: false });
    if (rounded > maxAvg) {
      maxAvg = rounded;
      bottleneckPhase = phase;
    }
  }

  // Mark bottleneck
  for (const r of results) {
    if (r.phase === bottleneckPhase) r.isBottleneck = true;
  }

  return results;
}

// ─── 3. Traceability Chains ───

function computeTraceabilityChains(constitutionContent, specContent, tasksContent, featuresDir) {
  const constitution = parseConstitution(constitutionContent);
  const { requirements } = parseRequirements(specContent);
  const tasks = parseTasks(tasksContent);
  const testSpecs = fs.existsSync(featuresDir) ? parseFeatureFiles(featuresDir) : [];

  const frIds = requirements.map(r => r.id);
  const tsIds = testSpecs.map(ts => ts.id);
  const taskIds = tasks.map(t => t.id);

  // Build FR → TS mapping
  const frToTS = {};
  for (const fr of frIds) {
    frToTS[fr] = testSpecs
      .filter(ts => ts.frRefs.includes(fr) || ts.title.includes(fr))
      .map(ts => ts.id);
  }

  // Build FR → T mapping
  const frToT = {};
  for (const fr of frIds) {
    frToT[fr] = tasks
      .filter(t => t.description.includes(fr) || t.storyTag === fr)
      .map(t => t.id);
  }

  // Build principle → FR mapping (by name mention in spec)
  const chains = [];
  for (const principle of constitution.principles) {
    const needle = principle.name.toLowerCase();
    const linkedFR = specContent
      ? frIds.filter(() => specContent.toLowerCase().includes(needle))
      : [];
    // Gather TS and T from linked FRs
    const linkedTS = [...new Set(linkedFR.flatMap(fr => frToTS[fr] || []))];
    const linkedT = [...new Set(linkedFR.flatMap(fr => frToT[fr] || []))];
    const totalLinks = linkedFR.length + linkedTS.length + linkedT.length;
    chains.push({
      principle: `${principle.number}. ${principle.name}`,
      requirements: linkedFR,
      testSpecs: linkedTS,
      tasks: linkedT,
      coverage: linkedFR.length > 0 ? 1.0 : 0.0
    });
  }

  // Identify orphans
  const testedFRs = new Set();
  for (const ts of testSpecs) {
    for (const fr of ts.frRefs) testedFRs.add(fr);
  }
  const untestedRequirements = frIds.filter(fr => !testedFRs.has(fr) && !(frToTS[fr] && frToTS[fr].length > 0));

  const linkedTaskIds = new Set(Object.values(frToT).flat());
  const unlinkedTasks = taskIds.filter(t => !linkedTaskIds.has(t));

  const coveredPrinciples = chains.filter(c => c.requirements.length > 0).length;

  const orphans = {
    untestedRequirements,
    untracedPrinciples: chains.filter(c => c.requirements.length === 0).map(c => c.principle),
    unlinkedTasks
  };

  const summary = {
    principlesCovered: coveredPrinciples,
    principlesTotal: constitution.principles.length,
    requirementsTested: frIds.length - untestedRequirements.length,
    requirementsTotal: frIds.length,
    overallCoverage: frIds.length > 0
      ? Math.round(((frIds.length - untestedRequirements.length) / frIds.length) * 100) / 100
      : 0
  };

  return { chains, orphans, summary };
}

// ─── 4. Risk Indicators ───

function computeRiskIndicators(healthHistory, currentScore, traceability) {
  const risks = [];
  const snapshots = healthHistory?.snapshots || [];

  // Score regression: >10 point drop from recent high
  if (snapshots.length >= 2) {
    const recent = snapshots.slice(-5);
    const maxRecent = Math.max(...recent.map(s => s.score));
    if (currentScore.score < maxRecent - 10) {
      risks.push({
        severity: 'high',
        category: 'regression',
        message: `Health score dropped from ${maxRecent} to ${currentScore.score} (Δ${currentScore.score - maxRecent})`,
        recommendation: 'Review recent changes that may have degraded coverage or completion.'
      });
    }
  }

  // Stagnation: same score for 5+ snapshots
  if (snapshots.length >= 5) {
    const lastFive = snapshots.slice(-5).map(s => s.score);
    const allSame = lastFive.every(s => s === lastFive[0]);
    if (allSame) {
      risks.push({
        severity: 'medium',
        category: 'stagnation',
        message: `Health score unchanged at ${lastFive[0]} for ${lastFive.length} consecutive snapshots`,
        recommendation: 'Project may be stalled. Review blocked tasks and incomplete phases.'
      });
    }
  }

  // Untested requirements
  if (traceability && traceability.orphans.untestedRequirements.length > 0) {
    const untested = traceability.orphans.untestedRequirements;
    risks.push({
      severity: untested.length > 3 ? 'high' : 'medium',
      category: 'coverage',
      message: `${untested.length} requirement(s) without test coverage: ${untested.slice(0, 5).join(', ')}`,
      recommendation: 'Generate test specifications for uncovered requirements.'
    });
  }

  // Unlinked tasks
  if (traceability && traceability.orphans.unlinkedTasks.length > 0) {
    const unlinked = traceability.orphans.unlinkedTasks;
    risks.push({
      severity: 'low',
      category: 'traceability',
      message: `${unlinked.length} task(s) not linked to any requirement: ${unlinked.slice(0, 5).join(', ')}`,
      recommendation: 'Tag tasks with FR-NNN references to maintain traceability.'
    });
  }

  // Low overall score
  if (currentScore.score < 40) {
    risks.push({
      severity: 'high',
      category: 'health',
      message: `Overall health score is critically low (${currentScore.score}/100)`,
      recommendation: 'Focus on the weakest factor to raise the score above 40.'
    });
  } else if (currentScore.score < 60) {
    risks.push({
      severity: 'medium',
      category: 'health',
      message: `Overall health score is below target (${currentScore.score}/100)`,
      recommendation: 'Address the lowest-scoring factor to improve overall health.'
    });
  }

  // Individual factor warnings
  const { raw } = currentScore;
  if (raw.testCoverage === 0 && currentScore.meta.totalRequirements > 0) {
    risks.push({
      severity: 'high',
      category: 'testing',
      message: 'No test specifications found for any requirement',
      recommendation: 'Run /sdd:test to generate BDD test specifications.'
    });
  }
  if (raw.specCoverage < 30 && currentScore.meta.totalRequirements > 0) {
    risks.push({
      severity: 'medium',
      category: 'planning',
      message: `Only ${raw.specCoverage}% of requirements have associated tasks`,
      recommendation: 'Run /sdd:tasks to break down remaining requirements into tasks.'
    });
  }

  // Sort by severity
  const severityOrder = { high: 0, medium: 1, low: 2 };
  risks.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);

  return risks;
}

// ─── 5. Recommendations ───

function computeRecommendations(risks, pipelineState, traceability) {
  const recommendations = [];
  const seen = new Set();

  function addRec(command, reason, priority) {
    if (seen.has(command)) return;
    seen.add(command);
    recommendations.push({ command, reason, priority });
  }

  for (const risk of risks) {
    switch (risk.category) {
      case 'testing':
      case 'coverage':
        addRec('/sdd:test', risk.message, risk.severity === 'high' ? 1 : 2);
        break;
      case 'planning':
        addRec('/sdd:tasks', risk.message, 2);
        break;
      case 'regression':
        addRec('/sdd:analyze', risk.message, 1);
        break;
      case 'stagnation':
        addRec('/sdd:status', risk.message, 2);
        break;
      case 'traceability':
        addRec('/sdd:spec', risk.message, 3);
        break;
      case 'health':
        addRec('/sdd:analyze', risk.message, 1);
        break;
    }
  }

  // Traceability-driven recommendations
  if (traceability) {
    const { orphans } = traceability;
    if (orphans.untestedRequirements.length > 0) {
      addRec('/sdd:test', `${orphans.untestedRequirements.length} FR(s) have no tests`, 1);
    }
    if (orphans.untracedPrinciples.length > 0) {
      addRec('/sdd:spec', `${orphans.untracedPrinciples.length} principle(s) not traced to requirements`, 2);
    }
  }

  // Pipeline-driven recommendations
  if (pipelineState) {
    const phases = pipelineState.phases || [];
    const notStarted = phases.filter(p => p.status === 'not_started' && !p.optional);
    if (notStarted.length > 0) {
      const first = notStarted[0];
      const cmdMap = {
        constitution: '/sdd:00-constitution',
        spec: '/sdd:spec',
        plan: '/sdd:plan',
        checklist: '/sdd:check',
        testify: '/sdd:test',
        tasks: '/sdd:tasks',
        analyze: '/sdd:analyze',
        implement: '/sdd:impl'
      };
      const cmd = cmdMap[first.id] || `/sdd:${first.id}`;
      addRec(cmd, `Phase "${first.name}" not started`, 1);
    }
  }

  // Constitution existence check
  if (!fs.existsSync(path.join(projectPath, 'CONSTITUTION.md'))) {
    addRec('/sdd:00-constitution', 'No CONSTITUTION.md found — governance undefined', 1);
  }

  recommendations.sort((a, b) => a.priority - b.priority);
  return recommendations;
}

// ─── 6. Append Health Snapshot ───

function appendHealthSnapshot(specifyDir, snapshot) {
  const filePath = path.join(specifyDir, 'health-history.json');
  let history = readJSON(filePath);

  // Backward compat: old format might be an array
  if (Array.isArray(history)) {
    history = { snapshots: history };
  } else if (!history || !history.snapshots) {
    history = { snapshots: [] };
  }

  history.snapshots.push(snapshot);

  // Cap at 100 entries (FIFO)
  if (history.snapshots.length > 100) {
    history.snapshots = history.snapshots.slice(-100);
  }

  atomicWrite(filePath, history);
  return filePath;
}

// ─── 7. Generate Insights Report ───

function generateInsightsReport(projectPath, allMetrics) {
  const { healthScores, velocity, traceability, risks, recommendations, featureIds } = allMetrics;
  const specifyDir = path.join(projectPath, '.specify');
  const reportPath = path.join(specifyDir, 'INSIGHTS-REPORT.md');

  // Compute trend arrow from history
  const historyPath = path.join(specifyDir, 'health-history.json');
  const history = readJSON(historyPath);
  const snapshots = history?.snapshots || [];

  function trendArrow(currentScore) {
    if (snapshots.length < 2) return '→';
    const prev = snapshots[snapshots.length - 1].score;
    if (currentScore > prev + 2) return '↑';
    if (currentScore < prev - 2) return '↓';
    return '→';
  }

  const now = new Date().toISOString();
  let md = `# SDD Insights Report\n\n`;
  md += `> Generated: ${now}\n`;
  md += `> Project: \`${path.resolve(projectPath)}\`\n\n`;

  // Health scores per feature
  md += `## Health Scores\n\n`;
  md += `| Feature | Score | Trend | Spec | Test | Tasks | Constitution |\n`;
  md += `|---------|-------|-------|------|------|-------|--------------|\n`;
  for (const featureId of featureIds) {
    const hs = healthScores[featureId];
    if (!hs) continue;
    const arrow = trendArrow(hs.score);
    md += `| ${featureId} | **${hs.score}**/100 | ${arrow} | ${hs.raw.specCoverage}% | ${hs.raw.testCoverage}% | ${hs.raw.taskCompletion}% | ${hs.raw.constitutionAlignment}% |\n`;
  }
  md += `\n`;

  // Top 5 risks
  md += `## Top Risks\n\n`;
  const topRisks = risks.slice(0, 5);
  if (topRisks.length === 0) {
    md += `No significant risks detected.\n\n`;
  } else {
    for (let i = 0; i < topRisks.length; i++) {
      const r = topRisks[i];
      const icon = r.severity === 'high' ? 'CRITICAL' : r.severity === 'medium' ? 'WARNING' : 'INFO';
      md += `${i + 1}. **[${icon}]** ${r.message}\n`;
      md += `   - ${r.recommendation}\n`;
    }
    md += `\n`;
  }

  // Recommendations
  md += `## Recommended Actions\n\n`;
  if (recommendations.length === 0) {
    md += `No actions needed — project is in good health.\n\n`;
  } else {
    md += `| Priority | Command | Reason |\n`;
    md += `|----------|---------|--------|\n`;
    for (const rec of recommendations.slice(0, 10)) {
      const pLabel = rec.priority === 1 ? 'P1' : rec.priority === 2 ? 'P2' : 'P3';
      md += `| ${pLabel} | \`${rec.command}\` | ${rec.reason} |\n`;
    }
    md += `\n`;
  }

  // Traceability summary
  md += `## Traceability Coverage\n\n`;
  for (const featureId of featureIds) {
    const t = traceability[featureId];
    if (!t) continue;
    md += `### ${featureId}\n\n`;
    md += `- Principles covered: ${t.summary.principlesCovered}/${t.summary.principlesTotal}\n`;
    md += `- Requirements tested: ${t.summary.requirementsTested}/${t.summary.requirementsTotal}\n`;
    md += `- Overall coverage: ${Math.round(t.summary.overallCoverage * 100)}%\n`;
    if (t.orphans.untestedRequirements.length > 0) {
      md += `- Untested: ${t.orphans.untestedRequirements.join(', ')}\n`;
    }
    if (t.orphans.unlinkedTasks.length > 0) {
      md += `- Unlinked tasks: ${t.orphans.unlinkedTasks.join(', ')}\n`;
    }
    md += `\n`;
  }

  // Velocity (if available)
  if (velocity.length > 0) {
    md += `## Phase Velocity\n\n`;
    md += `| Phase | Avg Days | Bottleneck |\n`;
    md += `|-------|----------|------------|\n`;
    for (const v of velocity) {
      md += `| ${v.phase} | ${v.avgDays} | ${v.isBottleneck ? 'YES' : ''} |\n`;
    }
    md += `\n`;
  }

  md += `---\n*Generated by sdd-insights.js — MetodologIA SDD*\n`;

  atomicWrite(reportPath, md);
  return reportPath;
}

// ─── Pipeline State (simplified from generate-dashboard.js) ───

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
        optional: p.id === 'checklist' || p.id === 'analyze'
      };
    })
  };
}

// ─── Main ───

try {
  const specsDir = path.join(projectPath, 'specs');
  const specifyDir = path.join(projectPath, '.specify');

  // Detect features
  const featureIds = fs.existsSync(specsDir) ? detectFeatures(specsDir) : [];
  if (featureIds.length === 0) {
    console.error('No features detected in specs/ directory.');
    process.exit(2);
  }

  // Load shared data
  const constitutionContent = readFile(path.join(projectPath, 'CONSTITUTION.md'));
  const constitutionData = parseConstitution(constitutionContent);
  const velocityData = readJSON(path.join(specifyDir, 'phase-velocity.json'));
  const healthHistory = readJSON(path.join(specifyDir, 'health-history.json'));

  // Backward compat for old health history format
  let normalizedHistory = healthHistory;
  if (Array.isArray(healthHistory)) {
    normalizedHistory = { snapshots: healthHistory };
  } else if (!healthHistory) {
    normalizedHistory = { snapshots: [] };
  }

  // Per-feature computation
  const healthScores = {};
  const traceabilityMap = {};
  const pipelineStates = {};
  let allRisks = [];

  for (const featureId of featureIds) {
    const featurePath = path.join(specsDir, featureId);
    const specContent = readFile(path.join(featurePath, 'spec.md'));
    const tasksContent = readFile(path.join(featurePath, 'tasks.md'));
    const featuresDir = path.join(featurePath, 'tests', 'features');

    // Health score
    const health = computeHealthScore(featurePath, constitutionData);
    healthScores[featureId] = health;

    // Traceability
    const trace = computeTraceabilityChains(constitutionContent, specContent, tasksContent, featuresDir);
    traceabilityMap[featureId] = trace;

    // Pipeline state
    const pipeline = computePipeline(featurePath);
    pipelineStates[featureId] = pipeline;

    // Risk indicators per feature
    const featureRisks = computeRiskIndicators(normalizedHistory, health, trace);
    allRisks = allRisks.concat(featureRisks.map(r => ({ ...r, featureId })));
  }

  // Deduplicate risks by message
  const riskMap = new Map();
  for (const r of allRisks) {
    const key = `${r.category}:${r.message}`;
    if (!riskMap.has(key) || r.severity === 'high') riskMap.set(key, r);
  }
  const risks = [...riskMap.values()].sort((a, b) => {
    const ord = { high: 0, medium: 1, low: 2 };
    return ord[a.severity] - ord[b.severity];
  });

  // Phase velocity
  const velocity = computePhaseVelocity(velocityData);

  // Recommendations (use first feature pipeline as representative)
  const firstPipeline = pipelineStates[featureIds[0]] || null;
  const firstTrace = traceabilityMap[featureIds[0]] || null;
  const recommendations = computeRecommendations(risks, firstPipeline, firstTrace);

  // Assemble full metrics
  const allMetrics = {
    generatedAt: new Date().toISOString(),
    projectPath: path.resolve(projectPath),
    featureIds,
    healthScores,
    velocity,
    traceability: traceabilityMap,
    risks,
    recommendations,
    pipelineStates
  };

  // --snapshot: append to health-history.json
  if (flagSnapshot) {
    for (const featureId of featureIds) {
      const hs = healthScores[featureId];
      const pipeline = pipelineStates[featureId];
      const snapshot = {
        timestamp: new Date().toISOString(),
        featureId,
        score: hs.score,
        factors: hs.factors,
        phaseStates: Object.fromEntries(pipeline.phases.map(p => [p.id, p.status])),
        risks: risks.filter(r => r.featureId === featureId).map(r => r.message),
        staleArtifacts: [],
        brokenRefs: [],
        integrityStatus: 'valid'
      };
      const histPath = appendHealthSnapshot(specifyDir, snapshot);
      if (!flagJSON) console.log(`Snapshot appended: ${histPath} (${featureId}: ${hs.score}/100)`);
    }
  }

  // --report: write INSIGHTS-REPORT.md
  if (flagReport) {
    const reportPath = generateInsightsReport(projectPath, allMetrics);
    if (!flagJSON) console.log(`Report generated: ${reportPath}`);
  }

  // --json: output everything to stdout
  if (flagJSON) {
    process.stdout.write(JSON.stringify(allMetrics, null, 2) + '\n');
  }

  // Default: summary to stderr
  if (!flagJSON) {
    console.log(`\nSDD Insights — ${featureIds.length} feature(s) analyzed`);
    for (const fid of featureIds) {
      const hs = healthScores[fid];
      console.log(`  ${fid}: ${hs.score}/100 (spec:${hs.raw.specCoverage}% test:${hs.raw.testCoverage}% tasks:${hs.raw.taskCompletion}% const:${hs.raw.constitutionAlignment}%)`);
    }
    if (risks.length > 0) {
      console.log(`\nTop risks (${risks.length} total):`);
      for (const r of risks.slice(0, 3)) {
        console.log(`  [${r.severity.toUpperCase()}] ${r.message}`);
      }
    }
    if (recommendations.length > 0) {
      console.log(`\nRecommended: ${recommendations[0].command} — ${recommendations[0].reason}`);
    }
  }

  process.exit(0);
} catch (err) {
  console.error('Insights computation failed:', err.message);
  if (!flagJSON) console.error(err.stack);
  process.exit(5);
}
