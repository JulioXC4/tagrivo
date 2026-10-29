import { test } from 'node:test';
import assert from 'node:assert/strict';
import { resolveDeployment } from '../src/lib/deployment.ts';

test('local builds default to noindex and never assume ownership of a domain', () => {
  assert.deepEqual(resolveDeployment({}), {
    site: 'http://localhost:4321',
    indexable: false,
    preview: false,
  });
});
test('the first Pages build uses the actual generated HTTPS deployment URL', () => {
  assert.equal(
    resolveDeployment({
      CF_PAGES: '1',
      CF_PAGES_BRANCH: 'main',
      CF_PAGES_URL: 'https://abc.project.pages.dev',
    }).site,
    'https://abc.project.pages.dev',
  );
});
test('preview branches override the production origin and always remain noindex', () => {
  const config = resolveDeployment({
    CF_PAGES: '1',
    CF_PAGES_BRANCH: 'codex/fix',
    CF_PAGES_URL: 'https://abc.project.pages.dev',
    PUBLIC_SITE_URL: 'https://project.pages.dev',
    SITE_INDEXING: 'enabled',
  });
  assert.equal(config.site, 'https://abc.project.pages.dev');
  assert.equal(config.indexable, false);
});
test('indexing is opt-in and requires an explicitly confirmed HTTPS origin', () => {
  assert.throws(() => resolveDeployment({ SITE_INDEXING: 'enabled' }));
  assert.throws(() =>
    resolveDeployment({ PUBLIC_SITE_URL: 'http://localhost:4321', SITE_INDEXING: 'enabled' }),
  );
  assert.throws(() =>
    resolveDeployment({ PUBLIC_SITE_URL: 'https://example.com', SITE_INDEXING: 'enabled' }),
  );
  assert.equal(
    resolveDeployment({ PUBLIC_SITE_URL: 'https://project.pages.dev', SITE_INDEXING: 'enabled' })
      .indexable,
    true,
  );
});
test('deployment configuration rejects malformed or unsafe origins and indexing typos', () => {
  const credentialed = new URL('https://example.com');
  credentialed.username = 'fixture';
  credentialed.password = 'fixture';
  for (const value of [
    credentialed.href,
    'https://example.com/path',
    'https://example.com/?key=value',
    'file:///tmp/site',
  ])
    assert.throws(() => resolveDeployment({ PUBLIC_SITE_URL: value }));
  assert.throws(() => resolveDeployment({ SITE_INDEXING: 'enable' }));
  assert.throws(() => resolveDeployment({ CF_PAGES: '1' }));
  assert.throws(() => resolveDeployment({ CF_PAGES: '1', CF_PAGES_URL: 'http://example.com' }));
});
