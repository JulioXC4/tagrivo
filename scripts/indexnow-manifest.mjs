import { readdir, readFile, writeFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { ORIGIN, pageFingerprint, validateManifest, htmlNoindex } from './indexnow-production.mjs';

export async function writeIndexNowManifest(deployment) {
  if (!deployment.indexable || deployment.preview || deployment.site !== ORIGIN) return;
  const commit =
    process.env.CF_PAGES_COMMIT_SHA ||
    execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
  const pages = {};
  for (const raw of await readdir('dist', { recursive: true })) {
    const path = raw.replaceAll('\\', '/');
    if (path !== 'index.html' && !path.endsWith('/index.html')) continue;
    const html = await readFile(`dist/${path}`, 'utf8');
    if (htmlNoindex(html)) continue;
    pages[new URL('/' + path.replace(/index\.html$/, ''), ORIGIN).href] = pageFingerprint(html);
  }
  const manifest = validateManifest({ version: 1, origin: ORIGIN, branch: 'main', commit, pages });
  await writeFile('dist/indexnow-manifest.json', JSON.stringify(manifest, null, 2) + '\n');
  console.log(
    `IndexNow production manifest: ${Object.keys(pages).length} page fingerprints; no notification during build.`,
  );
}
