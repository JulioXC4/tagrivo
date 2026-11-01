import test from 'node:test';
import assert from 'node:assert/strict';
import { indexNowUrls, contentHash, changedEntries } from '../scripts/indexnow-lib.mjs';

test('IndexNow accepts only unique canonical guide/product URLs', () => {
  assert.deepEqual(indexNowUrls(['/guides/printing-costs/', '/guides/printing-costs/']), [
    'https://tagrivo.pages.dev/guides/printing-costs/',
  ]);
  for (const path of [
    'https://example.test/guides/x/',
    '/privacy/',
    '/guides/x/?email=private',
    '/guides/x/#private',
    '/guides/x',
    '/printer-finder/',
  ])
    assert.throws(() => indexNowUrls([path]));
  assert.throws(() => indexNowUrls([]));
});
test('IndexNow skips unchanged accepted content and detects actual changes', () => {
  const first = contentHash('original');
  const entries = [
    { url: 'a', hash: first },
    { url: 'b', hash: contentHash('changed') },
  ];
  assert.deepEqual(changedEntries(entries, { a: first, b: first }), [entries[1]]);
  assert.deepEqual(changedEntries(entries, { a: first, b: entries[1].hash }), []);
});
