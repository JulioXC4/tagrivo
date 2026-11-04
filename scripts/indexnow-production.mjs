import { createHash } from 'node:crypto';

export const ORIGIN = 'https://tagrivo.pages.dev';
export const MANIFEST_PATH = '/indexnow-manifest.json';
export const COOLDOWN_MS = 5 * 60 * 1000;
export const digest = (value) => createHash('sha256').update(value).digest('hex');

export function publicUrl(value) {
  const url = new URL(value, ORIGIN);
  if (
    url.origin !== ORIGIN ||
    url.username ||
    url.password ||
    url.search ||
    url.hash ||
    !/^\/(?:[a-z0-9-]+\/)*$/.test(url.pathname) ||
    /\/(?:404|preview|staging|localhost)\//.test(url.pathname)
  )
    throw new Error(`Not a canonical production page: ${value}`);
  return url.href;
}

const attr = (tag, name) => tag.match(new RegExp(`\\b${name}=["']([^"']*)["']`, 'i'))?.[1] || '';

export const htmlNoindex = (html) =>
  [...html.matchAll(/<meta\b[^>]*>/gi)].some(
    ([tag]) =>
      ['robots', 'googlebot'].includes(attr(tag, 'name').toLowerCase()) &&
      /noindex/i.test(attr(tag, 'content')),
  );

export function productionCheckSucceeded(checks, commit) {
  return checks.some(
    (check) =>
      check.head_sha === commit &&
      check.name === 'Cloudflare Pages' &&
      check.app?.slug === 'cloudflare-workers-and-pages' &&
      check.status === 'completed' &&
      check.conclusion === 'success',
  );
}

/** Fingerprint reader content, metadata and destinations, not cosmetic CSS/JS hashes. */
export function pageFingerprint(html) {
  const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)?.[1];
  if (main === undefined) throw new Error('Expected a complete editorial HTML page.');
  const stripped = main
    .replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '');
  const meta = [...html.matchAll(/<meta\b[^>]*>/gi)]
    .map(([tag]) => ({
      name: attr(tag, 'name') || attr(tag, 'property'),
      content: attr(tag, 'content'),
    }))
    .filter((m) =>
      ['description', 'robots', 'googlebot', 'og:title', 'og:description'].includes(m.name),
    );
  const canonicalTag = [...html.matchAll(/<link\b[^>]*>/gi)].find(
    ([tag]) => attr(tag, 'rel') === 'canonical',
  )?.[0];
  return digest(
    JSON.stringify({
      title: html.match(/<title>([\s\S]*?)<\/title>/i)?.[1] || '',
      canonical: attr(canonicalTag || '', 'href'),
      meta,
      text: stripped
        .replace(/<[^>]*>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim(),
      links: [...stripped.matchAll(/<a\b[^>]*>/gi)].map(([tag]) => attr(tag, 'href')),
      images: [...stripped.matchAll(/<img\b[^>]*>/gi)].map(([tag]) => [
        attr(tag, 'src'),
        attr(tag, 'alt'),
      ]),
      schema: [
        ...html.matchAll(
          /<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi,
        ),
      ].map((m) => m[1].trim()),
    }),
  );
}

export function validateManifest(value, expectedCommit) {
  if (
    value?.version !== 1 ||
    value.origin !== ORIGIN ||
    value.branch !== 'main' ||
    !/^[a-f0-9]{40}$/.test(value.commit || '') ||
    (expectedCommit && value.commit !== expectedCommit) ||
    !value.pages ||
    Array.isArray(value.pages) ||
    !Object.keys(value.pages).length
  )
    throw new Error('Manifest is not the expected deployed main revision.');
  for (const [url, hash] of Object.entries(value.pages)) {
    if (publicUrl(url) !== url || !/^[a-f0-9]{64}$/.test(hash))
      throw new Error('Invalid manifest page.');
  }
  return value;
}

export function validateState(value) {
  if (
    value?.version !== 1 ||
    value.origin !== ORIGIN ||
    !value.pages ||
    !Array.isArray(value.pending) ||
    !value.lastSubmitted
  )
    throw new Error('Missing/invalid IndexNow state.');
  for (const [url, hash] of Object.entries(value.pages)) {
    if (publicUrl(url) !== url || !/^[a-f0-9]{64}$/.test(hash))
      throw new Error('Invalid state page.');
  }
  for (const url of value.pending) publicUrl(url);
  for (const [url, time] of Object.entries(value.lastSubmitted)) {
    publicUrl(url);
    if (!Number.isFinite(time)) throw new Error('Invalid submission date.');
  }
  return value;
}

