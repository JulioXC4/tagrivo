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
| `src/lib/affiliate.ts`              | Verified catalog identities, registered Store ID and direct sponsored URLs                   |
| `src/layouts/`                      | Metadata, global navigation, theme and editorial layout                                      |
| `src/styles/global.css`             | Approved design tokens, responsive and print styles                                          |
| `public/images/products/`           | Reference-based AI editorial studio renders with explicit disclosure                         |
| `public/images/editorial-hero.webp` | Original AI editorial image, 1000 × 1250, about 94 KB                                        |
| `design-assets/`                    | Hero original and exact generation prompt/provenance                                         |
| `tests/logic.test.ts`               | Meaningful compatibility, budget, media-cost and affiliate tests                             |

React hydrates only the interactive tools. The home Finder invitation is a native HTML radio form, so it works before JavaScript loads and the home page needs no React runtime. The shared Amazon CTA is server rendered on editorial pages without hydration. Editorial navigation and theme use a small Astro script. Fonts are self-hosted Latin subsets of DM Serif Display and DM Sans. Product visuals are disclosed AI editorial renders, not official photographs or exact hardware evidence.

## Product research and recommendations

The initial catalog covers Rollo Wireless X1040, MUNBYN ITPP941 **USB / 203 dpi**, and Brother QL-1110NWB. Source documentation was reviewed on October 29, 2026. Read the public methodology for the precise recommendation rules. This is document research, not hands-on testing.

Rollo's Bluetooth-assisted setup is not treated as direct Bluetooth label printing. Mobile USB and unverified Mac/mobile Bluetooth combinations are excluded. OS categories do not promise compatibility with every release. ChromeOS extension requirements and Brother's NWB/NWBc distinctions remain explicit.

Dated US manufacturer references are Rollo $279.99 and Brother $334.99 (October 29, 2026). Brother's page marked the model out of stock at that check. These are not live offers. MUNBYN's exact USB variant still has no verified price. The Finder excludes a known reference above the cap and flags unknown prices. Windows ARM restrictions, carrier-specific formats and exact platform-supported model names must be checked independently of a general OS or marketplace category. Volume changes batch/media guidance, not an unsupported durability rating.

Calculator defaults are illustrative assumptions. It models one label per order, 52 weeks per year, whole-label rounding after accounting for waste, and a one-time hardware purchase. Consumption is valued proportionally; whole-pack outlay may be higher. It excludes postage, tax, repairs, energy, subscriptions, financing and labor.

### Add or update a printer

1. Add a complete typed entry in `src/data/printers.ts`; do not merge facts across model variants.
2. Verify the exact model's official specifications and current driver matrix. Record sources and check date.
3. Add disclosed editorial artwork or an appropriately licensed exact-model photograph. Document references, generation and rights status in `ASSET-SOURCES.md`; do not describe AI renders as official photographs or exact hardware evidence.
4. Review `recommend.ts` whenever adding a new device or connection behavior. Do not assume the existing rules generalize to a different product family.
5. Run `npm run verify` and exercise the Finder, comparison and product page.

### Add an article

Create a Markdown file under `src/content/guides/` with title, description, category, date, readingTime and optional featured flag. Use `updated` for the actual revision date and optional `seoTitle` for a specific search title. Keep the original publication date. The file name becomes its URL. Use `##` headings for the automatic table of contents. Cite manufacturer evidence, distinguish opinion from facts, and do not add test claims unless actual test evidence exists.

## Amazon Associates

The owner supplied registered US Store ID `tagrivo-20`. The three exact listing identities, variants, documentary check dates and sources are centralized in `src/data/amazon.ts`. `PUBLIC_AMAZON_ASSOCIATE_TAG` is optional and must match that registered ID if set; a stale different ID fails the build. Manufacturer evidence links remain available independently.

`AmazonCTA.tsx` supplies direct links with visible Paid link disclosure and `rel="sponsored nofollow noopener noreferrer"` on cards, product pages, Finder results, Compare and five relevant guides. The exact Amazon Associate sentence appears in the footer and editorial disclosures. A listing marked unverified does not produce a purchase link. No Amazon price, image, review or API integration is used. Automated link checks deliberately never request Amazon destinations. See [MONETIZATION-PERU.md](MONETIZATION-PERU.md) for identity evidence and the owner's remaining account steps, and [PRIVACY-OPERATIONS.md](PRIVACY-OPERATIONS.md) for privacy and retention. Registration is not final program approval; Privacy remains provisional and indexing stays disabled until its legal launch gate is resolved.

