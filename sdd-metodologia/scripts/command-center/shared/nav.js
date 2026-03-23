/* ============================================================
   SDD Command Center — Shared Navigation
   Spec Driven Development by metodologIA
   Injected via <script src="shared/nav.js"></script>
   ============================================================ */

(function () {
  'use strict';

  const PAGES = [
    { id: 'index',        label: 'Command Center', icon: '\u2318' },
    { id: 'pipeline',     label: 'Pipeline',       icon: '\u25B6' },
    { id: 'specs',        label: 'Specifications', icon: '\uD83D\uDCCB' },
    { id: 'quality',      label: 'Quality',        icon: '\u2713' },
    { id: 'intelligence', label: 'Intelligence',   icon: '\u25C9' },
    { id: 'workspace',    label: 'Workspace',      icon: '\uD83D\uDCC1' },
    { id: 'governance',   label: 'Governance',     icon: '\u2696' }
  ];

  /* ── Detect current page ─────────────────────────────────── */
  const path = window.location.pathname.split('/').pop().replace('.html', '') || 'index';
  const current = PAGES.find(p => p.id === path) || PAGES[0];

  /* ── Feature list from data ──────────────────────────────── */
  function getFeatures() {
    try {
      const d = window.DASHBOARD_DATA;
      if (d && d.features && Array.isArray(d.features)) return d.features;
    } catch (_) { /* ignore */ }
    return [];
  }

  /* ── Build nav HTML ──────────────────────────────────────── */
  const nav = document.createElement('nav');
  nav.id = 'sdd-nav';
  nav.setAttribute('role', 'navigation');
  nav.setAttribute('aria-label', 'SDD Command Center');

  const feats = getFeatures();
  const featureSelector = feats.length > 0
    ? `<select id="sdd-feature-select" aria-label="Select feature">
         <option value="">All features</option>
         ${feats.map(f => `<option value="${f.id || f.name}">${f.name || f.id}</option>`).join('')}
       </select>`
    : '';

  const tabsHTML = PAGES.map(p => {
    const href = p.id === 'index' ? 'index.html' : `${p.id}.html`;
    const active = p.id === current.id ? ' class="active"' : '';
    return `<a href="${href}"${active} data-page="${p.id}">
              <span class="nav-icon">${p.icon}</span>
              <span class="nav-label">${p.label}</span>
            </a>`;
  }).join('');

  nav.innerHTML = `
    <div class="nav-inner">
      <div class="nav-brand">
        <a href="index.html" class="brand-link">
          <strong class="brand-sdd">SDD</strong>
          <span class="brand-sub">by metodolog<span class="gold">IA</span></span>
        </a>
      </div>

      <div class="nav-tabs" id="sdd-nav-tabs">${tabsHTML}</div>

      <div class="nav-actions">
        ${featureSelector}
        ${current.id !== 'index' ? '<a href="index.html" class="btn-back" title="Back to Command Center">\u2318 Hub</a>' : ''}
        <button id="sdd-theme-toggle" aria-label="Toggle theme" title="Toggle light/dark theme">
          <span class="theme-icon">\uD83C\uDF19</span>
        </button>
        <button id="sdd-hamburger" class="hamburger" aria-label="Toggle menu" aria-expanded="false">
          <span></span><span></span><span></span>
        </button>
      </div>
    </div>
  `;

  /* ── Inject nav + styles ─────────────────────────────────── */
  const style = document.createElement('style');
  style.textContent = `
    #sdd-nav {
      position:sticky; top:0; z-index:1000;
      background:var(--bg-surface); border-bottom:1px solid var(--border-subtle);
      backdrop-filter:var(--glass); -webkit-backdrop-filter:var(--glass);
    }
    .nav-inner {
      max-width:1400px; margin:0 auto; display:flex; align-items:center;
      padding:0 1.25rem; height:56px; gap:1rem;
    }
    .nav-brand { flex-shrink:0; }
    .brand-link { display:flex; align-items:baseline; gap:0.4rem; text-decoration:none; }
    .brand-sdd { font-family:var(--font-heading); font-size:1.35rem; color:var(--text-primary); letter-spacing:1px; }
    .brand-sub { font-size:0.7rem; color:var(--text-muted); }
    .brand-sub .gold { color:var(--brand-gold); font-weight:700; }

    .nav-tabs { display:flex; gap:0.15rem; overflow-x:auto; flex:1; scrollbar-width:none; }
    .nav-tabs::-webkit-scrollbar { display:none; }
    .nav-tabs a {
      display:flex; align-items:center; gap:0.35rem;
      padding:0.5rem 0.75rem; font-size:0.8rem; font-weight:500;
      color:var(--text-muted); white-space:nowrap; border-bottom:2px solid transparent;
      transition:color var(--transition-fast), border-color var(--transition-fast);
      text-decoration:none;
    }
    .nav-tabs a:hover { color:var(--text-primary); }
    .nav-tabs a.active { color:var(--brand-gold); border-bottom-color:var(--brand-gold); }
    .nav-icon { font-size:1rem; }

    .nav-actions { display:flex; align-items:center; gap:0.65rem; flex-shrink:0; }
    .btn-back {
      font-size:0.75rem; padding:0.3rem 0.7rem; border:1px solid var(--border-medium);
      border-radius:var(--radius-sm); color:var(--text-muted); text-decoration:none;
      transition:all var(--transition-fast);
    }
    .btn-back:hover { color:var(--brand-gold); border-color:var(--border-gold); }

    #sdd-feature-select {
      background:var(--bg-raised); color:var(--text-muted); border:1px solid var(--border-medium);
      border-radius:var(--radius-sm); padding:0.3rem 0.5rem; font-size:0.75rem;
      font-family:var(--font-body); max-width:160px;
    }

    #sdd-theme-toggle {
      background:none; border:none; cursor:pointer; font-size:1.1rem;
      padding:0.3rem; border-radius:var(--radius-sm);
      transition:background var(--transition-fast);
    }
    #sdd-theme-toggle:hover { background:var(--bg-raised); }

    .hamburger { display:none; background:none; border:none; cursor:pointer; padding:0.4rem; flex-direction:column; gap:4px; }
    .hamburger span { display:block; width:20px; height:2px; background:var(--text-muted); border-radius:2px; transition:all var(--transition-fast); }

    @media(max-width:900px) {
      .nav-tabs { display:none; position:absolute; top:56px; left:0; right:0; flex-direction:column;
        background:var(--bg-surface); border-bottom:1px solid var(--border-subtle);
        padding:0.5rem 0; gap:0; z-index:999; }
      .nav-tabs.open { display:flex; }
      .nav-tabs a { padding:0.75rem 1.5rem; border-bottom:none; border-left:3px solid transparent; }
      .nav-tabs a.active { border-left-color:var(--brand-gold); }
      .hamburger { display:flex; }
      #sdd-feature-select { display:none; }
      .btn-back { display:none; }
    }
  `;

  document.head.appendChild(style);
  document.body.prepend(nav);

  /* ── Theme toggle ────────────────────────────────────────── */
  const toggle = document.getElementById('sdd-theme-toggle');
  const iconEl = toggle.querySelector('.theme-icon');
  const saved = localStorage.getItem('sdd-theme');
  if (saved === 'light') { document.body.classList.add('light'); iconEl.textContent = '\u2600\uFE0F'; }

  toggle.addEventListener('click', function () {
    document.body.classList.toggle('light');
    const isLight = document.body.classList.contains('light');
    iconEl.textContent = isLight ? '\u2600\uFE0F' : '\uD83C\uDF19';
    localStorage.setItem('sdd-theme', isLight ? 'light' : 'dark');
  });

  /* ── Hamburger ───────────────────────────────────────────── */
  const burger = document.getElementById('sdd-hamburger');
  const tabs = document.getElementById('sdd-nav-tabs');
  burger.addEventListener('click', function () {
    const open = tabs.classList.toggle('open');
    burger.setAttribute('aria-expanded', String(open));
  });

  /* ── Feature selector dispatch ───────────────────────────── */
  const sel = document.getElementById('sdd-feature-select');
  if (sel) {
    sel.addEventListener('change', function () {
      window.dispatchEvent(new CustomEvent('sdd:feature-select', { detail: { featureId: sel.value } }));
    });
  }
})();
