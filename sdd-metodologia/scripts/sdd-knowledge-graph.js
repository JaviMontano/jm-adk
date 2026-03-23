#!/usr/bin/env node
// SDD Knowledge Graph Builder — Spec Driven Development by MetodologIA
// Parses Constitution, specs, features, tasks → builds traceability graph
// Usage: node sdd-knowledge-graph.js <project-path> [--json] [--output <path>]

'use strict';
const fs = require('fs');
const path = require('path');

// ── Helpers ──
function readFile(p) { try { return fs.readFileSync(p, 'utf8'); } catch { return ''; } }
function listDir(p) { try { return fs.readdirSync(p); } catch { return []; } }
function findFiles(dir, ext) {
  const results = [];
  function walk(d) {
    for (const f of listDir(d)) {
      const full = path.join(d, f);
      try {
        const st = fs.statSync(full);
        if (st.isDirectory()) walk(full);
        else if (f.endsWith(ext)) results.push(full);
      } catch { /* skip */ }
    }
  }
  walk(dir);
  return results;
}

// ── Parsers ──
function parseConstitution(projectPath) {
  const nodes = [];
  const content = readFile(path.join(projectPath, 'CONSTITUTION.md'));
  if (!content) return nodes;

  // Match Roman numeral principles: ## I. Title, ## II. Title, ### P-I, etc.
  const patterns = [
    /^#{1,3}\s+((?:P-)?[IVXLC]+)\.\s+(.+)/gm,  // ## I. Title or ### P-I. Title
    /^#{1,3}\s+((?:P-)?[IVXLC]+)\s*[-:]\s*(.+)/gm,  // ## I - Title or ## I: Title
    /^\*\*(\d+)\.\s+(.+?)\*\*/gm  // **1. Title**
  ];

  const seen = new Set();
  for (const pat of patterns) {
    let m;
    while ((m = pat.exec(content)) !== null) {
      const id = `P-${m[1]}`;
      if (!seen.has(id)) {
        seen.add(id);
        nodes.push({ id, type: 'principle', label: m[2].trim(), file: 'CONSTITUTION.md' });
      }
    }
  }
  return nodes;
}

function parseSpec(specPath, featureId) {
  const nodes = [];
  const edges = [];
  const content = readFile(specPath);
  if (!content) return { nodes, edges };

  // FR-NNN
  const frPat = /\b(FR-\d{3,4})\b[:\s]*(.{0,80})/g;
  let m;
  const seen = new Set();
  while ((m = frPat.exec(content)) !== null) {
    if (!seen.has(m[1])) {
      seen.add(m[1]);
      nodes.push({ id: m[1], type: 'requirement', label: m[2].trim().replace(/\*+/g, ''), file: specPath, feature: featureId });
    }
  }

  // US-NNN
  const usPat = /\b(US-\d{3,4})\b[:\s]*(.{0,80})/g;
  while ((m = usPat.exec(content)) !== null) {
    if (!seen.has(m[1])) {
      seen.add(m[1]);
      nodes.push({ id: m[1], type: 'user-story', label: m[2].trim().replace(/\*+/g, ''), file: specPath, feature: featureId });
    }
  }

  // SC-NNN
  const scPat = /\b(SC-\d{3,4})\b[:\s]*(.{0,80})/g;
  while ((m = scPat.exec(content)) !== null) {
    if (!seen.has(m[1])) {
      seen.add(m[1]);
      nodes.push({ id: m[1], type: 'success-criteria', label: m[2].trim().replace(/\*+/g, ''), file: specPath, feature: featureId });
    }
  }

  return { nodes, edges };
}

