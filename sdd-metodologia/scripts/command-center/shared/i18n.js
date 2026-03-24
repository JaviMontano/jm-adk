/**
 * SDD Command Center — i18n (English / Spanish)
 * Listens for `sdd:lang-change` from nav.js and re-applies translations.
 * Mark any DOM element with  data-i18n="key"  to auto-translate.
 */
window.SDD = window.SDD || {};
SDD.i18n = {
  strings: {
    /* ───────── English ───────── */
    en: {
      // Hub
      'hub.title':       'Command Center',
      'hub.health':      'Health Score',
      'hub.features':    'Features',
      'hub.tasks':       'Tasks',

      // Pipeline
      'pipeline.title':  'Pipeline',
      'pipeline.todo':   'Todo',
      'pipeline.wip':    'In Progress',
      'pipeline.done':   'Done',

      // Specs
      'specs.title':        'Specifications',
      'specs.requirements': 'Requirements',
      'specs.storymap':     'Story Map',
      'specs.covered':      'Covered',
      'specs.orphan':       'Orphan',

      // Quality
      'quality.title':       'Quality',
      'quality.passrate':    'Pass Rate',
      'quality.checklist':   'Checklists',
      'quality.testpyramid': 'Test Pyramid',
      'quality.dod':         'Definition of Done',
      'quality.ac':          'Acceptance Criteria',

      // Intelligence
      'intel.title':           'Intelligence',
      'intel.health':          'Health Score',
      'intel.sentinel':        'Sentinel Status',
      'intel.risks':           'Risk Indicators',
      'intel.recommendations': 'Recommendations',

      // Logs
      'logs.title':    'Logs & Decisions',
      'logs.timeline': 'Timeline',
      'logs.table':    'Table',
      'logs.adr':      'ADR Gallery',
      'logs.session':  'Session',
      'logs.change':   'Change',
      'logs.task':     'Task',
      'logs.decision': 'Decision',

      // Backlog
      'backlog.title': 'Backlog',
      'backlog.board': 'Board',
      'backlog.list':  'List',

      // Workspace
      'workspace.title': 'Workspace',
      'workspace.files': 'Project Files',
      'workspace.rag':   'RAG Memory Files',

      // Governance
      'governance.title':        'Governance',
      'governance.constitution': 'Constitution',
      'governance.gates':        'Quality Gates',
      'governance.evidence':     'Evidence Tags',
      'governance.dod':          'Definition of Done',
      'governance.logs':         'Operational Logs',

      // Search
      'search.title':       'Search',
      'search.placeholder': 'Search across all artifacts...',
      'search.results':     'results',

      // Docs
      'docs.title':    'Documentation',
      'docs.repos':    'Repositories',
      'docs.guides':   'Guides',
      'docs.commands': 'Pipeline Commands',

      // Tour
      'tour.title':   'SDD Tour',
      'tour.restart': 'Start Tour',

      // Common
      'common.nodata':   'No data available',
      'common.search':   'Search',
      'common.all':      'All',
      'common.feature':  'Feature',
      'common.phase':    'Phase',
      'common.status':   'Status'
    },

    /* ───────── Spanish ───────── */
    es: {
      // Hub
      'hub.title':       'Centro de Comando',
      'hub.health':      'Puntuacion de Salud',
      'hub.features':    'Funcionalidades',
      'hub.tasks':       'Tareas',

      // Pipeline
      'pipeline.title':  'Pipeline',
      'pipeline.todo':   'Pendiente',
      'pipeline.wip':    'En Progreso',
      'pipeline.done':   'Completado',

      // Specs
      'specs.title':        'Especificaciones',
      'specs.requirements': 'Requerimientos',
      'specs.storymap':     'Mapa de Historias',
      'specs.covered':      'Cubierto',
      'specs.orphan':       'Huerfano',

      // Quality
      'quality.title':       'Calidad',
      'quality.passrate':    'Tasa de Exito',
      'quality.checklist':   'Listas de Verificacion',
      'quality.testpyramid': 'Piramide de Tests',
      'quality.dod':         'Definicion de Hecho',
      'quality.ac':          'Criterios de Aceptacion',

      // Intelligence
      'intel.title':           'Inteligencia',
      'intel.health':          'Puntuacion de Salud',
      'intel.sentinel':        'Estado del Sentinel',
      'intel.risks':           'Indicadores de Riesgo',
      'intel.recommendations': 'Recomendaciones',

      // Logs
      'logs.title':    'Logs y Decisiones',
      'logs.timeline': 'Linea de Tiempo',
      'logs.table':    'Tabla',
      'logs.adr':      'Galeria ADR',
      'logs.session':  'Sesion',
      'logs.change':   'Cambio',
      'logs.task':     'Tarea',
      'logs.decision': 'Decision',

      // Backlog
      'backlog.title': 'Backlog',
      'backlog.board': 'Tablero',
      'backlog.list':  'Lista',

      // Workspace
      'workspace.title': 'Espacio de Trabajo',
      'workspace.files': 'Archivos del Proyecto',
      'workspace.rag':   'Archivos de Memoria RAG',

      // Governance
      'governance.title':        'Gobernanza',
      'governance.constitution': 'Constitucion',
      'governance.gates':        'Puertas de Calidad',
      'governance.evidence':     'Etiquetas de Evidencia',
      'governance.dod':          'Definicion de Hecho',
      'governance.logs':         'Logs Operacionales',

      // Search
      'search.title':       'Buscar',
      'search.placeholder': 'Buscar en todos los artefactos...',
      'search.results':     'resultados',

      // Docs
      'docs.title':    'Documentacion',
      'docs.repos':    'Repositorios',
      'docs.guides':   'Guias',
      'docs.commands': 'Comandos del Pipeline',

      // Tour
      'tour.title':   'Tour SDD',
      'tour.restart': 'Iniciar Tour',

      // Common
      'common.nodata':   'Sin datos disponibles',
      'common.search':   'Buscar',
      'common.all':      'Todos',
      'common.feature':  'Funcionalidad',
      'common.phase':    'Fase',
      'common.status':   'Estado'
    }
  },

  /** Get current language from localStorage (default: en) */
  lang: function () {
    return localStorage.getItem('sdd-lang') || 'en';
  },

  /** Translate a key — falls back to English, then returns the raw key */
  t: function (key) {
    var lang = this.lang();
    return (this.strings[lang] && this.strings[lang][key])
        || (this.strings.en[key])
        || key;
  },

  /** Apply translations to every element carrying data-i18n */
  apply: function () {
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key        = el.getAttribute('data-i18n');
      var translated = SDD.i18n.t(key);

      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = translated;
      } else {
        el.textContent = translated;
      }
    });
  }
};

/* ── Auto-apply on language change (dispatched by nav.js) ── */
window.addEventListener('sdd:lang-change', function () {
  SDD.i18n.apply();
});

/* ── Apply once the DOM is ready ── */
document.addEventListener('DOMContentLoaded', function () {
  SDD.i18n.apply();
});
