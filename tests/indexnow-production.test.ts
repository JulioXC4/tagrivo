import test from 'node:test';
import assert from 'node:assert/strict';
import {
  ORIGIN,
  digest,
  publicUrl,
  pageFingerprint,
  validateManifest,
  validateState,
  planChanges,
  advanceState,
  verifyChangedPage,
  submitBatch,
  COOLDOWN_MS,
  htmlNoindex,
  productionCheckSucceeded,
  deferChanges,
} from '../scripts/indexnow-production.mjs';

const url = (path: string) => ORIGIN + path;
const sha = 'a'.repeat(40);
const manifest = (pages: Record<string, string>) => ({
  version: 1,
  origin: ORIGIN,
  branch: 'main',
  commit: sha,
  pages,
});
const state = (pages: Record<string, string>) => ({
  version: 1,
  origin: ORIGIN,
  pages,
  pending: [] as string[],
  lastSubmitted: {} as Record<string, number>,
});
const html = (body = 'Original answer', extra = '') =>
  `<html><head><title>Guide</title><link rel="canonical" href="${url('/guides/example/')}"><meta name="description" content="Buying guide">${extra}</head><body><main class="prose"><p>${body}</p><a href="/compare/">Compare</a></main></body></html>`;

test('production URL validation excludes preview, external, query, private and error URLs', () => {
  for (const value of [
    'https://branch.tagrivo.pages.dev/',
    'http://localhost:4321/',
    'https://www.amazon.com/dp/X',
    '/guides/example/?utm_source=test',
    '/guides/example/#answers',
    '/.env',
    '/404/',
    '/staging/',
    '/guides/example',
  ])
    assert.throws(() => publicUrl(value));
  assert.equal(publicUrl('/'), ORIGIN + '/');
  assert.equal(publicUrl('/privacy/'), ORIGIN + '/privacy/');
});

test('manifest validates exact production revision and refuses empty or preview inventories', () => {
  const valid = manifest({ [url('/')]: digest('home') });
  assert.equal(validateManifest(valid, sha), valid);
  for (const override of [
    { branch: 'preview' },
    { origin: 'https://preview.tagrivo.pages.dev' },
    { commit: 'b'.repeat(40) },
    { pages: {} },
    { pages: { [url('/404/')]: digest('error') } },
  ])
    assert.throws(() => validateManifest({ ...valid, ...override }, sha));
});

test('only a successful real Cloudflare check on the exact commit authorizes production', () => {
  const check = {
    head_sha: sha,
    name: 'Cloudflare Pages',
    app: { slug: 'cloudflare-workers-and-pages' },
    status: 'completed',
    conclusion: 'success',
  };
  assert.equal(productionCheckSucceeded([check], sha), true);
  for (const override of [
    { head_sha: 'b'.repeat(40) },
    { status: 'in_progress' },
    { conclusion: 'failure' },
    { name: 'Other build' },
    { app: { slug: 'other-app' } },
  ])
    assert.equal(productionCheckSucceeded([{ ...check, ...override }], sha), false);
  assert.equal(productionCheckSucceeded([], sha), false);
});

test('noindex detection is independent of attribute order and supports googlebot directives', () => {
  assert.equal(htmlNoindex(html()), false);
  assert.equal(htmlNoindex(html('body', '<meta content="noindex, follow" name="robots">')), true);
  assert.equal(htmlNoindex(html('body', "<meta name='googlebot' content='NOINDEX'>")), true);
});

test('fingerprints ignore cosmetic classes and bundled script hashes but detect buyer content, metadata and links', () => {
  const first = html();
  const cosmetic = first
    .replace('class="prose"', 'class="new-layout"')
    .replace('</main>', '<script src="/_astro/newhash.js"></script></main>');
  assert.equal(pageFingerprint(first), pageFingerprint(cosmetic));
  for (const change of [
    html('Changed answer'),
    first.replace('Buying guide', 'New description'),
    first.replace('/compare/', '/printer-finder/'),
  ])
    assert.notEqual(pageFingerprint(first), pageFingerprint(change));
  assert.throws(() => pageFingerprint('<html>challenge</html>'));
});

test('only genuinely added, updated or deleted URLs enter a notification plan', () => {
  const before = state({
    [url('/')]: digest('same'),
    [url('/guides/changed/')]: digest('old'),
    [url('/guides/gone/')]: digest('removed'),
  });
  const after = manifest({
    [url('/')]: digest('same'),
    [url('/guides/changed/')]: digest('new'),
    [url('/guides/new/')]: digest('added'),
  });
  const plan = planChanges(after, before);
  assert.deepEqual(
    plan.map((x) => [x.url, x.kind]),
    [
      [url('/guides/changed/'), 'updated'],
      [url('/guides/gone/'), 'deleted'],
      [url('/guides/new/'), 'added'],
    ],
  );
  const saved = advanceState(before, plan, sha);
  assert.equal(Object.hasOwn(saved.pages, url('/guides/gone/')), false);
  assert.deepEqual(planChanges(after, saved), []);
  assert.equal(before.pages[url('/guides/changed/')], digest('old'));
});

