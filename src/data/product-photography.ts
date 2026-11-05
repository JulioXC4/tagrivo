/** Exact-model source images. Provenance is not a commercial reuse license. */
export const productPhotography: Record<
  string,
  {
    hero: string;
    alt: string;
    source: string;
    extra: { src: string; alt: string; caption: string }[];
  }
> = {
  'rollo-wireless': {
    hero: '/images/products/studio/rollo-x1040-hero.webp',
    alt: 'Rollo Wireless X1040 original manufacturer image, showing the purple Rollo logo, original side latch and paper outlet; Tagrivo studio background.',
    source: 'https://www.rollo.com/product/rollo-wireless-printer/',
    extra: [
      {
        src: '/images/products/studio/rollo-x1040-front.webp',
        alt: 'Original front view of Rollo X1040 with its purple outlet trim and printed sample label.',
        caption:
          'Front view from a separate original manufacturer image; studio background by Tagrivo.',
      },
    ],
  },
  'munbyn-itpp941': {
    hero: '/images/products/studio/munbyn-itpp941-usb-hero.webp',
    alt: 'MUNBYN ITPP941 USB original manufacturer image with its MUNBYN logo, black lid, green indicator and round feed button; Tagrivo studio background.',
    source: 'https://pos.munbyn.com/munbyn-itpp941-series-thermal-label-printer/',
    extra: [
      {
        src: '/images/products/studio/munbyn-itpp941-usb-controls.webp',
        alt: 'Crop of the original ITPP941 USB photograph showing its logo, status light and feed button.',
        caption:
          'Detail crop of the same manufacturer photograph. No controls or lettering were generated.',
      },
    ],
  },
  'rollo-usb-x1038': {
    hero: '/images/products/studio/rollo-x1038-hero.webp',
    alt: 'Rollo USB X1038 original manufacturer image showing its dark gray enclosure and actual front label path; Tagrivo studio background.',
    source: 'https://www.rollo.com/product/rollo-printer/',
    extra: [
      {
        src: '/images/products/studio/rollo-x1038-perspective.webp',
        alt: 'Separate original manufacturer three-quarter image of the dark gray Rollo USB X1038.',
        caption:
          'Genuine three-quarter view from a separate manufacturer image; the camera angle was not synthesized.',
      },
    ],
  },
  'munbyn-itpp941b': {
    hero: '/images/products/studio/munbyn-itpp941b-hero.webp',
    alt: 'White MUNBYN ITPP941B original manufacturer image with its original lid, Bluetooth indicator marking and feed button; Tagrivo studio background.',
    source: 'https://munbyn.com/products/bluetooth-thermal-label-printer-941b',
    extra: [
      {
        src: '/images/products/studio/munbyn-itpp941b-controls.webp',
        alt: 'Original white ITPP941B controls cropped from its own manufacturer image, not the USB 941 image.',
        caption:
          'Detail crop of the 941B photograph. It is not a substituted image of the USB-only model.',
      },
    ],
  },
  'phomemo-pm241bt': {
    hero: '/images/products/studio/phomemo-pm241bt-hero.webp',
    alt: 'Original Phomemo PM241-BT manufacturer image in the white and lavender finish, with its actual button, blue status light and label path; original white background retained.',
    source: 'https://phomemo.com/products/pm-241bt',
    extra: [],
  },
};
