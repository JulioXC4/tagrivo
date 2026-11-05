import { test } from 'node:test';
import assert from 'node:assert/strict';
import { printers } from '../src/data/printers.ts';
import { filterCatalog, toggleComparison, type CatalogFilters } from '../src/lib/catalog.ts';
import { printingRoutes, supportsRoute } from '../src/data/workflows.ts';
import { recommend } from '../src/lib/recommend.ts';
import { labelLayout } from '../src/lib/label-preview.ts';
import { diagnose, problems } from '../src/lib/troubleshooter.ts';
const all: CatalogFilters = {
  query: '',
  connection: 'any',
  os: '',
  dpi: '',
  format: '',
  use: '',
  sort: 'editorial',
};
test('catalog has seven distinct exact variants, without transfer or c-suffix substitutions', () => {
  assert.equal(printers.length, 7);
  assert.equal(new Set(printers.map((p) => p.id)).size, 7);
  assert.ok(printers.find((p) => p.id === 'munbyn-itpp941b')?.model.includes('203'));
  assert.equal(printers.find((p) => p.id === 'brother-ql1100')?.ethernet, false);
  assert.ok(!printers.some((p) => p.id.includes('zebra')));
});
test('search normalizes punctuation and combines resolution, device and connection filters', () => {
  assert.equal(filterCatalog({ ...all, query: 'QL1100' }).length, 1);
  assert.equal(filterCatalog({ ...all, query: 'no such model' }).length, 0);
  assert.deepEqual(
    filterCatalog({ ...all, os: 'ios', connection: 'bluetooth' }).map((p) => p.id),
    ['munbyn-itpp941b', 'phomemo-pm241bt'],
  );
  assert.equal(filterCatalog({ ...all, os: 'mac', connection: 'bluetooth' }).length, 0);
  assert.equal(filterCatalog({ ...all, dpi: '300', connection: 'usb' }).length, 2);
  assert.equal(filterCatalog({ ...all, format: 'continuous-dk' }).length, 2);
  assert.equal(filterCatalog({ ...all, use: 'desktop-shipping' }).length, 2);
});
test('comparison selection cannot duplicate, exceed three or accept an unknown model', () => {
  let selected: string[] = [];
  for (const p of printers) selected = toggleComparison(selected, p.id);
  assert.equal(selected.length, 3);
  assert.equal(new Set(selected).size, 3);
  const removed = toggleComparison(selected, selected[0]);
  assert.equal(removed.length, 2);
  assert.deepEqual(toggleComparison(removed, 'invalid'), removed);
});
test('documented-feature sort is numeric and deterministic', () => {
  const result = filterCatalog({ ...all, sort: 'resolution' });
  assert.equal(result[0].dpi, 300);
  assert.equal(result[1].dpi, 300);
  assert.equal(result[2].dpi, 203);
  assert.deepEqual(
    filterCatalog({ ...all, sort: 'speed' }).map((p) => p.speed),
    [150, 150, 150, 150, 150, 110, 110],
  );
});
test('every catalog route agrees with Finder and model interfaces, including phone USB exclusion', () => {
  for (const p of printers)
    for (const os of ['windows', 'mac', 'ios', 'android', 'chrome'] as const)
      for (const connection of ['usb', 'wifi', 'bluetooth'] as const) {
        const verified = supportsRoute(p, os, connection);
        assert.equal(
          recommend({ platform: 'Other', os, connection, volume: 25, budget: 100000 }).matches.some(
            (m) => m.printer.id === p.id,
          ),
          verified,
        );
        if (verified) {
          assert.ok(p.systems.includes(os));
          assert.ok(p.connections.includes(connection));
        }
      }
  assert.ok(printers.every((p) => printingRoutes[p.id]));
});
test('continuous DK requirement excludes generic media models with reasons', () => {
  const result = recommend({
    platform: 'Other',
    os: 'windows',
    connection: 'usb',
    volume: 300,
    budget: 1000,
    format: 'continuous-dk',
  });
  assert.deepEqual(
    result.matches.map((m) => m.printer.brand),
    ['Brother', 'Brother'],
  );
  assert.ok(result.excluded.some((p) => p.reason.includes('DK')));
});
test('4 by 6 inch geometry and smaller metric stock reveal actual-size clipping', () => {
  const input = { width: 101.6, height: 152.4, margin: 0, scale: 100, landscape: false };
  assert.equal(labelLayout(input)?.clipped, false);
  assert.equal(labelLayout({ ...input, width: 100, height: 150 })?.clipped, true);
  const inset = labelLayout({ ...input, margin: 2 })!;
  assert.ok(inset.clipped);
  assert.equal(
    labelLayout({ ...input, margin: 2, scale: Math.floor(inset.fitScale * 10) / 10 })?.clipped,
    false,
  );
});
test('orientation swaps physical axes without silently reflowing a 4 by 6 document', () => {
  const result = labelLayout({
    width: 101.6,
    height: 152.4,
    margin: 0,
    scale: 100,
    landscape: true,
  })!;
  assert.equal(result.w, 152.4);
  assert.equal(result.h, 101.6);
  assert.equal(result.contentW, 152.4);
  assert.equal(result.clipped, false);
});
test('preview rejects empty, nonfinite, unsafe and impossible layout bounds', () => {
  const input = { width: 101.6, height: 152.4, margin: 2, scale: 100, landscape: false };
  for (const change of [
    { width: NaN },
    { height: Infinity },
    { width: 0 },
    { width: 301 },
    { margin: -1 },
    { width: 25, margin: 20 },
    { scale: 0 },
    { scale: 201 },
  ])
    assert.equal(labelLayout({ ...input, ...change }), null);
});
test('all six diagnostic paths exist and incompatibility cannot be disguised as a setting fix', () => {
  for (const problem of Object.keys(problems) as (keyof typeof problems)[])
    assert.ok(diagnose(problem, 'windows', 'usb', '').steps.length >= 3);
  assert.match(diagnose('wireless', 'ios', 'bluetooth', 'rollo-wireless').warning!, /not verified/);
  assert.equal(diagnose('wireless', 'ios', 'bluetooth', 'munbyn-itpp941b').warning, null);
  assert.match(diagnose('driver', 'windows', 'bluetooth', 'munbyn-itpp941b').setup!, /ARM/);
  assert.equal(diagnose('detection', 'mac', 'usb', 'unknown').printer, undefined);
});
