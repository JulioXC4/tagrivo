import test from 'node:test';
import assert from 'node:assert/strict';
import {
  defaultSetup,
  estimatePrintingCosts as estimate,
  comparePrintingSetups as compare,
  serializeCostState,
  parseCostState,
  inputRules,
} from '../src/lib/printing-costs.ts';
test('known monthly case separates waste, operation, allocation and full-pack cash', () => {
  const r = estimate({
    ...defaultSetup,
    dailyLabels: 50,
    daysPerMonth: 20,
    wastePercent: 20,
    packPrice: 20,
    labelsPerPack: 500,
    printerPrice: 240,
    lifeMonths: 24,
    maintenanceMonthly: 2,
    energyKwhMonthly: 5,
    electricityRate: 0.2,
    otherMonthly: 3,
  })!;
  assert.equal(r.usableLabels, 1000);
  assert.equal(r.consumedLabels, 1250);
  assert.equal(r.wastedLabels, 250);
  assert.equal(r.consumables, 50);
  assert.equal(r.wasteCost, 10);
  assert.equal(r.extras, 6);
  assert.equal(r.operatingMonthly, 56);
  assert.equal(r.printerAllocation, 10);
  assert.equal(r.monthly, 66);
  assert.equal(r.annual, 792);
  assert.equal(r.totalPerUsableLabel, 0.066);
  assert.equal(r.packPurchase, 60);
});
test('zero demand never divides by zero; fixed costs still exist', () => {
  const r = estimate({ ...defaultSetup, dailyLabels: 0 })!;
  assert.equal(r.consumedLabels, 0);
  assert.equal(r.totalPerUsableLabel, null);
  assert.equal(r.stockPerLabel, 0.04);
  assert.equal(r.monthly, 200 / 36);
});
test('rounding at whole labels, high waste and invalid bounds', () => {
  assert.equal(
    estimate({ ...defaultSetup, dailyLabels: 50, daysPerMonth: 20, wastePercent: 0 })
      ?.consumedLabels,
    1000,
  );
  assert.equal(
    estimate({ ...defaultSetup, dailyLabels: 1, daysPerMonth: 1, wastePercent: 99 })
      ?.consumedLabels,
    100,
  );
  assert.equal(
    estimate({ ...defaultSetup, dailyLabels: 1000, daysPerMonth: 1, wastePercent: 3 })
      ?.consumedLabels,
    1031,
  );
  for (const k of Object.keys(inputRules))
    assert.equal(estimate({ ...defaultSetup, [k]: NaN }), null);
  for (const change of [
    { wastePercent: 100 },
    { dailyLabels: -1 },
    { daysPerMonth: 1.5 },
    { lifeMonths: 0 },
    { labelsPerPack: 0 },
    { packPrice: Infinity },
    { electricityRate: -0.1 },
    { dailyLabels: 10001 },
  ])
    assert.equal(estimate({ ...defaultSetup, ...change }), null);
});
test('cash comparison buys hardware once and excludes double-counted allocation', () => {
  const a = {
    ...defaultSetup,
    dailyLabels: 50,
    daysPerMonth: 20,
    wastePercent: 0,
    printerPrice: 100,
    packPrice: 25,
  };
  const b = { ...a, printerPrice: 300, packPrice: 15 };
  const r = compare(a, b, 12)!;
  assert.equal(r.totalA, 700);
  assert.equal(r.totalB, 660);
  assert.equal(r.breakEvenMonths, 10);
  assert.equal(compare(a, { ...b, dailyLabels: 999 }, 12)?.b.usableLabels, 1000);
  assert.equal(compare(a, { ...a, printerPrice: 200 }, 12)?.breakEvenMonths, null);
  assert.equal(compare(a, { ...a, printerPrice: 200, packPrice: 30 }, 12)?.breakEvenMonths, null);
  assert.equal(compare(a, b, 0), null);
  assert.equal(compare(a, b, 121), null);
  assert.equal(compare(a, b, 48)?.beyondLife, true);
});
test('sharing round-trips only bounded numeric setups and rejects malformed payloads', () => {
  const state = {
    a: { ...defaultSetup },
    b: { ...defaultSetup, packPrice: 30 },
    compare: true,
    months: 24,
  };
  assert.deepEqual(parseCostState('#' + serializeCostState(state)), state);
  for (const value of [
    '#calc=bad',
    '#calc=' + encodeURIComponent(JSON.stringify({ v: 2, a: [0], b: [], c: 1, m: 1 })),
    '#' + serializeCostState(state).replace('24', '999999'),
  ])
    assert.equal(parseCostState(value), null);
  assert.equal(parseCostState('#email=private@example.test'), null);
  assert.throws(() => serializeCostState({ ...state, a: { ...state.a, packPrice: NaN } }));
});
