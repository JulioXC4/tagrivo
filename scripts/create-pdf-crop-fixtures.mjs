// Non-postage QA documents; never deployed or used as a carrier label.
import { PDFDocument, rgb, degrees, StandardFonts } from 'pdf-lib';
import { mkdir, writeFile } from 'node:fs/promises';
const directory = '.impeccable/review/pdf-fixtures';
await mkdir(directory, { recursive: true });
const pdf = await PDFDocument.create();
const font = await pdf.embedFont(StandardFonts.Helvetica);
function specimen(page, x, y) {
  page.drawRectangle({ x, y, width: 288, height: 432, borderWidth: 1, borderColor: rgb(0, 0, 0) });
  page.drawText('DEMO - NOT POSTAGE', { x: x + 16, y: y + 382, size: 18, font });
  page.drawText('4 x 6 in / 101.6 x 152.4 mm', { x: x + 16, y: y + 353, size: 12, font });
  page.drawText('LOCAL CROP / ROTATION TEST', { x: x + 16, y: y + 320, size: 12, font });
  page.drawText('No carrier / no tracking / no address', { x: x + 16, y: y + 298, size: 11, font });
  const colors = [rgb(0, 0.6, 0), rgb(1, 0.5, 0), rgb(0, 0, 1), rgb(1, 0, 0)];
  [
    [x + 10, y + 410],
    [x + 266, y + 410],
    [x + 10, y + 10],
    [x + 266, y + 10],
  ].forEach(([cx, cy], i) =>
    page.drawRectangle({ x: cx, y: cy, width: 12, height: 12, color: colors[i] }),
  );
  for (let i = 0; i < 50; i++)
    page.drawRectangle({
      x: x + 24 + i * 4.7,
      y: y + 130,
      width: (i % 3) + 1,
      height: 85,
      color: rgb(0, 0, 0),
    });
  page.drawText('ILLUSTRATIVE BARS - NOT VALID', { x: x + 20, y: y + 100, size: 12, font });
}
const letter = pdf.addPage([612, 792]);
specimen(letter, 72, 288);
letter.drawText('Outside selection: packing note, not a shipping label', {
  x: 72,
  y: 220,
  size: 12,
  font,
});
const rotated = pdf.addPage([612, 792]);
specimen(rotated, 72, 288);
rotated.setRotation(degrees(90));
const offset = pdf.addPage([650, 850]);
specimen(offset, 92, 318);
offset.setCropBox(20, 30, 612, 792);
offset.setRotation(degrees(270));
await writeFile(`${directory}/crop-demo.pdf`, await pdf.save());
const annotated = await PDFDocument.create();
const page = annotated.addPage([612, 792]);
page.drawText('Form fixture - not postage');
annotated
  .getForm()
  .createTextField('qa-only')
  .addToPage(page, { x: 30, y: 30, width: 100, height: 25 });
await writeFile(`${directory}/annotated.pdf`, await annotated.save());
const many = await PDFDocument.create();
for (let i = 0; i < 51; i++) many.addPage([288, 432]);
await writeFile(`${directory}/too-many-pages.pdf`, await many.save());
await writeFile(`${directory}/invalid.pdf`, 'This is not a PDF.');
await writeFile(`${directory}/oversized.pdf`, new Uint8Array(20 * 1024 * 1024 + 1));
console.log('Created local-only non-postage PDF fixtures.');
