import { useEffect, useState } from 'react';
import {
  estimatePrintingCosts,
  comparePrintingSetups,
  costProfiles,
  defaultSetup,
  inputRules,
  validCostField,
  parseCostState,
  serializeCostState,
  type PrintingSetup,
} from '../lib/printing-costs';
import { announceToolUse } from '../lib/analytics';
import '../styles/calculator.css';
const money = (v: number, digits = 2) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(v);
const count = (v: number) => v.toLocaleString('en-US');
const fields: Record<keyof PrintingSetup, { label: string; hint: string; slider?: number }> = {
  dailyLabels: {
    label: 'Usable labels per day',
    hint: 'One usable shipping label per parcel. Excludes waste.',
    slider: 500,
  },
  daysPerMonth: {
    label: 'Operating days per month',
    hint: 'A typical month for your business.',
    slider: 31,
  },
  wastePercent: {
    label: 'Wasted labels (%)',
    hint: 'Share of consumed labels lost to tests, misprints or damage.',
    slider: 25,
  },
  packPrice: {
    label: 'Label pack price (USD)',
    hint: 'Your compatible stock quote. Include delivery if needed.',
  },
  labelsPerPack: {
    label: 'Labels per pack',
    hint: 'For continuous rolls, count complete usable labels.',
  },
  printerPrice: {
    label: 'Printer purchase price (USD)',
    hint: 'Your hardware quote, not a live retail price.',
  },
  lifeMonths: {
    label: 'Estimated useful life (months)',
    hint: 'Your planning assumption, not a manufacturer lifespan.',
  },
  maintenanceMonthly: {
    label: 'Maintenance per month (USD)',
    hint: 'Optional allowance. Zero excludes it.',
  },
  energyKwhMonthly: {
    label: 'Electricity use per month (kWh)',
    hint: 'Enter measured use or your documented estimate; no wattage assumed.',
  },
  electricityRate: {
    label: 'Electricity price (USD/kWh)',
    hint: 'Use your tariff. Both electricity fields are needed.',
  },
  otherMonthly: {
    label: 'Other monthly costs (USD)',
    hint: 'Optional software or other expenses. Avoid double-counting.',
  },
};
const initialB = { ...defaultSetup, printerPrice: 300, packPrice: 15 };
type Change = (key: keyof PrintingSetup, value: number) => void;
function SetupFields({
  values,
  prefix,
  onChange,
  volume = true,
}: {
  values: PrintingSetup;
  prefix: string;
  onChange: Change;
  volume?: boolean;
}) {
  function field(key: keyof PrintingSetup) {
    const info = fields[key],
      rule = inputRules[key],
      value = values[key],
      valid = validCostField(key, value),
      id = `${prefix}-${key}`;
    return (
      <div className="cost-field" key={key}>
        <label htmlFor={id}>{info.label}</label>
        <input
          id={id}
          type="number"
          inputMode={rule.step === 1 ? 'numeric' : 'decimal'}
          min={rule.min}
          max={rule.max}
          step={rule.step}
          value={Number.isNaN(value) ? '' : value}
          onChange={(e) => onChange(key, e.currentTarget.valueAsNumber)}
          aria-invalid={!valid}
          aria-describedby={`${id}-help${valid ? '' : ` ${id}-error`}`}
        />
        {info.slider && (
          <input
            type="range"
            aria-label={`${info.label} slider`}
            aria-describedby={`${id}-help`}
            min={rule.min}
            max={Math.min(rule.max, Math.max(info.slider, Number.isFinite(value) ? value : 0))}
            step={rule.step}
            value={valid ? value : rule.min}
            onChange={(e) => onChange(key, Number(e.currentTarget.value))}
          />
        )}
        <small id={`${id}-help`}>{info.hint}</small>
        {!valid && (
          <span className="error" id={`${id}-error`}>
            Enter {rule.step === 1 ? 'a whole number' : 'a number'} from {count(rule.min)} to{' '}
            {count(rule.max)}.
          </span>
        )}
      </div>
    );
  }
  const group = (title: string, keys: (keyof PrintingSetup)[], extra = '') => (
    <fieldset className="cost-group">
      <legend>{title}</legend>
      <div className={`cost-fields ${extra}`}>{keys.map(field)}</div>
    </fieldset>
  );
  return (
    <>
      {volume &&
        group(
          'Your printing volume',
          ['dailyLabels', 'daysPerMonth', 'wastePercent'],
          'volume-fields',
        )}
      {group('Compatible label stock', ['packPrice', 'labelsPerPack'])}
      {group('Printer investment', ['printerPrice', 'lifeMonths'])}
      <details className="cost-advanced">
        <summary>Optional costs: maintenance, electricity & other expenses</summary>
        <p className="cost-help">
          All start at zero. Electricity is monthly kWh × your tariff. Add only costs you can
          estimate.
        </p>
        <div className="cost-fields">
          {(
            ['maintenanceMonthly', 'energyKwhMonthly', 'electricityRate', 'otherMonthly'] as const
          ).map(field)}
        </div>
      </details>
    </>
  );
}
type Estimate = NonNullable<ReturnType<typeof estimatePrintingCosts>>;
function Summary({ r, values }: { r: Estimate; values: PrintingSetup }) {
  const parts = [
    ['Label consumption', r.consumables, 'stock'],
    ['Printer allocation', r.printerAllocation, 'hardware'],
    ['Optional costs', r.extras, 'extra'],
  ] as const;
  const rows = [
    ['Stock per label before waste', money(r.stockPerLabel, 4)],
    [
      'Consumables per usable label',
      r.consumablesPerUsableLabel === null ? 'No volume' : money(r.consumablesPerUsableLabel, 4),
    ],
    ['Usable labels / month', count(r.usableLabels)],
    ['Labels consumed / month', count(r.consumedLabels)],
    ['Waste included in consumption', `${count(r.wastedLabels)} · ${money(r.wasteCost)}`],
    ['Operating cost / month', money(r.operatingMonthly)],
    ['Printer allocation / month', money(r.printerAllocation)],
  ];
  return (
    <aside className="cost-summary" id="cost-estimate" aria-label="Setup A cost estimate">
      <h2>Your printing estimate</h2>
      <p className="cost-help">USD · editable planning assumptions</p>
      <div className="cost-feature">
        <span>Total per usable label</span>
        <strong data-testid="cost-per-label">
          {r.totalPerUsableLabel === null ? '—' : money(r.totalPerUsableLabel, 4)}
        </strong>
        <p>Label stock + allocated printer cost + optional costs. Postage excluded.</p>
      </div>
      <div className="cost-metrics">
        <div>
          <span>Per month</span>
          <strong data-testid="monthly-cost">{money(r.monthly)}</strong>
        </div>
        <div>
          <span>Annualized</span>
          <strong>{money(r.annual)}</strong>
        </div>
      </div>
      <dl className="cost-rows">
        {rows.map(([label, value]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
      {!r.usableLabels && (
        <p className="cost-help">
          No usable labels planned. Per-label results need a volume above zero; fixed costs still
          apply.
        </p>
      )}
      <div className="cost-chart">
        <h3>Where the monthly cost goes</h3>
        <div className="cost-stack" aria-hidden="true">
          {parts.map(([, value, key]) => (
            <span
              key={key}
              className={`cost-part-${key}`}
              style={{ width: `${r.monthly ? (value / r.monthly) * 100 : 0}%` }}
            />
          ))}
        </div>
        <dl className="cost-chart-key">
          {parts.map(([label, value, key]) => (
            <div key={key}>
              <dt>
                <span className={`cost-swatch cost-part-${key}`} aria-hidden="true" />
                {label}
              </dt>
              <dd>
                {money(value)}{' '}
                <span>({r.monthly ? ((value / r.monthly) * 100).toFixed(1) : '0'}%)</span>
              </dd>
            </div>
          ))}
        </dl>
        {!r.monthly && (
          <p className="cost-help">No costs entered. Add your quotes to see a distribution.</p>
        )}
      </div>
      <p className="cost-help">
        Allocation spreads your {money(values.printerPrice)} purchase over {values.lifeMonths}{' '}
        months. It is not a recurring payment. Annualized cost is 12 × this representative month.
      </p>
    </aside>
  );
}
export default function Calculator() {
  const [a, setA] = useState<PrintingSetup>({ ...defaultSetup }),
    [b, setB] = useState<PrintingSetup>({ ...initialB }),
    [comparing, setComparing] = useState(false),
    [months, setMonths] = useState(12),
    [status, setStatus] = useState(''),
    [announcement, setAnnouncement] = useState(''),
    [ready, setReady] = useState(false);
  const r = estimatePrintingCosts(a),
    comparison = comparing ? comparePrintingSetups(a, b, months) : null,
    allValid = !!r && (!comparing || !!comparison);
  useEffect(() => {
    setReady(true);
    if (location.hash.startsWith('#calc=')) {
      const s = parseCostState(location.hash);
      if (s) {
        setA(s.a);
        setB(s.b);
        setComparing(s.compare);
        setMonths(s.months);
        setStatus('Shared estimate loaded. All assumptions are editable.');
      } else
        setStatus(
          'This shared estimate is invalid or unsupported. Start with the editable example below.',
        );
    }
  }, []);
  useEffect(() => {
    const timer = setTimeout(
      () =>
        setAnnouncement(
          r
            ? `Estimated monthly cost ${money(r.monthly)}. ${r.totalPerUsableLabel === null ? 'No usable labels planned.' : `${money(r.totalPerUsableLabel, 4)} per usable label.`}`
            : 'Check the highlighted fields to calculate your estimate.',
        ),
      450,
    );
    return () => clearTimeout(timer);
  }, [r?.monthly, r?.totalPerUsableLabel]);
  const signal = () => announceToolUse('cost_calculator_used');
  const update: Change = (key, value) => {
    setA((v) => ({ ...v, [key]: value }));
    setStatus('');
    if (validCostField(key, value)) signal();
  };
  const updateB: Change = (key, value) => {
    setB((v) => ({ ...v, [key]: value }));
    setStatus('');
    if (validCostField(key, value)) signal();
  };
  function preset(id: keyof typeof costProfiles) {
    setA({ ...costProfiles[id].values });
    setStatus(
      `${costProfiles[id].label} example loaded. Replace illustrative quotes with your own.`,
    );
    signal();
    announceToolUse('cost_calculator_preset_used');
  }
  function reset() {
    setA({ ...defaultSetup });
    setB({ ...initialB });
    setMonths(12);
    setComparing(false);
    if (location.hash.startsWith('#calc='))
      history.replaceState(null, '', location.pathname + location.search);
    setStatus('All assumptions reset to the Small Etsy Shop example.');
  }
  function summary() {
    if (!r) return '';
    return [
      'Tagrivo — shipping label printing estimate (USD)',
      'User-entered/illustrative assumptions. Not retailer quotes; postage excluded.',
      ...Object.entries(a).map(
        ([key, value]) => `${fields[key as keyof PrintingSetup].label}: ${value}`,
      ),
      `Usable labels/month: ${r.usableLabels}`,
      `Consumed labels/month: ${r.consumedLabels}`,
      `Waste cost/month (already included): ${money(r.wasteCost)}`,
      `Stock/label before waste: ${money(r.stockPerLabel, 4)}`,
      `Total/usable label: ${r.totalPerUsableLabel === null ? 'No volume' : money(r.totalPerUsableLabel, 4)}`,
      `Operating/month: ${money(r.operatingMonthly)}`,
      `Allocation/month: ${money(r.printerAllocation)}`,
      `Monthly estimate: ${money(r.monthly)}`,
      `Annualized: ${money(r.annual)}`,
      ...(comparison
        ? [
            'Setup B (same volume and waste as A):',
            ...Object.entries(b)
              .filter(([k]) => !['dailyLabels', 'daysPerMonth', 'wastePercent'].includes(k))
              .map(([k, v]) => `${fields[k as keyof PrintingSetup].label}: ${v}`),
            `Comparison period: ${months} months`,
            `A upfront + operating: ${money(comparison.totalA)}`,
            `B upfront + operating: ${money(comparison.totalB)}`,
          ]
        : []),
      'Constant volume/prices; no automatic replacement. Whole-pack cash may differ.',
      'https://tagrivo.pages.dev/cost-calculator/',
    ].join('\n');
  }
  async function copy(shared = false) {
    try {
      const text = shared
        ? `${location.origin}${location.pathname}#${serializeCostState({ a, b: { ...(comparing ? b : initialB), dailyLabels: a.dailyLabels, daysPerMonth: a.daysPerMonth, wastePercent: a.wastePercent }, compare: comparing, months: comparing ? months : 12 })}`
        : summary();
      await navigator.clipboard.writeText(text);
      setStatus(
        shared
          ? 'Share link copied. It contains only your numeric assumptions.'
          : 'Estimate summary copied.',
      );
      announceToolUse(shared ? 'cost_calculator_shared' : 'cost_calculator_summary_copied');
    } catch {
      setStatus(
        'Clipboard unavailable. Download the summary, or allow clipboard access and try again.',
      );
    }
  }
  function download() {
    const url = URL.createObjectURL(new Blob([summary()], { type: 'text/plain;charset=utf-8' })),
      link = document.createElement('a');
    link.href = url;
    link.download = 'tagrivo-printing-cost-estimate.txt';
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setStatus('Estimate downloaded.');
    announceToolUse('cost_calculator_downloaded');
  }
  return (
    <div className="cost-tool" id="calculator" aria-busy={!ready}>
      <fieldset className="cost-interactive" disabled={!ready}>
        <legend className="sr-only">Shipping label printing calculator</legend>
        <div className="cost-toolbar">
          <div>
            <h2>Start with your workflow.</h2>
            <p>Illustrative profiles, not market averages. Every number is yours to change.</p>
          </div>
          <button className="plain-button" onClick={reset}>
            Reset all values
          </button>
        </div>
        <div className="cost-presets" aria-label="Illustrative printing profiles">
          {Object.entries(costProfiles).map(([key, p]) => (
            <button
              key={key}
              className="button secondary"
              onClick={() => preset(key as keyof typeof costProfiles)}
            >
              {p.label}
              <span>{p.values.dailyLabels} usable labels/day</span>
            </button>
          ))}
        </div>
        <div className="cost-layout">
          <div>
            <div className="cost-mobile-summary" aria-label="Live printing estimate">
              <div>
                <span>Monthly estimate</span>
                <strong>{r ? money(r.monthly) : 'Check inputs'}</strong>
              </div>
              <div>
                <span>Per usable label</span>
                <strong>
                  {r?.totalPerUsableLabel != null ? money(r.totalPerUsableLabel, 4) : '—'}
                </strong>
              </div>
              {r && <a href="#cost-estimate">View full estimate</a>}
            </div>
            <SetupFields values={a} prefix="setup-a" onChange={update} />
          </div>
          {r ? (
            <Summary r={r} values={a} />
          ) : (
            <aside className="cost-summary">
              <h2>Let’s check the inputs.</h2>
              <p className="error">
                Correct the highlighted fields to see an estimate. Blank fields are not treated as
                zero.
              </p>
            </aside>
          )}
        </div>
        <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">
          {announcement}
        </p>
        {r && (
          <section className="cost-insights" aria-label="Cost and volume insights">
            <div className="cost-chart">
              <h2>A month, and a year.</h2>
              <p className="cost-help">
                Same monthly assumptions, annualized. Includes printer allocation.
              </p>
              <div className="cost-hbars">
                {[
                  ['Month', r.monthly],
                  ['Year', r.annual],
                ].map(([label, v]) => (
                  <div key={label}>
                    <span>{label}</span>
                    <div className="cost-bar-track" aria-hidden="true">
                      <i style={{ transform: `scaleX(${r.annual ? Number(v) / r.annual : 0})` }} />
                    </div>
                    <strong>{money(Number(v))}</strong>
                  </div>
                ))}
              </div>
              <p className="cost-help">
                Whole-pack purchases for this month: {count(r.packsNeeded)}{' '}
                {r.packsNeeded === 1 ? 'pack' : 'packs'} · {money(r.packPurchase)}. Unused labels
                remain stock, not waste.
              </p>
            </div>
            <div className="cost-chart">
              <h2>What if volume changes?</h2>
              <p className="cost-help">
                Select a daily volume to update the estimate. Days, quotes and waste stay the same.
              </p>
              <div className="cost-volume">
                {[0.5, 1, 2].map((factor) => {
                  const daily = Math.min(10000, Math.round((a.dailyLabels || 10) * factor)),
                    example = estimatePrintingCosts({ ...a, dailyLabels: daily })!,
                    max = estimatePrintingCosts({
                      ...a,
                      dailyLabels: Math.min(10000, (a.dailyLabels || 10) * 2),
                    })!;
                  return (
                    <button
                      key={factor}
                      onClick={() => update('dailyLabels', daily)}
                      aria-label={`Use ${daily} usable labels per day`}
                    >
                      <span>{count(daily)} / day</span>
                      <span className="cost-volume-track" aria-hidden="true">
                        <i
                          style={{
                            transform: `scaleX(${max.monthly ? example.monthly / max.monthly : 0})`,
                          }}
                        />
                      </span>
                      <strong>
                        {money(example.monthly)}
                        <small> / month</small>
                      </strong>
                    </button>
                  );
                })}
              </div>
              <p className="cost-help">
                Fixed cost per label changes with volume. This does not predict printer capacity or
                reliability.
              </p>
            </div>
          </section>
        )}
        <section className="cost-compare" id="compare-setups">
          <div className="cost-section-heading">
            <div>
              <h2>Compare two printing setups.</h2>
              <p>Same volume and waste. Different hardware and compatible stock quotes.</p>
            </div>
            <button
              className={`button ${comparing ? 'secondary' : ''}`}
              aria-expanded={comparing}
              aria-controls="setup-comparison"
              onClick={() => {
                setComparing(!comparing);
                if (!comparing) {
                  signal();
                  announceToolUse('cost_calculator_compare_used');
                }
              }}
            >
              {comparing ? 'Close comparison' : 'Compare two setups'}
            </button>
          </div>
          {comparing && (
            <div id="setup-comparison">
              <div className="cost-comparison-layout">
                <div>
                  <h3>Setup B</h3>
                  <p className="cost-help">
                    Setup A is above. B shares A’s volume and waste. Its starting quotes are
                    illustrative, not a product offer.
                  </p>
                  <SetupFields values={b} prefix="setup-b" onChange={updateB} volume={false} />
                </div>
                <div className="cost-comparison-result">
                  <label className="cost-period" htmlFor="comparison-months">
                    Comparison period (months)
                    <input
                      id="comparison-months"
                      type="number"
                      min="1"
                      max="120"
                      step="1"
                      value={Number.isNaN(months) ? '' : months}
                      onChange={(e) => setMonths(e.currentTarget.valueAsNumber)}
                      aria-invalid={!Number.isInteger(months) || months < 1 || months > 120}
                    />
                  </label>
                  {comparison ? (
                    <>
                      <div className="cost-table-scroll">
                        <table>
                          <caption>Ownership cost · constant monthly assumptions</caption>
                          <thead>
                            <tr>
                              <th scope="col">Cost (USD)</th>
                              <th scope="col">Setup A</th>
                              <th scope="col">Setup B</th>
                            </tr>
                          </thead>
                          <tbody>
                            {[
                              ['Initial purchase', a.printerPrice, b.printerPrice],
                              [
                                'Operating / month',
                                comparison.a.operatingMonthly,
                                comparison.b.operatingMonthly,
                              ],
                              [
                                'Operating / year',
                                comparison.a.operatingMonthly * 12,
                                comparison.b.operatingMonthly * 12,
                              ],
                              [`Purchase + ${months} months`, comparison.totalA, comparison.totalB],
                            ].map(([label, x, y]) => (
                              <tr key={label}>
                                <th scope="row">{label}</th>
                                <td>{money(Number(x))}</td>
                                <td>{money(Number(y))}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <p className="cost-help">
                        Printer purchase counted once, plus operating costs. No allocation added
                        again, financing, discounting or replacement hardware.
                      </p>
                      <p className="cost-break-even">
                        {comparison.breakEvenMonths !== null
                          ? `Estimated cash-cost crossover: ${comparison.breakEvenMonths.toFixed(1)} months${comparison.breakEvenMonths > months ? ' (outside your period)' : ''}. Linear projection at constant volume and prices.`
                          : 'No positive cash-cost crossover under these assumptions. One setup may remain less costly, or their costs may match.'}
                      </p>
                      {comparison.beyondLife && (
                        <p className="cost-help">
                          Your period exceeds a stated useful life. Replacement costs are not
                          modeled; budget for them separately.
                        </p>
                      )}
                      <p className="cost-help">
                        Lower cost is not a recommendation. Compatibility, media, support and
                        reliability still matter.
                      </p>
                    </>
                  ) : (
                    <p className="error">
                      Check both setups and enter a whole period from 1 to 120 months.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </section>
        <div className="cost-actions">
          <button className="button" disabled={!allValid} onClick={() => copy()}>
            Copy summary
          </button>
          <button className="button secondary" disabled={!allValid} onClick={() => copy(true)}>
            Copy share link
          </button>
          <button className="button secondary" disabled={!allValid} onClick={download}>
            Download summary
          </button>
        </div>
        <p className="cost-status" role="status" aria-live="polite">
          {status ||
            'Calculations stay in your browser. No account or personal information needed.'}
        </p>
        <section className="cost-next">
          <h2>Find a printer that fits your workflow.</h2>
          <p>
            Start with compatibility, then compare the right media. These estimates are planning
            arithmetic, not hands-on product tests.
          </p>
          <div>
            <a className="text-link" href="/printer-finder/">
              Use the Printer Finder
            </a>
            <a
              className="text-link"
              href="/compare/"
              onClick={() => announceToolUse('cost_calculator_comparison_click')}
            >
              Compare verified specifications
            </a>
            <a
              className="text-link"
              href="/guides/rollo-wireless-vs-munbyn-itpp941-usb/"
              onClick={() => announceToolUse('cost_calculator_comparison_click')}
            >
              Rollo vs MUNBYN USB
            </a>
            <a className="text-link" href="/guides/printing-costs/">
              Understand label costs
            </a>
          </div>
        </section>
      </fieldset>
    </div>
  );
}
