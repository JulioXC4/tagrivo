export function amazonLink(asin: string | undefined, tag: string | undefined): string | null {
  if (!asin || !/^[A-Z0-9]{10}$/.test(asin) || !tag || !/^[A-Za-z0-9-]+$/.test(tag)) return null;
  return `https://www.amazon.com/dp/${asin}?tag=${encodeURIComponent(tag)}`;
}
