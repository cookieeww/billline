/* Billline — invoice totals math (pure, cents-based; unit-testable) */
(function (global) {
  'use strict';

  function parseNum(v) {
    var n = parseFloat(v);
    return isFinite(n) ? n : 0;
  }

  /* All returned values are integer cents. */
  function computeTotals(state) {
    var inv = state.invoice || {};
    var items = Array.isArray(state.items) ? state.items : [];

    var subtotalC = 0;
    items.forEach(function (it) {
      var q = parseNum(it && it.qty);
      var r = parseNum(it && it.rate);
      subtotalC += Math.round(q * r * 100);
    });
    subtotalC = Math.round(subtotalC);

    var discountC = 0;
    if (inv.discountType === 'pct') {
      var p = Math.min(100, parseNum(inv.discountValue));
      discountC = Math.round((subtotalC * p) / 100);
    } else {
      discountC = Math.round(parseNum(inv.discountValue) * 100);
    }
    if (discountC < 0) discountC = 0;

    var baseC = subtotalC - discountC;
    if (baseC < 0) baseC = 0;

    var taxC = 0;
    if (inv.taxType === 'pct') {
      var t = Math.min(100, parseNum(inv.taxValue));
      taxC = Math.round((baseC * t) / 100);
    } else {
      taxC = Math.round(parseNum(inv.taxValue) * 100);
    }
    if (taxC < 0) taxC = 0;

    return { subtotalC: subtotalC, discountC: discountC, taxC: taxC, baseC: baseC, totalC: baseC + taxC };
  }

  global.Billline = global.Billline || {};
  global.Billline.money = { computeTotals: computeTotals };
})(window);
