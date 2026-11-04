import { readFile, writeFile, mkdir, appendFile } from 'node:fs/promises';
import {
  ORIGIN,
  MANIFEST_PATH,
  validateManifest,
  validateState,
  planChanges,
  advanceState,
  verifyChangedPage,
  submitBatch,
  productionCheckSucceeded,
  deferChanges,
} from './indexnow-production.mjs';

const output = new URL('../release-artifacts/indexnow/', import.meta.url);
await mkdir(output, { recursive: true });
const report = {
  version: 1,
  mode: process.argv.includes('--submit') ? 'submit' : 'dry-run',
  origin: ORIGIN,
  changes: [],
  status: 'pending',
};
let state;
const readJson = async (path) => JSON.parse(await readFile(path, 'utf8'));
const headers = {
  'User-Agent': 'Tagrivo-IndexNow/2.0',
  Accept: 'application/vnd.github+json',
  ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
};
const api = 'https://api.github.com/repos/JulioXC4/tagrivo';
async function github(path) {
  const response = await fetch(api + path, { headers, signal: AbortSignal.timeout(15000) });
  if (!response.ok) throw new Error(`GitHub API HTTP ${response.status}.`);
  return response.json();
}

async function deployedManifest(commit) {
  // Observe the separate Cloudflare deploy; never gate or publish the web.
  for (let attempt = 0; attempt < 48; attempt++) {
    const head = await github('/git/ref/heads/main');
    if (head.object.sha !== commit)
      throw new Error(
        'Superseded main commit: skip; a later run will compare the complete manifest.',
      );
    const checks = await github(`/commits/${commit}/check-runs`);
    const cloudflare = checks.check_runs.filter(
      (c) => c.name === 'Cloudflare Pages' && c.app?.slug === 'cloudflare-workers-and-pages',
    );
    if (productionCheckSucceeded(cloudflare, commit)) {
      const response = await fetch(ORIGIN + MANIFEST_PATH, {
        cache: 'no-store',
        redirect: 'error',
        signal: AbortSignal.timeout(15000),
      });
      if (response.status === 200) {
        const value = await response.json();
        if (value.commit === commit) return validateManifest(value, commit);
      }
    } else if (
      cloudflare.some(
        (c) =>
          c.status === 'completed' && !['success', 'neutral', 'skipped'].includes(c.conclusion),
      )
    ) {
      throw new Error('Cloudflare deploy failed; no notification.');
    }
    if (attempt < 47) await new Promise((resolve) => setTimeout(resolve, 10000));
  }
  throw new Error('Production deploy not confirmed within eight minutes; no notification.');
}

try {
  if (process.argv.slice(2).some((a) => !['--submit', '--dry-run'].includes(a)))
    throw new Error(
      'Use npm run indexnow -- --dry-run, or the automatic production workflow. Arbitrary/manual URL batches are disabled.',
    );
  if (process.env.GITHUB_REPOSITORY && process.env.GITHUB_REPOSITORY !== 'JulioXC4/tagrivo')
    throw new Error('Wrong repository.');
  if (process.env.GITHUB_REF && process.env.GITHUB_REF !== 'refs/heads/main')
    throw new Error('Only main production may notify.');
  if (report.mode === 'submit' && process.env.GITHUB_ACTIONS !== 'true')
    throw new Error(
      'Submit only through the workflow, which restores the shared notification state.',
    );
  const config = await readJson(new URL('./indexnow.config.json', import.meta.url));
  if (config.provider !== 'github-actions' || process.env.INDEXNOW_EXTERNAL_PROVIDER === 'true')
    throw new Error('External IndexNow provider selected: this sender is disabled.');
  const commit = process.env.GITHUB_SHA || process.env.INDEXNOW_EXPECTED_COMMIT;
  if (!/^[a-f0-9]{40}$/.test(commit || ''))
    throw new Error('A genuine production commit SHA is required.');
  report.commit = commit;
  try {
    state = validateState(await readJson(new URL('state.json', output)));
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
    if (process.env.INDEXNOW_STATE_REQUIRED === 'true')
      throw new Error(
        'Previous notification state is unavailable. Refusing a bulk resend; restore its artifact first.',
      );
    state = validateState(await readJson(new URL('./indexnow-baseline.json', import.meta.url)));
  }
  const manifest = await deployedManifest(commit);
  const proof = await fetch(`${ORIGIN}/${config.key}.txt`, {
    redirect: 'error',
    signal: AbortSignal.timeout(15000),
  });
  if (proof.status !== 200 || (await proof.text()).trim() !== config.key)
    throw new Error('The public IndexNow verification key does not match.');
  const changes = planChanges(manifest, state);
  report.changes = changes.map(({ url, kind }) => ({ url, kind }));
  for (const entry of changes) await verifyChangedPage(entry);
  if ((await github('/git/ref/heads/main')).object.sha !== commit)
    throw new Error('Production was superseded during verification.');
  const current = await fetch(ORIGIN + MANIFEST_PATH, {
    cache: 'no-store',
    signal: AbortSignal.timeout(15000),
  }).then((r) => r.json());
  validateManifest(current, commit);
  if (report.mode === 'submit' && changes.length) {
    state = deferChanges(state, changes);
    const receipt = await submitBatch(changes, config.key);
    report.receipt = receipt;
    if (!receipt.accepted) state = deferChanges(state, changes, receipt.retryAfter);
    if (!receipt.accepted)
      throw new Error(
        `IndexNow HTTP ${receipt.status}; state not advanced. See report; do not repeatedly retry.`,
      );
    state = advanceState(state, changes, commit);
  }
  report.status = report.mode === 'dry-run' ? 'dry-run' : changes.length ? 'accepted' : 'unchanged';
  if (state) await writeFile(new URL('state.json', output), JSON.stringify(state, null, 2) + '\n');
} catch (error) {
  report.status = 'error';
  report.error = error.message;
  if (state) await writeFile(new URL('state.json', output), JSON.stringify(state, null, 2) + '\n');
  process.exitCode = 1;
} finally {
  report.completedAt = new Date().toISOString();
  await writeFile(new URL('report.json', output), JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify(report, null, 2));
  if (process.env.GITHUB_ACTIONS === 'true')
    console.log(
      `::notice title=IndexNow production::Status=${report.status}; HTTP=${report.receipt?.status || 'not sent'}; changed URLs=${report.changes.length}`,
    );
  if (process.env.GITHUB_STEP_SUMMARY) {
    await appendFile(
      process.env.GITHUB_STEP_SUMMARY,
      `## IndexNow production\n\nStatus: **${report.status}**. ${report.changes.length} changed URL(s). Receipt is not indexing.\n\n` +
        (report.receipt ? `IndexNow HTTP ${report.receipt.status}.\n\n` : '') +
        (report.error ? `${report.error}\n\n` : '') +
        report.changes.map((c) => `- ${c.kind}: ${c.url}`).join('\n') +
        '\n',
    );
  }
}
