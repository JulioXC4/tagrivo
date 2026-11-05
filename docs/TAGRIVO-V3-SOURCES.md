# Tagrivo V3: product and image evidence

Reviewed 2026-11-05. Documentary verification, not hands-on testing. This supersedes the October product-render section of ASSET-SOURCES.md for the website. Video/Pinterest archives are not replaced.

## Image rights and identity

| Exact model | Current website asset | Evidence / limitation |
|---|---|---|
| Brother QL-1110NWB (not NWBc) | `public/images/products/authorized/brother-ql1110nwb.jpg` | Official Brother Canada Marketing Library; exact model marked on product. Original 1800-square JPEG; unchanged. |
| Brother QL-1100 (not QL-1100c) | `public/images/products/authorized/brother-ql1100.png` | Same official library; exact front label and four-button Editor Lite arrangement. Original 960-square PNG; unchanged. |
| Rollo X1040 and X1038 | `public/images/products/category-shipping-label.svg` | Original Tagrivo format diagram, explicitly not a printer photo. Official-photo republication license not established. |
| MUNBYN ITPP941 USB203 white and ITPP941B203 | Same diagram | No exact-model commercial photo grant established. Family images do not prove a suffix/resolution. |
| Phomemo PM241-BT203 | Same diagram | No photo reuse grant established. No picture of another Phomemo model substituted. |

Library: https://www.brother.ca/en/media-room
Terms: https://www.brother.ca/cms/files/Brother_Canada_Logo_Guidelines_EN.pdf

The grant covers promotion of Brother products/programs/promotions and prohibits alterations. We display the original product files proportionally, on a white image well, with no AI edits, recoloring, cropping, new perspectives or standalone corporate logo artwork. The standalone-logo approval clause is separate; no corporate logo asset is republished. This is a limited promotional use, not a stock-photo license. Recheck the terms if use changes.

Original QL-1110NWB URL: https://cdn-tp1.mozu.com/21830-33325/cms/33325/files/888c89fa-7927-435c-af6b-dd9dfa8c65e5
SHA256: `835cdb871c7046739f7d997e9c2463e99983cedde5f369cfbf3c01b66bae6d64`

Original QL-1100 URL: https://cdn-tp1.mozu.com/21830-33325/cms/33325/files/47570aa2-3147-4856-9e42-3d4b10da8ff7
SHA256: `3c3c403bcd52811893dff32fad280e91765021113b50a7a57644f0cc3c351687`

Each has one authenticated view. No five-image gallery is fabricated. The originals are not recompressed or annotated with metadata because the usage terms prohibit changes; this sidecar records provenance and the build verifies the hashes. Existing generated hero art remains category artwork. Superseded model-like product renders are removed from public assets and old URLs redirect to current honest visuals. No Image Generator transformation was appropriate under the verified rights.

Other terms examined (public access or affiliate enrollment is not photo permission):
- https://www.rollo.com/terms-of-service/
- https://www.rollo.com/affiliate/
- https://munbyn.com/policies/terms-of-service
- https://phomemo.com/policies/terms-of-service
- https://phomemo.com/pages/phomemo-affiliate-programme

## Model facts and routes

`src/data/printers.ts` contains per-model sources and review dates. `src/data/workflows.ts` is the shared route matrix used by catalog, Finder and troubleshooting. Interface availability and verified OS-specific print routes are separate.

