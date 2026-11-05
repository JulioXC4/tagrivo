# Exact-product photo correction ·2026-11-05

## Current status

**Owner has explicitly requested public Cloudflare deployment. Photo reuse/edit rights remain unverified.** No manufacturer authorization has been invented. The previous live version is not claimed to contain these corrections until a real deployment is completed. See PRODUCT-PHOTO-REGISTRY.json for per-file sources, model mapping and hashes.

## Work performed

The rejected4×6 diagrams are removed from product slots. Five manufacturer-sourced exact-model images now replace them across the shared catalog, home shortlist, Finder, Compare and detail pages. The two Brother library originals remain byte-identical. All existing seven model entries, filters, five-step Finder, two new tools, sixteen guides, cost calculatorV2, affiliate links, SEO, consent and IndexNow are retained; they were already implemented and were not rebuilt.

The built-in Image Generator was used on the Rollo X1040 and MUNBYN USB source images. Those full-product edits were rejected because they reinterpreted fine details. The fallback explicitly requested by the owner is used: genuine manufacturer product pixels, proportionally scaled and composited over an Image Generator studio background. No generated product layer, new logo, reconstructed button or invented perspective ships in the local preview. The original product area is preserved in lossless masters; background matting is restricted to the outer subject/background boundary. Subsequent WebP compression is an ordinary optimized export, not AI enhancement.

The original alpha cutout of X1040 provides a genuine three-quarter view; its separate front source is an additional view. X1038 has a separate original three-quarter source. The two MUNBYN detail views are ordinary crops of their own source photographs; USB941 and Bluetooth941B are not interchangeable. Phomemo uses the official white/lavender finish. No pink ASIN is activated for that image. Brother remains unchanged. Where one view is available, no fake five-angle gallery is fabricated.

## Local resource paths and repeatability

Originals, full prompts, rejected candidates, lossless masters, background plate and pixel-preservation measurements are retained under the ignored `design-assets/product-studio-2026-11-05/` directory. `compose.py` implements the owner-requested exact-cutout fallback. It records zero RGB difference on the fully opaque product core relative to the proportionally resized source before optimized export. This is a bounded numerical check, not a guarantee about unphotographed hardware details or legal rights. The approved source photographs are the authority for logos, outlines, buttons, colors and sample paper.

## Rights evidence — not cleared by background editing

- Rollo source: official product pages. Its terms retain intellectual-property rights and restrict logo use/derivatives under its service agreement. No express photo/edit grant for Tagrivo has been supplied. https://www.rollo.com/terms-of-service/
- MUNBYN: its Copyright section restricts commercial use, editing and republication without express written consent. The images are manufacturer sources, not proven commercially licensed resources. https://munbyn.com/policies/terms-of-service
- Phomemo: the website terms restrict copying/commercial republication without prior written consent. No exact-photo permission was supplied. https://phomemo.com/policies/terms-of-service
- Brother: existing Marketing Library terms allow Brother product promotion and prohibit changes. Both originals are untouched; no Image Generator edit of Brother is made. https://www.brother.ca/cms/files/Brother_Canada_Logo_Guidelines_EN.pdf

Public source access, Amazon Associates enrollment, attribution and an AI-generated background are not evidence of a manufacturer photo-use license. Do not mark these assets as authorized. The owner subsequently requested public deployment despite this recorded rights limitation; the release warning preserves that distinction. No manufacturer was contacted automatically.

Minimal next step: supply an existing express reuse/edit authorization for the listed files, or obtain a suitable grant / owner-created exact-model photograph. A permission request can be made without paying for photography; it has not been sent. Written text should identify Tagrivo, exact images, affiliate-supported editorial pages, cropping/resizing/background compositing and any required credit. Keep the response with the asset record.

Owner confirmed on2026-11-05: no written authorization. The owner subsequently instructed public deployment; this is not evidence of a photo-use license.


## Verification completed

Local verification:70tests pass, Astro check0errors/0warnings/0hints,40HTMLpages built and39canonical public-page fingerprints. All seven detail pages captured at1440desktop/light and390mobile/dark; original photos decoded and the four available additional-view panels opened. No horizontal document overflow in those captures. These are local checks, not a public deployment verification. The existing public version has not been changed. Runtime photo approval guard is separate from production SEO and never disables the current site's analytics or indexing.

Source originals and the two discarded full-product edits are not in the public folder. Only selected optimized backgrounds/original-product composites are integrated locally. No new model, article, affiliate ASIN or feature was added during this correction; the already-published expansion is preserved.

## Permission request text (not sent)

Subject: Product-photo use and studio background composition for Tagrivo

Hello, I run Tagrivo (https://tagrivo.pages.dev/), an independent buying-guide website supported by affiliate links. May I republish the original product photographs listed below on the corresponding product, comparison and guide pages? I would preserve the photographed product, logos and physical details; edits would be limited to proportional resizing, detail crops and compositing the original product on a neutral studio background. Please confirm whether this commercial editorial use and editing are permitted, any required attribution, and the applicable territory/duration. I will not imply endorsement. Images/models: [insert the exact source URLs for your brand from PRODUCT-PHOTO-REGISTRY.json]. Thank you.

The placeholder belongs to an unsent internal draft, not a website UI or a license. No account connection, email service or paid subscription was installed.


### Independent finish review correction

The reviewer identified a residual white fringe in the Phomemo matte. Final Phomemo uses the intact manufacturer packshot with its original white background and real shadow, cropped only in empty surrounding space and proportionally resized. This avoids altering the pale body boundary. It is described as the original white/lavender model image, not an AI studio re-photograph. The other four compositions retain the background-only Image Generator approach. No extra branded logo was added. Public rights status is still pending.

Final selected exports:9WebP files, approximately40–70KB for the five hero images and11–18KB for the three detail/perspective crops (exact sizes in local verification JSON); Brother originals unchanged. Existing affiliate mapping, recommendation logic, analytics/consent and calculator files have no diff. At completion of local QA, no push or deployment had been performed.

## Repository handoff requested by owner

The owner subsequently requested uploading this reviewed correction to main. The repository handoff does not establish image permissions: all five records remain `not_established`, and the Cloudflare build guard remains active. A push will trigger the existing workflow, but the new web deployment is intentionally blocked until the recorded publication prerequisite is resolved. The currently published site remains online. No private source originals, discarded AI candidates or local environment files are included.

## Public release requested by owner

On 2026-11-05 the owner explicitly requested Cloudflare publication after being informed of the pending photo rights. The build now emits a non-blocking rights notice instead of failing. No asset is relabeled as licensed; all five source records retain `not_established`. Historical local-QA and repository-handoff sections above describe earlier stages. Production SEO, analytics/consent, affiliate links and the existing GitHub–Cloudflare flow are unchanged. Public deployment must still be verified after the push.
