/**
 * SDD Search & Filter — Shared Component
 * ========================================
 * Reusable search bar + filter chips for all ALM pages.
 * Usage: SDD.search.init('container-id', { filters: [...], onSearch: fn, onFilter: fn })
 */
window.SDD = window.SDD || {};
SDD.search = {
  init: function(containerId, opts) {
    var c = document.getElementById(containerId);
    if (!c) return;
    var filters = opts.filters || [];
    var onSearch = opts.onSearch || function(){};
    var onFilter = opts.onFilter || function(){};
    var activeFilter = 'all';
    var debounceTimer = null;

    // Build HTML
    var html = '<div class="sdd-search-bar">';
    html += '<div class="sdd-search-input-wrap">';
    html += '<svg class="sdd-search-icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2"><circle cx="8" cy="8" r="6"/><line x1="12.5" y1="12.5" x2="18" y2="18"/></svg>';
    html += '<input class="sdd-search-input" type="text" placeholder="' + (opts.placeholder || 'Search...') + '" />';
    html += '<span class="sdd-search-count"></span>';
    html += '</div>';
    if (filters.length) {
      html += '<div class="sdd-filter-chips">';
      html += '<button class="sdd-chip active" data-filter="all">All</button>';
      filters.forEach(function(f) {
        html += '<button class="sdd-chip" data-filter="' + f.value + '">' + f.label + '</button>';
      });
      html += '</div>';
    }
    html += '</div>';
    c.innerHTML = html;

    // Search handler
    var input = c.querySelector('.sdd-search-input');
    var countEl = c.querySelector('.sdd-search-count');
    input.addEventListener('input', function() {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(function() {
        onSearch(input.value.trim().toLowerCase(), activeFilter);
      }, 200);
    });

    // Filter chips
    var chips = c.querySelectorAll('.sdd-chip');
    chips.forEach(function(chip) {
      chip.addEventListener('click', function() {
        chips.forEach(function(ch) { ch.classList.remove('active'); });
        chip.classList.add('active');
        activeFilter = chip.getAttribute('data-filter');
        onFilter(activeFilter, input.value.trim().toLowerCase());
      });
    });

    return {
      setCount: function(shown, total) {
        countEl.textContent = shown + ' / ' + total;
      },
      getValue: function() { return input.value.trim().toLowerCase(); },
      getFilter: function() { return activeFilter; },
      focus: function() { input.focus(); }
    };
  }
};
