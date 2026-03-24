/* ============================================================
   SDD Command Center — Feature Filter Module
   Listens to sidebar feature selector, provides filter API,
   dispatches sdd:filter-applied for page re-renders.
   ============================================================ */

(function () {
  'use strict';

  /* ── State ──────────────────────────────────────────────── */
  var state = { featureId: null };

  /* ── Data helpers ───────────────────────────────────────── */
  function D() { return window.DASHBOARD_DATA || null; }

  function getFeatureById(id) {
    var d = D();
    if (!d || !d.features) return null;
    for (var i = 0; i < d.features.length; i++) {
      if ((d.features[i].id || d.features[i].name) === id) return d.features[i];
    }
    return null;
  }

  function getAllRequirements() {
    var d = D();
    if (!d || !d.features) return [];
    var reqs = [];
    d.features.forEach(function (f) {
      if (f.requirements && Array.isArray(f.requirements)) {
        f.requirements.forEach(function (r) {
          reqs.push(Object.assign({}, r, { _featureId: f.id || f.name, _featureName: f.name || f.id }));
        });
      }
    });
    return reqs;
  }

  /* ── Public API ─────────────────────────────────────────── */
  window.SDD = window.SDD || {};
  window.SDD.filter = {
    /** Current active feature ID or null */
    active: function () { return state.featureId; },

    /** Check if a feature ID matches the active filter (or no filter) */
    matchesFeature: function (featureId) {
      return !state.featureId || state.featureId === featureId;
    },

    /** Get the active feature's full data object */
    getActiveFeatureData: function () {
      return state.featureId ? getFeatureById(state.featureId) : null;
    },

    /** Get features filtered by current selection */
    getFilteredFeatures: function () {
      var d = D();
      if (!d || !d.features) return [];
      if (!state.featureId) return d.features;
      return d.features.filter(function (f) { return (f.id || f.name) === state.featureId; });
    },

    /** Get all requirements, optionally filtered by active feature */
    getFilteredRequirements: function () {
      var all = getAllRequirements();
      if (!state.featureId) return all;
      return all.filter(function (r) { return r._featureId === state.featureId; });
    },

    /** Programmatically set filter */
    set: function (featureId) {
      state.featureId = featureId || null;
      window.dispatchEvent(new CustomEvent('sdd:filter-applied', { detail: { featureId: state.featureId } }));
    }
  };

  /* ── Listen to sidebar feature selector ─────────────────── */
  window.addEventListener('sdd:feature-select', function (e) {
    var id = e.detail && e.detail.featureId ? e.detail.featureId : null;
    state.featureId = id;
    window.dispatchEvent(new CustomEvent('sdd:filter-applied', { detail: { featureId: id } }));
  });
})();
