import { amazonListings, amazonStoreId, type AmazonListing } from '../data/amazon.ts';

export const affiliateRel = 'sponsored nofollow noopener noreferrer';

export function resolveAmazonStoreId(configured?: string): string {
  if (configured?.trim() && configured.trim() !== amazonStoreId)
    throw new Error(
      'PUBLIC_AMAZON_ASSOCIATE_TAG must match the registered Store ID in src/data/amazon.ts.',
    );
  return amazonStoreId;
}

export function amazonLink(asin: string | undefined, tag: string | undefined): string | null {
  if (!asin || !/^[A-Z0-9]{10}$/.test(asin) || !tag || !/^[A-Za-z0-9-]+$/.test(tag)) return null;
  return `https://www.amazon.com/dp/${asin}?tag=${encodeURIComponent(tag)}`;
}

/** Fail closed: a catalog identity and its evidence must be verified before linking. */
export function verifiedAmazonLink(
  listing: AmazonListing | undefined,
  tag: string | undefined,
): string | null {
  if (!listing?.verified || !listing.checked || !listing.variant) return null;
  if (listing.source !== `https://www.amazon.com/dp/${listing.asin}`) return null;
  return amazonLink(listing.asin, tag);
}

export function amazonLinkFor(printerId: string, tag: string | undefined): string | null {
  if (!Object.hasOwn(amazonListings, printerId)) return null;
  return verifiedAmazonLink(amazonListings[printerId], tag);
}

/** Link-check jobs must never generate Amazon referral traffic, even through short links. */
export function isAmazonDestination(value: string): boolean {
  const host = new URL(value).hostname.toLowerCase();
  return (
    host === 'amazon.com' || host.endsWith('.amazon.com') || host === 'amzn.to' || host === 'a.co'
  );
}
