export const finderPlatforms = ['Etsy', 'Shopify', 'eBay', 'Other'] as const;

function allowedPlatform(value: unknown): string | null {
  return typeof value === 'string' && finderPlatforms.some((platform) => platform === value)
    ? value
    : null;
}

/** Fragments are not included in HTTP requests; no storage or identity is needed. */
export function finderHandoffHref(value: unknown): string | null {
  const platform = allowedPlatform(value);
  return platform ? `/printer-finder/#platform=${encodeURIComponent(platform)}` : null;
}

/** Keep old bookmarked query links usable, then clear our handoff from browser history. */
export function readFinderHandoff(href: string): { platform: string | null; cleanHref: string } {
  const url = new URL(href);
  const ownFragment = url.hash.startsWith('#platform=');
  const fragment = ownFragment ? new URLSearchParams(url.hash.slice(1)).get('platform') : null;
  const platform = allowedPlatform(fragment) || allowedPlatform(url.searchParams.get('platform'));
  url.searchParams.delete('platform');
  if (ownFragment) url.hash = '';
  return { platform, cleanHref: `${url.pathname}${url.search}${url.hash}` };
}
