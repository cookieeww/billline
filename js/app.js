/* Billline — app logic: state binding, live preview, items, print (no deps) */
(function (global) {
  'use strict';

  var Fmt = global.Billline.format;
  var Store = global.Billline.store;

  var state = Store.load();

  /* ---------- tiny HTML escape (we render user text into innerHTML) ---------- */
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  /* ---------- element refs ---------- */
  var $ = function (id) { return document.getElementById(id); };
  var els = {
    items: $('items'),
    sheet: $('sheet'),
    currency: $('inv-currency'),
    logoInput: $('logo-input'),
    logoImg: $('logo-img'),
    logoPreview: $('logo-preview'),
    logoContent: $('logo-dropzone-content'),
    logoLabel: $('logo-label'),
    logoRemove: $('logo-remove')
  };

  /* Field id -> state path */
  var FIELD_MAP = {
    'from-name': ['brand', 'name'],
    'from-email': ['brand', 'email'],
    'from-address': ['brand', 'address'],
    'from-phone': ['brand', 'phone'],
    'from-vat': ['brand', 'vat'],
    'to-name': ['client', 'name'],
    'to-email': ['client', 'email'],
    'to-address': ['client', 'address'],
    'inv-number': ['invoice', 'number'],
    'inv-currency': ['invoice', 'currency'],
    'inv-issue': ['invoice', 'issueDate'],
    'inv-due': ['invoice', 'dueDate'],
    'discount-type': ['invoice', 'discountType'],
    'discount-value': ['invoice', 'discountValue'],
    'tax-type': ['invoice', 'taxType'],
    'tax-value': ['invoice', 'taxValue'],
    'payment-info': ['invoice', 'paymentInfo'],
    'notes': ['invoice', 'notes'],
    'terms': ['invoice', 'terms']
  };

  function getPath(obj, path) {
    return path.reduce(function (o, k) { return (o == null ? o : o[k]); }, obj);
  }

  var computeTotals = global.Billline.money.computeTotals;

  /* ---------- render: items editor rows ---------- */
  function renderItems() {
    var html = state.items.map(function (it, idx) {
      return '<div class="item-row">' +
        '<input type="text" class="item-desc" data-idx="' + idx + '" value="' + esc(it.description) + '" placeholder="Description" maxlength="2000" aria-label="Item description">' +
        '<input type="text" inputmode="decimal" class="item-qty" data-idx="' + idx + '" value="' + esc(it.qty) + '" placeholder="Qty" aria-label="Quantity">' +
        '<input type="text" inputmode="decimal" class="item-rate" data-idx="' + idx + '" value="' + esc(it.rate) + '" placeholder="Rate" aria-label="Unit rate">' +
        '<span class="item-amount">' + esc(itemAmount(idx)) + '</span>' +
        '<button type="button" class="btn-icon" data-remove="' + idx + '" aria-label="Remove item">' +
          '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>' +
        '</button>' +
        '</div>';
    }).join('');
    els.items.innerHTML = html;
  }

  function itemAmount(idx) {
    var it = state.items[idx];
    var q = parseFloat(it.qty) || 0;
    var r = parseFloat(it.rate) || 0;
    return Fmt.formatMoney(Math.round(q * r * 100), state.invoice.currency);
  }

  /* ---------- render: sheet preview ---------- */
  function renderSheet() {
    var inv = state.invoice;
    var t = computeTotals(state);
    var cur = inv.currency;

    var brandBlock = state.brand.logo
      ? '<div class="sheet-logo"><img src="' + esc(state.brand.logo) + '" alt="' + esc(state.brand.name || 'Company logo') + '"></div>'
      : (state.brand.name
          ? '<div class="sheet-brandname">' + esc(state.brand.name) + '</div>'
          : '<div class="sheet-brandname" style="color:#b9c2cc">Your company</div>');

    var biz = [];
    if (state.brand.name && !state.brand.logo) biz.push(esc(state.brand.name));
    if (state.brand.email) biz.push(esc(state.brand.email));
    if (state.brand.phone) biz.push(esc(state.brand.phone));
    if (state.brand.address) biz.push(esc(state.brand.address).replace(/\n/g, '<br>'));
    if (state.brand.vat) biz.push('VAT/Tax ID: ' + esc(state.brand.vat));

    var clientLines = [];
    if (state.client.name) clientLines.push('<div style="font-weight:700;font-size:13px">' + esc(state.client.name) + '</div>');
    if (state.client.email) clientLines.push(esc(state.client.email));
    if (state.client.address) clientLines.push(esc(state.client.address).replace(/\n/g, '<br>'));

    var rows = state.items
      .filter(function (it) { return it.description || it.qty || it.rate; })
      .map(function (it) {
        var q = parseFloat(it.qty) || 0;
        var r = parseFloat(it.rate) || 0;
        var amt = Fmt.formatMoney(Math.round(q * r * 100), cur);
        return '<tr>' +
          '<td class="desc">' + esc(it.description || '—') + '</td>' +
          '<td class="num">' + esc(formatQty(q)) + '</td>' +
          '<td class="num">' + esc(Fmt.formatMoney(Math.round(r * 100), cur)) + '</td>' +
          '<td class="num">' + esc(amt) + '</td>' +
          '</tr>';
      }).join('');

    if (!rows) {
      rows = '<tr><td colspan="4" class="desc sheet-muted">Add line items to build your invoice.</td></tr>';
    }

    var totalsRows = '';
    totalsRows += totalsRow('Subtotal', Fmt.formatMoney(t.subtotalC, cur));
    if (t.discountC > 0) {
      var discLabel = inv.discountType === 'pct'
        ? 'Discount (' + esc(inv.discountValue) + '%)'
        : 'Discount';
      totalsRows += totalsRow(discLabel, '− ' + Fmt.formatMoney(t.discountC, cur));
    }
    if (t.taxC > 0) {
      var taxLabel = inv.taxType === 'pct'
        ? 'Tax (' + esc(inv.taxValue) + '%)'
        : 'Tax';
      totalsRows += totalsRow(taxLabel, Fmt.formatMoney(t.taxC, cur));
    }
    totalsRows += '<tr class="total"><td>Total</td><td>' + esc(Fmt.formatMoney(t.totalC, cur)) + '</td></tr>';

    var meta = '';
    meta += metaRow('Invoice number', inv.number);
    if (inv.issueDate) meta += metaRow('Issue date', Fmt.formatDate(inv.issueDate));
    if (inv.dueDate) meta += metaRow('Due date', Fmt.formatDate(inv.dueDate));

    var notesBlock = inv.notes
      ? '<div class="block"><div class="sheet-label">Notes</div><p>' + esc(inv.notes) + '</p></div>'
      : '';
    var paymentBlock = inv.paymentInfo
      ? '<div class="block"><div class="sheet-label">Payment details</div><p>' + esc(inv.paymentInfo) + '</p></div>'
      : '';
    var termsBlock = inv.terms
      ? '<div class="block"><div class="sheet-label">Terms</div><p class="terms">' + esc(inv.terms) + '</p></div>'
      : '';

    els.sheet.innerHTML =
      '<div class="sheet-head">' +
        '<div>' + brandBlock +
          '<div class="sheet-biz sheet-muted">' + biz.join('<br>') + '</div>' +
        '</div>' +
        '<div class="sheet-meta">' +
          '<div class="inv-number">' + esc(inv.number || 'Invoice') + '</div>' +
          '<table>' + meta + '</table>' +
        '</div>' +
      '</div>' +

      '<div class="sheet-parties">' +
        '<div class="sheet-billto">' +
          '<div class="sheet-label">Bill to</div>' +
          '<div>' + clientLines.join('<br>') + '</div>' +
        '</div>' +
        '<div></div>' +
      '</div>' +

      '<table class="sheet-table">' +
        '<thead><tr><th>Description</th><th class="num">Qty</th><th class="num">Rate</th><th class="num">Amount</th></tr></thead>' +
        '<tbody>' + rows + '</tbody>' +
      '</table>' +

      '<div class="sheet-totals"><table>' + totalsRows + '</table></div>' +

      '<div class="sheet-foot">' +
        notesBlock + paymentBlock + termsBlock +
      '</div>';
  }

  function totalsRow(label, value) {
    return '<tr><td>' + esc(label) + '</td><td>' + esc(value) + '</td></tr>';
  }
  function metaRow(label, value) {
    return '<tr><td style="color:#667">' + esc(label) + '</td><td>' + esc(value || '—') + '</td></tr>';
  }
  function formatQty(q) {
    return Number.isInteger(q) ? String(q) : String(Math.round(q * 100) / 100);
  }

  /* ---------- bindings ---------- */
  function bindFields() {
    Object.keys(FIELD_MAP).forEach(function (id) {
      var el = $(id);
      if (!el) return;
      el.value = getPath(state, FIELD_MAP[id]) || '';
      el.addEventListener('input', function () {
        var path = FIELD_MAP[id];
        setByPath(state, path, el.value);
        onChange();
      });
    });
  }

  function setByPath(obj, path, value) {
    var last = path[path.length - 1];
    var target = path.slice(0, -1).reduce(function (o, k) { return o[k]; }, obj);
    target[last] = value;
  }

  function onChange() {
    renderItems();
    renderSheet();
    scheduleSave();
  }

  /* ---------- items ---------- */
  els.items.addEventListener('input', function (e) {
    var target = e.target;
    var idx = parseInt(target.getAttribute('data-idx'), 10);
    if (isNaN(idx) || !state.items[idx]) return;
    if (target.classList.contains('item-desc')) state.items[idx].description = target.value;
    if (target.classList.contains('item-qty')) state.items[idx].qty = target.value;
    if (target.classList.contains('item-rate')) state.items[idx].rate = target.value;
    onChange();
  });

  els.items.addEventListener('click', function (e) {
    var btn = e.target.closest('.btn-icon[data-remove]');
    if (!btn) return;
    var idx = parseInt(btn.getAttribute('data-remove'), 10);
    if (state.items.length > 1) {
      state.items.splice(idx, 1);
    } else {
      state.items = [{ description: '', qty: '', rate: '' }];
    }
    onChange();
  });

  $('btn-add-item').addEventListener('click', function () {
    state.items.push({ description: '', qty: '', rate: '' });
    onChange();
    var rows = els.items.querySelectorAll('.item-desc');
    if (rows.length) rows[rows.length - 1].focus();
  });

  /* ---------- currency select ---------- */
  Fmt.CURRENCIES.forEach(function (c) {
    var opt = document.createElement('option');
    opt.value = c.code;
    opt.textContent = c.label;
    els.currency.appendChild(opt);
  });
  els.currency.value = state.invoice.currency;

  /* ---------- logo ---------- */
  els.logoInput.addEventListener('change', function () {
    var file = els.logoInput.files && els.logoInput.files[0];
    if (!file) return;
    if (file.type.indexOf('image/') !== 0) { alert('Please choose an image file.'); return; }
    if (file.size > 1.5 * 1024 * 1024) { alert('Logo is too large. Please use an image under 1.5 MB.'); return; }
    var reader = new FileReader();
    reader.onload = function () {
      state.brand.logo = reader.result;
      syncLogoUI();
      onChange();
    };
    reader.onerror = function () { alert('Could not read that image.'); };
    reader.readAsDataURL(file);
  });

  els.logoRemove.addEventListener('click', function () {
    state.brand.logo = '';
    els.logoInput.value = '';
    syncLogoUI();
    onChange();
  });

  function syncLogoUI() {
    if (state.brand.logo) {
      els.logoImg.src = state.brand.logo;
      els.logoPreview.hidden = false;
      els.logoContent.hidden = true;
      els.logoLabel.textContent = 'Upload New Logo';
    } else {
      els.logoPreview.hidden = true;
      els.logoContent.hidden = false;
      els.logoImg.removeAttribute('src');
      els.logoLabel.textContent = 'Upload Brand Logo';
    }
  }

  /* ---------- toolbar ---------- */
  $('btn-print').addEventListener('click', function () { window.print(); });
  $('btn-print-mobile').addEventListener('click', function () { window.print(); });

  $('btn-sample').addEventListener('click', function () {
    if (!confirm('Replace the current invoice with the sample invoice?')) return;
    state = Store.sampleState();
    els.currency.value = state.invoice.currency;
    syncLogoUI();
    hydrateFields();
    onChange();
  });

  $('btn-reset').addEventListener('click', function () {
    if (!confirm('Start a new blank invoice? Your current draft will be replaced.')) return;
    state = Store.defaultState();
    els.currency.value = state.invoice.currency;
    syncLogoUI();
    hydrateFields();
    onChange();
  });

  function hydrateFields() {
    Object.keys(FIELD_MAP).forEach(function (id) {
      var el = $(id);
      if (el) el.value = getPath(state, FIELD_MAP[id]) || '';
    });
  }

  /* ---------- autosave ---------- */
  var saveTimer = null;
  function scheduleSave() {
    if (saveTimer) clearTimeout(saveTimer);
    saveTimer = setTimeout(function () { saveNow(); }, 400);
  }
  function saveNow() {
    Store.save(state);
  }
  window.addEventListener('beforeunload', function () { saveNow(); });

  /* ---------- init ---------- */
  syncLogoUI();
  bindFields();
  renderItems();
  renderSheet();

  global.Billline.app = { state: function () { return state; } };
})(window);