function parseFeatureFiles(specsDir, featureId) {
  const nodes = [];
  const edges = [];
  const featuresDir = path.join(specsDir, 'tests', 'features');
  const files = findFiles(featuresDir, '.feature');

  for (const file of files) {
    const content = readFile(file);
    const relFile = path.relative(path.dirname(specsDir), file);

    // Parse scenarios with @TS-NNN tags
    const blocks = content.split(/(?=@)/);
    for (const block of blocks) {
      const tsMatch = block.match(/@TS-(\d{3,4})/);
      if (!tsMatch) continue;

      const tsId = `TS-${tsMatch[1]}`;
      const scenarioMatch = block.match(/Scenario(?:\s+Outline)?:\s*(.+)/);
      const label = scenarioMatch ? scenarioMatch[1].trim() : tsId;

      nodes.push({ id: tsId, type: 'test-spec', label, file: relFile, feature: featureId });

      // Edges to requirements
      const frRefs = block.match(/@FR-(\d{3,4})/g) || [];
      for (const ref of frRefs) {
        edges.push({ from: ref.replace('@', ''), to: tsId, type: 'verified_by' });
      }

      const usRefs = block.match(/@US-(\d{3,4})/g) || [];
      for (const ref of usRefs) {
        edges.push({ from: ref.replace('@', ''), to: tsId, type: 'verified_by' });
      }
    }
  }
  return { nodes, edges };
}

function parseTasks(tasksPath, featureId) {
  const nodes = [];
  const edges = [];
  const content = readFile(tasksPath);
  if (!content) return { nodes, edges };

  // T-NNN or numbered task lines
  const tPat = /\b(T-\d{3,4})\b[:\s]*(.{0,80})/g;
  let m;
  const seen = new Set();
  while ((m = tPat.exec(content)) !== null) {
    if (!seen.has(m[1])) {
      seen.add(m[1]);
      const checked = content.includes(`[x]`) && content.indexOf(m[1]) < content.indexOf('[x]', content.indexOf(m[1]) - 50);
      nodes.push({ id: m[1], type: 'task', label: m[2].trim().replace(/\*+/g, ''), file: tasksPath, feature: featureId, metadata: { checked } });

      // Find FR references near this task
      const frRefs = m[2].match(/FR-\d{3,4}/g) || [];
      for (const ref of frRefs) {
        edges.push({ from: ref, to: m[1], type: 'implemented_by' });
      }
    }
  }

  // Also parse checkbox lines without T-NNN
  const lines = content.split('\n');
  let taskCounter = 0;
  for (const line of lines) {
    const checkMatch = line.match(/^[-*]\s+\[([ x])\]\s+(.+)/);
    if (checkMatch && !line.match(/T-\d{3,4}/)) {
      taskCounter++;
      const id = `T-auto-${featureId}-${taskCounter}`;
      if (!seen.has(id)) {
        seen.add(id);
        nodes.push({ id, type: 'task', label: checkMatch[2].trim().substring(0, 80), file: tasksPath, feature: featureId, metadata: { checked: checkMatch[1] === 'x' } });
        const frRefs = checkMatch[2].match(/FR-\d{3,4}/g) || [];
        for (const ref of frRefs) {
          edges.push({ from: ref, to: id, type: 'implemented_by' });
        }
      }
    }
  }
  return { nodes, edges };
}

