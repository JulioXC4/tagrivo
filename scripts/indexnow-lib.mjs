import { createHash } from 'node:crypto';

export function indexNowUrls(paths, origin = 'https://tagrivo.pages.dev') {
  if (!paths.length) throw new Error('Supply only genuinely changed guide/product paths.');
  return [
    ...new Set(
      paths.map((path) => {
        const url = new URL(path, origin);
        if (
          url.origin !== origin ||
          url.username ||
          url.password ||
          url.search ||
          url.hash ||
          !/^\/(?:guides\/[a-z0-9-]+|printers\/[a-z0-9-]+)\/$/.test(url.pathname)
        )
          throw new Error(
            'Only canonical, public guide/product URLs on the production host are allowed.',
          );
        return url.href;
      }),
    ),
  ];
}
export const contentHash = (body) => createHash('sha256').update(body).digest('hex');
export function changedEntries(entries, state) {
  return entries.filter((entry) => state[entry.url] !== entry.hash);
}
