import { useState } from 'react';
import { DownloadSimpleIcon as DownloadSimple } from '@phosphor-icons/react/dist/csr/DownloadSimple';
import { ArrowCounterClockwiseIcon as ArrowCounterClockwise } from '@phosphor-icons/react/dist/csr/ArrowCounterClockwise';
import { calculateCosts, type CostInputs } from '../lib/costs';
import { announceToolUse } from '../lib/analytics';
const withinLimits = (inputs: CostInputs) =>
  inputs.weeklyOrders <= 100000 &&
  Number.isInteger(inputs.weeklyOrders) &&
  inputs.printerPrice <= 100000 &&
  inputs.packPrice <= 100000 &&
  inputs.labelsPerPack <= 1000000 &&
  Number.isInteger(inputs.labelsPerPack) &&
  inputs.waste <= 99;
const defaults: CostInputs = {
  weeklyOrders: 50,
  printerPrice: 200,
  packPrice: 19.99,
  labelsPerPack: 500,
  waste: 3,
  years: 1,
};
const dollars = (value: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  }).format(value);
export default function Calculator() {
  const [inputs, setInputs] = useState<CostInputs>(defaults);
  const result = calculateCosts(inputs);
  const update = (key: keyof CostInputs, value: number) => {
    const next = { ...inputs, [key]: value };
    setInputs(next);
    if (calculateCosts(next) && withinLimits(next)) announceToolUse('cost_calculator_used');
  };
  const fields: {
    key: keyof CostInputs;
    label: string;
    hint: string;
    min: number;
    step: number;
    max?: number;
  }[] = [
    {
      key: 'weeklyOrders',
      label: 'Orders per week',
      hint: 'One shipping label per order.',
      min: 0,
      max: 100000,
      step: 1,
    },
    {
      key: 'printerPrice',
      label: 'Printer cost (USD)',
      hint: 'Enter your actual purchase quote.',
      min: 0,
      max: 100000,
      step: 0.01,
    },
    {
      key: 'packPrice',
      label: 'Label pack price (USD)',
      hint: 'Use the pack you plan to buy.',
      min: 0,
      max: 100000,
      step: 0.01,
    },
    {
      key: 'labelsPerPack',
      label: 'Labels in one pack',
      hint: 'For continuous rolls, estimate usable labels.',
      min: 1,
      max: 1000000,
      step: 1,
    },
    {
      key: 'waste',
      label: 'Wasted labels (%)',
      hint: 'Misprints, test prints, and damaged labels.',
      min: 0,
      max: 99,
      step: 1,
    },
  ];
  const inRange = withinLimits(inputs);
  const valid = result && inRange;
  function download() {
    if (!valid || !result) return;
    const rows = [
      ['Tagrivo printing cost estimate', 'USD; user-entered assumptions, not retailer prices'],
      ...Object.entries(inputs).map(([key, value]) => [key, String(value)]),
      ...Object.entries(result).map(([key, value]) => [
        key,
        String(Math.round(value * 10000) / 10000),
      ]),
    ];
    const blob = new Blob(
      [
        rows
          .map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(','))
          .join('\r\n'),
      ],
      {
        type: 'text/csv;charset=utf-8;',
      },
    );
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'tagrivo-cost-estimate.csv';
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return (
    <div className="calculator">
      <div>
        <p className="helper" style={{ margin: '0 0 30px' }}>
          <strong>Start with your numbers.</strong> The defaults below are illustrative planning
          assumptions, not verified product or label prices. Replace them with your quotes.
        </p>
        <div className="calculator-fields">
          {fields.map((field) => (
            <label className="field" key={field.key}>
              {field.label}
              <input
                type="number"
                min={field.min}
                max={field.max}
                step={field.step}
                value={Number.isNaN(inputs[field.key]) ? '' : inputs[field.key]}
                onChange={(e) => update(field.key, e.currentTarget.valueAsNumber)}
                aria-describedby={`${field.key}-hint`}
                aria-label={field.label}
                aria-invalid={
                  !Number.isFinite(inputs[field.key]) ||
                  inputs[field.key] < field.min ||
                  (field.max !== undefined && inputs[field.key] > field.max) ||
                  (['weeklyOrders', 'labelsPerPack'].includes(field.key) &&
                    !Number.isInteger(inputs[field.key]))
                }
                aria-errormessage={!valid ? 'calculator-error' : undefined}
              />
              <small id={`${field.key}-hint`}>{field.hint}</small>
            </label>
          ))}
          <label className="field">
            Planning period
            <select
              value={inputs.years}
              onChange={(e) => update('years', Number(e.currentTarget.value))}
            >
              <option value={1}>1 year</option>
              <option value={2}>2 years</option>
              <option value={3}>3 years</option>
              <option value={5}>5 years</option>
            </select>
            <small>The printer is purchased once.</small>
          </label>
        </div>
        <button
          className="plain-button"
          style={{ marginTop: 20 }}
          onClick={() => setInputs(defaults)}
        >
          <ArrowCounterClockwise size={17} /> Reset assumptions
        </button>
        <div className="calculator-explanation">
          <h2>The cost behind the label.</h2>
          <p>
            Hardware is only the beginning. Order volume, the exact media format, and wasted prints
            determine what you spend over time.
          </p>
          <p>
            This estimate includes a one-time printer purchase and label consumption. It excludes
            postage, tax, electricity, repairs, financing, and subscription fees. Unused stock is
            valued proportionally; whole-pack purchase totals may be higher.
          </p>
          <a className="text-link" href="/guides/printing-costs/">
            Read the cost guide
          </a>
        </div>
      </div>
      <div className="calc-results" aria-live="polite" aria-atomic="true">
        <h2>Your {inputs.years}-year printing estimate</h2>
        {valid && result ? (
          <>
            <p className="cost-total">{dollars(result.total)}</p>
            <p className="small-note">Hardware + estimated labels. Postage excluded.</p>
            <div
              className="cost-visual"
              role="img"
              aria-label={`Hardware ${dollars(inputs.printerPrice)}, labels ${dollars(result.consumables)}`}
            >
              <span
                style={{
                  width: `${result.total ? (inputs.printerPrice / result.total) * 100 : 0}%`,
                }}
              />
              <span style={{ flex: 1 }} />
            </div>
            <div className="chart-key">
              <span>Printer</span>
              <span>Label stock</span>
            </div>
            <dl className="calc-breakdown">
              <div>
                <dt>One-time printer cost</dt>
                <dd>{dollars(inputs.printerPrice)}</dd>
              </div>
              <div>
                <dt>Label consumption</dt>
                <dd>{dollars(result.consumables)}</dd>
              </div>
              <div>
                <dt>Labels needed (including waste)</dt>
                <dd>{result.labels.toLocaleString('en-US')}</dd>
              </div>
              <div>
                <dt>Cost per shipped order</dt>
                <dd>{result.orders ? dollars(result.perOrder) : 'No orders planned'}</dd>
              </div>
              <div>
                <dt>Average per month</dt>
                <dd>{dollars(result.monthly)}</dd>
              </div>
            </dl>
            <button className="button secondary" onClick={download}>
              <DownloadSimple size={18} /> Download estimate
            </button>
            <p className="formula">
              How it works: orders × 52 × years ÷ (1 − waste rate), rounded up to whole labels.
              Multiply by cost per label, then add the printer.
            </p>
          </>
        ) : (
          <p id="calculator-error" className="error" role="alert" style={{ marginTop: 25 }}>
            Check your inputs. Use non-negative amounts, whole orders and label counts, at least one
            label per pack, and waste from 0% to 99%. Amounts and weekly orders are limited to
            100,000; packs to 1,000,000 labels.
          </p>
        )}
      </div>
    </div>
  );
}
