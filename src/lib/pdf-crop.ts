/** Coordinates are percentages of the displayed PDF page, including its own rotation. */
export interface CropRect {
  x: number;
  y: number;
  width: number;
  height: number;
}
export interface PageGeometry {
  width: number;
  height: number;
  rotation: number;
  transform: number[];
}
export const FULL_PAGE: CropRect = { x: 0, y: 0, width: 100, height: 100 };
export const MAX_PDF_BYTES = 20 * 1024 * 1024;
export const MAX_PDF_PAGES = 50;
export function validCrop(c: CropRect): boolean {
  return (
    [c.x, c.y, c.width, c.height].every(Number.isFinite) &&
    c.x >= 0 &&
    c.y >= 0 &&
    c.width >= 1 &&
    c.height >= 1 &&
    c.x + c.width <= 100.00001 &&
    c.y + c.height <= 100.00001
  );
}
export function selectionBetween(
  a: { x: number; y: number },
  b: { x: number; y: number },
): CropRect {
  const clamp = (n: number) => Math.max(0, Math.min(100, n));
  const x1 = clamp(a.x),
    y1 = clamp(a.y),
    x2 = clamp(b.x),
    y2 = clamp(b.y);
  return {
    x: Math.min(x1, x2),
    y: Math.min(y1, y2),
    width: Math.abs(x2 - x1),
    height: Math.abs(y2 - y1),
  };
}
/** Invert PDF.js's viewport transform rather than assuming an unrotated Letter page. */
export function sourceBounds(c: CropRect, g: PageGeometry) {
  if (
    !validCrop(c) ||
    ![g.width, g.height].every((n) => Number.isFinite(n) && n > 0) ||
    g.transform.length !== 6 ||
    !g.transform.every(Number.isFinite)
  )
    throw new Error('Invalid crop or PDF page dimensions.');
  const [a, b, d, e, f, h] = g.transform,
    determinant = a * e - b * d;
  if (!Number.isFinite(determinant) || Math.abs(determinant) < 1e-12)
    throw new Error('Unsupported PDF page transform.');
  const inverse = (x: number, y: number) => ({
    x: (e * (x - f) - d * (y - h)) / determinant,
    y: (-b * (x - f) + a * (y - h)) / determinant,
  });
  const points = [
    inverse((c.x * g.width) / 100, (c.y * g.height) / 100),
    inverse(((c.x + c.width) * g.width) / 100, (c.y * g.height) / 100),
    inverse((c.x * g.width) / 100, ((c.y + c.height) * g.height) / 100),
    inverse(((c.x + c.width) * g.width) / 100, ((c.y + c.height) * g.height) / 100),
  ];
  const clean = (n: number) => (n === 0 ? 0 : n);
  return {
    left: clean(Math.min(...points.map((p) => p.x))),
    right: clean(Math.max(...points.map((p) => p.x))),
    bottom: clean(Math.min(...points.map((p) => p.y))),
    top: clean(Math.max(...points.map((p) => p.y))),
  };
}
export function placement(width: number, height: number, clockwise: number) {
  const rotation = ((clockwise % 360) + 360) % 360;
  if (
    ![width, height].every((n) => Number.isFinite(n) && n > 0) ||
    ![0, 90, 180, 270].includes(rotation)
  )
    throw new Error('Unsupported output geometry.');
  const rw = rotation % 180 ? height : width,
    rh = rotation % 180 ? width : height;
  const scale = Math.min(288 / rw, 432 / rh),
    w = rw * scale,
    h = rh * scale;
  const ox = (288 - w) / 2,
    oy = (432 - h) / 2;
  return {
    scale,
    rotation,
    x: ox + ([180, 270].includes(rotation) ? w : 0),
    y: oy + ([90, 180].includes(rotation) ? h : 0),
  };
}
/** Embed original PDF content; the on-screen raster is never used for export. */
export async function exportCroppedPdf(
  bytes: Uint8Array,
  pageIndex: number,
  crop: CropRect,
  geometry: PageGeometry,
  turn: number,
) {
  const { PDFDocument, degrees } = await import('pdf-lib');
  const source = await PDFDocument.load(bytes, { updateMetadata: false });
  if (source.isEncrypted) throw new Error('Password-protected PDFs are not supported.');
  if (!Number.isInteger(pageIndex) || pageIndex < 0 || pageIndex >= source.getPageCount())
    throw new Error('Choose an existing PDF page.');
  const output = await PDFDocument.create();
  const bounds = sourceBounds(crop, geometry);
  const original = source.getPage(pageIndex);
  const embedded = await output.embedPage(original, bounds);
  const p = placement(embedded.width, embedded.height, geometry.rotation + turn);
  const page = output.addPage([288, 432]);
  page.drawPage(embedded, {
    x: p.x,
    y: p.y,
    xScale: p.scale,
    yScale: p.scale,
    rotate: degrees(-p.rotation),
  });
  output.setTitle('4 × 6 label — cropped with Tagrivo');
  output.setCreator('Tagrivo browser PDF cropper');
  return output.save();
}
