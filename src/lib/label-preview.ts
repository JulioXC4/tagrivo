export interface LabelLayout {
  width: number;
  height: number;
  margin: number;
  scale: number;
  landscape: boolean;
}
export function labelLayout(input: LabelLayout) {
  const { width, height, margin, scale, landscape } = input;
  if (
    ![width, height, margin, scale].every(Number.isFinite) ||
    width < 25 ||
    width > 300 ||
    height < 25 ||
    height > 300 ||
    margin < 0 ||
    margin > 30 ||
    scale < 10 ||
    scale > 200
  )
    return null;
  const w = landscape ? Math.max(width, height) : Math.min(width, height);
  const h = landscape ? Math.min(width, height) : Math.max(width, height);
  if (margin * 2 >= Math.min(w, h)) return null;
  // The sample is a 4 × 6 document. Changing stock size never silently reflows it.
  const sourceW = landscape ? 152.4 : 101.6,
    sourceH = landscape ? 101.6 : 152.4;
  const contentW = (sourceW * scale) / 100,
    contentH = (sourceH * scale) / 100;
  const fitScale = Math.min((w - 2 * margin) / sourceW, (h - 2 * margin) / sourceH) * 100;
  return {
    w,
    h,
    contentW,
    contentH,
    x: (w - contentW) / 2,
    y: (h - contentH) / 2,
    fitScale,
    clipped: scale > fitScale + 0.001,
  };
}
