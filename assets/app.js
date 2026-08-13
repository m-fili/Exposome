/* Life-Experience Exposome — Variable Explorer
 * Dependency-free. No build step. Works from file:// and from GitHub Pages.
 *
 * Data contract:
 *   window.EXPOSOME_TAXONOMY  — hierarchy (data/taxonomy.js)
 *   window.EXPOSOME_VARIABLES — id -> record (data/variables/*.js)
 */
(function () {
  'use strict';

  var TAX = window.EXPOSOME_TAXONOMY;
  var VARS = window.EXPOSOME_VARIABLES || {};

  /* ------------------------------------------------------------------ *
   * Record schema. One place: drives the card, the "not yet defined"
   * checklist, the copyable stub, and the CSV export.
   * ------------------------------------------------------------------ */

  var FIELD_SPEC = [
    { key: 'construct',       label: 'Conceptual definition', hint: 'What the variable represents, in one or two sentences.' },
    { key: 'rationale',       label: 'Why it belongs',        hint: 'Why this exposure matters for the outcome of interest.' },
    { key: 'measure',         label: 'Operational measure',   hint: 'The concrete instrument, item, or algorithm.' },
    { key: 'units',           label: 'Units',                 hint: 'e.g. hours/night, µg/m³, count, z-score.' },
    { key: 'coding',          label: 'Coding',                hint: 'Response levels or derived categories.' },
    { key: 'temporal',        label: 'Temporal resolution',   hint: 'Point-in-time, annual, time-varying, cumulative.' },
    { key: 'lookback',        label: 'Lookback window',       hint: 'Interval of data used relative to index date.' },
    { key: 'ehr',             label: 'EHR provenance',        hint: 'Source tables, code sets, NLP need, expected coverage.' },
    { key: 'external',        label: 'External data linkage', hint: 'Public dataset, geographic/temporal unit, linkage key.' },
    { key: 'formula',         label: 'Derivation',            hint: 'Formula or algorithm producing the analytic variable.' },
    { key: 'validity',        label: 'Validity notes',        hint: 'Known biases and misclassification.' },
    { key: 'missingness',     label: 'Missingness',           hint: 'Expected completeness and handling.' },
    { key: 'equity',          label: 'Equity considerations', hint: 'Differential capture across populations.' },
    { key: 'references',      label: 'References',            hint: 'Citations with PMID or DOI.' }
  ];

  var STATUS_LABEL = { final: 'Final', review: 'Under review', draft: 'Draft', todo: 'Not yet defined' };

  /* ------------------------------------------------------------------ *
   * Index the taxonomy
   * ------------------------------------------------------------------ */

  var byId = new Map();
  var domains = [];

  function build(raw, parent) {
    var id = parent ? parent.id + '.' + raw.slug : raw.slug;
    var node = {
      id: id,
      slug: raw.slug,
      label: raw.label,
      number: raw.number || '',
      parent: parent,
      depth: parent ? parent.depth + 1 : 0,
      children: [],
      path: parent ? parent.path.concat([raw.label]) : [raw.label],
      color: raw.color || (parent ? parent.color : '')
    };
    node.domain = parent ? parent.domain : node;
    byId.set(id, node);
    if (parent) { parent.children.push(node); } else { domains.push(node); }
    (raw.children || []).forEach(function (c) { build(c, node); });
    return node;
  }

  TAX.domains.forEach(function (d) { build(d, null); });

  function isLeaf(n) { return n.children.length === 0; }
  function record(id) { return VARS[id] || null; }
  function statusOf(id) { var r = record(id); return r && r.status ? r.status : 'todo'; }

  function leavesOf(n, out) {
    out = out || [];
    if (isLeaf(n)) { out.push(n); } else { n.children.forEach(function (c) { leavesOf(c, out); }); }
    return out;
  }

  var allLeaves = [];
  domains.forEach(function (d) { leavesOf(d, allLeaves); });

  function stats(n) {
    var lv = leavesOf(n);
    var done = lv.filter(function (l) { return statusOf(l.id) !== 'todo'; }).length;
    return { total: lv.length, defined: done };
  }

  /* ------------------------------------------------------------------ *
   * State
   * ------------------------------------------------------------------ */

  var state = { expanded: new Set(), selected: null, query: '' };

  var elTree = document.getElementById('tree');
  var elCard = document.getElementById('card');
  var elSearch = document.getElementById('search');
  var elClear = document.getElementById('search-clear');
  var elNoResults = document.getElementById('no-results');
  var elStats = document.getElementById('corpus-stats');
  var elToast = document.getElementById('toast');

  /* ------------------------------------------------------------------ *
   * Helpers
   * ------------------------------------------------------------------ */

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function highlight(text, q) {
    var safe = esc(text);
    if (!q) return safe;
    var i = text.toLowerCase().indexOf(q);
    if (i < 0) return safe;
    return esc(text.slice(0, i)) + '<mark>' + esc(text.slice(i, i + q.length)) + '</mark>' + esc(text.slice(i + q.length));
  }

  function toast(msg) {
    elToast.textContent = msg;
    elToast.hidden = false;
    clearTimeout(toast._t);
    toast._t = setTimeout(function () { elToast.hidden = true; }, 2200);
  }

  function recordText(id) {
    var r = record(id);
    if (!r) return '';
    try { return JSON.stringify(r).toLowerCase(); } catch (e) { return ''; }
  }

  /* ------------------------------------------------------------------ *
   * Search
   * ------------------------------------------------------------------ */

  function computeSearch(q) {
    var hit = new Set();
    byId.forEach(function (n, id) {
      if (n.label.toLowerCase().indexOf(q) >= 0 || id.toLowerCase().indexOf(q) >= 0) hit.add(id);
      else if (recordText(id).indexOf(q) >= 0) hit.add(id);
    });
    var vis = new Set();
    hit.forEach(function (id) {
      var n = byId.get(id);
      for (var p = n; p; p = p.parent) vis.add(p.id);
      (function desc(x) { x.children.forEach(function (c) { vis.add(c.id); desc(c); }); })(n);
    });
    return { hit: hit, vis: vis };
  }

  /* ------------------------------------------------------------------ *
   * Tree rendering
   * ------------------------------------------------------------------ */

  function renderTree() {
    var q = state.query.trim().toLowerCase();
    var search = q ? computeSearch(q) : null;

    var html = '<ul role="group">';
    domains.forEach(function (d) { html += renderNode(d, q, search); });
    html += '</ul>';

    elTree.innerHTML = html;
    elNoResults.hidden = !(search && search.hit.size === 0);
    elTree.hidden = !!(search && search.hit.size === 0);
  }

  function renderNode(n, q, search) {
    if (search && !search.vis.has(n.id)) return '';

    var leaf = isLeaf(n);
    var open = search ? true : state.expanded.has(n.id);
    var cls = ['row'];
    if (n.depth === 0) cls.push('domain');
    else if (!leaf) cls.push('group');
    if (leaf) cls.push('leaf');
    if (state.selected === n.id) cls.push('selected');

    var twisty = leaf ? '<span class="twisty" aria-hidden="true"></span>'
                      : '<span class="twisty" aria-hidden="true">' + (open ? '▾' : '▸') + '</span>';

    var trailing;
    if (leaf) {
      var st = statusOf(n.id);
      trailing = '<span class="dot ' + st + '" title="' + esc(STATUS_LABEL[st]) + '"></span>';
    } else {
      var s = stats(n);
      trailing = '<span class="count">' + s.defined + '/' + s.total + '</span>';
    }

    var labelText = (n.number ? n.number + '  ' : '') + n.label;
    var style = n.depth === 0 ? ' style="--domain-color:' + esc(n.color) + '"' : '';

    var out = '<li role="none">'
      + '<button type="button" class="' + cls.join(' ') + '"' + style
      + ' data-id="' + esc(n.id) + '" role="treeitem"'
      + (leaf ? '' : ' aria-expanded="' + (open ? 'true' : 'false') + '"')
      + (state.selected === n.id ? ' aria-current="true"' : '')
      + '>' + twisty
      + '<span class="label">' + highlight(labelText, q) + '</span>'
      + trailing
      + '</button>';

    if (!leaf && open) {
      var kids = n.children.map(function (c) { return renderNode(c, q, search); }).join('');
      if (kids) out += '<ul role="group">' + kids + '</ul>';
    }
    return out + '</li>';
  }

  /* ------------------------------------------------------------------ *
   * Card rendering
   * ------------------------------------------------------------------ */

  function breadcrumb(n) {
    var parts = [];
    for (var p = n.parent; p; p = p.parent) parts.unshift(p);
    if (!parts.length) return '';
    return '<p class="breadcrumb">' + parts.map(function (p) {
      return '<a href="#/' + esc(p.id) + '">' + esc(p.label) + '</a>';
    }).join('<span class="sep">›</span>') + '</p>';
  }

  function renderPlaceholder() {
    var s = { total: allLeaves.length, defined: allLeaves.filter(function (l) { return statusOf(l.id) !== 'todo'; }).length };
    elCard.className = 'card placeholder';
    elCard.innerHTML =
      '<h2>Select a variable</h2>'
      + '<p>Open a domain in the hierarchy and choose a variable to see its definition, '
      + 'EHR provenance, external data linkage, and derivation.</p>'
      + '<p>' + s.defined + ' of ' + s.total + ' variables currently carry a definition. '
      + 'Every card has a permanent link — copy it to cite a specific variable.</p>'
      + '<p class="muted">Press <kbd>/</kbd> to search.</p>';
  }

  function renderGroupCard(n) {
    var s = stats(n);
    var rows = n.children.map(function (c) {
      var cLeaf = isLeaf(c);
      var st = cLeaf ? statusOf(c.id) : null;
      var right = cLeaf
        ? '<span class="dot ' + st + '"></span>'
        : '<span class="count">' + stats(c).defined + '/' + stats(c).total + '</span>';
      return '<li><a href="#/' + esc(c.id) + '">' + esc(c.label) + '</a> ' + right + '</li>';
    }).join('');

    elCard.className = 'card';
    elCard.innerHTML =
      breadcrumb(n)
      + '<h2>' + esc((n.number ? n.number + '  ' : '') + n.label) + '</h2>'
      + '<div class="card-meta">'
      + '<span class="card-id">' + esc(n.id) + '</span>'
      + '<span class="spacer"></span>'
      + '<button type="button" class="text-btn" data-copy-link="' + esc(n.id) + '">Copy link</button>'
      + '</div>'
      + '<section><h3>Contents — ' + s.defined + ' of ' + s.total + ' defined</h3>'
      + '<ul class="field-list">' + rows + '</ul></section>';
  }

  function fieldRow(label, value) {
    if (!value) return '';
    return '<div><dt>' + esc(label) + '</dt><dd>' + esc(value) + '</dd></div>';
  }

  function renderEhr(ehr) {
    if (!ehr) return '';
    var body = '';
    if (ehr.sources && ehr.sources.length) {
      body += '<dl class="fields">' + fieldRow('Source', ehr.sources.join('; ')) + '</dl>';
    }
    if (ehr.codes && ehr.codes.length) {
      body += '<ul class="codes">' + ehr.codes.map(function (c) {
        return '<li><span class="system">' + esc(c.system) + '</span> ' + esc(c.value)
          + (c.note ? ' <span class="note">— ' + esc(c.note) + '</span>' : '') + '</li>';
      }).join('') + '</ul>';
    }
    var extra = '<dl class="fields">'
      + (typeof ehr.nlp === 'boolean' ? fieldRow('Requires NLP', ehr.nlp ? 'Yes — free-text extraction' : 'No — structured fields only') : '')
      + fieldRow('Expected coverage', ehr.coverage)
      + '</dl>';
    if (extra.indexOf('<div>') < 0) extra = '';
    if (!body && !extra) return '';
    return '<section><h3>EHR provenance</h3>' + body + extra + '</section>';
  }

  function renderExternal(list) {
    if (!list || !list.length) return '';
    var items = list.map(function (d) {
      var name = d.url ? '<a href="' + esc(d.url) + '" target="_blank" rel="noopener">' + esc(d.dataset) + '</a>' : esc(d.dataset);
      return '<div class="dataset"><div class="name">' + name + '</div><dl class="fields">'
        + fieldRow('Geographic / temporal unit', d.unit)
        + fieldRow('Linkage key', d.key)
        + fieldRow('Access', d.access)
        + fieldRow('License', d.license)
        + '</dl></div>';
    }).join('');
    return '<section><h3>External data linkage</h3>' + items + '</section>';
  }

  function renderRefs(refs) {
    if (!refs || !refs.length) return '';
    var items = refs.map(function (r) {
      var tail = [];
      if (r.pmid) tail.push('<a href="https://pubmed.ncbi.nlm.nih.gov/' + esc(r.pmid) + '/" target="_blank" rel="noopener">PMID ' + esc(r.pmid) + '</a>');
      if (r.doi) tail.push('<a href="https://doi.org/' + esc(r.doi) + '" target="_blank" rel="noopener">doi:' + esc(r.doi) + '</a>');
      if (!tail.length && r.url) tail.push('<a href="' + esc(r.url) + '" target="_blank" rel="noopener">link</a>');
      return '<li>' + esc(r.citation) + (tail.length ? ' ' + tail.join(' · ') : '') + '</li>';
    }).join('');
    return '<section><h3>References</h3><ol class="refs">' + items + '</ol></section>';
  }

  function renderEmptyRecord(n) {
    var items = FIELD_SPEC.map(function (f) {
      return '<li><span class="fname">' + esc(f.key) + '</span>' + esc(f.hint) + '</li>';
    }).join('');
    return '<section><div class="empty-state">'
      + '<p><strong>This variable has no definition yet.</strong> A record for '
      + '<code>' + esc(n.id) + '</code> has not been added to <code>data/variables/'
      + esc(n.domain.slug) + '.js</code>.</p>'
      + '<p>A complete record answers:</p>'
      + '<ul class="field-list">' + items + '</ul>'
      + '<p style="margin-top:14px"><button type="button" class="text-btn" data-stub="' + esc(n.id) + '">Copy blank record</button></p>'
      + '</div></section>';
  }

  function renderVariableCard(n) {
    var r = record(n.id);
    var st = statusOf(n.id);

    var head = breadcrumb(n)
      + '<h2>' + esc(n.label) + '</h2>'
      + '<div class="card-meta">'
      + '<span class="badge ' + st + '">' + esc(STATUS_LABEL[st]) + '</span>'
      + '<span class="card-id">' + esc(n.id) + '</span>'
      + '<span class="spacer"></span>'
      + (r && r.updated ? '<span class="muted">updated ' + esc(r.updated) + '</span>' : '')
      + '<button type="button" class="text-btn" data-copy-link="' + esc(n.id) + '">Copy link</button>'
      + '</div>';

    if (!r) {
      elCard.className = 'card';
      elCard.innerHTML = head + renderEmptyRecord(n);
      return;
    }

    var body = '';

    if (r.construct || r.rationale) {
      body += '<section><h3>Definition</h3>'
        + (r.construct ? '<p>' + esc(r.construct) + '</p>' : '')
        + (r.rationale ? '<p>' + esc(r.rationale) + '</p>' : '')
        + '</section>';
    }

    var op = '<dl class="fields">'
      + fieldRow('Measure', r.measure)
      + fieldRow('Units', r.units)
      + fieldRow('Coding', r.coding)
      + fieldRow('Temporal resolution', r.temporal)
      + fieldRow('Lookback window', r.lookback)
      + '</dl>';
    if (op.indexOf('<div>') >= 0) body += '<section><h3>Operationalization</h3>' + op + '</section>';

    body += renderEhr(r.ehr);
    body += renderExternal(r.external);

    if (r.formula || r.derivationNotes) {
      body += '<section><h3>Derivation</h3>'
        + (r.formula ? '<pre class="formula">' + esc(r.formula) + '</pre>' : '')
        + (r.derivationNotes ? '<p>' + esc(r.derivationNotes) + '</p>' : '')
        + '</section>';
    }

    if (r.validity || r.missingness || r.equity) {
      body += '<section><h3>Validity and limitations</h3>'
        + (r.validity ? '<p>' + esc(r.validity) + '</p>' : '')
        + (r.missingness ? '<p><em>Missingness.</em> ' + esc(r.missingness) + '</p>' : '')
        + (r.equity ? '<p><em>Equity.</em> ' + esc(r.equity) + '</p>' : '')
        + '</section>';
    }

    body += renderRefs(r.references);

    if (r.tags && r.tags.length) {
      body += '<section><h3>Tags</h3><div class="tags">'
        + r.tags.map(function (t) { return '<span class="tag">' + esc(t) + '</span>'; }).join('')
        + '</div></section>';
    }

    elCard.className = 'card';
    elCard.innerHTML = head + body;
  }

  function renderCard() {
    if (!state.selected) return renderPlaceholder();
    var n = byId.get(state.selected);
    if (!n) return renderPlaceholder();
    if (isLeaf(n)) renderVariableCard(n); else renderGroupCard(n);
    elCard.parentNode.scrollTop = 0;
  }

  /* ------------------------------------------------------------------ *
   * Selection + routing
   * ------------------------------------------------------------------ */

  var suppressHash = false;

  function expandAncestors(id) {
    var n = byId.get(id);
    if (!n) return;
    for (var p = n.parent; p; p = p.parent) state.expanded.add(p.id);
  }

  function select(id, opts) {
    opts = opts || {};
    if (!byId.has(id)) return;
    state.selected = id;
    expandAncestors(id);
    if (!isLeaf(byId.get(id)) && opts.toggle) {
      if (state.expanded.has(id)) state.expanded.delete(id); else state.expanded.add(id);
    } else if (!isLeaf(byId.get(id)) && !opts.toggle) {
      state.expanded.add(id);
    }
    if (!opts.fromHash) {
      suppressHash = true;
      location.hash = '#/' + id;
      setTimeout(function () { suppressHash = false; }, 0);
    }
    renderTree();
    renderCard();
    if (opts.focus) {
      var btn = elTree.querySelector('[data-id="' + id.replace(/"/g, '\\"') + '"]');
      if (btn) btn.focus();
    }
  }

  function fromHash() {
    var h = location.hash.replace(/^#\/?/, '');
    if (!h) { state.selected = null; renderTree(); renderCard(); return; }
    if (byId.has(h)) {
      select(h, { fromHash: true });
      var btn = elTree.querySelector('[data-id="' + h.replace(/"/g, '\\"') + '"]');
      if (btn && btn.scrollIntoView) btn.scrollIntoView({ block: 'nearest' });
    }
  }

  window.addEventListener('hashchange', function () { if (!suppressHash) fromHash(); });

  /* ------------------------------------------------------------------ *
   * Events
   * ------------------------------------------------------------------ */

  elTree.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-id]');
    if (!btn) return;
    select(btn.getAttribute('data-id'), { toggle: true, focus: true });
  });

  elTree.addEventListener('keydown', function (e) {
    var btn = e.target.closest('[data-id]');
    if (!btn) return;
    var rows = Array.prototype.slice.call(elTree.querySelectorAll('[data-id]'));
    var i = rows.indexOf(btn);
    var id = btn.getAttribute('data-id');
    var node = byId.get(id);

    if (e.key === 'ArrowDown' && i < rows.length - 1) { e.preventDefault(); rows[i + 1].focus(); }
    else if (e.key === 'ArrowUp' && i > 0) { e.preventDefault(); rows[i - 1].focus(); }
    else if (e.key === 'ArrowRight' && node && !isLeaf(node) && !state.expanded.has(id)) {
      e.preventDefault(); state.expanded.add(id); renderTree(); focusId(id);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      if (node && !isLeaf(node) && state.expanded.has(id)) { state.expanded.delete(id); renderTree(); focusId(id); }
      else if (node && node.parent) { focusId(node.parent.id); }
    }
  });

  function focusId(id) {
    var btn = elTree.querySelector('[data-id="' + id.replace(/"/g, '\\"') + '"]');
    if (btn) btn.focus();
  }

  elCard.addEventListener('click', function (e) {
    var link = e.target.closest('[data-copy-link]');
    if (link) {
      var url = location.href.split('#')[0] + '#/' + link.getAttribute('data-copy-link');
      copy(url, 'Link copied');
      return;
    }
    var stub = e.target.closest('[data-stub]');
    if (stub) {
      copy(blankRecord(stub.getAttribute('data-stub')), 'Blank record copied — paste into data/variables/');
    }
  });

  function copy(text, msg) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () { toast(msg); }, function () { fallbackCopy(text, msg); });
    } else {
      fallbackCopy(text, msg);
    }
  }

  function fallbackCopy(text, msg) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); toast(msg); } catch (err) { toast('Copy failed — select manually'); }
    document.body.removeChild(ta);
  }

  function blankRecord(id) {
    var n = byId.get(id);
    var rec = {
      status: 'draft',
      updated: '',
      construct: '',
      rationale: '',
      measure: '',
      units: '',
      coding: '',
      temporal: '',
      lookback: '',
      ehr: { sources: [], codes: [{ system: '', value: '', note: '' }], nlp: false, coverage: '' },
      external: [{ dataset: '', unit: '', key: '', access: '', license: '', url: '' }],
      formula: '',
      derivationNotes: '',
      validity: '',
      missingness: '',
      equity: '',
      references: [{ citation: '', pmid: '', doi: '', url: '' }],
      tags: []
    };
    return '  // ' + (n ? n.path.join(' › ') : id) + '\n'
      + '  ' + JSON.stringify(id) + ': ' + JSON.stringify(rec, null, 2).replace(/\n/g, '\n  ') + ',';
  }

  /* search box */

  var searchTimer;
  elSearch.addEventListener('input', function () {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(function () {
      state.query = elSearch.value;
      elClear.hidden = !elSearch.value;
      renderTree();
    }, 90);
  });

  elClear.addEventListener('click', function () {
    elSearch.value = '';
    state.query = '';
    elClear.hidden = true;
    renderTree();
    elSearch.focus();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === '/' && document.activeElement !== elSearch) {
      e.preventDefault(); elSearch.focus(); elSearch.select();
    } else if (e.key === 'Escape' && document.activeElement === elSearch) {
      elSearch.value = ''; state.query = ''; elClear.hidden = true; renderTree(); elSearch.blur();
    }
  });

  /* pane actions */

  document.getElementById('expand-all').addEventListener('click', function () {
    byId.forEach(function (n, id) { if (!isLeaf(n)) state.expanded.add(id); });
    renderTree();
  });

  document.getElementById('collapse-all').addEventListener('click', function () {
    state.expanded.clear();
    renderTree();
  });

  document.getElementById('print-all').addEventListener('click', function () { window.print(); });

  /* theme */

  var themeBtn = document.getElementById('theme-toggle');
  var stored = null;
  try { stored = localStorage.getItem('exposome-theme'); } catch (e) {}
  if (stored) document.documentElement.setAttribute('data-theme', stored);

  themeBtn.addEventListener('click', function () {
    var cur = document.documentElement.getAttribute('data-theme');
    var dark = cur ? cur === 'dark'
      : window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    var next = dark ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    try { localStorage.setItem('exposome-theme', next); } catch (e) {}
  });

  /* CSV export */

  document.getElementById('download-csv').addEventListener('click', function () {
    var cols = ['id', 'domain', 'subdomain', 'variable', 'status', 'construct', 'measure', 'units',
      'coding', 'temporal', 'lookback', 'ehr_sources', 'ehr_codes', 'ehr_nlp', 'ehr_coverage',
      'external_datasets', 'formula', 'validity', 'missingness', 'equity', 'references', 'tags'];

    function q(v) { return '"' + String(v == null ? '' : v).replace(/"/g, '""') + '"'; }

    var lines = [cols.join(',')];
    allLeaves.forEach(function (n) {
      var r = record(n.id) || {};
      var ehr = r.ehr || {};
      lines.push([
        n.id,
        n.path[0],
        n.path.length > 2 ? n.path[1] : '',
        n.label,
        statusOf(n.id),
        r.construct, r.measure, r.units, r.coding, r.temporal, r.lookback,
        (ehr.sources || []).join('; '),
        (ehr.codes || []).map(function (c) { return c.system + ' ' + c.value; }).join('; '),
        typeof ehr.nlp === 'boolean' ? (ehr.nlp ? 'yes' : 'no') : '',
        ehr.coverage,
        (r.external || []).map(function (d) { return d.dataset; }).join('; '),
        r.formula, r.validity, r.missingness, r.equity,
        (r.references || []).map(function (x) { return x.citation; }).join(' | '),
        (r.tags || []).join('; ')
      ].map(q).join(','));
    });

    var blob = new Blob(['﻿' + lines.join('\r\n')], { type: 'text/csv;charset=utf-8;' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'exposome-variables-v' + TAX.version + '.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(a.href);
    toast('CSV downloaded');
  });

  /* ------------------------------------------------------------------ *
   * Boot
   * ------------------------------------------------------------------ */

  (function boot() {
    var defined = allLeaves.filter(function (l) { return statusOf(l.id) !== 'todo'; }).length;
    elStats.innerHTML = '<strong>' + allLeaves.length + '</strong> variables across '
      + domains.length + ' domains · <strong>' + defined + '</strong> defined';

    document.getElementById('cite-line').textContent = TAX.citation || (TAX.title + ', v' + TAX.version);
    document.getElementById('version-line').textContent = 'v' + TAX.version + ' · ' + TAX.updated;

    renderTree();
    if (location.hash) fromHash(); else renderCard();
  })();

})();
