import { useEffect, useRef, useState, type PointerEvent } from 'react';
import type { PDFDocumentProxy, PDFDocumentLoadingTask } from 'pdfjs-dist';
import {
  FULL_PAGE,
  MAX_PDF_BYTES,
  MAX_PDF_PAGES,
  validCrop,
  selectionBetween,
  exportCroppedPdf,
  type CropRect,
  type PageGeometry,
} from '../lib/pdf-crop';

export default function PdfCropper() {
  const [ready, setReady] = useState(false),
    [busy, setBusy] = useState(false),
    [exporting, setExporting] = useState(false);
  const [error, setError] = useState(''),
    [notice, setNotice] = useState('Choose a PDF to begin. Nothing is uploaded.');
  const [pdf, setPdf] = useState<PDFDocumentProxy | null>(null),
    [pageNumber, setPageNumber] = useState(1);
  const [crop, setCrop] = useState<CropRect>({ ...FULL_PAGE }),
    [turn, setTurn] = useState(0),
    [geometry, setGeometry] = useState<PageGeometry | null>(null);
  const sourceCanvas = useRef<HTMLCanvasElement>(null),
    resultCanvas = useRef<HTMLCanvasElement>(null),
    fileInput = useRef<HTMLInputElement>(null);
  const bytes = useRef<Uint8Array | null>(null),
    task = useRef<PDFDocumentLoadingTask | null>(null),
    generation = useRef(0);
  const anchor = useRef<{ x: number; y: number } | null>(null),
    previous = useRef<CropRect>({ ...FULL_PAGE });
  useEffect(() => {
    setReady(true);
    return () => {
      generation.current++;
      void task.current?.destroy();
      bytes.current = null;
    };
  }, []);
  const clear = (resetInput = true) => {
    generation.current++;
    void task.current?.destroy();
    task.current = null;
    bytes.current = null;
    setPdf(null);
    setGeometry(null);
    setCrop({ ...FULL_PAGE });
    setTurn(0);
    setBusy(false);
    setError('');
    setNotice('PDF removed from this tool. Choose another file to start again.');
    if (resetInput && fileInput.current) fileInput.current.value = '';
  };
  async function openFile(file: File | undefined) {
    if (!file) return;
    clear(false);
    const token = generation.current;
    if (!file.name.toLowerCase().endsWith('.pdf') || file.size === 0 || file.size > MAX_PDF_BYTES) {
      setError(
        'Choose a non-empty PDF up to 20 MB. Split larger files in your PDF application first.',
      );
      return;
    }
    setBusy(true);
    setNotice('Opening your PDF locally…');
    try {
      const data = new Uint8Array(await file.arrayBuffer());
      if (!new TextDecoder().decode(data.subarray(0, 1024)).includes('%PDF-'))
        throw new Error('not-pdf');
      const [engine, worker] = await Promise.all([
        import('pdfjs-dist'),
        import('pdfjs-dist/build/pdf.worker.min.mjs?url'),
      ]);
      if (token !== generation.current) return;
      engine.GlobalWorkerOptions.workerSrc = worker.default;
      bytes.current = data;
      const loading = engine.getDocument({
        data: data.slice(),
        stopAtErrors: true,
        enableXfa: false,
        cMapUrl: '/pdfjs/cmaps/',
        cMapPacked: true,
        standardFontDataUrl: '/pdfjs/standard_fonts/',
        wasmUrl: '/pdfjs/wasm/',
      });
      task.current = loading;
      const doc = await loading.promise;
      if (token !== generation.current) {
        void loading.destroy();
        return;
      }
      if (doc.numPages > MAX_PDF_PAGES) throw new Error('too-many-pages');
      setPageNumber(1);
      setPdf(doc);
    } catch (e) {
      if (token !== generation.current) return;
      const name = (e as Error).name;
      setError(
        name === 'PasswordException'
          ? 'Password-protected PDFs are not supported. Use an unprotected copy you are authorized to open.'
          : (e as Error).message === 'too-many-pages'
            ? 'This MVP supports up to 50 pages. Split the PDF before choosing it.'
            : 'This PDF could not be opened. Try the original, unprotected shipping PDF from your provider.',
      );
      bytes.current = null;
      void task.current?.destroy();
      task.current = null;
      setBusy(false);
      setNotice('No PDF loaded.');
    }
  }
  useEffect(() => {
    if (!pdf) return;
    let cancelled = false;
    let render: { cancel: () => void } | undefined;
    setBusy(true);
    setGeometry(null);
    setError('');
    setCrop({ ...FULL_PAGE });
    setTurn(0);
    (async () => {
      try {
        const page = await pdf.getPage(pageNumber);
        if (cancelled) return;
        if ((await page.getAnnotations()).length) throw new Error('annotations');
        const base = page.getViewport({ scale: 1 });
        if (![base.width, base.height].every((n) => Number.isFinite(n) && n >= 16 && n <= 20000))
          throw new Error('dimensions');
        const viewport = page.getViewport({
          scale: Math.min(1.75, 1400 / Math.max(base.width, base.height)),
        });
        const canvas = sourceCanvas.current;
        if (!canvas || cancelled) return;
        canvas.width = Math.ceil(viewport.width);
        canvas.height = Math.ceil(viewport.height);
        const context = canvas.getContext('2d');
        if (!context) throw new Error('canvas');
        const job = page.render({
          canvas,
          canvasContext: context,
          viewport,
          background: 'white',
          annotationMode: 0,
        });
        render = job;
        await job.promise;
        if (cancelled) return;
        setGeometry({
          width: base.width,
          height: base.height,
          rotation: base.rotation,
          transform: [...base.transform],
        });
        setNotice(
          `Page ${pageNumber} of ${pdf.numPages} ready. Drag around the complete label or enter crop values.`,
        );
      } catch (e) {
        if (!cancelled) {
          setError(
            (e as Error).message === 'annotations'
              ? 'This page contains annotations or form fields. Use a flattened PDF from your provider so the preview and export match.'
              : 'This page could not be previewed. Try a simpler PDF exported by your shipping provider.',
          );
          setNotice('Choose another page or PDF.');
        }
      } finally {
        if (!cancelled) setBusy(false);
      }
    })();
    return () => {
      cancelled = true;
      render?.cancel();
    };
  }, [pdf, pageNumber]);
  const valid = !!geometry && validCrop(crop) && !busy;
  useEffect(() => {
    const source = sourceCanvas.current,
      dest = resultCanvas.current,
      ctx = dest?.getContext('2d');
    if (!source || !dest || !ctx || !valid) return;
    dest.width = 576;
    dest.height = 864;
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, 576, 864);
    const sw = (source.width * crop.width) / 100,
      sh = (source.height * crop.height) / 100;
    const rw = turn % 180 ? sh : sw,
      rh = turn % 180 ? sw : sh,
      scale = Math.min(576 / rw, 864 / rh);
    ctx.save();
    ctx.translate(288, 432);
    ctx.rotate((turn * Math.PI) / 180);
    ctx.scale(scale, scale);
    ctx.drawImage(
      source,
      (source.width * crop.x) / 100,
      (source.height * crop.y) / 100,
      sw,
      sh,
      -sw / 2,
      -sh / 2,
      sw,
      sh,
    );
    ctx.restore();
  }, [crop, turn, valid, geometry]);
  function point(e: PointerEvent<HTMLDivElement>) {
    const b = e.currentTarget.getBoundingClientRect();
    return {
      x: Math.max(0, Math.min(100, ((e.clientX - b.left) / b.width) * 100)),
      y: Math.max(0, Math.min(100, ((e.clientY - b.top) / b.height) * 100)),
    };
  }
  function start(e: PointerEvent<HTMLDivElement>) {
    if (!geometry || busy || exporting || !e.isPrimary || e.button !== 0) return;
    previous.current = crop;
    anchor.current = point(e);
    e.currentTarget.setPointerCapture(e.pointerId);
  }
  function move(e: PointerEvent<HTMLDivElement>) {
    if (anchor.current) setCrop(selectionBetween(anchor.current, point(e)));
  }
  function end(e: PointerEvent<HTMLDivElement>) {
    if (!anchor.current) return;
    const next = selectionBetween(anchor.current, point(e));
    setCrop(validCrop(next) ? next : previous.current);
    anchor.current = null;
  }
  async function download() {
    if (!bytes.current || !geometry || !valid || exporting) return;
    setExporting(true);
    setError('');
    const token = generation.current;
    try {
      const result = await exportCroppedPdf(bytes.current, pageNumber - 1, crop, geometry, turn);
      if (token !== generation.current) return;
      const url = URL.createObjectURL(
        new Blob([new Uint8Array(result)], { type: 'application/pdf' }),
      );
      const link = document.createElement('a');
      link.href = url;
      link.download = 'tagrivo-4x6.pdf';
      document.body.append(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 30000);
      setNotice(
        `Exported page ${pageNumber} as a 4 × 6 inch PDF. Check the downloaded file and print preview before dispatch.`,
      );
    } catch {
      if (token === generation.current)
        setError(
          'Could not export this page. Try an original PDF without encryption, forms or unusual page content.',
        );
    } finally {
      setExporting(false);
    }
  }
  return (
    <section
      className="pdf-cropper"
      aria-label="Shipping label PDF cropper"
      aria-busy={busy || exporting}
    >
      <div className="crop-file-row">
        <label className="field">
          Choose a shipping label PDF
          <input
            ref={fileInput}
            type="file"
            accept="application/pdf,.pdf"
            disabled={!ready || exporting}
            aria-describedby="pdf-limits"
            onChange={(e) => void openFile(e.target.files?.[0])}
          />
        </label>
        <p id="pdf-limits" className="small-note">
          Up to 20 MB / 50 pages. One page per export. No account, upload or file-content tracking.
        </p>
        <button
          className="plain-button"
          type="button"
          onClick={() => clear()}
          disabled={(!pdf && !error && !busy) || exporting}
        >
          Remove PDF
        </button>
      </div>
      <p role="status" className="crop-status">
        {notice}
      </p>
      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
      <div className="crop-workbench">
        <div className="crop-source">
          <div className="crop-toolbar">
            <h2>Choose the label area.</h2>
            {pdf && (
              <label className="field">
                PDF page{' '}
                <select
                  aria-label="PDF page"
                  disabled={busy || exporting}
                  value={pageNumber}
                  onChange={(e) => setPageNumber(Number(e.target.value))}
                >
                  {Array.from({ length: pdf.numPages }, (_, i) => (
                    <option key={i} value={i + 1}>
                      {i + 1} of {pdf.numPages}
                    </option>
                  ))}
                </select>
              </label>
            )}
          </div>
          <p className="small-note" id="crop-instructions">
            Drag a rectangle around the whole label, including barcode quiet zones. For keyboard or
            precise adjustment, use the percentage fields below.
          </p>
          <div
            className={`crop-page ${geometry ? 'is-loaded' : ''}`}
            style={{
              maxWidth: geometry ? `${(640 * geometry.width) / geometry.height}px` : undefined,
            }}
            onPointerDown={start}
            onPointerMove={move}
            onPointerUp={end}
            onPointerCancel={() => {
              anchor.current = null;
              setCrop(previous.current);
            }}
            aria-describedby="crop-instructions"
          >
            <canvas
              ref={sourceCanvas}
              hidden={!geometry}
              aria-label="Original PDF page preview"
              role="img"
            />
            {!geometry && (
              <div className="crop-empty">
                <span>
                  {busy ? 'Preparing local preview…' : 'Your PDF preview will appear here.'}
                </span>
                <p>Start with the original PDF. A screenshot cannot restore a blurred barcode.</p>
              </div>
            )}
            {geometry && validCrop(crop) && (
              <div
                className="crop-selection"
                style={{
                  left: `${crop.x}%`,
                  top: `${crop.y}%`,
                  width: `${crop.width}%`,
                  height: `${crop.height}%`,
                }}
                aria-hidden="true"
              />
            )}
          </div>
          <fieldset className="crop-adjustments" disabled={!geometry || busy || exporting}>
            <legend>Crop position and size (% of the displayed page)</legend>
            <div className="crop-presets">
              {[
                { name: 'Whole page', area: FULL_PAGE },
                { name: 'Top half', area: { x: 0, y: 0, width: 100, height: 50 } },
                { name: 'Bottom half', area: { x: 0, y: 50, width: 100, height: 50 } },
              ].map((p) => (
                <button
                  className="plain-button"
                  type="button"
                  key={p.name}
                  onClick={() => setCrop({ ...p.area })}
                >
                  {p.name}
                </button>
              ))}
            </div>
            <div className="crop-fields">
              {(['x', 'y', 'width', 'height'] as const).map((key) => (
                <label className="field" key={key}>
                  {{ x: 'Left', y: 'Top', width: 'Width', height: 'Height' }[key]} (%)
                  <input
                    type="number"
                    min={key === 'x' || key === 'y' ? 0 : 1}
                    max="100"
                    step="0.1"
                    value={Number.isFinite(crop[key]) ? Math.round(crop[key] * 100) / 100 : ''}
                    onChange={(e) => setCrop((c) => ({ ...c, [key]: e.target.valueAsNumber }))}
                  />
                </label>
              ))}
            </div>
            {geometry && !validCrop(crop) && (
              <p className="error">
                Use values within the page. Width and height must be at least 1%; left + width and
                top + height must not exceed 100%.
              </p>
            )}
          </fieldset>
        </div>
        <aside className="crop-output" aria-label="4 by 6 export preview">
          <h2>A true 4 × 6 PDF.</h2>
          <p className="small-note">101.6 × 152.4 mm · 288 × 432 PDF points</p>
          <canvas
            ref={resultCanvas}
            hidden={!valid}
            role="img"
            aria-label="Proportional 4 by 6 output preview"
          />
          {!valid && (
            <div className="crop-output-empty">
              The selected area will fit here without stretching.
            </div>
          )}
          <label className="field">
            Rotate selected label
            <select
              disabled={!geometry || busy || exporting}
              value={turn}
              onChange={(e) => setTurn(Number(e.target.value))}
            >
              {[0, 90, 180, 270].map((n) => (
                <option key={n} value={n}>
                  {n}° clockwise
                </option>
              ))}
            </select>
          </label>
          <p>
            Fits proportionally and centers on white. Original PDF text and vector bars are
            embedded, not converted to a screenshot. Existing low-resolution images stay
            low-resolution.
          </p>
          <button
            type="button"
            className="button"
            disabled={!valid || exporting}
            onClick={() => void download()}
          >
            {exporting ? 'Creating PDF…' : 'Download 4×6 PDF'}
          </button>
          <p className="small-note">
            Exports the selected page only. No postage is created or validated. Check every barcode,
            address and required mark before printing.
          </p>
        </aside>
      </div>
    </section>
  );
}
