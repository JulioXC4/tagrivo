import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
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
const queue = [...urls].sort();
async function worker() {
  while (queue.length) {
    const url = queue.shift();
    try {
      const response = await fetch(url, {
        redirect: 'follow',
        signal: AbortSignal.timeout(15000),
        headers: { 'User-Agent': 'Tagrivo-Link-Check/1.0' },
      });
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
  `${urls.size} external links checked; ${unresolved} need manual review. A reachable page does not verify its claims or image rights.`,
);
if (unresolved) process.exitCode = 1;
