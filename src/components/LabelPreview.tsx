import { useEffect, useId, useState } from 'react';
import { labelLayout, type LabelLayout } from '../lib/label-preview';
import { announceToolUse } from '../lib/analytics';
export default function LabelPreview() {
  const [values, setValues] = useState<LabelLayout>({
    width: 101.6,
    height: 152.4,
    margin: 2,
    scale: 96,
    landscape: false,
  });
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  const id = useId().replace(/:/g, '');
  const result = labelLayout(values);
  const sizeValue = ['101.6,152.4', '100,150', '102,152'].includes(
    `${values.width},${values.height}`,
  )
    ? `${values.width},${values.height}`
    : 'custom';
  const update = <K extends keyof LabelLayout>(key: K, value: LabelLayout[K]) => {
    setValues((v) => ({ ...v, [key]: value }));
    announceToolUse('label_preview_used');
  };
  return (
    <section className="workbench" aria-label="Shipping label layout workbench">
      <fieldset
        className="workbench-controls"
        disabled={!ready}
        style={{ border: 0, padding: 0, margin: 0, minWidth: 0 }}
      >
        <legend className="sr-only">Label layout settings</legend>
        <label className="field">
          Stock size
          <select
            onChange={(e) => {
              const [width, height] = e.target.value.split(',').map(Number);
              setValues((v) => ({ ...v, width, height }));
              announceToolUse('label_preview_used');
            }}
            value={sizeValue}
          >
            <option value="custom" disabled>
              Custom dimensions below
            </option>
            <option value="101.6,152.4">4 × 6 in (101.6 × 152.4 mm)</option>
            <option value="100,150">100 × 150 mm (different size)</option>
            <option value="102,152">102 × 152 mm</option>
          </select>
        </label>
        {(['width', 'height', 'margin', 'scale'] as const).map((key) => (
          <label className="field" key={key}>
            {
              {
                width: 'Stock width (mm)',
                height: 'Stock height (mm)',
                margin: 'Inset on every edge (mm)',
                scale: 'Document scale (%)',
              }[key]
            }
            <input
              type="number"
              min={key === 'scale' ? 10 : key === 'margin' ? 0 : 25}
              max={key === 'scale' ? 200 : key === 'margin' ? 30 : 300}
              step="0.1"
              value={Number.isFinite(values[key]) ? values[key] : ''}
              onChange={(e) => update(key, e.target.valueAsNumber)}
              aria-describedby="preview-note"
            />
          </label>
        ))}
        <label className="field">
          Orientation
          <select
            value={values.landscape ? 'landscape' : 'portrait'}
            onChange={(e) => update('landscape', e.target.value === 'landscape')}
          >
            <option value="portrait">Portrait</option>
            <option value="landscape">Landscape</option>
          </select>
        </label>
        <button
          type="button"
          className="plain-button"
          disabled={!result}
          onClick={() => result && update('scale', Math.floor(result.fitScale * 10) / 10)}
        >
          Fit sample inside the inset
        </button>
        <p className="small-note" id="preview-note">
          All settings stay in this tab. This diagram cannot detect a printer’s actual printable
          area, calibrate hardware or create postage. The inset is your assumption, not a model
          specification.
        </p>
      </fieldset>
      <div className="workbench-output">
        <h2>Your layout, at a glance.</h2>
        <div role="status" aria-live="polite">
          {!result ? (
            <p className="error">
              Use stock dimensions from 25–300 mm, an inset from 0–30 mm smaller than half the
              stock, and scale from 10–200%.
            </p>
          ) : (
            <p className={result.clipped ? 'error' : 'workbench-summary'}>
              {result.w.toFixed(1)} × {result.h.toFixed(1)} mm · {values.scale}% scale.{' '}
              {result.clipped
                ? 'Content extends past the inset: clipping is possible.'
                : 'Sample fits inside your assumed inset.'}
            </p>
          )}
        </div>
        {result && (
          <svg
            viewBox={`-8 -8 ${result.w + 16} ${result.h + 16}`}
            role="img"
            aria-labelledby={`${id}-title ${id}-desc`}
          >
            <title id={`${id}-title`}>Fictitious shipping label layout preview</title>
            <desc id={`${id}-desc`}>
              Not a valid carrier label. Dashed green line shows the assumed inset. Bars are
              illustrative and contain no tracking information.
            </desc>
            <defs>
              <clipPath id={`${id}-stock`}>
                <rect width={result.w} height={result.h} />
              </clipPath>
            </defs>
            <rect
              width={result.w}
              height={result.h}
              fill="white"
              stroke="#59635e"
              strokeWidth=".5"
            />
            <g clipPath={`url(#${id}-stock)`}>
              <g
                transform={`translate(${result.x} ${result.y}) scale(${values.scale / 100})`}
                fill="#171e1b"
                fontFamily="DM Sans, sans-serif"
              >
                <g transform={values.landscape ? 'translate(152.4 0) rotate(90)' : undefined}>
                  <rect x="7" y="7" width="86" height="16" fill="#185642" />
                  <text x="11" y="17" fontSize="4.3" fill="white">
                    TAGRIVO · SAMPLE ONLY
                  </text>
                  <text x="8" y="34" fontSize="4">
                    DEMO ORDER / 000123
                  </text>
                  <text x="8" y="45" fontSize="3.8">
                    SHIP TO: FICTIONAL RECIPIENT
                  </text>
                  <text x="8" y="53" fontSize="3.3">
                    Example packing station · Demo destination
                  </text>
                  <path d="M8 60H93M8 89H93" stroke="#171e1b" strokeWidth=".4" />
                  <text x="8" y="70" fontSize="4.5">
                    NOT VALID FOR POSTAGE
                  </text>
                  <text x="8" y="80" fontSize="3.1">
                    No carrier service · No real tracking number
                  </text>
                  {Array.from({ length: 35 }, (_, i) => (
                    <rect
                      key={i}
                      x={9 + i * 2.4}
                      y="100"
                      width={i % 3 === 0 ? 1.4 : 0.6}
                      height="23"
                    />
                  ))}
                  <text x="8" y="133" fontSize="3.3">
                    ILLUSTRATIVE BARS · DO NOT SCAN
                  </text>
                  <text x="8" y="143" fontSize="3">
                    4 × 6 document · 101.6 × 152.4 mm
                  </text>
                </g>
              </g>
            </g>
            <rect
              x={values.margin}
              y={values.margin}
              width={result.w - 2 * values.margin}
              height={result.h - 2 * values.margin}
              fill="none"
              stroke="#185642"
              strokeWidth=".5"
              strokeDasharray="2 1"
            />
          </svg>
        )}
        <p className="small-note">
          Preview only. A carrier-approved label must come from your shipping provider. Rotate the
          actual source PDF and choose the correct stock in its print dialog; changing orientation
          here is illustrative.
        </p>
      </div>
    </section>
  );
}
