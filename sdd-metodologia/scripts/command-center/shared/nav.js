/* ============================================================
   SDD Command Center — Sidebar Navigation
   Spec Driven Development by metodologIA
   Injected via <script src="shared/nav.js"></script>
   ============================================================ */

(function () {
  'use strict';

  /* ── SVG Icon Library (18x18, stroke-only, stroke-width=1.5) ── */
  const ICONS = {
    hub: '<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="5.5" height="5.5" rx="1"/><rect x="10.5" y="2" width="5.5" height="5.5" rx="1"/><rect x="2" y="10.5" width="5.5" height="5.5" rx="1"/><rect x="10.5" y="10.5" width="5.5" height="5.5" rx="1"/></svg>',
    pipeline: '<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="3.5" cy="9" r="2"/><circle cx="14.5" cy="9" r="2"/><circle cx="9" cy="9" r="2"/><line x1="5.5" y1="9" x2="7" y2="9"/><line x1="11" y1="9" x2="12.5" y2="9"/></svg>',
    specs: '<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 2h8a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"/><line x1="6" y1="6" x2="12" y2="6"/><line x1="6" y1="9" x2="12" y2="9"/><line x1="6" y1="12" x2="9" y2="12"/></svg>',
    quality: '<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 1.5L2 5v4.5c0 4.14 2.99 8.01 7 9 4.01-.99 7-4.86 7-9V5L9 1.5z"/><polyline points="6.5 9 8 10.5 11.5 7"/></svg>',
    intel: '<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 2a4.5 4.5 0 0 1 4.5 4.5c0 1.6-.83 3-2.08 3.8V12a1 1 0 0 1-1 1H7.58a1 1 0 0 1-1-1v-1.7A4.5 4.5 0 0 1 9 2z"/><line x1="7.5" y1="14.5" x2="10.5" y2="14.5"/><line x1="8" y1="16" x2="10" y2="16"/></svg>',
    logs: '<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="9" r="7"/><polyline points="9 5 9 9 12 11"/></svg>',
    backlog: '<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h10a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z"/><polyline points="3 4 9 8 15 4"/><line x1="2" y1="2" x2="16" y2="2"/></svg>',
    workspace: '<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2 6l1-3.5a1 1 0 0 1 1-.5h4l1.5 2H15a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6z"/></svg>',
    governance: '<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="9" y1="2" x2="9" y2="16"/><path d="M4 5l5 4-5 4"/><path d="M14 5l-5 4 5 4"/></svg>',
    search: '<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="7.5" cy="7.5" r="5"/><line x1="11" y1="11" x2="16" y2="16"/></svg>',
    tour: '<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="9" r="7"/><path d="M9 2v2"/><path d="M9 14v2"/><path d="M2 9h2"/><path d="M14 9h2"/><path d="M9 6l2.5 3L9 12 6.5 9 9 6z"/></svg>',
    docs: '<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3a1 1 0 0 1 1-1h4.5a1 1 0 0 1 .7.3L9 3l.8-.7a1 1 0 0 1 .7-.3H15a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1h-4.5a1 1 0 0 0-1 1 1 1 0 0 0-1-1H4a1 1 0 0 1-1-1V3z"/><line x1="9" y1="3" x2="9" y2="15"/></svg>',
    sun: '<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="9" r="3.5"/><line x1="9" y1="1.5" x2="9" y2="3"/><line x1="9" y1="15" x2="9" y2="16.5"/><line x1="1.5" y1="9" x2="3" y2="9"/><line x1="15" y1="9" x2="16.5" y2="9"/><line x1="3.7" y1="3.7" x2="4.8" y2="4.8"/><line x1="13.2" y1="13.2" x2="14.3" y2="14.3"/><line x1="3.7" y1="14.3" x2="4.8" y2="13.2"/><line x1="13.2" y1="4.8" x2="14.3" y2="3.7"/></svg>',
    moon: '<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M15.1 10.4A6.5 6.5 0 0 1 7.6 2.9 7 7 0 1 0 15.1 10.4z"/></svg>',
    hamburger: '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><line x1="3" y1="5" x2="17" y2="5"/><line x1="3" y1="10" x2="17" y2="10"/><line x1="3" y1="15" x2="17" y2="15"/></svg>',
    close: '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><line x1="5" y1="5" x2="15" y2="15"/><line x1="15" y1="5" x2="5" y2="15"/></svg>',
    logo: '<svg width="24" height="24" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg" aria-label="MetodologIA"><defs><linearGradient id="nav-lg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#0A122A"/><stop offset="100%" stop-color="#13315C"/></linearGradient></defs><rect width="36" height="36" rx="10" fill="url(#nav-lg)"/><rect x="10" y="12" width="4" height="12" rx=".5" fill="#FFF"/><rect x="16" y="12" width="4" height="8" rx=".5" fill="#FFF"/><rect x="16" y="22" width="4" height="2" rx=".5" fill="#FFF"/><rect x="22" y="12" width="4" height="6" rx=".5" fill="#FFF"/><rect x="22" y="20" width="4" height="4" rx=".5" fill="#FFF"/><circle cx="18" cy="8" r="2" fill="#FFD700"/></svg>',
    lang: '<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="9" r="7"/><path d="M2 9h14"/><ellipse cx="9" cy="9" rx="3.5" ry="7"/></svg>',
    chevron: '<svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 2 9 7 4 12"/></svg>'
  };

  /* ── Page & Group Definitions ─────────────────────────────── */
  const NAV_GROUPS = [
    {
      label: null, /* Overview — no section label */
      items: [
        { id: 'index', label: 'Hub', icon: 'hub' }
      ]
    },
    {
      label: 'Pipeline',
      items: [
        { id: 'pipeline',  label: 'Pipeline', icon: 'pipeline' },
        { id: 'specs',     label: 'Specs',    icon: 'specs' },
        { id: 'quality',   label: 'Quality',  icon: 'quality' }
      ]
    },
    {
      label: 'Intelligence',
      items: [
        { id: 'intelligence', label: 'Intel',   icon: 'intel' },
        { id: 'logs',         label: 'Logs',    icon: 'logs' },
        { id: 'backlog',      label: 'Backlog', icon: 'backlog' }
      ]
    },
    {
      label: 'Workspace',
      items: [
        { id: 'workspace',  label: 'Workspace',  icon: 'workspace' },
        { id: 'governance', label: 'Governance',  icon: 'governance' },
        { id: 'search',     label: 'Search',      icon: 'search' }
      ]
    },
    {
      label: 'Help',
      items: [
        { id: 'tour',       label: 'Tour', icon: 'tour' },
        { id: 'docs', label: 'Docs', icon: 'docs' }
      ]
    }
  ];

  /* Flat list for lookups */
  const ALL_PAGES = NAV_GROUPS.flatMap(g => g.items);

  /* ── Detect current page ─────────────────────────────────── */
  const path = window.location.pathname.split('/').pop().replace('.html', '') || 'index';
  const current = ALL_PAGES.find(p => p.id === path) || ALL_PAGES[0];

  /* ── Feature list from data ──────────────────────────────── */
  function getFeatures() {
    try {
      const d = window.DASHBOARD_DATA;
      if (d && d.features && Array.isArray(d.features)) return d.features;
    } catch (_) { /* ignore */ }
    return [];
  }

  /* ── Build sidebar nav items HTML ─────────────────────────── */
  function buildSidebarHTML() {
    let html = '';
    NAV_GROUPS.forEach(function (group) {
      if (group.label) {
        html += '<div class="nav-section-label">' + group.label + '</div>';
      }
      group.items.forEach(function (p) {
        var href = p.id === 'index' ? 'index.html' : p.id + '.html';
        var active = p.id === current.id ? ' active' : '';
        html += '<a href="' + href + '" class="nav-item' + active + '" data-page="' + p.id + '" title="' + p.label + '">'
              + '<span class="nav-icon">' + ICONS[p.icon] + '</span>'
              + '<span class="nav-label">' + p.label + '</span>'
              + '</a>';
      });
    });
    return html;
  }

  /* ── Feature selector HTML ───────────────────────────────── */
  function buildFeatureSelector() {
    var feats = getFeatures();
    if (feats.length === 0) return '';
    var opts = feats.map(function (f) {
      return '<option value="' + (f.id || f.name) + '">' + (f.name || f.id) + '</option>';
    }).join('');
    return '<div class="sidebar-feature-selector">'
         + '<label class="nav-section-label" for="sdd-feature-select">Feature</label>'
         + '<select id="sdd-feature-select" aria-label="Select feature">'
         + '<option value="">All features</option>'
         + opts
         + '</select>'
         + '</div>';
  }

  /* ── Inject header ───────────────────────────────────────── */
  var header = document.createElement('header');
  header.className = 'sdd-header';
  header.setAttribute('role', 'banner');
  header.innerHTML = '<div class="header-inner">'
    + '<div class="header-left">'
    + '<button id="sdd-hamburger" class="hamburger-btn" aria-label="Toggle sidebar" aria-expanded="false">'
    + ICONS.hamburger
    + '</button>'
    + '<a href="index.html" class="header-brand">'
    + '<span class="brand-logo">' + ICONS.logo + '</span>'
    + '<span class="brand-sdd" id="sdd-brand-name">SDD</span>'
    + '<span class="brand-sub">by metodolog<span class="gold">IA</span></span>'
    + '</a>'
    + (window.DASHBOARD_DATA && window.DASHBOARD_DATA.isDemo ? '<span class="demo-badge" title="Showing demo data — run /sdd:init to load real project data">DEMO</span>' : '')
    + '</div>'
    + '<div class="header-right">'
    + '<button id="sdd-search-shortcut" class="header-action-btn" aria-label="Search" title="Search (Ctrl+K)">'
    + ICONS.search
    + '<span class="shortcut-hint">Ctrl+K</span>'
    + '</button>'
    + '<button id="sdd-lang-toggle" class="header-action-btn lang-btn" aria-label="Toggle language" title="Toggle EN/ES">'
    + ICONS.lang
    + '<span class="lang-label">EN</span>'
    + '</button>'
    + '<button id="sdd-theme-toggle" class="header-action-btn" aria-label="Toggle theme" title="Toggle light/dark theme">'
    + '<span class="theme-icon">' + ICONS.moon + '</span>'
    + '</button>'
    + '</div>'
    + '</div>';

  /* ── Inject sidebar ──────────────────────────────────────── */
  var sidebar = document.createElement('aside');
  sidebar.className = 'sdd-sidebar';
  sidebar.id = 'sdd-sidebar';
  sidebar.setAttribute('role', 'navigation');
  sidebar.setAttribute('aria-label', 'SDD Command Center');
  sidebar.innerHTML = '<nav class="sidebar-nav">'
    + buildSidebarHTML()
    + '</nav>'
    + buildFeatureSelector();

  /* ── Backdrop for mobile overlay ─────────────────────────── */
  var backdrop = document.createElement('div');
  backdrop.className = 'sidebar-backdrop';
  backdrop.id = 'sdd-sidebar-backdrop';

  /* ── Wrap existing content ───────────────────────────────── */
  var existingMain = document.querySelector('main');

  /* Inject into DOM */
  document.body.prepend(backdrop);
  document.body.prepend(sidebar);
  document.body.prepend(header);

  /* Wrap main in layout container if not already */
  if (existingMain && !existingMain.parentElement.classList.contains('sdd-layout')) {
    var layout = document.createElement('div');
    layout.className = 'sdd-layout';
    existingMain.parentNode.insertBefore(layout, existingMain);
    layout.appendChild(sidebar);
    layout.appendChild(existingMain);
    existingMain.classList.add('sdd-main');
  }

  /* ── Inject styles ─────────────────────────────────────────
     Core structural styles are in tokens.css.
     These are component-specific styles for nav elements. */
  var style = document.createElement('style');
  style.textContent = ''
    /* Header */
    + '.sdd-header {'
    + '  position:fixed; top:0; left:0; right:0; height:var(--header-height,48px); z-index:100;'
    + '  background:var(--bg-surface); border-bottom:1px solid var(--border-subtle);'
    + '  backdrop-filter:var(--glass); -webkit-backdrop-filter:var(--glass);'
    + '}'
    + '.demo-badge {'
    + '  font-size:0.6rem; padding:2px 8px; border-radius:4px; margin-left:0.5rem;'
    + '  background:rgba(255,215,0,0.15); color:#FFD700; border:1px solid rgba(255,215,0,0.3);'
    + '  font-family:var(--font-code); letter-spacing:1px; vertical-align:middle; cursor:help;'
    + '}'
    + '.header-inner {'
    + '  display:flex; align-items:center; justify-content:space-between;'
    + '  height:100%; padding:0 1rem; max-width:100%;'
    + '}'
    + '.header-left { display:flex; align-items:center; gap:0.75rem; }'
    + '.header-right { display:flex; align-items:center; gap:0.35rem; }'
    + '.header-brand {'
    + '  display:flex; align-items:center; gap:0.5rem; text-decoration:none;'
    + '}'
    + '.brand-logo { display:flex; align-items:center; color:var(--brand-gold); }'
    + '.brand-sdd {'
    + '  font-family:var(--font-heading); font-size:1.15rem; font-weight:700;'
    + '  color:var(--text-primary); letter-spacing:0.5px;'
    + '}'
    + '.brand-sub { font-size:0.65rem; color:var(--text-muted); margin-left:0.15rem; }'
    + '.brand-sub .gold { color:var(--brand-gold); font-weight:700; }'
    + '.header-action-btn {'
    + '  display:flex; align-items:center; gap:0.35rem;'
    + '  background:none; border:none; cursor:pointer; color:var(--text-muted);'
    + '  padding:0.4rem 0.5rem; border-radius:var(--radius-sm);'
    + '  transition:background var(--transition-fast), color var(--transition-fast);'
    + '  font-family:var(--font-body); font-size:0.7rem;'
    + '}'
    + '.header-action-btn:hover { background:var(--bg-raised); color:var(--text-primary); }'
    + '.lang-btn { gap:0.2rem; }'
    + '.lang-label { font-family:var(--font-heading); font-size:0.6rem; font-weight:700; letter-spacing:0.05em; }'
    + '.shortcut-hint {'
    + '  font-size:0.6rem; color:var(--text-dim); padding:0.1rem 0.35rem;'
    + '  border:1px solid var(--border-medium); border-radius:4px;'
    + '}'
    + '.theme-icon { display:flex; align-items:center; }'
    + '.hamburger-btn {'
    + '  display:none; background:none; border:none; cursor:pointer;'
    + '  color:var(--text-muted); padding:0.3rem; border-radius:var(--radius-sm);'
    + '  transition:color var(--transition-fast);'
    + '}'
    + '.hamburger-btn:hover { color:var(--text-primary); }'

    /* Sidebar */
    + '.sdd-sidebar {'
    + '  position:fixed; top:var(--header-height,48px); left:0; bottom:0;'
    + '  width:var(--sidebar-width,240px); background:var(--bg-surface);'
    + '  border-right:1px solid rgba(255,255,255,0.06);'
    + '  overflow-y:auto; overflow-x:hidden; z-index:90;'
    + '  display:flex; flex-direction:column;'
    + '  scrollbar-width:thin; scrollbar-color:var(--border-medium) transparent;'
    + '  transition:width var(--transition-normal);'
    + '}'
    + '.sdd-sidebar::-webkit-scrollbar { width:4px; }'
    + '.sdd-sidebar::-webkit-scrollbar-track { background:transparent; }'
    + '.sdd-sidebar::-webkit-scrollbar-thumb { background:var(--border-medium); border-radius:4px; }'
    + '.sidebar-nav { flex:1; padding:0.75rem 0; }'

    /* Section labels */
    + '.nav-section-label {'
    + '  text-transform:uppercase; font-size:0.625rem; font-weight:600;'
    + '  letter-spacing:1.5px; color:var(--text-dim); padding:0 1.25rem;'
    + '  margin-top:1.5rem; margin-bottom:0.35rem;'
    + '  font-family:var(--font-body);'
    + '}'
    + '.sidebar-nav > .nav-section-label:first-child { margin-top:0.5rem; }'

    /* Nav items */
    + '.nav-item {'
    + '  display:flex; align-items:center; gap:0.65rem; height:36px;'
    + '  padding:0 1.25rem; font-size:0.8125rem; font-weight:500;'
    + '  color:var(--text-muted); text-decoration:none; position:relative;'
    + '  border-left:3px solid transparent;'
    + '  transition:color var(--transition-fast), background var(--transition-fast), border-color var(--transition-fast);'
    + '  font-family:var(--font-body);'
    + '}'
    + '.nav-item:hover {'
    + '  color:#137DC5; background:rgba(19,125,197,0.04);'
    + '}'
    + '.nav-item.active {'
    + '  color:#FFD700; border-left-color:#FFD700;'
    + '  background:rgba(255,215,0,0.06);'
    + '}'
    + '.nav-icon { display:flex; align-items:center; flex-shrink:0; width:18px; height:18px; }'
    + '.nav-label { white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }'

    /* Feature selector in sidebar */
    + '.sidebar-feature-selector {'
    + '  padding:0.75rem 1.25rem; border-top:1px solid var(--border-subtle);'
    + '}'
    + '.sidebar-feature-selector .nav-section-label { padding:0; margin-top:0; margin-bottom:0.35rem; }'
    + '#sdd-feature-select {'
    + '  width:100%; background:var(--bg-raised); color:var(--text-muted);'
    + '  border:1px solid var(--border-medium); border-radius:var(--radius-sm);'
    + '  padding:0.4rem 0.5rem; font-size:0.75rem; font-family:var(--font-body);'
    + '  cursor:pointer;'
    + '}'

    /* Sidebar backdrop (mobile) */
    + '.sidebar-backdrop {'
    + '  display:none; position:fixed; inset:0; z-index:80;'
    + '  background:rgba(0,0,0,0.5); backdrop-filter:blur(4px);'
    + '  -webkit-backdrop-filter:blur(4px);'
    + '}'
    + '.sidebar-backdrop.visible { display:block; }'

    /* ── Responsive: collapsed sidebar ─────────────────────── */
    + '@media(max-width:900px) {'
    + '  .hamburger-btn { display:flex; }'
    + '  .shortcut-hint { display:none; }'
    + '  .sdd-sidebar {'
    + '    width:var(--sidebar-collapsed,56px);'
    + '  }'
    + '  .sdd-sidebar .nav-label { display:none; }'
    + '  .sdd-sidebar .nav-section-label { display:none; }'
    + '  .sdd-sidebar .sidebar-feature-selector { display:none; }'
    + '  .nav-item { padding:0; justify-content:center; height:40px; border-left:none; }'
    + '  .nav-item.active { background:rgba(255,215,0,0.06); border-left:3px solid #FFD700; }'
    + '  .sdd-main { margin-left:var(--sidebar-collapsed,56px) !important; }'
    /* Expanded overlay state */
    + '  .sdd-sidebar.expanded {'
    + '    width:var(--sidebar-width,240px); z-index:95;'
    + '    box-shadow:4px 0 24px rgba(0,0,0,0.4);'
    + '  }'
    + '  .sdd-sidebar.expanded .nav-label { display:inline; }'
    + '  .sdd-sidebar.expanded .nav-section-label { display:block; }'
    + '  .sdd-sidebar.expanded .sidebar-feature-selector { display:block; }'
    + '  .sdd-sidebar.expanded .nav-item { padding:0 1.25rem; justify-content:flex-start; border-left:3px solid transparent; }'
    + '  .sdd-sidebar.expanded .nav-item.active { border-left-color:#FFD700; }'
    + '}'

    /* ── Light theme adjustments ───────────────────────────── */
    + 'body.light .sdd-sidebar { border-right-color:rgba(0,0,0,0.08); }'
    + 'body.light .nav-item.active { color:#B48200; border-left-color:#B48200; background:rgba(180,130,0,0.06); }'
    + 'body.light .nav-item:hover { color:#137DC5; background:rgba(19,125,197,0.04); }'
    + 'body.light .brand-logo { color:#B48200; }'
  ;

  document.head.appendChild(style);

  /* ── Theme toggle ────────────────────────────────────────── */
  var toggle = document.getElementById('sdd-theme-toggle');
  var themeIconEl = toggle.querySelector('.theme-icon');
  var saved = localStorage.getItem('sdd-theme');
  if (saved === 'light') {
    document.body.classList.add('light');
    themeIconEl.innerHTML = ICONS.sun;
  }

  toggle.addEventListener('click', function () {
    document.body.classList.toggle('light');
    var isLight = document.body.classList.contains('light');
    themeIconEl.innerHTML = isLight ? ICONS.sun : ICONS.moon;
    localStorage.setItem('sdd-theme', isLight ? 'light' : 'dark');
  });

  /* ── Language toggle (EN/ES) ─────────────────────────────── */
  var langToggle = document.getElementById('sdd-lang-toggle');
  var langLabel = langToggle ? langToggle.querySelector('.lang-label') : null;
  var savedLang = localStorage.getItem('sdd-lang') || 'en';
  if (langLabel) langLabel.textContent = savedLang.toUpperCase();
  document.documentElement.setAttribute('lang', savedLang);

  if (langToggle) {
    langToggle.addEventListener('click', function () {
      var current = localStorage.getItem('sdd-lang') || 'en';
      var next = current === 'en' ? 'es' : 'en';
      localStorage.setItem('sdd-lang', next);
      document.documentElement.setAttribute('lang', next);
      if (langLabel) langLabel.textContent = next.toUpperCase();
      window.dispatchEvent(new CustomEvent('sdd:lang-change', { detail: { lang: next } }));
    });
  }

  /* ── Inject favicon (MetodologIA logo) ─────────────────── */
  if (!document.querySelector('link[rel="icon"]')) {
    var favicon = document.createElement('link');
    favicon.rel = 'icon';
    favicon.type = 'image/svg+xml';
    favicon.href = 'data:image/svg+xml,' + encodeURIComponent('<svg viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="fg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#0A122A"/><stop offset="100%" stop-color="#13315C"/></linearGradient></defs><rect width="36" height="36" rx="10" fill="url(#fg)"/><rect x="10" y="12" width="4" height="12" rx=".5" fill="#FFF"/><rect x="16" y="12" width="4" height="8" rx=".5" fill="#FFF"/><rect x="16" y="22" width="4" height="2" rx=".5" fill="#FFF"/><rect x="22" y="12" width="4" height="6" rx=".5" fill="#FFF"/><rect x="22" y="20" width="4" height="4" rx=".5" fill="#FFF"/><circle cx="18" cy="8" r="2" fill="#FFD700"/></svg>');
    document.head.appendChild(favicon);
  }

  /* ── Hamburger toggle (mobile) ─────────────────────────── */
  var burger = document.getElementById('sdd-hamburger');
  var sidebarEl = document.getElementById('sdd-sidebar');
  var backdropEl = document.getElementById('sdd-sidebar-backdrop');

  function toggleSidebar() {
    var isExpanded = sidebarEl.classList.toggle('expanded');
    burger.setAttribute('aria-expanded', String(isExpanded));
    burger.innerHTML = isExpanded ? ICONS.close : ICONS.hamburger;
    if (isExpanded) {
      backdropEl.classList.add('visible');
    } else {
      backdropEl.classList.remove('visible');
    }
  }

  burger.addEventListener('click', toggleSidebar);
  backdropEl.addEventListener('click', function () {
    sidebarEl.classList.remove('expanded');
    backdropEl.classList.remove('visible');
    burger.setAttribute('aria-expanded', 'false');
    burger.innerHTML = ICONS.hamburger;
  });

  /* ── Search shortcut (Ctrl+K) ──────────────────────────── */
  var searchBtn = document.getElementById('sdd-search-shortcut');
  searchBtn.addEventListener('click', function () {
    window.location.href = 'search.html';
  });
  document.addEventListener('keydown', function (e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      window.location.href = 'search.html';
    }
  });

  /* ── Feature selector dispatch ───────────────────────────── */
  var sel = document.getElementById('sdd-feature-select');
  if (sel) {
    sel.addEventListener('change', function () {
      window.dispatchEvent(new CustomEvent('sdd:feature-select', { detail: { featureId: sel.value } }));
    });
  }

  /* ── Dynamic project name in brand ───────────────────────── */
  var D = window.DASHBOARD_DATA;
  var brandEl = document.getElementById('sdd-brand-name');
  if (D && D.project && D.project.name && brandEl) {
    // Show project name instead of "SDD" — capitalize first letter
    var pname = D.project.name.replace(/-/g, ' ').replace(/\b\w/g, function(c) { return c.toUpperCase(); });
    brandEl.textContent = pname;
    brandEl.title = 'Project: ' + D.project.name;
  }

  /* ── Demo Data Badge ────────────────────────────────────── */
  if (D && D.isDemo) {
    // Create badge
    var badge = document.createElement('div');
    badge.id = 'sdd-demo-badge';
    badge.style.cssText = 'position:fixed;top:6px;right:80px;z-index:10001;'
      + 'background:rgba(255,215,0,0.12);border:1px solid rgba(255,215,0,0.3);'
      + 'color:#FFD700;font-family:var(--font-heading);font-size:0.65rem;font-weight:700;'
      + 'padding:3px 10px;border-radius:12px;letter-spacing:0.5px;'
      + 'display:flex;align-items:center;gap:6px;cursor:pointer;'
      + 'transition:opacity 0.3s ease';
    badge.innerHTML = ICONS.hub + ' DEMO DATA'
      + '<span style="font-size:0.6rem;color:var(--text-dim);margin-left:4px">dismiss</span>';
    badge.title = 'Viewing demo data. Run /sdd:init to load your project.';
    badge.addEventListener('click', function () {
      badge.style.opacity = '0';
      setTimeout(function () { badge.remove(); }, 300);
      sessionStorage.setItem('sdd-demo-dismissed', 'true');
    });
    // Don't show if dismissed this session
    if (!sessionStorage.getItem('sdd-demo-dismissed')) {
      document.body.appendChild(badge);
    }
  }
})();
