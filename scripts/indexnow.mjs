import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { indexNowUrls, contentHash, changedEntries } from './indexnow-lib.mjs';

// No deployment hook or scheduled resubmission. Default is a read-only dry run.
const args = process.argv.slice(2);
const submit = args.includes('--submit');
if (args.some((arg) => arg.startsWith('--') && arg !== '--submit'))
  throw new Error('Unknown option.');
const origin = 'https://tagrivo.pages.dev';
const urls = indexNowUrls(args.filter((arg) => arg !== '--submit'));
const key = (await readFile(new URL('./indexnow.config.json', import.meta.url), 'utf8')).trim();
const { key: token } = JSON.parse(key);
if (!/^[a-f0-9]{32}$/.test(token)) throw new Error('Invalid public IndexNow verification key.');
const headers = { 'User-Agent': 'Tagrivo-IndexNow/1.0 (editorial updates)' };
const keyLocation = `${origin}/${token}.txt`;
const proof = await fetch(keyLocation, { headers, redirect: 'error' });
if (proof.status !== 200 || (await proof.text()).trim() !== token)
  throw new Error('Publish the key file first.');
const entries = [];
for (const url of urls) {
  const res = await fetch(url, { headers, redirect: 'error' });
  if (res.status !== 200) throw new Error(`Not HTTP 200: ${url}`);
  const body = await res.text();
  if (
    /noindex/i.test(body.match(/<head>[\s\S]*?<\/head>/i)?.[0] || '') ||
    /noindex/i.test(res.headers.get('x-robots-tag') || '')
  )
    throw new Error(`Not indexable: ${url}`);
  entries.push({ url, hash: contentHash(body) });
}
const stateFile = new URL('../release-artifacts/indexnow-state.json', import.meta.url);
let state = {};
try {
  state = JSON.parse(await readFile(stateFile, 'utf8'));
} catch (e) {
  if (e.code !== 'ENOENT') throw e;
}
const changed = changedEntries(entries, state);
console.log(
  JSON.stringify(
    {
      mode: submit ? 'submit' : 'dry-run',
      urls: changed.map((e) => e.url),
      unchangedSkipped: entries.length - changed.length,
    },
    null,
    2,
  ),
);
if (submit && changed.length) {
  const response = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { ...headers, 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({
      host: new URL(origin).host,
      key: token,
      keyLocation,
      urlList: changed.map((e) => e.url),
    }),
  });
  console.log(`IndexNow HTTP ${response.status}; receipt does not guarantee indexing.`);
  if (![200, 202].includes(response.status))
    throw new Error('Submission not accepted; no state saved.');
  for (const entry of changed) state[entry.url] = entry.hash;
  await mkdir(new URL('../release-artifacts/', import.meta.url), { recursive: true });
  await writeFile(stateFile, JSON.stringify(state, null, 2) + '\n');
}
