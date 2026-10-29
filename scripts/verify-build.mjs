import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { deployment } from './deployment-env.mjs';
const root = path.resolve('dist');
async function files(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  return (
    await Promise.all(
      entries.map((e) =>
        e.isDirectory() ? files(path.join(dir, e.name)) : path.join(dir, e.name),
      ),
    )
  ).flat();
}
const all = await files(root);
const htmlFiles = all.filter((f) => f.endsWith('.html'));
const failures = [];
const titles = new Set();
const descriptions = new Set();
for (const file of htmlFiles) {
  const html = await readFile(file, 'utf8');
  const title = html.match(/<title>([\s\S]*?)<\/title>/)?.[1];
  const description = html.match(/name="description"\s+content="([^"]*)"/)?.[1];
  const canonical = html.match(/rel="canonical"\s+href="([^"]*)"/)?.[1];
  if (!canonical || new URL(canonical).origin !== deployment.site)
    failures.push(`${file}: incorrect deployment canonical`);
  if (!deployment.indexable && !html.includes('content="noindex, nofollow"'))
    failures.push(`${file}: preview must be noindex`);
  if (/tagrivo\.com/.test(html) && !deployment.site.includes('tagrivo.com'))
    failures.push(`${file}: unconfirmed legacy domain`);
  if (title && titles.has(title)) failures.push(`${file}: duplicate title`);
  if (description && descriptions.has(description)) failures.push(`${file}: duplicate description`);
  if (title) titles.add(title);
  if (description) descriptions.add(description);
  if ((html.match(/<h1[\s>]/g) || []).length !== 1) failures.push(`${file}: expected one h1`);
  for (const anchor of html.matchAll(/href="#([^"\s]+)"/g)) {
    if (!html.includes(`id="${decodeURIComponent(anchor[1])}"`))
      failures.push(`${file}: broken section link #${anchor[1]}`);
  }
  for (const match of html.matchAll(
    /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g,
  )) {
    try {
      const data = JSON.parse(match[1]);
      if (!data['@context'] || !data['@type']) failures.push(`${file}: incomplete structured data`);
      if (
        data['@type'] === 'Article' &&
        (!data.author ||
          !data.datePublished ||
          !data.dateModified ||
          new Date(data.dateModified) < new Date(data.datePublished))
      )
        failures.push(`${file}: incomplete or inconsistent article dates/author`);
      if (data['@type'] === 'Product' && (data.review || data.aggregateRating || data.offers))
        failures.push(
          `${file}: initial research catalog must not imply verified reviews or live offers`,
        );
    } catch {
      failures.push(`${file}: invalid structured-data JSON`);
    }
  }
  if (
    !html.includes('<title>') ||
    !html.includes('rel="canonical"') ||
    !html.includes('name="description"')
  )
    failures.push(`${file}: missing metadata`);
  for (const match of html.matchAll(/(?:href|src)="(\/[^"#?]*)(?:[?#][^"]*)?"/g)) {
    const link = decodeURIComponent(match[1]);
    if (link === '/') continue;
    const target = path.join(root, link);
    try {
      const info = await stat(target);
      if (info.isDirectory()) await stat(path.join(target, 'index.html'));
    } catch {
      failures.push(`${path.relative(root, file)}: missing ${link}`);
    }
  }
  if (
    /https:\/\/www\.amazon\.com\/dp\//.test(html) &&
    !html.includes('rel="sponsored nofollow noopener noreferrer"')
  )
    failures.push(`${file}: undisclosed affiliate`);
}
for (const file of [
  'robots.txt',
  '404.html',
  '_headers',
  ...(deployment.indexable ? ['sitemap-index.xml', 'sitemap-0.xml'] : []),
])
  if (!all.includes(path.join(root, file))) failures.push(`Missing ${file}`);
const headers = await readFile(path.join(root, '_headers'), 'utf8');
const robots = await readFile(path.join(root, 'robots.txt'), 'utf8');
if (!deployment.indexable) {
  if (!headers.includes('X-Robots-Tag: noindex, nofollow'))
    failures.push('Missing preview noindex HTTP header');
  if (/Sitemap:/i.test(robots) || all.some((file) => /sitemap.*\.xml$/.test(file)))
    failures.push('Preview must not publish a sitemap');
} else {
  if (headers.includes('X-Robots-Tag: noindex')) failures.push('Production unexpectedly noindex');
  if (!robots.includes(`${deployment.site}/sitemap-index.xml`))
    failures.push('Incorrect sitemap origin');
}
for (const file of all) {
  const relative = path.relative(root, file).replaceAll('\\', '/');
  if (
    /(^|\/)(?:\.env(?:\..*)?|\.git|node_modules|src|scripts|tests|design-assets)(\/|$)/.test(
      relative,
    ) ||
    /\.(?:map|pem|key|p12|pfx|log)$/.test(relative)
  )
    failures.push(`Private/source artifact in deployment: ${relative}`);
  if (/\.(?:html|js|css|txt|xml)$/.test(file)) {
    const text = await readFile(file, 'utf8');
    if (
      /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----|\bgithub_pat_[A-Za-z0-9_]{30,}\b|\bghp_[A-Za-z0-9]{30,}\b/.test(
        text,
      )
    )
      failures.push(`${relative}: possible credential`);
    if (text.includes('C:/Users/') || text.includes('C:\\Users\\') || text.includes('D:/Julio/'))
      failures.push(`${relative}: local personal path`);
  }
}
if (failures.length) {
  console.error([...new Set(failures)].join('\n'));
  process.exit(1);
}
console.log(
  `Verified ${htmlFiles.length} prerendered HTML routes, local links/assets, unique metadata, h1, JSON-LD, canonical origin, indexing policy, robots, affiliate attributes and deployment artifacts.`,
);
