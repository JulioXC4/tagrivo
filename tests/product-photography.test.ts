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
test('pending photo permissions allow local review but stop a Pages build', () => {
  const registry = [{ model: 'example-exact-model', reuse_authorization: 'not_established' }];
  assert.doesNotThrow(() => assertPhotoPublication({}, registry));
  assert.throws(
    () => assertPhotoPublication({ CF_PAGES: '1' }, registry),
    /reuse\/edit authorization/,
  );
  assert.doesNotThrow(() =>
    assertPhotoPublication({ CF_PAGES: '1' }, [
      { ...registry[0], reuse_authorization: 'documented' },
    ]),
  );
});
