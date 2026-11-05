---
title: "Thermal Printer Setup Problems: Diagnose Before Replacing"
seoTitle: "Thermal Printer Setup Problems: Diagnose Before Replacing"
description: "A documented checklist for thermal printers not detected, wrong-size labels, wireless issues and blurry barcodes. Separate app, driver, media and hardware faults."
category: Shipping problems
date: 2026-11-05
readingTime: 3
---

A failed shipping-label print can begin in the source PDF, the application, the driver, the connection or the stock. Replacing hardware before identifying that layer can leave the same problem in place.

**Start with the exact model and print route, then inspect the document.** Use the [Thermal Printer Troubleshooter](/tools/printer-troubleshooter/) for a device-specific starting checklist. It does not connect to your printer, inspect parcels or perform remote repairs. These are documented checks rather than repairs we have tested on customer equipment.

## Printer not detected: identify the connection first

Confirm power and read any status indication in the exact manual. For USB, use a data-capable cable and the active printer queue. Rollo documents that switching USB ports can create another queue, leaving a print dialog pointed at the old instance.

For mobile Bluetooth, first verify that this particular printer and app support printing. Rollo Wireless uses Bluetooth during Wi-Fi setup; it is not a direct Bluetooth print route. The USB MUNBYN ITPP941 cannot acquire Bluetooth by installing the 941B app. The [connection guide](/guides/usb-wifi-bluetooth/) keeps these cases separate.

## Too small or cut off: inspect the PDF before the printer

Obtain the original shipping PDF and inspect its page dimensions. A label placed on a Letter-size page is not the same file as a native 4 × 6 document. Match document, stock and driver paper size. Do not enlarge a screenshot until a barcode looks right.

True 4 × 6 stock is 101.6 × 152.4 mm; 100 × 150 mm stock is smaller. Margins and forced 100% scaling can expose the difference. The [label preview](/tools/label-preview/) demonstrates those relationships using fictitious data. It cannot certify a carrier label or replace the model’s print-area specification.

For marketplace-specific source restrictions, read the [Etsy size checklist](/guides/etsy-4x6-label-size/) and [platform workflow guide](/guides/etsy-shopify-ebay/). Do not transfer Etsy’s documented USPS format rules to every carrier.

## Wireless: a radio is not an application workflow

For Wi-Fi, check local network discovery and whether a guest network isolates devices. An internet connection does not prove two local devices can communicate. AirPrint is a network route, not Bluetooth.

For MUNBYN ITPP941B, the supported mobile route uses Munbyn Print. Windows Bluetooth uses its dedicated driver, with a documented ARM restriction. Phomemo PM241-BT uses Labelife for phone printing. Neither app route guarantees that a marketplace’s own app can send a print job directly.

Use the original manufacturer instructions for pairing. Avoid applying a reset or button sequence from a visually similar model.

## Blurry barcode: preserve the source and check stock

Use the original PDF rather than a compressed screenshot. Confirm the correct stock, loading and documented darkness / speed settings. Change one setting at a time and inspect a sample before printing a batch.

Cleaning must follow the exact manual. Do not improvise solvents or touch a hot printhead. A sharper-looking barcode does not establish carrier acceptance; use the shipping provider’s requirements. Tagrivo does not offer barcode grading or guarantee scan performance.

## Driver errors: use the exact download

Match model, operating-system release and CPU architecture. Use official support downloads instead of driver-update advertisements. Do not disable system security to force an unsupported installation. An older model and its c-suffix successor can have different support.

If the documented workflow still fails, contact the manufacturer with the model, OS version and error text. Avoid posting unredacted shipping labels or recipient addresses publicly. For a purchase driven by incompatibility, [check the Finder](/printer-finder/) before choosing a replacement.

## Official references

Reviewed November 5, 2026:

- [Rollo active USB queue / nothing prints](https://support.rollo.com/support/solutions/articles/29000041014-nothing-happens-when-i-try-to-print)
- [Rollo Wireless setup requirements](https://support.rollo.com/support/solutions/articles/29000039959)
- [MUNBYN Windows Bluetooth instructions and ARM restriction](https://support.munbyn.com/hc/en-us/articles/54258310492563--Bluetooth-connection-method-How-to-connect-the-devices-using-Bluetooth-on-Windows)
- [Brother QL-1100 manual](https://download.brother.com/welcome/docp100363/ql-1100_use_ug_03.pdf)
- [Phomemo PM241-BT software and support links](https://phomemo.com/products/pm-241bt)

