import test from 'node:test';
import assert from 'node:assert/strict';
import {
  resolveAnalyticsConfig,
  parseAnalyticsConsent,
  mayMeasure,
  analyticsPageLocation,
  productClickPayload,
  CONSENT_LIFETIME,
  announceToolUse,
} from '../src/lib/analytics.ts';

// Synthetic unit-test ID only; it is never supplied to a build or sent to a provider.
const config = { enabled: true, measurementId: 'G-UNITTEST00' };
const now = 1_000_000;
const accepted = {
  version: 1 as const,
  choice: 'accepted' as const,
  expiresAt: now + CONSENT_LIFETIME,
};

test('analytics defaults to off and cannot be enabled without destination and policy approval', () => {
  assert.deepEqual(resolveAnalyticsConfig({}), { enabled: false, measurementId: null });
  assert.throws(
    () => resolveAnalyticsConfig({ PUBLIC_ANALYTICS_ENABLED: 'true' }),
    /measurement ID/,
  );
  assert.throws(
    () =>
      resolveAnalyticsConfig({
        PUBLIC_ANALYTICS_ENABLED: 'true',
        PUBLIC_GA4_MEASUREMENT_ID: config.measurementId,
      }),
    /privacy policy/,
  );
  assert.throws(() => resolveAnalyticsConfig({ PUBLIC_ANALYTICS_ENABLED: 'yes' }), /true or false/);
});

test('permission is required and rejection, expiry, DNT and GPC prevent measurement', () => {
  assert.equal(mayMeasure(config, null, {}, now), false);
  assert.equal(mayMeasure(config, { ...accepted, choice: 'rejected' }, {}, now), false);
  assert.equal(mayMeasure(config, accepted, {}, now), true);
  assert.equal(mayMeasure(config, accepted, { doNotTrack: '1' }, now), false);
  assert.equal(mayMeasure(config, accepted, { globalPrivacyControl: true }, now), false);
  assert.equal(mayMeasure(config, accepted, {}, accepted.expiresAt), false);
});

test('stored permission fails closed when corrupt, expired, from another version or overlong', () => {
  assert.equal(parseAnalyticsConsent('invalid', now), null);
  assert.equal(parseAnalyticsConsent(JSON.stringify({ ...accepted, expiresAt: now }), now), null);
  assert.equal(parseAnalyticsConsent(JSON.stringify({ ...accepted, version: 2 }), now), null);
  assert.equal(
    parseAnalyticsConsent(JSON.stringify({ ...accepted, expiresAt: accepted.expiresAt + 1 }), now),
    null,
  );
  assert.deepEqual(parseAnalyticsConsent(JSON.stringify(accepted), now), accepted);
});

test('analytics omits Finder answers, retailer query values and fragments', () => {
  assert.equal(
    analyticsPageLocation(
      'https://tagrivo.pages.dev/printer-finder/?platform=Etsy&budget=200#answers',
    ),
    'https://tagrivo.pages.dev/printer-finder/',
  );
  const payload = productClickPayload(
    {
      href: 'https://www.rollo.com/product/rollo-wireless-printer/?private=test#quote',
      printerId: 'rollo-wireless',
      kind: 'manufacturer',
    },
    'https://tagrivo.pages.dev',
    { 'rollo-wireless': 'www.rollo.com' },
  );
  assert.deepEqual(payload, {
    printer_id: 'rollo-wireless',
    link_kind: 'manufacturer',
    destination_host: 'www.rollo.com',
  });
  assert.equal(JSON.stringify(payload).includes('private'), false);
});

test('product events reject unlisted models, unsafe destinations and internal or mislabeled links', () => {
  const hosts = { 'rollo-wireless': 'www.rollo.com' };
  const base = {
    href: 'https://www.rollo.com/product/',
    printerId: 'rollo-wireless',
    kind: 'manufacturer',
  };
  for (const change of [
    { printerId: 'unknown' },
    { href: 'https://unrelated.example/' },
    { href: 'http://www.rollo.com/' },
    { kind: 'affiliate' },
    { href: 'https://tagrivo.pages.dev/printers/rollo-wireless/' },
  ])
    assert.equal(
      productClickPayload({ ...base, ...change }, 'https://tagrivo.pages.dev', hosts),
      null,
    );
});

test('tool signals expose only approved names and never accept answer payloads', () => {
  const previous = Object.getOwnPropertyDescriptor(globalThis, 'document');
  const target = new EventTarget();
  const seen: Event[] = [];
  target.addEventListener('tagrivo:printer_finder_complete', (event) => seen.push(event));
  target.addEventListener('tagrivo:comparison_used', (event) => seen.push(event));
  Object.defineProperty(globalThis, 'document', { value: target, configurable: true });
  try {
    announceToolUse('printer_finder_complete');
    announceToolUse('comparison_used');
    announceToolUse('email=user@example.test' as 'comparison_used');
    assert.deepEqual(
      seen.map((event) => event.type),
      ['tagrivo:printer_finder_complete', 'tagrivo:comparison_used'],
    );
    assert.ok(seen.every((event) => !('detail' in event)));
  } finally {
    if (previous) Object.defineProperty(globalThis, 'document', previous);
    else Reflect.deleteProperty(globalThis, 'document');
  }
});
