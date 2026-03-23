#!/usr/bin/env node
/**
 * brand-html-patch.js — Apply HTML structural changes to template.js
 * This handles the complex string escaping that sed can't reliably do.
 *
 * Called by brand-overlay.sh after CSS token replacements.
 * Usage: node scripts/brand-html-patch.js <path-to-template.js>
 */

const fs = require('fs');
const path = require('path');

const filePath = process.argv[2];
if (!filePath) {
  console.error('Usage: node brand-html-patch.js <path-to-template.js>');
  process.exit(1);
}

let content = fs.readFileSync(filePath, 'utf8');

// The template.js is: module.exports = "...escaped HTML..."
// All replacements target the escaped string content.

// ─── 1. Title ───
content = content.replace(
  '<title>IIKit Dashboard</title>',
  '<title>IIC Dashboard \\u2014 MetodologIA</title>'
);
content = content.replace(
  "dirName + ' \\u2014 IIKit Dashboard'",
  "dirName + ' \\u2014 IIC Dashboard \\u00b7 MetodologIA'"
);
// Also handle the em-dash variant
content = content.replace(
  "dirName + ' — IIKit Dashboard'",
  "dirName + ' — IIC Dashboard · MetodologIA'"
);

// ─── 2. Logo icon replacement ───
// Replace the "D" letter in logo-icon div with SVG
const logoSvg = '<svg viewBox=\\\"0 0 36 36\\\" xmlns=\\\"http://www.w3.org/2000/svg\\\" aria-label=\\\"MetodologIA logo\\\" width=\\\"28\\\" height=\\\"28\\\"><defs><linearGradient id=\\\"logoBg\\\" x1=\\\"0\\\" y1=\\\"0\\\" x2=\\\"1\\\" y2=\\\"1\\\"><stop offset=\\\"0%\\\" stop-color=\\\"#0A122A\\\"/><stop offset=\\\"100%\\\" stop-color=\\\"#1E293B\\\"/></linearGradient></defs><rect width=\\\"36\\\" height=\\\"36\\\" rx=\\\"10\\\" fill=\\\"url(#logoBg)\\\"/><rect x=\\\"10\\\" y=\\\"12\\\" width=\\\"4\\\" height=\\\"12\\\" rx=\\\"0.5\\\" fill=\\\"#FFF\\\"/><rect x=\\\"16\\\" y=\\\"12\\\" width=\\\"4\\\" height=\\\"8\\\" rx=\\\"0.5\\\" fill=\\\"#FFF\\\"/><rect x=\\\"16\\\" y=\\\"22\\\" width=\\\"4\\\" height=\\\"2\\\" rx=\\\"0.5\\\" fill=\\\"#FFF\\\"/><rect x=\\\"22\\\" y=\\\"12\\\" width=\\\"4\\\" height=\\\"6\\\" rx=\\\"0.5\\\" fill=\\\"#FFF\\\"/><rect x=\\\"22\\\" y=\\\"20\\\" width=\\\"4\\\" height=\\\"4\\\" rx=\\\"0.5\\\" fill=\\\"#FFF\\\"/><circle cx=\\\"18\\\" cy=\\\"8\\\" r=\\\"2\\\" fill=\\\"#FFD700\\\"/></svg>';

content = content.replace(
  '<div class=\\\"logo-icon\\\" aria-hidden=\\\"true\\\">D</div>',
  logoSvg
);

// ─── 3. Dashboard name in header ───
content = content.replace(
  '<span>IIKit Dashboard</span>',
  '<span style=\\\"font-family:Poppins,sans-serif;font-weight:600;\\\">IIC by metodolog<span style=\\\"color:#FFD700;font-weight:700;\\\">IA</span></span>'
);

// ─── 4. Google Fonts ───
const fontsLink = '<link rel=\\\"preconnect\\\" href=\\\"https://fonts.googleapis.com\\\"><link rel=\\\"preconnect\\\" href=\\\"https://fonts.gstatic.com\\\" crossorigin><link href=\\\"https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap\\\" rel=\\\"stylesheet\\\">';

content = content.replace('</head>', fontsLink + '</head>');

// ─── 5. Footer (before </body>) ───
const footer = '<footer style=\\\"background:#122562;border-top:4px solid #FFD700;padding:24px 32px;display:flex;align-items:center;justify-content:space-between;margin-top:40px;\\\"><div style=\\\"display:flex;align-items:center;gap:12px;\\\">' + logoSvg + '<span style=\\\"font-family:Poppins,sans-serif;color:#F8F9FC;font-size:14px;font-weight:500;\\\">IIC by metodolog<span style=\\\"color:#FFD700;font-weight:700;\\\">IA</span></span></div><span style=\\\"font-family:Trebuchet MS,sans-serif;color:#9aa0b4;font-size:12px;\\\">Intent Integrity Chain \\u00b7 MetodologIA \\u00a9 2026</span></footer>';

content = content.replace('</body>', footer + '</body>');

// ─── 6. Header border styling ───
content = content.replace(
  '.header {',
  '*:focus-visible { outline: 2px solid #FFD700; outline-offset: 2px; }\\n    .header { border-top: 4px solid #122562; border-bottom: 2px solid #FFD700;'
);

// ─── 7. Logo-icon background gradient ───
content = content.replace(
  'background: linear-gradient(135deg, var(--color-accent), #122562)',
  'background: linear-gradient(135deg, #0A122A, #1E293B)'
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('  HTML patch applied: ' + path.basename(path.dirname(path.dirname(filePath))));
