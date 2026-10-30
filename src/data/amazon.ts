/** Public catalog identities, not prices, offers, reviews, or Amazon API credentials. */
export const amazonStoreId = 'tagrivo-20';

export interface AmazonListing {
  asin: string;
  variant: string;
  verified: boolean;
  checked: string;
  source: string;
  evidence: string;
}

// Identity checked against the public Amazon detail page, including selected variants.
// A documentary check is not a guarantee of live stock, seller, price, or future redirects.
export const amazonListings: Readonly<Record<string, AmazonListing>> = {
  'rollo-wireless': {
    asin: 'B09VF4Z2WQ',
    variant: 'Rollo Wireless X1040',
    verified: true,
    checked: '2026-10-29',
    source: 'https://www.amazon.com/dp/B09VF4Z2WQ',
    evidence: 'Item details identify Wireless Rollo, model X1040, and this ASIN.',
  },
  'munbyn-itpp941': {
    asin: 'B07S48NHYS',
    variant: 'MUNBYN ITPP941 · USB · 203 dpi · white',
    verified: true,
    checked: '2026-10-29',
    source: 'https://www.amazon.com/dp/B07S48NHYS',
    evidence: 'Item details identify ITPP941, USB connectivity, 203 dpi, and the white selection.',
  },
  'brother-ql1110nwb': {
    asin: 'B079G51QT9',
    variant: 'Brother QL-1110NWB · new · not NWBc or renewed',
    verified: true,
    checked: '2026-10-29',
    source: 'https://www.amazon.com/dp/B079G51QT9',
    evidence: 'Model number QL1110NWB; selected variation QL1110NWB / New has this child ASIN.',
  },
};

// Commercial placements follow each guide's actual subject, not keyword matching.
export const guideAmazonProducts: Readonly<Record<string, readonly string[]>> = {
  'choose-label-printer': ['rollo-wireless', 'munbyn-itpp941', 'brother-ql1110nwb'],
  'rollo-vs-brother': ['rollo-wireless', 'brother-ql1110nwb'],
  'rollo-wireless-vs-munbyn-itpp941-usb': ['rollo-wireless', 'munbyn-itpp941'],
  'shopify-label-printer-models': ['rollo-wireless', 'munbyn-itpp941', 'brother-ql1110nwb'],
  'iphone-android-shipping-labels': ['rollo-wireless', 'brother-ql1110nwb'],
};