test('migration catches up only documented pending URLs, preserving a five-minute debounce', () => {
  const before = state({ [url('/')]: digest('home'), [url('/privacy/')]: digest('policy') });
  before.pending = [url('/privacy/')];
  const after = manifest({ ...before.pages });
  assert.deepEqual(
    planChanges(after, before).map((x) => x.url),
    [url('/privacy/')],
  );
  const saved = advanceState(before, planChanges(after, before), sha, 1000000);
  const changed = manifest({ ...saved.pages, [url('/privacy/')]: digest('next-policy') });
  assert.deepEqual(planChanges(changed, saved, 1000000 + COOLDOWN_MS - 1), []);
  assert.equal(planChanges(changed, saved, 1000000 + COOLDOWN_MS).length, 1);
  assert.throws(() => validateState({ ...before, origin: 'https://elsewhere.test' }));
});

test('failed or ambiguous attempts are deferred and Retry-After is respected without marking content accepted', () => {
  const initial = state({ [url('/')]: digest('old') });
  const current = manifest({ [url('/')]: digest('changed') });
  const changes = planChanges(current, initial, 1000000);
  const waiting = deferChanges(initial, changes, '600', 1000000);
  assert.deepEqual(planChanges(current, waiting, 1000000 + 599999), []);
  assert.equal(waiting.pages[url('/')], digest('old'));
  assert.equal(planChanges(current, waiting, 1000000 + 600000).length, 1);
});

test('live checks require matching canonical HTML; deletions require a real removal or redirect', async () => {
  const entry = { url: url('/guides/example/'), kind: 'updated', hash: pageFingerprint(html()) };
  await verifyChangedPage(
    entry,
    async () => new Response(html(), { headers: { 'Content-Type': 'text/html' } }),
  );
  for (const response of [
    new Response('challenge', { status: 403 }),
    new Response(html('old'), { headers: { 'Content-Type': 'text/html' } }),
    new Response(html(), { headers: { 'Content-Type': 'text/html', 'X-Robots-Tag': 'noindex' } }),
  ])
    await assert.rejects(() => verifyChangedPage(entry, async () => response));
  await verifyChangedPage(
    { ...entry, kind: 'deleted' },
    async () => new Response(null, { status: 404 }),
  );
  await verifyChangedPage(
    { ...entry, kind: 'deleted' },
    async () => new Response(null, { status: 410 }),
  );
  await verifyChangedPage(
    { ...entry, kind: 'deleted' },
    async () => new Response(null, { status: 301, headers: { location: ORIGIN + '/guides/' } }),
  );
  await assert.rejects(() =>
    verifyChangedPage(
      { ...entry, kind: 'deleted' },
      async () => new Response('still here', { status: 200 }),
    ),
  );
  await assert.rejects(() =>
    verifyChangedPage(
      { ...entry, kind: 'deleted' },
      async () =>
        new Response(null, { status: 302, headers: { location: 'https://external.test/' } }),
    ),
  );
});

test('POST targets the global endpoint once, uses exactly the real host and handles protocol responses', async () => {
  for (const status of [200, 202, 400, 403, 422, 429, 500]) {
    let requests = 0;
    const result = await submitBatch(
      [{ url: url('/guides/example/') }],
      '1'.repeat(32),
      async (endpoint, options) => {
        requests++;
        assert.equal(endpoint, 'https://api.indexnow.org/indexnow');
        assert.ok(options);
        assert.equal(options.method, 'POST');
        assert.equal(typeof options.body, 'string');
        const payload = JSON.parse(options.body as string);
        assert.equal(payload.host, 'tagrivo.pages.dev');
        assert.equal(payload.keyLocation, ORIGIN + '/' + '1'.repeat(32) + '.txt');
        assert.deepEqual(payload.urlList, [url('/guides/example/')]);
        return new Response(null, { status });
      },
    );
    assert.equal(requests, 1);
    assert.equal(result.accepted, [200, 202].includes(status));
  }
  let calls = 0;
  await assert.rejects(() =>
    submitBatch([{ url: url('/') }], '1'.repeat(32), async () => {
      calls++;
      throw new Error('ambiguous timeout');
    }),
  );
  assert.equal(calls, 1);
});
