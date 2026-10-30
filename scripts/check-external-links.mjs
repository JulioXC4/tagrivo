import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { isAmazonDestination } from '../src/lib/affiliate.ts';
async function collect(dir) {
  const files = await readdir(dir, { withFileTypes: true });
  return (
    await Promise.all(
      files.map((file) =>
        file.isDirectory() ? collect(path.join(dir, file.name)) : path.join(dir, file.name),
      ),
    )
  ).flat();
}
const urls = new Set();
for (const file of (await collect('dist')).filter((file) => file.endsWith('.html'))) {
  for (const match of (await readFile(file, 'utf8')).matchAll(/<a\b[^>]*href="(https?:[^"\s]+)"/g))
    urls.add(match[1].replaceAll('&amp;', '&'));
}
let unresolved = 0;
const skipped = [...urls].filter(isAmazonDestination);
const queue = [...urls].filter((url) => !isAmazonDestination(url)).sort();
for (const url of skipped)
  console.log(
    JSON.stringify({
      url,
      result:
        'not requested: Amazon links require documentary/manual identity review; no automated referral clicks',
    }),
  );
async function worker() {
  while (queue.length) {
    const url = queue.shift();
    try {
      let destination = url;
      let response;
      for (let hop = 0; hop < 6; hop++) {
        // Inspect redirects before following: manufacturer/policy URLs must not cause Amazon visits.
        if (isAmazonDestination(destination)) break;
        response = await fetch(destination, {
          redirect: 'manual',
          signal: AbortSignal.timeout(15000),
          headers: { 'User-Agent': 'Tagrivo-Link-Check/1.0' },
        });
        const location = response.headers.get('location');
        if (![301, 302, 303, 307, 308].includes(response.status) || !location) break;
        await response.body?.cancel();
        destination = new URL(location, destination).href;
        response = undefined;
      }
      if (!response) {
        unresolved++;
        console.log(
          JSON.stringify({
            url,
            result:
              'manual review: redirect chain not followed to Amazon, or redirect limit reached',
          }),
        );
        continue;
      }
      await response.body?.cancel();
      if (!response.ok) unresolved++;
      console.log(
        JSON.stringify({
          url,
          status: response.status,
          final: response.url,
          result: response.ok ? 'reachable' : 'manual review (may be bot protection)',
        }),
      );
    } catch {
      unresolved++;
      console.log(JSON.stringify({ url, result: 'manual review: timeout/network failure' }));
    }
  }
}
await Promise.all(Array.from({ length: 4 }, worker));
console.log(
  `${urls.size - skipped.length} external links requested; ${skipped.length} Amazon destinations deliberately not requested; ${unresolved} need manual review. A reachable page does not verify its claims or image rights.`,
);
if (unresolved) process.exitCode = 1;
