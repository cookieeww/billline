import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

const storage = new Map();
global.window = global;
global.localStorage = {
  getItem: (k) => (storage.has(k) ? storage.get(k) : null),
  setItem: (k, v) => storage.set(k, String(v)),
  removeItem: (k) => storage.delete(k),
};

function loadScript(rel) {
  const code = readFileSync(join(root, rel), 'utf8');
  (0, eval)(code);
}

loadScript('js/format.js');
loadScript('js/money.js');
loadScript('js/store.js');

const Fmt = Billline.format;
const Money = Billline.money;
const Store = Billline.store;

test('formatMoney basic', () => {
  assert.equal(Fmt.formatMoney(123456, 'USD'), '$1,234.56');
  assert.equal(Fmt.formatMoney(0, 'USD'), '$0.00');
  assert.equal(Fmt.formatMoney(-500, 'EUR'), '-€5.00');
  assert.equal(Fmt.formatMoney(99999999, 'NONE'), '999,999.99');
});

test('date helpers', () => {
  assert.equal(Fmt.formatDate('2026-08-08'), 'Aug 8, 2026');
  assert.equal(Fmt.addDaysISO('2026-08-08', 14), '2026-08-22');
  assert.equal(Fmt.addDaysISO('2026-12-25', 7), '2027-01-01');
  assert.equal(Fmt.formatDate(''), '');
  assert.equal(Fmt.formatDate('garbage'), '');
});

test('totals: simple sum', () => {
  const s = Store.defaultState();
  s.items = [
    { description: 'a', qty: '2', rate: '10' },
    { description: 'b', qty: '1', rate: '12.50' },
  ];
  const t = Money.computeTotals(s);
  assert.equal(t.subtotalC, 3250);
  assert.equal(t.discountC, 0);
  assert.equal(t.taxC, 0);
  assert.equal(t.totalC, 3250);
});

test('totals: percent discount + percent tax on discounted base', () => {
  const s = Store.defaultState();
  s.items = [{ description: 'a', qty: '1', rate: '100' }];
  s.invoice.discountType = 'pct';
  s.invoice.discountValue = '10';
  s.invoice.taxType = 'pct';
  s.invoice.taxValue = '5';
  const t = Money.computeTotals(s);
  assert.equal(t.subtotalC, 10000);
  assert.equal(t.discountC, 1000);   // 10% of 100.00
  assert.equal(t.baseC, 9000);
  assert.equal(t.taxC, 450);         // 5% of 90.00
  assert.equal(t.totalC, 9450);      // 94.50
});

test('totals: fixed discount and fixed tax', () => {
  const s = Store.defaultState();
  s.items = [{ description: 'a', qty: '3', rate: '50' }];
  s.invoice.discountType = 'fixed';
  s.invoice.discountValue = '25';
  s.invoice.taxType = 'fixed';
  s.invoice.taxValue = '7.5';
  const t = Money.computeTotals(s);
  assert.equal(t.subtotalC, 15000);
  assert.equal(t.discountC, 2500);
  assert.equal(t.taxC, 750);
  assert.equal(t.totalC, 13250);
});

test('totals: percent capped at 100', () => {
  const s = Store.defaultState();
  s.items = [{ description: 'a', qty: '1', rate: '80' }];
  s.invoice.discountType = 'pct';
  s.invoice.discountValue = '150';
  const t = Money.computeTotals(s);
  assert.equal(t.discountC, 8000);
  assert.equal(t.totalC, 0);
});

test('totals: decimal rates round to cents', () => {
  const s = Store.defaultState();
  s.items = [{ description: 'a', qty: '1', rate: '0.1' }, { description: 'b', qty: '1', rate: '0.2' }];
  const t = Money.computeTotals(s);
  assert.equal(t.subtotalC, 30);
});

test('totals: bad input treated as zero', () => {
  const s = Store.defaultState();
  s.items = [{ description: 'a', qty: 'abc', rate: '' }];
  const t = Money.computeTotals(s);
  assert.equal(t.subtotalC, 0);
  assert.equal(t.totalC, 0);
});

test('store: defaults have sane values', () => {
  const s = Store.defaultState();
  assert.equal(s.invoice.currency, 'USD');
  assert.ok(s.invoice.issueDate);
  assert.ok(s.invoice.dueDate > s.invoice.issueDate);
  assert.equal(s.items.length, 1);
  assert.equal(s.invoice.terms.length > 0, true);
});

test('store: save/load round-trip', () => {
  storage.clear();
  const s = Store.defaultState();
  s.brand.name = 'Test Co';
  s.items = [{ description: 'x', qty: '2', rate: '5' }];
  Store.save(s);
  const loaded = Store.load();
  assert.equal(loaded.brand.name, 'Test Co');
  assert.equal(loaded.items[0].rate, '5');
});

test('store: corrupt JSON falls back to defaults', () => {
  storage.clear();
  storage.set(Store.KEY, '{{{not json');
  const loaded = Store.load();
  assert.equal(loaded.invoice.currency, 'USD');
});

test('store: junk saved data is normalized', () => {
  storage.clear();
  storage.set(Store.KEY, JSON.stringify({ brand: { name: 123 }, invoice: { currency: null }, items: [{ description: 'ok', qty: '1', rate: '1' }, 'junk'] }));
  const loaded = Store.load();
  assert.equal(loaded.brand.name, '123'); // coerced string
  assert.equal(loaded.invoice.currency, 'USD'); // default kept
  assert.equal(loaded.items.length, 1);
});

test('store: sample invoice totals are consistent', () => {
  const s = Store.sampleState();
  const t = Money.computeTotals(s);
  // 1500 + 2400 + 3*400 = 5100.00
  assert.equal(t.subtotalC, 510000);
  assert.equal(t.totalC, 510000);
});