export function planChanges(manifest, state, now = Date.now()) {
  validateManifest(manifest);
  validateState(state);
  const urls = new Set([
    ...Object.keys(manifest.pages),
    ...Object.keys(state.pages),
    ...state.pending,
  ]);
  return [...urls].sort().flatMap((url) => {
    const exists = Object.hasOwn(manifest.pages, url);
    const existed = Object.hasOwn(state.pages, url);
    if (
      (!exists && !existed) ||
      (exists &&
        existed &&
        manifest.pages[url] === state.pages[url] &&
        !state.pending.includes(url))
    )
      return [];
    if (state.lastSubmitted[url] && now - state.lastSubmitted[url] < COOLDOWN_MS) return [];
    if ((state.deferredUntil?.[url] || 0) > now) return [];
    return [
      {
        url,
        kind: !exists ? 'deleted' : !existed ? 'added' : 'updated',
        hash: exists ? manifest.pages[url] : null,
      },
    ];
  });
}

export function advanceState(state, accepted, commit, now = Date.now()) {
  const next = structuredClone(validateState(state));
  for (const entry of accepted) {
    if (entry.kind === 'deleted') delete next.pages[entry.url];
    else next.pages[entry.url] = entry.hash;
    next.lastSubmitted[entry.url] = now;
    next.pending = next.pending.filter((url) => url !== entry.url);
    if (next.deferredUntil) delete next.deferredUntil[entry.url];
  }
  next.lastCommit = commit;
  return next;
}

/** @param {string | null} retryAfter */
export function deferChanges(state, entries, retryAfter = null, now = Date.now()) {
  const next = structuredClone(validateState(state));
  const seconds =
    retryAfter && /^\d+$/.test(retryAfter)
      ? Number(retryAfter) * 1000
      : Date.parse(retryAfter || '') - now;
  const delay = Number.isFinite(seconds) ? Math.max(COOLDOWN_MS, seconds) : COOLDOWN_MS;
  next.deferredUntil ||= {};
  for (const { url } of entries) next.deferredUntil[url] = now + delay;
  return next;
}

export async function verifyChangedPage(entry, fetcher = fetch) {
  publicUrl(entry.url);
  const response = await fetcher(entry.url, {
    redirect: 'manual',
    signal: AbortSignal.timeout(15000),
    headers: { 'User-Agent': 'Tagrivo-IndexNow/2.0' },
  });
  if (entry.kind === 'deleted') {
    if (![301, 302, 307, 308, 404, 410].includes(response.status))
      throw new Error(`Deletion not live (${response.status}): ${entry.url}`);
    if ([301, 302, 307, 308].includes(response.status)) {
      const target = new URL(response.headers.get('location') || '', entry.url);
      publicUrl(target.href);
      if (target.href === entry.url) throw new Error('Self-redirect is not a deletion.');
    }
    return;
  }
  if (response.status !== 200 || !/text\/html/i.test(response.headers.get('content-type') || ''))
    throw new Error(`Page not live HTML (${response.status}): ${entry.url}`);
  const html = await response.text();
  if (/noindex/i.test(response.headers.get('x-robots-tag') || '') || htmlNoindex(html))
    throw new Error(`Page is noindex: ${entry.url}`);
  const canonical = [...html.matchAll(/<link\b[^>]*>/gi)].find(
    ([tag]) => attr(tag, 'rel') === 'canonical',
  )?.[0];
  if (attr(canonical || '', 'href') !== entry.url || pageFingerprint(html) !== entry.hash)
    throw new Error(`Page differs from published manifest: ${entry.url}`);
}

export async function submitBatch(entries, key, fetcher = fetch) {
  if (!/^[a-f0-9]{32}$/.test(key) || !entries.length || entries.length > 10000)
    throw new Error('Invalid IndexNow batch.');
  const response = await fetcher('https://api.indexnow.org/indexnow', {
    method: 'POST',
    redirect: 'error',
    signal: AbortSignal.timeout(30000),
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'User-Agent': 'Tagrivo-IndexNow/2.0',
    },
    body: JSON.stringify({
      host: 'tagrivo.pages.dev',
      key,
      keyLocation: `${ORIGIN}/${key}.txt`,
      urlList: entries.map((e) => publicUrl(e.url)),
    }),
  });
  // No automatic POST retry: ambiguous timeouts may already have been received.
  return {
    status: response.status,
    accepted: [200, 202].includes(response.status),
    retryAfter: response.headers.get('retry-after'),
  };
}
