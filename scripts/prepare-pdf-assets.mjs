// Self-host decoding resources; no user PDF or font request goes to a third-party CDN.
import { cp, mkdir, copyFile } from 'node:fs/promises';
for (const directory of ['cmaps', 'standard_fonts', 'wasm']) {
  await mkdir(`public/pdfjs/${directory}`, { recursive: true });
  await cp(`node_modules/pdfjs-dist/${directory}`, `public/pdfjs/${directory}`, {
    recursive: true,
  });
}
await copyFile('node_modules/pdfjs-dist/LICENSE', 'public/pdfjs/LICENSE');
await copyFile('node_modules/pdf-lib/LICENSE.md', 'public/pdfjs/PDF-LIB-LICENSE.md');
console.log('Prepared self-hosted PDF decoding resources and license notices.');
