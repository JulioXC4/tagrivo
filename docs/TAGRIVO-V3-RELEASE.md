# Tagrivo V3 · implementation and release checklist

## Implemented

- Seven exact catalog entries: existing Rollo Wireless X1040, MUNBYN ITPP941 USB203 and Brother QL-1110NWB; new Rollo USB X1038, MUNBYN ITPP941B203, Phomemo PM241-BT203 and Brother QL-1100 (not c).
- `/printers/`: normalized brand/model search; OS plus print-connection route filtering; resolution, format and use-case filters; documented-feature sorting; live count; clear/empty states; up to three selected models passed to the existing `/compare/` query interface.
- Shared route matrix in `src/data/workflows.ts` used by catalog, Finder, product compatibility tables and troubleshooting. Finder still has five steps; last step also checks 4×6 versus continuous DK requirements. Budget remains conditional for unverified current prices. No invented ranking score.
- `/tools/`: existing cost calculator plus new browser-only `/tools/label-preview/` and `/tools/printer-troubleshooter/`. No uploads, PII fields, new storage, backend or dependencies. Preview has fictitious data, illustrative bars, dimension/scale validation and clipping mathematics. Troubleshooter has six problem paths, exact-model limitations and official references; no factory-reset recipes.
- `/labels-accessories/`: sourced media-family reference, including DK versus loose generic stock and precise DK dimensions. No universal holder or unverified accessory buy buttons.
- Six original guides added: Rollo USB/Wireless; MUNBYN USB/941B; Brother1100/1110NWB; Phomemo compatibility; compatible labels; setup problems. Existing Etsy size and connection guides improved instead of duplicated. Original ten URLs retained.
- Navigation exposes Finder, Printers, Compare, Buying Guides, Tools. Existing identity/hero/fonts retained; calculator V2 code/styles unchanged.
- Six name-only action events added through the existing consent gate: catalog search/filter/selection, product navigation, preview use and troubleshooter use. No search terms or tool answers transmitted; no new trackers. Privacy describes the actions accurately without changing approved operator identity.
- Two new verified Amazon identities (X1038,QL-1100), real `tagrivo-20`, no live price/stock claims. Existing three identities unchanged. Unverified941B/Phomemo variants remain informational.

## Photography: completed versus blocked

Two unchanged authentic Brother library photographs replace generated model-like images. One authorized view per model, not five fabricated views. The five Rollo/MUNBYN/Phomemo entries have an original category diagram expressly labeled as not a printer photograph, with official-model photo links. These remain photo-rights limitations, not a claim that seven authenticated photos were delivered. No unauthorized copying, hotlinking or AI product reconstruction. Retired render URLs redirect to current visuals to override retained Pages assets. Social images distinguish official Brother photos from general editorial hero artwork.

See [full image rights, source URLs, hashes and exact-model research](TAGRIVO-V3-SOURCES.md). Public disclosure: `/image-sources/`.

## Verification completed before push

- `npm run verify`:67tests passed; Astro check0errors/0warnings/0hints;40HTMLroutes built,39public URL fingerprints/sitemap pages.
- Build audit checks local links/assets, metadata uniqueness, oneH1, validJSON-LD, canonical paths, production/preview indexing policy, official Google ownership file bytes, affiliate attributes/counts and licensed-photo hashes.
- Release scan: no configured private legal values, credential patterns or private filenames found among Git-eligible files. Private `.env` files remain ignored. This is a bounded scan, not a security guarantee.
- Browser: catalog search / combined iOS+BT filters / reset / selection handoff; Finder five-step iOS+BT returns941B+Phomemo; Compare reads three new IDs; preview fit/clipping and portrait/landscape; troubleshooting warns for unsupported RolloBT and supplies Munbyn Print setup for941B.
- Responsive evidence:1440desktop,768tablet,390mobile,light/dark; no horizontal document overflow in checked views. Lazy product photos decoded before accepted captures. Impeccable independent review: two findings (control boundaries, link discoverability) fixed and scored resolved, disposition `ship` limited to those fixes. Documenter verified incumbent DESIGN.md and sidecar hashes unchanged. No claim of full WCAG certification or measured Core Web Vitals.
- External source sweep:37non-Amazon URLs checked; five automated403/challenge responses require a normal browser/provider resolution. Rollo and MUNBYN driver challenges also reproduce in the test browser; these are not reported as confirmed broken URLs. One actual old Brother brochure404 was replaced with the current200PDF linked by the official product page. Amazon links were deliberately not requested by the checker; identities were checked documentarily, without artificial referral clicks.

## Deployment verification procedure

Publish only the reviewed changes as a normal commit to current main after fetching remote (no force push). Wait for Cloudflare Pages success on that exact SHA and the public `/indexnow-manifest.json` to show the same commit. Run `npm run check:deployment -- https://tagrivo.pages.dev/`, then public browser interactions for catalog, tools, Finder and Compare. Existing IndexNow workflow sends only real changed canonical URLs after matching production; do not add a separate manual notification batch. Actual commit/check results are supplied with delivery and local release evidence; build acceptance is not a promise of search-engine indexing.

## Remaining external decisions

1. Suitable exact-model photo permissions or owner-created real photos for Rollo X1040/X1038, MUNBYN USB941/941B and Phomemo PM241-BT. No paid service is necessary in the implementation.
2. Exact selected Amazon child variants for941B and Phomemo before commercial links. A pink Phomemo candidate is not silently represented as an unspecified/white variant.
3. Manufacturer clarification of conflicting941B chassis dimensions and Phomemo non-4×6 media widths.
4. Zebra requires exact ZD421d DT SKU/interface/resolution, rights and listing checks; research is documented, no ambiguous entry shipped.
5. Additional accessory part numbers and holders require fit documentation; current section is an informative reference.

No new environment variable, Cloudflare secret or account authorization is required for V3. Production indexing, GA4 consent, Search Console verification, robots/sitemaps and IndexNow remain in the established configuration. Monitor actual Bing/GSC landing-page impressions/clicks and consented GA4 action events; do not interpret keyword-research impressions as site traffic.
