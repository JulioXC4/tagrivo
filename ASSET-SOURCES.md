# Asset provenance

## Approved visual authority

The user selected the first green Editorial Premium concept in the original design review. The original reference is retained locally and is not part of the public site or repository.

## Original editorial art

`public/images/editorial-hero.webp` was generated with the built-in Image Generator from the selected reference. It is a generic editorial still life, not a commercial printer. The generation prompt and original raster remain in the local, Git-ignored `design-assets/` folder. Only the optimized WebP is published.

## Current product studio renders — October 29, 2026

The owner rejected the abstract series and requested much closer product recognition. The current three visuals are AI-generated editorial studio renders made with the built-in Image Generator, each using its corresponding manufacturer photograph as a visual reference. They preserve the general silhouette, proportions, material contrast and front paper path, with fresh front-left perspective, studio lighting, blank paper and no manufacturer lettering. They are generated interpretations, not official photographs or exact hardware documentation.

| Published file                                                   | Reference                                           | Studio treatment                                            |
| ---------------------------------------------------------------- | --------------------------------------------------- | ----------------------------------------------------------- |
| `public/images/products/editorial-rollo-wireless-render.webp`    | Retained Rollo Wireless photograph listed below     | Broad white body, dark label outlet, restrained violet trim |
| `public/images/products/editorial-munbyn-itpp941-render.webp`    | Retained MUNBYN ITPP941 photograph listed below     | Black lid, compact white body, blank outgoing label         |
| `public/images/products/editorial-brother-ql1110nwb-render.webp` | Retained Brother QL-1110NWB photograph listed below | Curved dark cover, light gray base and front control row    |

All three are 1000 × 1000 WebP files, converted with FFmpeg at quality 86. Original generated PNGs and the exact prompt set remain in the ignored `design-assets/editorial-renders-2026-10-29/` folder. The built-in generator received only the respective product reference; no abstract image was used as a reference. One coherent neutral studio direction was generated and selected, rather than multiple design alternatives.

Cards and thumbnails say “Editorial render based on manufacturer references.” Product details, methodology, alt text and social-image alt metadata explicitly identify AI generation and possible visual differences. Real product facts and recommendations remain independent of the rendering. Product JSON-LD continues to omit `image` to avoid treating generated interpretation as exact product evidence.

The original manufacturer files remain outside `public/`. The superseded abstract assets are also removed from the current build. Exact 302 rules route both sets of former image URLs to the corresponding new render, avoiding Cloudflare's retained-asset behavior. Older Git history and immutable deployments are not purged.

**Rights status remains pending review.** Transforming a manufacturer reference with AI is not, by itself, proof of a republication license, copyright clearance or freedom from other rights. No written authorization was supplied and no manufacturer was contacted. The new images are not documented as rights-cleared merely because their composition, lighting or branding differs. Keep noindex and the remaining launch review in place.

## Superseded abstract series — historical record

The first replacement used original AI-generated editorial category illustrations without manufacturer references: abstract architectural paper/ceramic sculptures with blank ribbons. The owner rejected this direction. The following records describe that superseded series, not the current visuals.

| Published file                                             | Editorial concept                                          | Used alongside, not depicting |
| ---------------------------------------------------------- | ---------------------------------------------------------- | ----------------------------- |
| `public/images/products/editorial-wireless-workspace.webp` | Ivory arch, sage forms, blank paper and pine wireless arcs | Rollo Wireless X1040          |
| `public/images/products/editorial-wired-workspace.webp`    | Open ivory bridge, blank paper and an abstract cable       | MUNBYN ITPP941 USB            |
| `public/images/products/editorial-network-workspace.webp`  | Open upright frame, blank paper and three connected nodes  | Brother QL-1110NWB            |

All three are 1000 × 1000 WebP files, optimized with FFmpeg at quality 84. Their original generated PNGs and full prompt set are retained in the Git-ignored `design-assets/editorial-products-2026-10-29/` directory. The generation used `stylized-concept` prompts requesting premium, non-photographic category illustrations, an ivory/mineral-sage/deep-pine palette, white background, soft light and generous whitespace. Each prompt explicitly forbade real product silhouettes, copied controls, brands, lettering and shipping label content. Generated material is recorded as original project artwork, not as a manufacturer endorsement or an independently certified copyright clearance.

Cards, listings, Finder, comparison and product details disclose the illustrative nature. Alt text explicitly separates the concept from the named model. Product Open Graph/Twitter images use these assets and descriptive alt metadata. Product JSON-LD omits `image` because these are not pictures of the actual products. Names, factual specifications, source URLs and recommendation rules remain unchanged.

The former photograph files are removed from `public/` and the current Git tree. Local archival copies remain outside the build in the ignored directory above; older Git commits/deployments may still contain the previous assets. The current build verifies an allowlist of the three editorial files and rejects former product-photo paths. No permission requests or affiliate applications were sent. Noindex and the provisional privacy notice remain in place; remaining legal/editorial launch conditions are separate.

