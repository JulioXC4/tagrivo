import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { deployment } from './deployment-env.mjs';
import { resolveAnalyticsConfig } from '../src/lib/analytics.ts';
const analytics = resolveAnalyticsConfig(process.env);
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
const expectedProductArt = [
  'editorial-rollo-wireless-render.webp',
  'editorial-munbyn-itpp941-render.webp',
  'editorial-brother-ql1110nwb-render.webp',
];
const verificationName = 'google7bb345f95d638147.html';
const verificationFile = path.join(root, verificationName);
// Google's ownership file is an exact payload, not an editorial HTML route.
const htmlFiles = all.filter((f) => f.endsWith('.html') && f !== verificationFile);
const failures = [];
const productArt = await readdir(path.join(root, 'images/products'));
if (
  productArt.length !== expectedProductArt.length ||
  productArt.some((file) => !expectedProductArt.includes(file))
)
  failures.push('Product assets must contain only the three current editorial studio renders');
const originalVerification = await readFile(path.resolve('public', verificationName));
const deployedVerification = await readFile(verificationFile);
if (!originalVerification.equals(deployedVerification))
  failures.push('Google verification file must be copied byte-for-byte');
if (originalVerification.toString('utf8') !== `google-site-verification: ${verificationName}`)
  failures.push('Google verification file has an unexpected payload');
const redirects = await readFile(path.join(root, '_redirects'), 'utf8');
const retiredPhotoRedirects = [
  '/images/products/rollo-wireless.webp /images/products/editorial-rollo-wireless-render.webp 302',
  '/images/products/munbyn-itpp941.jpg /images/products/editorial-munbyn-itpp941-render.webp 302',
  '/images/products/brother-ql1110nwb.webp /images/products/editorial-brother-ql1110nwb-render.webp 302',
  '/images/products/editorial-wireless-workspace.webp /images/products/editorial-rollo-wireless-render.webp 302',
  '/images/products/editorial-wired-workspace.webp /images/products/editorial-munbyn-itpp941-render.webp 302',
  '/images/products/editorial-network-workspace.webp /images/products/editorial-brother-ql1110nwb-render.webp 302',
];
if (retiredPhotoRedirects.some((rule) => !redirects.split(/\r?\n/).includes(rule)))
  failures.push(
    'Retired photo URLs must redirect to editorial art to override Pages asset retention',
  );
if (
  !redirects.split(/\r?\n/).includes(`/${verificationName} /${verificationName.slice(0, -5)} 200`)
)
  failures.push('Google verification URL must bypass the Pages HTML-extension redirect');
const titles = new Set();
const descriptions = new Set();
const canonicals = new Set();
const articleBodies = new Set();
for (const file of htmlFiles) {
  const html = await readFile(file, 'utf8');
  if (
    /images\/products\/(?:rollo-wireless\.webp|munbyn-itpp941\.jpg|brother-ql1110nwb\.webp)/.test(
      html,
    )
  )
    failures.push(`${file}: retired manufacturer photograph referenced`);
  if (/images\/products\/editorial-(?:wireless|wired|network)-workspace\.webp/.test(html))
    failures.push(`${file}: superseded abstract illustration referenced`);
  const productVisuals = [...html.matchAll(/<img\b[^>]*src="\/images\/products\/[^>]*>/g)];
  if (
    productVisuals.some(([tag]) => !/alt="[^"]*AI-generated editorial render[^"]*"/i.test(tag)) ||
    (productVisuals.length && !/Editorial render/i.test(html))
  )
    failures.push(
      `${file}: editorial product imagery needs honest alt text and a visible disclosure`,
    );
  if (
    file.includes(`${path.sep}printers${path.sep}`) &&
    path.basename(path.dirname(file)) !== 'printers'
  ) {
    if (
      !/property="og:image" content="[^"]*\/images\/products\/editorial-/.test(html) ||
      !/property="og:image:alt" content="[^"]*AI-generated editorial render/i.test(html)
    )
      failures.push(`${file}: product Open Graph must identify original editorial art`);
  }
  const title = html.match(/<title>([\s\S]*?)<\/title>/)?.[1];
  const description = html.match(/name="description"\s+content="([^"]*)"/)?.[1];
  const canonical = html.match(/rel="canonical"\s+href="([^"]*)"/)?.[1];
  if (!canonical || new URL(canonical).origin !== deployment.site)
    failures.push(`${file}: incorrect deployment canonical`);
  if (canonical) {
    const relative = path.relative(root, file).replaceAll('\\', '/');
    const expectedPath =
      relative === 'index.html'
        ? '/'
        : relative === '404.html'
          ? '/404/'
          : `/${relative.replace(/index\.html$/, '')}`;
    const url = new URL(canonical);
    if (url.pathname !== expectedPath || url.search || url.hash)
      failures.push(`${file}: canonical must identify this route without query/fragment`);
    if (canonicals.has(canonical)) failures.push(`${file}: duplicate canonical`);
    canonicals.add(canonical);
  }
  if (!analytics.enabled && html.includes('id="analytics-preferences"'))
    failures.push(`${file}: analytics controls must be absent while integration is disabled`);
  if (/src="https:\/\/www\.googletagmanager\.com/.test(html))
    failures.push(`${file}: Google tag must not load before browser consent`);
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
      if (data['@type'] === 'Article') {
        const body = html
          .match(/<div class="prose">([\s\S]*?)<\/div>/)?.[1]
          ?.replace(/<[^>]+>/g, ' ')
          .replace(/\s+/g, ' ')
          .trim();
        if (!body || articleBodies.has(body))
          failures.push(`${file}: missing or duplicated article body`);
        if (body) articleBodies.add(body);
      }
      if (data['@type'] === 'Product' && (data.review || data.aggregateRating || data.offers))
        failures.push(
          `${file}: initial research catalog must not imply verified reviews or live offers`,
        );
      if (data['@type'] === 'Product' && data.image)
        failures.push(
          `${file}: generated editorial art must not be declared as an exact Product image`,
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
  const sitemap = await readFile(path.join(root, 'sitemap-0.xml'), 'utf8');
  for (const match of sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)) {
    if (!canonicals.has(match[1]) || /\/404(?:\.html|\/)?$/.test(match[1]))
      failures.push(`Sitemap includes a noncanonical or error page: ${match[1]}`);
  }
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
  `Verified ${htmlFiles.length} prerendered HTML routes, exact Google ownership file, local links/assets, unique metadata, h1, JSON-LD, canonical origin, indexing policy, robots, affiliate attributes and deployment artifacts.`,
);