## Cloudflare Pages

This is a static project; an SSR adapter and Cloudflare Functions are unnecessary.

The repository is [JulioXC4/tagrivo](https://github.com/JulioXC4/tagrivo). Follow [DEPLOYMENT.md](DEPLOYMENT.md) for the complete first-deploy, authorization, preview, update and launch procedure.

Use the Pages Git integration, branch `main`, build command `npm run verify`, output `dist`, `NODE_VERSION=24` and `SITE_INDEXING=disabled` in both Production and Preview. Keep the Free plan. No Cloudflare API token, Wrangler dependency, database, Functions or paid hosting is needed. The GitHub verification workflow is manual; automatic verification runs in Cloudflare before each publication.

The first deploy derives canonical/Open Graph/schema URLs from Cloudflare's actual `CF_PAGES_URL`. After the assigned stable `pages.dev` URL is known, set `PUBLIC_SITE_URL` to that origin and rebuild. Preview branches always use their own deployment URL and remain noindex. Local builds default to localhost. No ownership of a brand domain is assumed.

Indexing is disabled by default with HTML metadata and an HTTP header generated into `dist/_headers`. Preview builds publish no sitemap; robots permits reading the noindex. Only explicit `SITE_INDEXING=enabled` plus a confirmed HTTPS origin enables production sitemap/indexing. See the deployment guide before changing it. There are no fabricated ratings, offers or aggregate reviews.

## Before public launch

- Tagrivo is an independent editorial project developed under JC Labs, the creator's personal brand for digital projects. The authorized public contact is `hello.jclabs@gmail.com`. Neither brand is presented as an incorporated company. Legal operator/data-controller details and policy review remain pending; complete them before enabling indexing.
- Review the supplied privacy and disclosure copy against the actual operator, jurisdiction, hosting and data practices. The current edition has no accounts, analytics, ad pixels or submission forms.
- The manufacturer photographs and rejected abstract series are retired from the build. Current studio renders use the corresponding manufacturer references, with explicit AI disclosure and possible-detail differences. Reference-based generation does not automatically establish rights clearance. See `ASSET-SOURCES.md`.
- Recheck specifications, OS releases, exact retailer variants, availability, and the dated hardware price.
- Activate affiliate links only after enrollment and proper product mapping.

With optional analytics disabled, the application stores only a theme preference (`tagrivo-theme`) in local storage. Finder answers and calculator inputs stay in memory; selected platform/printer IDs may appear in shareable URLs. There are no third-party font requests or image hotlinks.

## Google readiness and measurement

`PUBLIC_GOOGLE_SITE_VERIFICATION` optionally renders an actual HTML verification token supplied by the owner for a Search Console URL-prefix property. Set only the token in Cloudflare's Production environment and rebuild; do not paste a whole meta tag or invent an ID. Verification does not remove noindex. Keep `SITE_INDEXING=disabled` until the remaining editorial/legal launch conditions and explicit owner approval are resolved. Current product visuals are reference-based AI editorial renders; reference rights remain part of launch review. No Search Console account, ownership verification or indexing request is performed by the source code.

Follow [SEARCH-CONSOLE.md](SEARCH-CONSOLE.md) to verify the exact `https://tagrivo.pages.dev/` URL-prefix property personally using the prepared HTML-tag method, without sharing Google credentials.

Analytics remains inactive. An optional GA4 adapter uses manufacturer/affiliate CTAs marked with `data-link-kind` and `data-printer-id`. To activate later, supply a genuine `PUBLIC_GA4_MEASUREMENT_ID`, complete policy review and explicitly set both `PUBLIC_ANALYTICS_POLICY_APPROVED=true` and `PUBLIC_ANALYTICS_ENABLED=true`. No Google tag loads before reader consent. DNT/GPC prevent measurement; page events omit query strings/referrers and product events contain only public model/type/hostname. No tool answers are sent. Test actual reception before claiming tracking works. See [MEASUREMENT.md](MEASUREMENT.md).

Ten guides are maintained in the content collection; see [CONTENT-AUDIT.md](CONTENT-AUDIT.md) for intent, sources and scope. Follow the two-group [launch checklist](LAUNCH-CHECKLIST.md) before enabling indexing. [MONETIZATION-PERU.md](MONETIZATION-PERU.md) records the manual account, tax, payment and product-mapping requirements for Amazon.com Associates from Peru. No analytics account, legal identity or affiliate ID was invented.
