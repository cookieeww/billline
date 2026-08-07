/* Billline — formatting helpers (plain script, no deps) */
(function (global) {
  'use strict';

  var CURRENCIES = [
    { code: 'USD', label: 'USD — US Dollar' },
    { code: 'EUR', label: 'EUR — Euro' },
    { code: 'GBP', label: 'GBP — British Pound' },
    { code: 'INR', label: 'INR — Indian Rupee' },
    { code: 'AUD', label: 'AUD — Australian Dollar' },
    { code: 'CAD', label: 'CAD — Canadian Dollar' },
    { code: 'JPY', label: 'JPY — Japanese Yen' },
    { code: 'CNY', label: 'CNY — Chinese Yuan' },
    { code: 'CHF', label: 'CHF — Swiss Franc' },
    { code: 'NZD', label: 'NZD — New Zealand Dollar' },
    { code: 'SEK', label: 'SEK — Swedish Krona' },
    { code: 'NOK', label: 'NOK — Norwegian Krone' },
    { code: 'DKK', label: 'DKK — Danish Krone' },
    { code: 'PLN', label: 'PLN — Polish Zloty' },
    { code: 'BRL', label: 'BRL — Brazilian Real' },
    { code: 'MXN', label: 'MXN — Mexican Peso' },
    { code: 'ZAR', label: 'ZAR — South African Rand' },
    { code: 'SGD', label: 'SGD — Singapore Dollar' },
    { code: 'HKD', label: 'HKD — Hong Kong Dollar' },
    { code: 'AED', label: 'AED — UAE Dirham' },
    { code: 'TRY', label: 'TRY — Turkish Lira' },
    { code: 'ILS', label: 'ILS — Israeli Shekel' },
    { code: 'PHP', label: 'PHP — Philippine Peso' },
    { code: 'MYR', label: 'MYR — Malaysian Ringgit' },
    { code: 'THB', label: 'THB — Thai Baht' },
    { code: 'IDR', label: 'IDR — Indonesian Rupiah' },
    { code: 'RUB', label: 'RUB — Russian Ruble' },
    { code: 'NONE', label: 'None — no currency symbol' }
  ];

  var SYMBOL_MAP = {
    USD: '$', EUR: '€', GBP: '£', INR: '₹', AUD: 'A$', CAD: 'C$', JPY: '¥',
    CNY: 'CN¥', CHF: 'CHF', NZD: 'NZ$', SEK: 'kr', NOK: 'kr', DKK: 'kr',
    PLN: 'zł', BRL: 'R$', MXN: 'MX$', ZAR: 'R', SGD: 'S$', HKD: 'HK$',
    AED: 'AED', TRY: '₺', ILS: '₪', PHP: '₱', MYR: 'RM', THB: '฿',
    IDR: 'Rp', RUB: '₽'
  };

  function formatMoney(amountCents, code) {
    if (code === 'NONE' || !code) {
      return (amountCents / 100).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    }
    var val = amountCents / 100;
    try {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: code,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(val);
    } catch (e) {
      return SYMBOL_MAP[code] + ' ' + val.toFixed(2);
    }
  }

  function formatDate(iso) {
    var d = parseISODate(iso);
    if (!d) return '';
    try {
      return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: 'numeric' }).format(d);
    } catch (e) {
      return iso;
    }
  }

  function pad(n) { return n < 10 ? '0' + n : String(n); }

  function toISODate(d) {
    return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
  }

  function parseISODate(iso) {
    var parts = String(iso || '').split('-');
    if (parts.length !== 3) return null;
    var y = parseInt(parts[0], 10), m = parseInt(parts[1], 10), day = parseInt(parts[2], 10);
    if (!y || !m || !day) return null;
    var d = new Date(y, m - 1, day);
    if (isNaN(d.getTime())) return null;
    /* guard against rollovers like 2026-02-30 */
    if (d.getFullYear() !== y || d.getMonth() !== m - 1 || d.getDate() !== day) return null;
    return d;
  }

  function todayISO() {
    return toISODate(new Date());
  }

  function addDaysISO(iso, days) {
    var d = parseISODate(iso);
    if (!d) return '';
    d.setDate(d.getDate() + days);
    return toISODate(d);
  }

  global.Billline = global.Billline || {};
  global.Billline.format = {
    CURRENCIES: CURRENCIES,
    formatMoney: formatMoney,
    formatDate: formatDate,
    todayISO: todayISO,
    addDaysISO: addDaysISO
  };
})(window);
