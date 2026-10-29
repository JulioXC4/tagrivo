import { mkdir, writeFile } from 'node:fs/promises';
const images = [
  [
    'rollo-wireless.webp',
    'https://rollo-main.b-cdn.net/wp-content/uploads/2021/11/rollo-wireless-label-printer-product-image-1-1-600x600.webp',
  ],
  ['munbyn-itpp941.jpg', 'https://pos.munbyn.com/wp-content/uploads/2024/02/ITPP941-1.jpg'],
  [
    'brother-ql1110nwb.webp',
    'https://assets.brother.com/transform/9f4046a8-6b49-47d9-9023-3c78fa532d38/3931_QL1110NWB_front_featuredimagery_0-png?io=transform%3Afit%2Cwidth%3A680',
  ],
];
await mkdir('public/images/products', { recursive: true });
for (const [name, url] of images) {
  const response = await fetch(url, { signal: AbortSignal.timeout(30000) });
  if (!response.ok || !response.headers.get('content-type')?.startsWith('image/'))
    throw new Error(`${name}: ${response.status}`);
  await writeFile(`public/images/products/${name}`, Buffer.from(await response.arrayBuffer()));
  console.log(`Saved ${name}`);
}