// ── Graph Builder ──
function buildGraph(projectPath) {
  const allNodes = [];
  const allEdges = [];

  // 1. Constitution principles
  const principles = parseConstitution(projectPath);
  allNodes.push(...principles);

  // 2. Discover features
  const specsRoot = path.join(projectPath, 'specs');
  const features = listDir(specsRoot).filter(d => {
    try { return fs.statSync(path.join(specsRoot, d)).isDirectory(); } catch { return false; }
  }).sort();

  // 3. Parse each feature
  for (const feat of features) {
    const featDir = path.join(specsRoot, feat);
    const featureId = feat;

    // spec.md
    const specResult = parseSpec(path.join(featDir, 'spec.md'), featureId);
    allNodes.push(...specResult.nodes);
    allEdges.push(...specResult.edges);

    // .feature files
    const testResult = parseFeatureFiles(featDir, featureId);
    allNodes.push(...testResult.nodes);
    allEdges.push(...testResult.edges);

    // tasks.md
    const taskResult = parseTasks(path.join(featDir, 'tasks.md'), featureId);
    allNodes.push(...taskResult.nodes);
    allEdges.push(...taskResult.edges);
  }

  // 4. Build principle → requirement edges
  // Strategy: Look for "## Constitutional Alignment" section in spec.md
  // that explicitly lists principle references (P-I, P-II, etc.)
  // Fallback: @P-NNN tags anywhere in spec.md
  const principleIds = new Set(principles.map(p => p.id));
  for (const feat of features) {
    const specContent = readFile(path.join(specsRoot, feat, 'spec.md'));
    if (!specContent) continue;

    const featReqs = allNodes.filter(n => n.type === 'requirement' && n.feature === feat);
    const linkedPrinciples = new Set();

    // Method 1: Dedicated section "## Constitutional Alignment"
    const alignSection = specContent.match(/##\s*Constitutional\s*Alignment[\s\S]*?(?=\n##\s|\n---|\Z)/i);
    if (alignSection) {
      const pRefs = alignSection[0].match(/P-[IVXLC]+/g) || [];
      for (const ref of pRefs) {
        if (principleIds.has(ref)) linkedPrinciples.add(ref);
      }
    }

    // Method 2: @P-NNN tags anywhere in spec
    const tagRefs = specContent.match(/@P-[IVXLC]+/g) || [];
    for (const ref of tagRefs) {
      const clean = ref.replace('@', '');
      if (principleIds.has(clean)) linkedPrinciples.add(clean);
    }

    // Create edges: each linked principle governs all requirements in this feature
    for (const pId of linkedPrinciples) {
      for (const r of featReqs) {
        allEdges.push({ from: pId, to: r.id, type: 'governs' });
      }
    }
  }

  // 5. Compute orphans
  const nodeIds = new Set(allNodes.map(n => n.id));
  const edgeFroms = new Set(allEdges.map(e => e.from));
  const edgeTos = new Set(allEdges.map(e => e.to));

  const untestedReqs = allNodes
    .filter(n => n.type === 'requirement' && !allEdges.some(e => e.from === n.id && e.type === 'verified_by'))
    .map(n => n.id);

  const untracedPrinciples = principles
    .filter(p => !allEdges.some(e => e.from === p.id))
    .map(p => p.id);

  const unlinkedTasks = allNodes
    .filter(n => n.type === 'task' && !allEdges.some(e => e.to === n.id))
    .map(n => n.id);

  // 6. Stats
  const totalReqs = allNodes.filter(n => n.type === 'requirement').length;
  const testedReqs = totalReqs - untestedReqs.length;
  const coverage = totalReqs > 0 ? Math.round((testedReqs / totalReqs) * 100) / 100 : 0;

  return {
    nodes: allNodes,
    edges: allEdges,
    orphans: {
      untested_requirements: untestedReqs,
      untraced_principles: untracedPrinciples,
      unlinked_tasks: unlinkedTasks
    },
    stats: {
      nodes: allNodes.length,
      edges: allEdges.length,
      coverage,
      principlesCovered: principles.length - untracedPrinciples.length,
      principlesTotal: principles.length,
      requirementsTested: testedReqs,
      requirementsTotal: totalReqs,
      features: features.length
    }
  };
}

// ── CLI ──
const args = process.argv.slice(2);
const projectPath = args.find(a => !a.startsWith('-')) || process.cwd();
const jsonMode = args.includes('--json');
const outputIdx = args.indexOf('--output');
const outputPath = outputIdx >= 0 ? args[outputIdx + 1] : null;

if (!fs.existsSync(projectPath)) {
  console.error(`Error: path not found: ${projectPath}`);
  process.exit(1);
}

const graph = buildGraph(projectPath);

// Write to .specify/
const specifyDir = path.join(projectPath, '.specify');
try { fs.mkdirSync(specifyDir, { recursive: true }); } catch { /* exists */ }
const defaultOutput = path.join(specifyDir, 'knowledge-graph.json');
const target = outputPath || defaultOutput;
fs.writeFileSync(target, JSON.stringify(graph, null, 2));

// Summary
const o = graph.orphans;
const s = graph.stats;
console.error(`Knowledge Graph: ${s.nodes} nodes, ${s.edges} edges, ${o.untested_requirements.length + o.untraced_principles.length + o.unlinked_tasks.length} orphans, coverage: ${Math.round(s.coverage * 100)}%`);

if (jsonMode) {
  console.log(JSON.stringify(graph, null, 2));
}
