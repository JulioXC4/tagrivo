import { productPhotography } from './product-photography.ts';
export type OperatingSystem = 'windows' | 'mac' | 'ios' | 'android' | 'chrome';
export type Connection = 'usb' | 'wifi' | 'bluetooth' | 'any';
export interface Printer {
  id: string;
  brand: string;
  name: string;
  model: string;
  image: string;
  imageAlt: string;
  fit: string;
  description: string;
  dpi: number;
  speed: number;
  width: string;
  connections: Exclude<Connection, 'any'>[];
  ethernet: boolean;
  systems: OperatingSystem[];
  media: string;
  cutter: boolean;
  price: number | null;
  priceChecked: string | null;
  priceNote: string;
  strengths: string[];
  limitations: string[];
  setup: string;
  sources: { label: string; url: string }[];
  checked: string;
}

export const printers: Printer[] = [
  {
    id: 'rollo-wireless',
    brand: 'Rollo',
    name: 'Rollo Wireless',
    model: 'X1040',
    image: '/images/products/studio/rollo-x1040-hero.webp',
    imageAlt: productPhotography['rollo-wireless'].alt,
    fit: 'For a flexible, wireless workspace',
    description:
      'A compact Wi-Fi option for sellers who switch between a computer and a phone. Standard direct-thermal media keeps your label choices open.',
    dpi: 203,
    speed: 150,
    width: 'Label width: 1.57–4.1 in (media range)',
    connections: ['usb', 'wifi'],
    ethernet: false,
    systems: ['windows', 'mac', 'ios', 'android', 'chrome'],
    media: 'Generic direct-thermal rolls or fanfold',
    cutter: false,
    price: 279.99,
    priceChecked: '2026-10-29',
    priceNote:
      'Manufacturer page showed $279.99 on October 29, 2026. A dated US reference, not a live offer; confirm tax, delivery and availability.',
    strengths: [
      'Wi-Fi and Apple AirPrint',
      'USB fallback for a wired workstation',
      'Uses generic direct-thermal label stock',
    ],
    limitations: [
      '203 dpi rather than 300 dpi',
      'Bluetooth is used for setup, not direct label printing',
      'Labels feed externally; allow desk space behind the printer',
    ],
    setup:
      'App-assisted setup uses Bluetooth to join Wi-Fi; Rollo also documents setup without a phone. Devices must share the network. Standard Android phone printing is limited to 4 × 6. The Rollo Windows driver does not support ARM-based PCs; confirm an appropriate workflow before buying.',
    sources: [
      {
        label: 'Rollo product specifications',
        url: 'https://www.rollo.com/product/rollo-wireless-printer/',
      },
      {
        label: 'Rollo wireless setup and device requirements',
        url: 'https://support.rollo.com/support/solutions/articles/29000039959',
      },
    ],
    checked: '2026-10-29',
  },
  {
    id: 'munbyn-itpp941',
    brand: 'MUNBYN',
    name: 'MUNBYN ITPP941',
    model: 'USB · 203 dpi version',
    image: '/images/products/studio/munbyn-itpp941-usb-hero.webp',
    imageAlt: productPhotography['munbyn-itpp941'].alt,
    fit: 'For a dedicated desktop setup',
    description:
      'A straightforward USB model for a fixed packing desk. Choose this exact wired variant if you want a computer connection without wireless setup.',
    dpi: 203,
    speed: 150,
    width: 'Maximum print area: 108 mm (about 4.25 in)',
    connections: ['usb'],
    ethernet: false,
    systems: ['windows', 'mac', 'chrome'],
    media: 'Generic direct-thermal rolls or fanfold',
    cutter: false,
    price: null,
    priceChecked: null,
    priceNote: 'Current price is unverified; check the exact USB variant.',
    strengths: [
      'Direct USB connection',
      'Generic direct-thermal media',
      'Windows and macOS drivers; Chrome extension available',
    ],
    limitations: [
      'This USB model has no Wi-Fi or Bluetooth',
      'No verified direct iOS or Android printing for this variant',
      '941-series variants differ; match the full model and resolution',
    ],
    setup:
      'Install the manufacturer driver on Windows or macOS. ChromeOS uses the manufacturer-linked Chrome extension; confirm your device and browser meet its requirements. The current driver table does not list a Linux download for this model.',
    sources: [
      {
        label: 'MUNBYN ITPP941 USB parameter table',
        url: 'https://pos.munbyn.com/munbyn-itpp941-series-thermal-label-printer/',
      },
      {
        label: 'MUNBYN drivers and Chrome extension',
        url: 'https://support.munbyn.com/hc/en-us/articles/6092502480787-Printer-Drivers-SDK-Download',
      },
      {
        label: 'MUNBYN ITPP941 roll and fanfold media guidance',
        url: 'https://ca.munbyn.com/blogs/news/choose-label-printers',
      },
    ],
    checked: '2026-10-29',
  },
  {
    id: 'brother-ql1110nwb',
    brand: 'Brother',
    name: 'Brother QL-1110NWB',
    model: 'Network label printer',
    image: '/images/products/authorized/brother-ql1110nwb.jpg',
    imageAlt:
      'Official Brother QL-1110NWB product photograph from the Brother Canada Marketing Library.',
    fit: 'For networking and finer detail',
    description:
      'A 300 dpi printer with an automatic cutter and multiple connection options. Its DK-roll system needs a different consumables calculation from generic fanfold models.',
    dpi: 300,
    speed: 110,
    width: 'Maximum print area: 101.6 mm (4 in)',
    connections: ['usb', 'wifi', 'bluetooth'],
    ethernet: true,
    systems: ['windows', 'mac', 'ios', 'android'],
    media: 'Brother DK die-cut or continuous rolls',
    cutter: true,
    price: 334.99,
    priceChecked: '2026-10-29',
    priceNote:
      'Manufacturer page showed $334.99 and marked this model out of stock on October 29, 2026. A dated US reference, not a live offer; confirm variant, availability, tax and delivery.',
    strengths: [
      '300 dpi resolution',
      'Automatic cutter',
      'USB, Ethernet, Wi-Fi and Bluetooth interfaces',
    ],
    limitations: [
      'Uses DK-format media; compare the exact cost per label',
      'AirPrint uses the network, not Bluetooth',
      'Check current OS support and distinguish NWB from NWBc variants',
      'Automatic Crop is documented for Windows only',
    ],
    setup:
      'Check the current Brother support matrix for your OS release. AirPrint requires a wired or wireless network connection. Mobile printing is app- and label-format-dependent; a Bluetooth interface alone does not guarantee printing from every app.',
    sources: [
      {
        label: 'Brother product page and dated list price',
        url: 'https://www.brother-usa.com/p/desktop-label-printers/QL1110NWB',
      },
      {
        label: 'Brother user guide: specifications',
        url: 'https://download.brother.com/welcome/docp100364/ql-1110nwb_use_ug_03.pdf',
      },
      {
        label: 'Brother AirPrint and Bluetooth requirements',
        url: 'https://help.brother-usa.com/app/answers/detail/a_id/155109/~/airprint-driver-and-cups-driver-compatibility',
      },
      {
        label: 'Current operating-system support',
        url: 'https://support.brother.com/g/b/producttop.aspx?c=us&lang=en&prod=lpql1110nwbeus',
      },
      {
        label: 'Brother supported OS and NWB/NWBc exceptions',
        url: 'https://support.brother.com/g/b/oslist.aspx?c=us&lang=en&prod=lpql1110nwbeus',
      },
    ],
    checked: '2026-10-29',
  },
  {
    image: '/images/products/studio/rollo-x1038-hero.webp',
    imageAlt: productPhotography['rollo-usb-x1038'].alt,
    dpi: 203,
    speed: 150,
    ethernet: false,
    cutter: false,
    price: null,
    priceChecked: null,
    priceNote: 'Current price is unverified; confirm the exact model and variant before buying.',
    checked: '2026-11-05',
    id: 'rollo-usb-x1038',
    brand: 'Rollo',
    name: 'Rollo USB X1038',
    model: 'X1038 · USB',
    fit: 'For one computer at a fixed packing desk',
    description:
      'The wired Rollo: 203 dpi direct-thermal printing without the wireless model’s network setup. A driver and a supported computer are part of the purchase decision.',
    width: 'Label media width: 1.57–4.1 in',
    connections: ['usb'],
    systems: ['windows', 'mac'],
    media: 'Generic direct-thermal rolls or fanfold',
    strengths: [
      'USB-only workstation simplicity',
      'Generic direct-thermal stock, including 4 × 6',
      '203 dpi with a rated maximum of 150 mm/s',
    ],
    limitations: [
      'No Wi-Fi, AirPrint or Bluetooth printing',
      'Direct phone printing is not verified',
      'External labels need space behind the printer',
    ],
    setup:
      'Use the X1038 USB driver and a data-capable cable on a supported Windows or macOS release. Check the current driver’s CPU requirements; do not infer phone support from a USB adapter.',
    sources: [
      {
        label: 'Rollo X1038 / X1040 comparison',
        url: 'https://www.rollo.com/intro-print/',
      },
      {
        label: 'Rollo USB user guide',
        url: 'https://rollo-main.b-cdn.net/wp-content/uploads/2022/09/Rollo-USB-User-Guide.pdf',
      },
      {
        label: 'Official USB setup articles',
        url: 'https://support.rollo.com/support/solutions/folders/29000005966',
      },
    ],
  },
  {
    image: '/images/products/studio/munbyn-itpp941b-hero.webp',
    imageAlt: productPhotography['munbyn-itpp941b'].alt,
    dpi: 203,
    speed: 150,
    ethernet: false,
    cutter: false,
    price: null,
    priceChecked: null,
    priceNote: 'Current price is unverified; confirm the exact model and variant before buying.',
    checked: '2026-11-05',
    id: 'munbyn-itpp941b',
    brand: 'MUNBYN',
    name: 'MUNBYN ITPP941B',
    model: 'ITPP941B · Bluetooth / USB · 203 dpi',
    fit: 'For app-based phone printing with a USB fallback',
    description:
      'The Bluetooth 203 dpi 941B is a different variant from the USB ITPP941. Mobile printing uses the manufacturer app; desktop workflows depend on the operating system.',
    width: 'Maximum print width: 108 mm; media: 40–110 mm',
    connections: ['usb', 'bluetooth'],
    systems: ['windows', 'mac', 'chrome', 'ios', 'android'],
    media: 'Generic direct-thermal rolls or fanfold',
    strengths: [
      'Bluetooth printing from Munbyn Print on iOS / Android',
      'USB Windows and macOS drivers',
      'Rated 150 mm/s at 203 dpi; no ink ribbon',
    ],
    limitations: [
      'No verified Wi-Fi or AirPrint route for this variant',
      'Windows Bluetooth driver excludes ARM PCs',
      'Mac USB drivers do not establish system-wide Mac Bluetooth support',
    ],
    setup:
      'On a phone, import the shipping PDF into Munbyn Print and select the exact Bluetooth model. Windows Bluetooth uses the dedicated 941B(P) driver and excludes ARM PCs. macOS uses the USB driver; ChromeOS uses the linked extension. Browser-specific Munbyn Editor routes are separate from desktop system drivers.',
    sources: [
      {
        label: 'ITPP941B exact-model parameter table',
        url: 'https://pos.munbyn.com/munbyn-itpp941-series-thermal-label-printer/',
      },
      {
        label: '941B retail variant and specifications',
        url: 'https://munbyn.com/products/bluetooth-thermal-label-printer-941b',
      },
      {
        label: 'Drivers and Chrome extension',
        url: 'https://support.munbyn.com/hc/en-us/articles/6092502480787-Printer-Drivers-SDK-Download',
      },
      {
        label: 'Windows Bluetooth requirements',
        url: 'https://support.munbyn.com/hc/en-us/articles/54258310492563--Bluetooth-connection-method-How-to-connect-the-devices-using-Bluetooth-on-Windows',
      },
      {
        label: 'Munbyn Print mobile connection',
        url: 'https://support.munbyn.com/hc/en-us/articles/29278403182355--Bluetooth-models-How-to-connect-the-device-on-the-Phone',
      },
    ],
  },
  {
    image: '/images/products/studio/phomemo-pm241bt-hero.webp',
    imageAlt: productPhotography['phomemo-pm241bt'].alt,
    dpi: 203,
    speed: 150,
    ethernet: false,
    cutter: false,
    price: null,
    priceChecked: null,
    priceNote: 'Current price is unverified; confirm the exact model and variant before buying.',
    checked: '2026-11-05',
    id: 'phomemo-pm241bt',
    brand: 'Phomemo',
    name: 'Phomemo PM-241BT',
    model: 'PM241-BT · Bluetooth / USB · 203 dpi',
    fit: 'For a Labelife-based mobile shipping workflow',
    description:
      'A 4 × 6 direct-thermal model with Bluetooth for the Labelife phone app and a documented USB route on computers. Verify the app and media before committing.',
    width: '4 × 6 supported; other widths need confirmation (manufacturer ranges conflict)',
    connections: ['usb', 'bluetooth'],
    systems: ['windows', 'mac', 'ios', 'android'],
    media: 'Compatible direct-thermal stock; confirm PM241-BT media requirements',
    strengths: [
      'Labelife app workflow for iOS / Android',
      'USB route on Windows and macOS',
      '203 dpi, rated up to 150 mm/s',
    ],
    limitations: [
      'No Wi-Fi or AirPrint route documented for this model',
      'Mobile Bluetooth uses Labelife, not every marketplace app',
      'Official page gives conflicting width ranges; do not assume every small label fits',
    ],
    setup:
      'Use Labelife for phone Bluetooth printing and the exact PM241-BT driver for a Windows or macOS USB setup. Import the correctly sized PDF first. Desktop Bluetooth support is not treated as a verified Finder route. Phomemo warns against HUOJI labels on this product page; check stock explicitly.',
    sources: [
      {
        label: 'Phomemo PM241-BT specifications and software links',
        url: 'https://phomemo.com/products/pm-241bt',
      },
      {
        label: 'Labelife official help center',
        url: 'https://help.labelife.net/portal/en/home',
      },
    ],
  },
  {
    image: '/images/products/authorized/brother-ql1100.png',
    imageAlt:
      'Official Brother QL-1100 product photograph from the Brother Canada Marketing Library.',
    dpi: 300,
    speed: 110,
    ethernet: false,
    cutter: true,
    price: null,
    priceChecked: null,
    priceNote: 'Current price is unverified; confirm the exact model and variant before buying.',
    checked: '2026-11-05',
    id: 'brother-ql1100',
    brand: 'Brother',
    name: 'Brother QL-1100',
    model: 'QL-1100 · USB · not QL-1100c',
    fit: 'For a USB desk that also needs cut-to-length DK labels',
    description:
      'A 300 dpi USB model with an automatic cutter and Brother DK media. It keeps the QL-1110NWB’s media approach while omitting its network and Bluetooth interfaces.',
    width: 'Maximum print width: 101.6 mm (4 in)',
    connections: ['usb'],
    systems: ['windows', 'mac'],
    media: 'Brother DK die-cut or continuous rolls',
    strengths: [
      '300 dpi resolution',
      'Automatic cutter for compatible DK rolls',
      'Windows-only Automatic Crop workflow',
    ],
    limitations: [
      'No Wi-Fi, Ethernet or Bluetooth',
      'Uses DK-format rolls rather than loose generic fanfold',
      'Check QL-1100 versus QL-1100c and current OS support',
    ],
    setup:
      'Use Brother’s current QL-1100 support downloads for your OS release and a USB connection. Automatic Crop is Windows-only. A 110 mm/s specification is not a measured 4 × 6 label-per-minute result. Brother also documents Android iPrint&Label through a separately purchased USBtoGO cable for label design. A shipping-PDF import route is not verified here, so Finder does not infer general phone USB printing. USB Host does not establish universal phone printing.',
    sources: [
      {
        label: 'Brother QL-1100 exact model',
        url: 'https://www.brother-usa.com/p/label-printers/QL1100',
      },
      {
        label: 'Brother QL-1100 user guide',
        url: 'https://download.brother.com/welcome/docp100363/ql-1100_use_ug_03.pdf',
      },
      {
        label: 'QL-1100 / QL-1110NWB manufacturer brochure',
        url: 'https://www.brother.com.sg/-/media/ap2/singapore/products/ql-1110nwb/ql-1100-and-ql-1110nwb-brochure_lr.pdf?rev=01b3f39771c644a8a9a675e4b242f608',
      },
    ],
  },
];

export const systemNames: Record<OperatingSystem, string> = {
  windows: 'Windows',
  mac: 'macOS',
  ios: 'iPhone / iPad',
  android: 'Android',
  chrome: 'ChromeOS',
};
export const connectionNames: Record<Connection, string> = {
  usb: 'USB',
  wifi: 'Wi-Fi',
  bluetooth: 'Bluetooth',
  any: 'No preference',
};

export function getConnectionLabels(printer: Printer): string[] {
  return [
    ...printer.connections.map((connection) => connectionNames[connection]),
    ...(printer.ethernet ? ['Ethernet'] : []),
  ];
}

export function formatResearchDate(date: string): string {
  return new Date(`${date}T00:00:00Z`).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

// Never claim the whole catalog is newer than its least recently reviewed entry.
export const catalogCheckedLabel = formatResearchDate(
  printers.map((printer) => printer.checked).sort()[0],
);
