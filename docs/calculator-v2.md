# Printing cost calculator V2 · release notes

Reviewed November 5, 2026. Production route: https://tagrivo.pages.dev/cost-calculator/.

## Delivered

- One Astro route with the existing React island; no added framework, chart package, backend, paid service or account requirement.
- Editable sliders and numeric fields, three explicitly illustrative profiles, collapsed optional expenses, immediate estimates and mobile sticky feedback while editing.
- Monthly and annualized cost, stock cost per physical/usable label, consumed and wasted labels, operating cost and printer allocation. Whole-pack purchase cash is separately identified.
- Three useful views: monthly versus annualized cost, a labeled cost breakdown, and selectable volume-impact estimates. Data remains accessible as text and controls rather than relying on colour alone.
- Two setups use the same usable demand, operating days and waste. The ownership table counts hardware once and operating costs over 1–120 months. Positive-only cash-cost crossover, constant-price/volume assumptions and lifespan limitations are visible; no automatic product winner.
- Copy summary, copy share link, plain-text download and reset. Shared numeric assumptions are strictly bounded, versioned and carried in a URL fragment, restored both at load and when a share is opened in an existing calculator tab. No inputs stored in localStorage or sent to a Tagrivo endpoint. Unknown/malformed shares keep the current editable assumptions with a message.
- Relevant guide links and calculator explanations/FAQs, canonical and unique metadata. Existing WebPage JSON-LD remains valid. No unsupported FAQ rich-result claims or invented review markup.
- Eight independent Pinterest PNGs, editable artboards, exact destinations, fixed UTMs, alt text, publication copy, asset manifests and permission references in `marketing/pinterest/2026-11/`. Manual publication only.

## Formulas and limits

Usable labels = daily usable labels × days per month. Consumed stock = ceiling(usable / (1 − waste / 100)); a machine-precision adjustment avoids adding a label from floating-point noise. Waste cost = (consumed − usable) × pack price / pack count and is already included in consumption.

Operating monthly = consumption + maintenance + (monthly kWh × tariff) + other monthly expenses. Monthly estimate = operating + hardware price / user-estimated life months. Annualized = 12 × that representative month. The allocation is not a repeated payment.

Scenario ownership cost = purchase once + operating monthly × period, without adding allocation again. A positive crossover solves the two linear cash-cost lines; zero/negative/undefined crossings are not shown as break-even. No financing, discounting, taxes, postage, labour or automatic replacement. Continuous consumption is valued proportionally; pack purchases round up separately. Displayed currency rounds last, generally to two decimals and four for unit costs. Per-usable-label cost is unavailable at zero demand; fixed costs still apply.

Optional electricity is not inferred from nominal printer wattage. All profile prices and lifespans are illustrative editable values. Maximums and integer requirements are enforced consistently in UI, math and share parsing.

## Consent-gated measurement

Existing `cost_calculator_used` is retained. Added name-only signals: `cost_calculator_preset_used`, `cost_calculator_compare_used`, `cost_calculator_shared`, `cost_calculator_summary_copied`, `cost_calculator_downloaded`, `cost_calculator_comparison_click`. Each is counted at most once per document after consent, not replayed from actions before acceptance. Existing Amazon events and links are preserved; no new direct affiliate links inserted in the calculator.

New public Pinterest campaign IDs `calc_v2_01`–`calc_v2_08` use the existing campaign allowlist. No numeric quotes, answers, model selections, arbitrary UTM text, URL queries or fragments enter calculator event payloads. Privacy explains optional copy/download/share actions without changing the approved operator identity or retention policy.

Browser test with Google's script intercepted: zero GA script requests/events before acceptance and after rejection; after acceptance, one script request and expected name-only events with sanitized page_location. This proves dispatch/consent behaviour; it does not establish receipt in the private GA4 Realtime report. Confirm that report personally if needed; no credentials requested.

## Verification evidence

| Check | Result |
| --- | --- |
| Unit tests | 56 passed, including known cost examples, rounding, zero/invalid input, cash crossover, share parsing and analytics allowlists |
| TypeScript / Astro | 0 errors, warnings or hints; 25 prerendered HTML routes |
| Release audit | Configured credential/private-file scan passed; approved legal values remain in private build environment |
| Generated-site audit | Local links/assets, unique metadata, H1, JSON-LD, canonical, robots/sitemap, exact Google verification and affiliate attributes passed |
| Desktop/tablet/mobile | 1440/820/390 px; no horizontal page overflow; light and dark captures inspected |
| Controls | Known $60/month and $0.0600/usable-label case; sliders by keyboard; zero/invalid input; profile/reset; two setups; shared restore; clipboard summary/link; downloaded text |
| Mobile feedback | Sticky $/month and $/label strip stays above editing controls and links to full estimate |
| Reduced motion | Native preference disables optional transitions; charts use transforms rather than animated layout widths |
| Bundle | Calculator module approximately 21 KB raw / 6.9 KB gzip in checked build; no chart dependency or new image requests on tool route |
| Pinterest | Eight distinct 1000×1500 PNGs, sources/fonts loaded; seven unique destination routes HTTP 200; original commercial-photo SHA preserved |

Browser fallback: integrated browser disabled; user explicitly authorized Playwright. Visual audit began from the actual production calculator before edits. Source and destination captures are stored outside the repository in the task visualization workspace; build, test and detector logs are local ignored files in `.impeccable/review/`.

Impeccable: mechanical review found two layout-width transitions, replaced with transform motion; type advisories reflect local sizes within the established editorial world. Finish reviewer’s sole material mobile-feedback fix was resolved, verdict `ship` for that scored fix. Documenter preserved DESIGN.md and its sidecar, checking the actual CSS and component; pre-existing historical product/legal/image guidance drift was not rewritten. No claim of a complete WCAG certification or field Core Web Vitals assessment follows from these checks.

## Main files

- `src/components/Calculator.tsx`, `src/lib/printing-costs.ts`, `src/styles/calculator.css`: isolated UI, calculations/share rules and route-specific styles.
- `src/pages/cost-calculator.astro`: metadata, static explanation, worked example and FAQs.
- `src/lib/analytics.ts`, `src/scripts/analytics.ts`, `tests/analytics.test.ts`: fixed event/campaign allowlists and consent reuse.
- `tests/printing-costs.test.ts`: mathematical and sharing tests.
- `src/content/guides/{printing-costs,choose-label-printer,etsy-4x6-label-size}.md`: accurate calculator descriptions and internal links.
- `src/pages/privacy.astro`: actual local/share/download behaviour and event descriptions; operator values remain environment-driven.
- `tsconfig.json`: excludes the independent marketing workspace from Astro's typecheck; no Remotion source changed.
- `.gitignore`: excludes pre-existing Short productions from this web release. Earlier MP4s remain local and intact.

Deployment uses the existing main → Cloudflare Pages integration. IndexNow remains independent and compares actual production fingerprints after successful deployment. No manual duplicate batch is sent. Actual release commit and public HTTP/deployment results are reported after the push, rather than assumed here.
