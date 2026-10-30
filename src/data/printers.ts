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
    image: '/images/products/editorial-rollo-wireless-render.webp',
    imageAlt:
      'AI-generated editorial render of Rollo Wireless X1040, based on manufacturer reference imagery; details may vary.',
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
    image: '/images/products/editorial-munbyn-itpp941-render.webp',
    imageAlt:
      'AI-generated editorial render of MUNBYN ITPP941, based on manufacturer reference imagery; details may vary.',
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
    image: '/images/products/editorial-brother-ql1110nwb-render.webp',
    imageAlt:
      'AI-generated editorial render of Brother QL-1110NWB, based on manufacturer reference imagery; details may vary.',
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