- Rollo X1038: USB, 203 dpi, rated150 mm/s, external generic direct-thermal media. https://www.rollo.com/intro-print/ and https://rollo-main.b-cdn.net/wp-content/uploads/2022/09/Rollo-USB-User-Guide.pdf . USB Windows/macOS are included; no direct USB phone route is inferred. Linux mentioned on the manufacturer comparison is outside the current Finder OS choices.
- Rollo X1040: existing sourced entry preserved. Bluetooth setup is not printing. Standard Android phone route has a 4×6 restriction; Windows ARM driver caveat remains.
- MUNBYN ITPP941B203: exact table, not family headline: https://pos.munbyn.com/munbyn-itpp941-series-thermal-label-printer/ . USB+Bluetooth,203dpi,150mm/s,108mm print width. https://munbyn.com/products/bluetooth-thermal-label-printer-941b identifies retail SKU ITPP941B-WH-US. Physical dimensions conflict between pages; omitted rather than guessed.
- MUNBYN drivers: https://support.munbyn.com/hc/en-us/articles/6092502480787-Printer-Drivers-SDK-Download . Phone app: https://support.munbyn.com/hc/en-us/articles/29278403182355--Bluetooth-models-How-to-connect-the-device-on-the-Phone . Windows Bluetooth/ARM exclusion and Mac USB: https://support.munbyn.com/hc/en-us/articles/54258310492563--Bluetooth-connection-method-How-to-connect-the-devices-using-Bluetooth-on-Windows . Browser-specific Munbyn Editor support is not system-wide Mac Bluetooth driver support; conservative matching uses USB on Mac.
- Phomemo PM241-BT: https://phomemo.com/products/pm-241bt .203dpi,150mm/s,4×6,Labelife mobile Bluetooth,computer USB. Width ranges conflict within the page; no settled non-4×6 range is claimed. HUOJI media warning retained. Desktop Bluetooth is not asserted without an exact OS workflow.
- Brother QL-1100: https://www.brother-usa.com/p/label-printers/QL1100 ; manual https://download.brother.com/welcome/docp100363/ql-1100_use_ug_03.pdf .300dpi,110mm/s,USB,DK media,cutter; no Wi-Fi/BT/Ethernet. Automatic Crop Windows-only.
- Brother paired brochure: https://assets.brother.com/asset/99182938-c310-4b42-b03f-7b9498f1d643/12442_BRO8665-1-QL1100QL1110nwbBrochure-Collection-052418-V3-pdf.pdf . DK-1247 is4.07×6.4in, not exactly4×6; DK-2205 continuous is2.4in wide.69 labels/min is not a4×6 throughput measurement. QL-1110NWB’s existing OS/support caveats remain.

## Amazon identity checks

Normal public detail-page inspection, not scraping, price extraction or paid API use. Existing three exact child-ASIN links remain unchanged. Added two identity-verified listings:
- X1038: https://www.amazon.com/dp/B01MA3EYC5 — item details identify Rollo,X1038,series1038 and thisASIN.
- QL-1100: https://www.amazon.com/dp/B079G51QTB — item details identify Brother,QL1100,seriesQL-1100 and thisASIN.

`tagrivo-20` remains centralized. No current price/stock is reproduced. MUNBYN941B remains without a purchase CTA until the exact child variant is verified. Candidate Phomemo B0BRMRD91W identifies241BT-PINK-GM/pink: not silently reused for an unspecified/white variant. It is not activated. Existing dated manufacturer prices retain dates/caveats; new entries have no price.

## Zebra next-model assessment (not published as a catalog entry)

https://www.zebra.com/us/en/products/printers/desktop/zd400-series/zd421.html
https://www.zebra.com/content/dam/zebra_dam/en/tech-specs/zd421-tech-specs-en-us.pdf
https://www.zebra.com/content/dam/support-dam/en/documentation/unrestricted/guide/product/zd421-zd621-ug-en.pdf

Separate ZD421d direct-thermal from ZD421t transfer and ZD421c cartridge. Resolution and installed connectivity are SKU-specific.203dpi maximum152mm/s;300dpi variant maximum102mm/s. USB/USBHost are standard; Ethernet/serial/Wi-Fi/Bluetooth Classic are options. BLE setup/light transfer does not imply every mobile label-printing route. Before inclusion: select exact DT SKU, installed interfaces, supported driver/app, authorized photo and valid listing. No fake general-purpose ZD421 buy button is shipped.

## Editorial and search scope

Six useful new guides cover exact Rollo, MUNBYN and Brother pairs; Phomemo routes; compatible media; setup faults. Existing Etsy sizing and USB/Wi-Fi/Bluetooth guides were extended instead of duplicated. Original ten URLs remain. Buyer comparisons and troubleshooting match separate intents; general connection/OS/platform guides remain hubs.

Free research was based on manufacturer search results and documented buyer questions. Existing owner-provided Bing numbers are keyword-research impressions, not Tagrivo traffic; no new volume, difficulty, conversion or traffic forecast is invented. Narrow exact-variant queries are chosen for utility, not claimed measurable demand.

## External blocks

To replace the five remaining category panels with real photos requires an express suitable license or owner-created exact-model photographs. No payment is required by the code, and no permission request is sent automatically. For941B/Phomemo monetization, verify the exact selected Amazon child listing. Accessory SKUs and holders need exact fit evidence before adding purchase links. Manufacturer source contradictions remain disclosed.
