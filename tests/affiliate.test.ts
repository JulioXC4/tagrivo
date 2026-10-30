import { test } from 'node:test';
import assert from 'node:assert/strict';
import { amazonListings, amazonStoreId, guideAmazonProducts } from '../src/data/amazon.ts';
import {
  amazonLinkFor,
  verifiedAmazonLink,
  isAmazonDestination,
  resolveAmazonStoreId,
} from '../src/lib/affiliate.ts';
import { printers } from '../src/data/printers.ts';

test('each published product links directly to its documented child ASIN with the real US tag', () => {
  const identities = {
    'rollo-wireless': 'B09VF4Z2WQ',
    'munbyn-itpp941': 'B07S48NHYS',
    'brother-ql1110nwb': 'B079G51QT9',
  };
  assert.equal(amazonStoreId, 'tagrivo-20');
  for (const p of printers) {
    const url = new URL(amazonLinkFor(p.id, amazonStoreId)!);
    assert.equal(url.origin, 'https://www.amazon.com');
    assert.equal(url.pathname, `/dp/${identities[p.id as keyof typeof identities]}`);
    assert.equal(url.searchParams.get('tag'), amazonStoreId);
    assert.equal([...url.searchParams].length, 1);
  }
});

test('unverified, missing, mismatched and invalid listing identities cannot become commercial links', () => {
  const listing = amazonListings['munbyn-itpp941'];
  assert.equal(amazonLinkFor('unknown-model', amazonStoreId), null);
  assert.equal(amazonLinkFor('toString', amazonStoreId), null);
  assert.equal(verifiedAmazonLink(undefined, amazonStoreId), null);
  assert.equal(verifiedAmazonLink({ ...listing, verified: false }, amazonStoreId), null);
  assert.equal(
    verifiedAmazonLink(
      { ...listing, source: 'https://www.amazon.com/dp/B000000000' },
      amazonStoreId,
    ),
    null,
  );
  assert.equal(verifiedAmazonLink({ ...listing, checked: '' }, amazonStoreId), null);
  assert.equal(verifiedAmazonLink(listing, undefined), null);
  assert.equal(verifiedAmazonLink(listing, 'tagrivo-20&redirect=other'), null);
});

test('guide commercial placements only reference verified catalog models and preserve mobile exclusions', () => {
  for (const ids of Object.values(guideAmazonProducts))
    for (const id of ids) {
      assert.ok(printers.some((p) => p.id === id));
      assert.ok(amazonLinkFor(id, amazonStoreId));
    }
  assert.ok(!guideAmazonProducts['iphone-android-shipping-labels'].includes('munbyn-itpp941'));
});

test('automated link checks skip Amazon destinations and shortened referral URLs', () => {
  for (const url of [
    amazonLinkFor('rollo-wireless', amazonStoreId)!,
    'https://amazon.com/dp/B09VF4Z2WQ',
    'https://amzn.to/example',
    'https://a.co/example',
  ])
    assert.equal(isAmazonDestination(url), true);
  assert.equal(isAmazonDestination('https://www.rollo.com/product/rollo-wireless-printer/'), false);
  assert.equal(isAmazonDestination('https://amazon.com.example.org/'), false);
});

test('a stale environment variable cannot silently credit a different Amazon account', () => {
  assert.equal(resolveAmazonStoreId(undefined), 'tagrivo-20');
  assert.equal(resolveAmazonStoreId(''), 'tagrivo-20');
  assert.equal(resolveAmazonStoreId(' tagrivo-20 '), 'tagrivo-20');
  assert.throws(() => resolveAmazonStoreId('another-account-20'));
});
