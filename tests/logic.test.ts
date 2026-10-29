import { test } from 'node:test';
import assert from 'node:assert/strict';
import { recommend, type FinderAnswers } from '../src/lib/recommend.ts';
import { calculateCosts } from '../src/lib/costs.ts';
import { amazonLink } from '../src/lib/affiliate.ts';
import { printers, getConnectionLabels } from '../src/data/printers.ts';
const baseline: FinderAnswers = {
  platform: 'Etsy',
  os: 'windows',
  volume: 50,
  connection: 'any',
  budget: 500,
};
test('mobile + USB produces no unsupported recommendation', () => {
  for (const os of ['ios', 'android'] as const)
    assert.equal(recommend({ ...baseline, os, connection: 'usb' }).matches.length, 0);
});
test('Rollo setup Bluetooth is never mistaken for Bluetooth printing', () => {
  const result = recommend({ ...baseline, connection: 'bluetooth' });
  assert.deepEqual(
    result.matches.map((m) => m.printer.id),
    ['brother-ql1110nwb'],
  );
});
test('unknown mobile/Mac Bluetooth app combinations are excluded', () => {
  for (const os of ['ios', 'android', 'mac'] as const)
    assert.equal(recommend({ ...baseline, os, connection: 'bluetooth' }).matches.length, 0);
});
test('known price above cap excluded; unknown prices carry explicit caveat', () => {
  const result = recommend({ ...baseline, budget: 150 });
  assert.ok(!result.matches.some((m) => m.printer.id === 'brother-ql1110nwb'));
  assert.ok(result.matches.every((m) => m.cautions.some((c) => c.includes('price is unverified'))));
});
test('Wi-Fi and USB preferences produce explainable different starting points', () => {
  assert.equal(
    recommend({ ...baseline, connection: 'wifi' }).matches[0].printer.id,
    'rollo-wireless',
  );
  assert.equal(
    recommend({ ...baseline, connection: 'usb' }).matches[0].printer.id,
    'munbyn-itpp941',
  );
});
test('platform changes instructions without inventing native integrations or changing ranking', () => {
  const etsy = recommend(baseline);
  const ebay = recommend({ ...baseline, platform: 'eBay' });
  assert.deepEqual(
    etsy.matches.map((m) => m.printer.id),
    ebay.matches.map((m) => m.printer.id),
  );
  assert.match(ebay.platformNote, /eBay/);
});
test('ChromeOS excludes catalog models without documented support', () => {
  assert.ok(
    !recommend({ ...baseline, os: 'chrome' }).matches.some(
      (m) => m.printer.id === 'brother-ql1110nwb',
    ),
  );
});
test('a larger budget does not become a quality score or reorder otherwise eligible printers', () => {
  assert.deepEqual(
    recommend({ ...baseline, budget: 334.99 }).matches.map((match) => match.printer.id),
    recommend({ ...baseline, budget: 1000 }).matches.map((match) => match.printer.id),
  );
});
test('waste calculation uses consumed labels, rounds up, and buys hardware only once', () => {
  const result = calculateCosts({
    weeklyOrders: 100,
    printerPrice: 200,
    packPrice: 20,
    labelsPerPack: 500,
    waste: 3,
    years: 2,
  });
  assert.ok(result);
  assert.equal(result.orders, 10400);
  assert.equal(result.labels, 10722);
  assert.equal(result.total, 200 + 10722 * 0.04);
});
test('zero orders remains finite and hardware-only', () => {
  const result = calculateCosts({
    weeklyOrders: 0,
    printerPrice: 200,
    packPrice: 20,
    labelsPerPack: 500,
    waste: 0,
    years: 1,
  });
  assert.equal(result?.total, 200);
  assert.equal(result?.perOrder, 0);
});
test('invalid calculator denominators and non-finite values are rejected', () => {
  const valid = {
    weeklyOrders: 10,
    printerPrice: 200,
    packPrice: 20,
    labelsPerPack: 500,
    waste: 3,
    years: 1,
  };
  for (const change of [
    { labelsPerPack: 0 },
    { waste: 100 },
    { years: 0 },
    { printerPrice: -1 },
    { weeklyOrders: NaN },
  ])
    assert.equal(calculateCosts({ ...valid, ...change }), null);
});
test('affiliate URL requires a real configured tag and valid ASIN', () => {
  assert.equal(amazonLink(undefined, undefined), null);
  assert.equal(amazonLink('invalid', 'test-20'), null);
  assert.equal(amazonLink('B012345678', ''), null);
  assert.equal(
    amazonLink('B012345678', 'example-20'),
    'https://www.amazon.com/dp/B012345678?tag=example-20',
  );
});

test('dated Rollo price excludes it from a lower cap while unknown MUNBYN pricing stays conditional', () => {
  const result = recommend({ ...baseline, connection: 'wifi', budget: 200 });
  assert.equal(result.matches.length, 0);
  assert.ok(
    result.excluded.some(
      (printer) => printer.name === 'Rollo Wireless' && printer.reason.includes('279.99'),
    ),
  );
  const usb = recommend({ ...baseline, connection: 'usb', budget: 200 });
  assert.equal(usb.matches[0].printer.id, 'munbyn-itpp941');
  assert.ok(usb.matches[0].cautions.some((text) => text.includes('price is unverified')));
});

test('the catalog supplies Ethernet consistently and retains Windows ARM caveats in recommendations', () => {
  const brother = printers.find((printer) => printer.id === 'brother-ql1110nwb')!;
  assert.ok(getConnectionLabels(brother).includes('Ethernet'));
  const rollo = recommend(baseline).matches.find((match) => match.printer.id === 'rollo-wireless')!;
  assert.ok(rollo.cautions.some((text) => text.includes('ARM')));
  assert.ok(rollo.cautions.some((text) => text.includes('October 29, 2026')));
});

test('platform notes distinguish carrier restrictions and exact Shopify model support', () => {
  assert.match(recommend(baseline).platformNote, /USPS/);
  const shopify = recommend({ ...baseline, platform: 'Shopify' }).platformNote;
  assert.match(shopify, /X1038/);
  assert.match(shopify, /X1040/);
  assert.ok(printers.every((printer) => printer.price === null || printer.priceChecked));
});
