import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { printers } from '../src/data/printers.ts';
import { productPhotography } from '../src/data/product-photography.ts';
import { assertPhotoPublication } from '../scripts/photo-publication.mjs';

test('all seven catalog heroes are real-model sources, never label diagrams or generated hardware', () => {
  for (const printer of printers) {
    assert.ok(existsSync(`public${printer.image}`));
    assert.ok(!/category-shipping|editorial-.*render/.test(printer.image));
    if (printer.brand === 'Brother') assert.ok(printer.image.includes('/authorized/'));
    else assert.equal(printer.image, productPhotography[printer.id].hero);
  }
});
test('documented source and composition exports match their registry hashes', () => {
  const registry = JSON.parse(readFileSync('docs/PRODUCT-PHOTO-REGISTRY.json', 'utf8'));
  assert.equal(registry.length, 5);
  for (const record of registry) {
    const file = readFileSync(`public${record.output}`);
    assert.equal(createHash('sha256').update(file).digest('hex'), record.output_sha256);
    assert.equal(record.reuse_authorization, 'not_established');
    for (const view of productPhotography[record.model].extra)
      assert.ok(existsSync(`public${view.src}`));
  }
});
test('Pages publication reports pending photo rights without inventing authorization or blocking release', () => {
  const registry = [{ model: 'example-exact-model', reuse_authorization: 'not_established' }];
  const warnings: string[] = [];
  const warn = (message: string) => warnings.push(message);
  assert.doesNotThrow(() => assertPhotoPublication({}, registry, warn));
  assert.equal(warnings.length, 0);
  assert.doesNotThrow(() => assertPhotoPublication({ CF_PAGES: '1' }, registry, warn));
  assert.equal(warnings.length, 1);
  assert.match(warnings[0], /authorization remains pending/);
  assert.match(warnings[0], /example-exact-model/);
  assert.equal(registry[0].reuse_authorization, 'not_established');
  assert.doesNotThrow(() =>
    assertPhotoPublication(
      { CF_PAGES: '1' },
      [{ ...registry[0], reuse_authorization: 'documented' }],
      warn,
    ),
  );
  assert.equal(warnings.length, 1);
});
