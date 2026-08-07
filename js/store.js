/* Billline — state + localStorage persistence (plain script, no deps) */
(function (global) {
  'use strict';

  var KEY = 'billline:v1';

  function defaultState() {
    var today = global.Billline.format.todayISO();
    return {
      brand: { name: '', email: '', address: '', phone: '', vat: '', logo: '' },
      client: { name: '', email: '', address: '' },
      invoice: {
        number: 'INV-0001',
        currency: 'USD',
        issueDate: today,
        dueDate: global.Billline.format.addDaysISO(today, 14),
        discountType: 'pct',
        discountValue: '',
        taxType: 'pct',
        taxValue: '',
        notes: '',
        terms: 'Payment is due on the due date. Thank you for your business.',
        paymentInfo: ''
      },
      items: [
        { description: '', qty: '', rate: '' }
      ]
    };
  }

  function sampleState() {
    var today = global.Billline.format.todayISO();
    return {
      brand: {
        name: 'Acme Studio',
        email: 'billing@acme.studio',
        address: '48 Pine Street\nPortland, OR 97205\nUnited States',
        phone: '+1 (503) 555-0134',
        vat: '',
        logo: ''
      },
      client: {
        name: 'Northwind Coffee Co.',
        email: 'orders@northwind.coffee',
        address: '221B Baker Lane\nSeattle, WA 98101\nUnited States'
      },
      invoice: {
        number: 'INV-0042',
        currency: 'USD',
        issueDate: today,
        dueDate: global.Billline.format.addDaysISO(today, 14),
        discountType: 'pct',
        discountValue: '',
        taxType: 'pct',
        taxValue: '',
        notes: 'Thanks for your continued partnership!',
        terms: 'Payment is due on the due date. Thank you for your business.',
        paymentInfo: 'Bank: Northwind Bank • ACH routing 123456789 • Account 000123456789'
      },
      items: [
        { description: 'Brand identity & logo design', qty: '1', rate: '1500' },
        { description: 'Website landing page build', qty: '1', rate: '2400' },
        { description: 'Monthly social media templates', qty: '3', rate: '400' }
      ]
    };
  }

  function isPlainObject(v) {
    return v !== null && typeof v === 'object' && !Array.isArray(v);
  }

  /* Deep-merge saved data onto defaults so new fields never break old drafts. */
  function normalize(saved) {
    var d = defaultState();
    if (!isPlainObject(saved)) return d;
    var out = JSON.parse(JSON.stringify(d));

    ['brand', 'client'].forEach(function (section) {
      var src = saved[section];
      if (isPlainObject(src)) {
        Object.keys(d[section]).forEach(function (key) {
          if (typeof src[key] === 'string' || typeof src[key] === 'number') {
            out[section][key] = String(src[key]).slice(0, 4096);
          }
        });
      }
    });

    var inv = saved.invoice;
    if (isPlainObject(inv)) {
      ['number', 'currency', 'issueDate', 'dueDate', 'discountType', 'taxType', 'notes', 'terms', 'paymentInfo']
        .forEach(function (key) {
          if (typeof inv[key] === 'string') out.invoice[key] = inv[key].slice(0, 4096);
        });
      ['discountValue', 'taxValue'].forEach(function (key) {
        if (typeof inv[key] === 'string' || typeof inv[key] === 'number') {
          out.invoice[key] = String(inv[key]).slice(0, 16);
        }
      });
    }

    if (Array.isArray(saved.items) && saved.items.length) {
      out.items = saved.items
        .slice(0, 200)
        .map(function (it) {
          if (!isPlainObject(it)) return null;
          return {
            description: typeof it.description === 'string' ? it.description.slice(0, 2000) : '',
            qty: String(it.qty == null ? '' : it.qty).slice(0, 16),
            rate: String(it.rate == null ? '' : it.rate).slice(0, 16)
          };
        })
        .filter(Boolean);
    }

    return out;
  }

  function load() {
    try {
      var raw = localStorage.getItem(KEY);
      if (!raw) return defaultState();
      return normalize(JSON.parse(raw));
    } catch (e) {
      return defaultState();
    }
  }

  function save(state) {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
      return true;
    } catch (e) {
      /* Quota exceeded (usually a huge logo). Fall back gracefully. */
      try {
        var slim = JSON.parse(JSON.stringify(state));
        slim.brand.logo = '';
        localStorage.setItem(KEY, JSON.stringify(slim));
        return false;
      } catch (e2) {
        return false;
      }
    }
  }

  global.Billline = global.Billline || {};
  global.Billline.store = { defaultState: defaultState, sampleState: sampleState, load: load, save: save, KEY: KEY };
})(window);
