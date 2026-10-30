import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  finderPlatforms,
  finderHandoffHref,
  readFinderHandoff,
} from '../src/lib/finder-handoff.ts';
import { resolveAnalyticsConfig } from '../src/lib/analytics.ts';

test('home-to-Finder handoff preserves the selected platform without putting it in the HTTP URL', () => {
  for (const platform of finderPlatforms) {
    const href = finderHandoffHref(platform);
    assert.ok(href);
    const url = new URL(href, 'https://tagrivo.pages.dev');
    assert.equal(url.pathname, '/printer-finder/');
    assert.equal(url.search, '');
    assert.deepEqual(readFinderHandoff(url.href), { platform, cleanHref: '/printer-finder/' });
  }
  for (const value of [
    null,
    '',
    'private@email.example',
    'Etsy&email=private',
    '//external.example',
  ])
    assert.equal(finderHandoffHref(value), null);
});

test('legacy Finder URLs still prefill while removing only the tool handoff from the visible URL', () => {
  assert.deepEqual(readFinderHandoff('https://tagrivo.pages.dev/printer-finder/?platform=Etsy'), {
    platform: 'Etsy',
    cleanHref: '/printer-finder/',
  });
  assert.deepEqual(
    readFinderHandoff('https://tagrivo.pages.dev/printer-finder/?platform=invalid#help'),
    {
      platform: null,
      cleanHref: '/printer-finder/#help',
    },
  );
  assert.equal(
    readFinderHandoff('https://tagrivo.pages.dev/printer-finder/?platform=Etsy#platform=Shopify')
      .platform,
    'Shopify',
  );
});

test('future analytics needs a real destination and approval; without a destination it stays off', () => {
  assert.deepEqual(
    resolveAnalyticsConfig({
      PUBLIC_ANALYTICS_ENABLED: 'true',
      PUBLIC_ANALYTICS_POLICY_APPROVED: 'true',
      PUBLIC_GA4_MEASUREMENT_ID: 'G-UNITTEST00',
    }),
    { enabled: true, measurementId: 'G-UNITTEST00' },
  );
  assert.deepEqual(resolveAnalyticsConfig({ PUBLIC_ANALYTICS_ENABLED: 'false' }), {
    enabled: false,
    measurementId: null,
  });
});
