import { test } from 'node:test';
import assert from 'node:assert/strict';
import { PDFDocument, PDFName, PDFRawStream, rgb } from 'pdf-lib';
import {
  FULL_PAGE,
  validCrop,
  selectionBetween,
  sourceBounds,
  placement,
  exportCroppedPdf,
  type PageGeometry,
} from '../src/lib/pdf-crop.ts';
const letter: PageGeometry = {
  width: 612,
  height: 792,
  rotation: 0,
  transform: [1, 0, 0, -1, 0, 792],
};
test('crop rejects blank, nonfinite, inverted and out-of-page selections', () => {
  assert.ok(validCrop(FULL_PAGE));
  for (const c of [{ x: -1 }, { width: 0 }, { height: Infinity }, { x: 20, width: 90 }, { y: NaN }])
    assert.equal(validCrop({ ...FULL_PAGE, ...c }), false);
});
test('pointer selection supports either drag direction and clamps to visible page', () => {
  assert.deepEqual(selectionBetween({ x: 90, y: 80 }, { x: 10, y: 20 }), {
    x: 10,
    y: 20,
    width: 80,
    height: 60,
  });
  assert.deepEqual(selectionBetween({ x: -20, y: 120 }, { x: 130, y: -10 }), FULL_PAGE);
});
test('display crop maps to PDF coordinates including top-down inversion and offset', () => {
  assert.deepEqual(sourceBounds({ x: 25, y: 0, width: 50, height: 50 }, letter), {
    left: 153,
    right: 459,
    bottom: 396,
    top: 792,
  });
  const offset = { ...letter, transform: [1, 0, 0, -1, -20, 822] };
  assert.deepEqual(sourceBounds(FULL_PAGE, offset), { left: 20, right: 632, bottom: 30, top: 822 });
  assert.throws(() => sourceBounds(FULL_PAGE, { ...letter, transform: [0, 0, 0, 0, 0, 0] }));
});
test('intrinsic 90, 180 and 270 degree page rotations map all four crop corners correctly', () => {
  const topLeft = { x: 0, y: 0, width: 50, height: 50 };
  assert.deepEqual(
    sourceBounds(topLeft, { width: 792, height: 612, rotation: 90, transform: [0, 1, 1, 0, 0, 0] }),
    { left: 0, right: 306, bottom: 0, top: 396 },
  );
  assert.deepEqual(
    sourceBounds(topLeft, { ...letter, rotation: 180, transform: [-1, 0, 0, 1, 612, 0] }),
    { left: 306, right: 612, bottom: 0, top: 396 },
  );
  assert.deepEqual(
    sourceBounds(topLeft, {
      width: 792,
      height: 612,
      rotation: 270,
      transform: [0, -1, -1, 0, 792, 612],
    }),
    { left: 306, right: 612, bottom: 396, top: 792 },
  );
});
test('proportional placement never stretches and stays on the 288 by 432 point output', () => {
  for (const rotation of [0, 90, 180, 270, 360]) {
    const p = placement(400, 250, rotation),
      w = (p.rotation % 180 ? 250 : 400) * p.scale,
      h = (p.rotation % 180 ? 400 : 250) * p.scale;
    assert.ok(w <= 288 && h <= 432);
    assert.ok(p.scale > 0);
  }
  assert.equal(placement(288, 432, 0).scale, 1);
  assert.throws(() => placement(288, 432, 45));
});
test('PDF export produces one exact 4x6 page embedding vector content instead of a screenshot', async () => {
  const input = await PDFDocument.create();
  const source = input.addPage([612, 792]);
  source.drawText('DEMO - NOT POSTAGE', { x: 40, y: 650, size: 18 });
  source.drawRectangle({ x: 40, y: 400, width: 120, height: 200, color: rgb(0, 0, 0) });
  input.addPage([612, 792]);
  const bytes = await input.save();
  const result = await PDFDocument.load(
    await exportCroppedPdf(bytes, 0, { x: 0, y: 0, width: 50, height: 60 }, letter, 90),
  );
  assert.equal(result.getPageCount(), 1);
  assert.deepEqual(result.getPage(0).getSize(), { width: 288, height: 432 });
  const streams = result.context
    .enumerateIndirectObjects()
    .map(([, value]) => value)
    .filter((value) => value instanceof PDFRawStream) as PDFRawStream[];
  assert.ok(streams.some((s) => s.dict.get(PDFName.of('Subtype')) === PDFName.of('Form')));
  assert.ok(!streams.some((s) => s.dict.get(PDFName.of('Subtype')) === PDFName.of('Image')));
  assert.throws(() => sourceBounds({ x: 80, y: 0, width: 50, height: 50 }, letter));
  await assert.rejects(exportCroppedPdf(bytes, 9, FULL_PAGE, letter, 0));
});
