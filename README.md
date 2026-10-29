# TAGRIVO

An independent editorial platform for thermal shipping-label printers. Built with Astro, TypeScript, Tailwind CSS and React Islands. All editorial routes are prerendered; no database, authentication, application backend or paid service is required.

## Run locally

Use Node.js 24, as pinned in `.nvmrc`. The deployment scripts use its native TypeScript and dotenv support.

```sh
npm ci
npm run dev
```

Astro prints the local URL. To inspect the actual static production output:

```sh
npm run verify
npm run preview
```

`verify` audits Git-eligible files, runs behavior/deployment tests, Astro/TypeScript checks, the build and checks generated links, assets, metadata, canonical origins and indexing policy. `npm run test` runs tests independently. `npm run check:links` separately checks external links; anti-bot responses need manual review and do not automatically mean a link is broken.

## Architecture

| Location                            | Purpose                                                                                      |
| ----------------------------------- | -------------------------------------------------------------------------------------------- |
| `src/pages/`                        | Home, Finder, Compare, Calculator, guides, product details, editorial/legal pages and 404    |
| `src/data/printers.ts`              | Typed product catalog, exact variants, source evidence, dated price reference, image credits |
| `src/content/guides/*.md`           | Original articles in an Astro Content Collection                                             |
| `src/content.config.ts`             | Article schema and glob content loader                                                       |
| `src/components/Finder.tsx`         | Five-step browser-only recommendation interface                                              |
| `src/components/Compare.tsx`        | Two/three-model comparison, differences, per-model cost quotes, shareable URL, print         |
| `src/components/Calculator.tsx`     | Cost assumptions, calculation, CSV export                                                    |
| `src/lib/recommend.ts`              | Explicit eligibility and preference rules                                                    |
| `src/lib/costs.ts`                  | Pure cost calculation with invalid-input protection                                          |
| `src/lib/affiliate.ts`              | Affiliate URLs only when both tag and actual ASIN exist                                      |
| `src/layouts/`                      | Metadata, global navigation, theme and editorial layout                                      |
| `src/styles/global.css`             | Approved design tokens, responsive and print styles                                          |
| `public/images/products/`           | Authentic manufacturer photos                                                                |
| `public/images/editorial-hero.webp` | Original AI editorial image, 1000 × 1250, about 94 KB                                        |
| `design-assets/`                    | Hero original and exact generation prompt/provenance                                         |
| `tests/logic.test.ts`               | Meaningful compatibility, budget, media-cost and affiliate tests                             |

React hydrates only the interactive tools. The home Finder invitation is a native HTML radio form, so it works before JavaScript loads and the home page needs no React runtime. Editorial navigation and theme use a small Astro script. Fonts are self-hosted Latin subsets of DM Serif Display and DM Sans. Product imagery is never generated as a stand-in for real hardware.

## Product research and recommendations

The initial catalog covers Rollo Wireless X1040, MUNBYN ITPP941 **USB / 203 dpi**, and Brother QL-1110NWB. Source documentation was checked on October 28, 2026. Read the public methodology for the precise recommendation rules. This is document research, not hands-on testing.

Rollo's Bluetooth-assisted setup is not treated as direct Bluetooth label printing. Mobile USB and unverified Mac/mobile Bluetooth combinations are excluded. OS categories do not promise compatibility with every release. ChromeOS extension requirements and Brother's NWB/NWBc distinctions remain explicit.

Only Brother had a verified dated hardware price in this research pass ($334.99). The Finder excludes that model when the reference exceeds the cap, and clearly flags unknown-price models as needing a price check. It does not invent a price to complete a recommendation. Volume changes batch/media guidance, not an unsupported durability rating.

Calculator defaults are illustrative assumptions. It models one label per order, 52 weeks per year, whole-label rounding after accounting for waste, and a one-time hardware purchase. Consumption is valued proportionally; whole-pack outlay may be higher. It excludes postage, tax, repairs, energy, subscriptions, financing and labor.

### Add or update a printer

1. Add a complete typed entry in `src/data/printers.ts`; do not merge facts across model variants.
2. Verify the exact model's official specifications and current driver matrix. Record sources and check date.
3. Add an authentic, appropriately licensed photo and document its origin in `ASSET-SOURCES.md`.
4. Review `recommend.ts` whenever adding a new device or connection behavior. Do not assume the existing rules generalize to a different product family.
5. Run `npm run verify` and exercise the Finder, comparison and product page.

### Add an article

Create a Markdown file under `src/content/guides/` with title, description, category, date, readingTime and optional featured flag. The file name becomes its URL. Use `##` headings for the automatic table of contents. Cite manufacturer evidence, distinguish opinion from facts, and do not add test claims unless actual test evidence exists.

## Amazon Associates

No affiliate identifier or product ASIN was provided, so no Amazon purchase link is emitted. Manufacturer information links work independently.

After actual program enrollment, set `PUBLIC_AMAZON_ASSOCIATE_TAG` and add the verified Amazon ASIN to each appropriate catalog entry. Rebuild. Links receive `rel="sponsored nofollow noopener noreferrer"`; the product page displays the required Associate sentence next to the purchase area, and the disclosure page switches to active-participation wording. Never use made-up ASINs or copy Amazon images/prices. Review [Amazon's agreement](https://affiliate-program.amazon.com/help/operating/agreement) and [disclosure requirements](https://affiliate-program.amazon.com/help/node/topic/GPXFHVYZMTGPUMPE) when activating the program.

## Cloudflare Pages

This is a static project; an SSR adapter and Cloudflare Functions are unnecessary.

The repository is [JulioXC4/tagrivo](https://github.com/JulioXC4/tagrivo). Follow [DEPLOYMENT.md](DEPLOYMENT.md) for the complete first-deploy, authorization, preview, update and launch procedure.

Use the Pages Git integration, branch `main`, build command `npm run verify`, output `dist`, `NODE_VERSION=24` and `SITE_INDEXING=disabled` in both Production and Preview. Keep the Free plan. No Cloudflare API token, Wrangler dependency, database, Functions or paid hosting is needed. The GitHub verification workflow is manual; automatic verification runs in Cloudflare before each publication.

The first deploy derives canonical/Open Graph/schema URLs from Cloudflare's actual `CF_PAGES_URL`. After the assigned stable `pages.dev` URL is known, set `PUBLIC_SITE_URL` to that origin and rebuild. Preview branches always use their own deployment URL and remain noindex. Local builds default to localhost. No ownership of a brand domain is assumed.

Indexing is disabled by default with HTML metadata and an HTTP header generated into `dist/_headers`. Preview builds publish no sitemap; robots permits reading the noindex. Only explicit `SITE_INDEXING=enabled` plus a confirmed HTTPS origin enables production sitemap/indexing. See the deployment guide before changing it. There are no fabricated ratings, offers or aggregate reviews.

## Before public launch

- Confirm the production domain and operator contact details; add a real corrections/privacy contact to About and Privacy. No address or email was invented.
- Review the supplied privacy and disclosure copy against the actual operator, jurisdiction, hosting and data practices. The current edition has no accounts, analytics, ad pixels or submission forms.
- Confirm publication rights for manufacturer photographs. Public availability is not a blanket image license; replace with your own/authorized photos if needed. Sources are documented in `ASSET-SOURCES.md`.
- Recheck specifications, OS releases, exact retailer variants, availability, and the dated hardware price.
- Activate affiliate links only after enrollment and proper product mapping.

The application stores only a theme preference (`tagrivo-theme`) in local storage. Finder answers and calculator inputs stay in memory; selected platform/printer IDs may appear in shareable URLs. There are no third-party font requests or image hotlinks.