Cloudflare Pages initially continued serving the former URLs through its asset-retention behavior after deletion from the build. Three exact 302 rules in `public/_redirects` override those retained paths with the corresponding new editorial assets on the stable domain. These are routing safeguards, not continued copies of the old photographs. Historical immutable deployments and Git history are not purged by this replacement.

## Retired manufacturer photographs — historical provenance

Retrieved October 28, 2026 and retired October 29, 2026. The following records describe the former assets, not images currently published by the site. No Amazon imagery was scraped or downloaded. These sources identify provenance, not a republication license.

| File                                            | Manufacturer source                                                                                                                                                                                                            |
| ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `public/images/products/rollo-wireless.webp`    | [Rollo product image](https://rollo-main.b-cdn.net/wp-content/uploads/2021/11/rollo-wireless-label-printer-product-image-1-1-600x600.webp) from [official product page](https://www.rollo.com/product/rollo-wireless-printer/) |
| `public/images/products/munbyn-itpp941.jpg`     | [MUNBYN product image](https://pos.munbyn.com/wp-content/uploads/2024/02/ITPP941-1.jpg) from [official series specifications](https://pos.munbyn.com/munbyn-itpp941-series-thermal-label-printer/)                             |
| `public/images/products/brother-ql1110nwb.webp` | [Brother product page](https://www.brother-usa.com/products/ql1110nwb), `assets.brother.com/transform/9f4046a8-6b49-47d9-9023-3c78fa532d38/3931_QL1110NWB_front_featuredimagery_0-png` at width 680                            |

## Historical publication-rights review — before replacement

No written republication permission was supplied for any of the three manufacturer photographs. Source attribution and public availability do not establish a publication license. These files must not be restored to the public build without an applicable authorization. The owner chose original conceptual illustrations instead of requesting manufacturer permissions.

Brother's [US website terms](https://www.brother-usa.com/terms-of-use) expressly restrict republication of its materials without prior written permission. Treat its photograph as a priority rights-resolution item. The reviewed [Rollo terms](https://www.rollo.com/terms-of-service/) and [MUNBYN terms](https://munbyn.com/policies/terms-of-service) did not establish a specific permission for these files. This is an evidence status, not a legal determination about possible exceptions. Noindex is not a photo license or an access barrier.

| File                   | SHA-256 of retained local asset                                    | Permission evidence                  |
| ---------------------- | ------------------------------------------------------------------ | ------------------------------------ |
| rollo-wireless.webp    | `3dd45b2d69eb9ba61cd285f7fba87ebb53f3d0be417ebda517063fd1104a7f1d` | Not supplied                         |
| munbyn-itpp941.jpg     | `4252d74d13a51678ae0b752180b4ba69ea0c2e2402e76b50b87bbb3da0957fc8` | Not supplied                         |
| brother-ql1110nwb.webp | `4634da6933a4a281c4a464bedd4b6ad2c74ee53e757af1ab44485af8a30b9479` | Not supplied; US site terms reviewed |

Record the licensor, exact asset/model, date, permitted uses, territory, required credit and the actual permission document when resolved. No manufacturer has been contacted by this project.

### Options while permissions remain unresolved

At that earlier review, no newly licensed exact-model replacement was verified. Do not label an arbitrary stock printer as X1040, ITPP941 USB or QL-1110NWB. The subsequent owner-approved conceptual replacement is documented above; obtaining permission for the retired photographs is no longer the chosen launch path.

Preferred alternatives are owner-created photographs of the exact physical models with documented photographer permission, or a written manufacturer/media-kit license covering Tagrivo's editorial and future affiliate use. If neither is available, propose an original editorial still life or code-native connection diagram, clearly captioned as an illustration rather than a product photograph. The existing original editorial hero is available for generic editorial use; it does not identify any commercial model. No AI replica or unrelated stock photo should fill a product-identification slot.

Permission request draft (not sent): “Tagrivo is an independent editorial publication at https://tagrivo.pages.dev/. May we republish the specified product image for model [exact model] in buying guides and comparisons, including future affiliate-supported pages? Please confirm the licensor, permitted territory/duration, resizing/cropping rights, attribution requirements and any restrictions.” Replace the bracket with the actual asset/model, and retain the response. Do not infer permission from a lack of reply.

Manual browser review on October 29 confirmed access to Rollo's product page, MUNBYN's driver table and Shopify's supported-model list despite earlier HTTP 403 results from the automated checker. Access to those pages does not establish image-republication rights.

## Typography and icons

- DM Serif Display and DM Sans via Fontsource; their license files ship in the packages.
- Phosphor Icons, MIT-licensed; individual icon modules, regular weight.
- Tagrivo wordmark is live typography with a simple original geometric fold mark, not a generated raster logo.
