import { useEffect, useState } from 'react';
import { ArrowRightIcon as ArrowRight } from '@phosphor-icons/react/dist/csr/ArrowRight';
import { CheckIcon as Check } from '@phosphor-icons/react/dist/csr/Check';
import { CopyIcon as Copy } from '@phosphor-icons/react/dist/csr/Copy';
import { PrinterIcon as PrintIcon } from '@phosphor-icons/react/dist/csr/Printer';
import {
  printers,
  systemNames,
  getConnectionLabels,
  catalogCheckedLabel,
  type Printer,
} from '../data/printers';
import { calculateCosts } from '../lib/costs';
import AmazonCTA from './AmazonCTA';
import { announceToolUse } from '../lib/analytics';

const rows: { label: string; get: (p: Printer) => string }[] = [
  { label: 'Printing method', get: () => 'Direct thermal · black only' },
  { label: 'Resolution', get: (p) => `${p.dpi} dpi` },
  { label: 'Rated max. speed', get: (p) => `${p.speed} mm/s` },
  {
    label: 'Connections',
    get: (p) => getConnectionLabels(p).join(' · '),
  },
  { label: 'Documented devices', get: (p) => p.systems.map((s) => systemNames[s]).join(' · ') },
  { label: 'Width (manufacturer definition)', get: (p) => p.width },
  { label: 'Label media', get: (p) => p.media },
  { label: 'Automatic cutter', get: (p) => (p.cutter ? 'Yes' : 'No · manual tear-off') },
  { label: 'Hardware price', get: (p) => p.priceNote },
  { label: 'Best suited to', get: (p) => p.fit },
  { label: 'Setup considerations', get: (p) => p.setup },
  { label: 'Main trade-off', get: (p) => p.limitations[0] },
];
export default function Compare() {
  const [ids, setIds] = useState(['rollo-wireless', 'munbyn-itpp941', '']);
  const [differences, setDifferences] = useState(false);
  const [copyState, setCopyState] = useState('Copy comparison link');
  const [showCosts, setShowCosts] = useState(false);
  const [weeklyOrders, setWeeklyOrders] = useState(50);
  const [waste, setWaste] = useState(3);
  const [quotes, setQuotes] = useState<Record<string, { hardware: string; label: string }>>({});
  useEffect(() => {
    const requested = [
      ...new Set(
        (new URLSearchParams(location.search).get('printers') || '')
          .split(',')
          .filter((id) => printers.some((p) => p.id === id)),
      ),
    ].slice(0, 3);
    if (requested.length >= 2) setIds([...requested, ...Array(3 - requested.length).fill('')]);
  }, []);
  const selected = ids.flatMap((id) => printers.filter((p) => p.id === id));
  function select(index: number, value: string) {
    setCopyState('Copy comparison link');
    const next = [...ids];
    next[index] = value;
    setIds(next);
    const query = new URLSearchParams({ printers: next.filter(Boolean).join(',') });
    history.replaceState(null, '', `/compare/?${query}`);
    announceToolUse('comparison_used');
  }
  async function copy() {
    announceToolUse('comparison_used');
    const url = new URL('/compare/', location.origin);
    url.searchParams.set('printers', ids.filter(Boolean).join(','));
    try {
      await navigator.clipboard.writeText(url.href);
      setCopyState('Link copied');
    } catch {
      setCopyState('Copy the URL from your address bar');
      history.replaceState(null, '', url.href);
    }
  }
  function updateQuote(id: string, key: 'hardware' | 'label', value: string) {
    setQuotes((q) => ({
      ...q,
      [id]: { hardware: q[id]?.hardware ?? '', label: q[id]?.label ?? '', [key]: value },
    }));
  }
  function annualCost(id: string) {
    const quote = quotes[id];
    if (!quote || quote.hardware === '' || quote.label === '') return 'Enter both quotes above';
    if (
      !Number.isInteger(weeklyOrders) ||
      weeklyOrders < 0 ||
      weeklyOrders > 100000 ||
      waste < 0 ||
      waste > 99 ||
      Number(quote.hardware) > 100000 ||
      Number(quote.label) > 100
    )
      return 'Check your planning inputs';
    const cost = calculateCosts({
      weeklyOrders,
      printerPrice: Number(quote.hardware),
      packPrice: Number(quote.label),
      labelsPerPack: 1,
      waste,
      years: 1,
    });
    return cost
      ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cost.total)
      : 'Check your planning inputs';
  }
  return (
    <section aria-label="Interactive printer comparison">
      <div className="compare-controls">
        {ids.map((id, index) => (
          <label className="field" key={index}>
            {index === 2 ? 'Third printer (optional)' : `Printer ${index + 1}`}
            <select
              className="compare-select"
              value={id}
              onChange={(e) => select(index, e.currentTarget.value)}
            >
              {index === 2 ? <option value="">Add a third printer</option> : null}
              {printers.map((p) => (
                <option
                  value={p.id}
                  key={p.id}
                  disabled={ids.some((other, i) => i !== index && other === p.id)}
                >
                  {p.name}
                </option>
              ))}
            </select>
          </label>
        ))}
      </div>
      <div className="compare-actions" style={{ marginTop: 0, marginBottom: 22 }}>
        <button
          className="plain-button"
          aria-expanded={showCosts}
          aria-controls="comparison-cost-settings"
          onClick={() => {
            announceToolUse('comparison_used');
            setShowCosts((value) => !value);
          }}
        >
          {showCosts ? 'Hide cost estimates' : 'Estimate ownership costs'}
        </button>
      </div>
      {showCosts ? (
        <div id="comparison-cost-settings" className="comparison-cost-settings">
          <label className="field">
            Orders per week
            <input
              type="number"
              min="0"
              max="100000"
              step="1"
              value={Number.isNaN(weeklyOrders) ? '' : weeklyOrders}
              onChange={(e) => setWeeklyOrders(e.currentTarget.valueAsNumber)}
            />
          </label>
          <label className="field">
            Wasted labels (%)
            <input
              type="number"
              min="0"
              max="99"
              step="1"
              value={Number.isNaN(waste) ? '' : waste}
              onChange={(e) => setWaste(e.currentTarget.valueAsNumber)}
            />
          </label>
          <p className="small-note">
            Enter your own hardware and compatible-media quotes in the table. Estimates use 52 weeks
            and a one-time purchase. Postage, taxes, energy, repairs and subscriptions are excluded.
            Quotes stay in this tab and are not included in the shared URL.
          </p>
        </div>
      ) : null}
      <label className="comparison-options">
        <input
          type="checkbox"
          checked={differences}
          onChange={(e) => {
            announceToolUse('comparison_used');
            setDifferences(e.currentTarget.checked);
          }}
        />{' '}
        Show only differences
      </label>
      <p className="comparison-scroll-note">Scroll the table horizontally to see every printer.</p>
      <div
        className="comparison-wrap"
        tabIndex={0}
        role="region"
        aria-label="Printer specification comparison, scroll horizontally"
      >
        <table className="comparison-table">
          <caption className="sr-only">
            Manufacturer specifications checked {catalogCheckedLabel}. Rated speeds are not our
            measured results.
          </caption>
          <thead>
            <tr>
              <th scope="col">
                The details
                <br />
                that matter.
              </th>
              {selected.map((p) => (
                <th scope="col" key={p.id}>
                  <img src={p.image} alt={p.imageAlt} width="190" height="150" />
                  <p className="small-note editorial-image-caption">
                    Editorial render based on manufacturer references.
                  </p>
                  <h2>
                    <a href={`/printers/${p.id}/`}>{p.name}</a>
                  </h2>
                  <a className="text-link" href={`/printers/${p.id}/`}>
                    View analysis <ArrowRight size={15} />
                  </a>
                  <AmazonCTA printerId={p.id} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const different = new Set(selected.map(row.get)).size > 1;
              if (differences && !different) return null;
              return (
                <tr key={row.label} className={different ? 'different' : ''}>
                  <th scope="row">{row.label}</th>
                  {selected.map((p) => (
                    <td key={p.id}>{row.get(p)}</td>
                  ))}
                </tr>
              );
            })}
            <tr>
              <th scope="row">Manufacturer evidence</th>
              {selected.map((p) => (
                <td key={p.id}>
                  <a
                    className="text-link"
                    href={p.sources[0].url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View source <ArrowRight size={15} />
                  </a>
                  <p className="small-note" style={{ marginTop: 10 }}>
                    Checked {p.checked}
                  </p>
                </td>
              ))}
            </tr>
            {showCosts ? (
              <>
                <tr>
                  <th scope="row">Your hardware quote (USD)</th>
                  {selected.map((p) => (
                    <td key={p.id}>
                      <input
                        className="compare-quote"
                        type="number"
                        min="0"
                        max="100000"
                        step="0.01"
                        aria-label={`${p.name} hardware quote in USD`}
                        placeholder="Enter your quote"
                        value={quotes[p.id]?.hardware ?? ''}
                        onChange={(e) => updateQuote(p.id, 'hardware', e.currentTarget.value)}
                      />
                    </td>
                  ))}
                </tr>
                <tr>
                  <th scope="row">Your cost per label (USD)</th>
                  {selected.map((p) => (
                    <td key={p.id}>
                      <input
                        className="compare-quote"
                        type="number"
                        min="0"
                        max="100"
                        step="0.001"
                        aria-label={`${p.name} cost per label in USD`}
                        placeholder="Enter compatible media cost"
                        value={quotes[p.id]?.label ?? ''}
                        onChange={(e) => updateQuote(p.id, 'label', e.currentTarget.value)}
                      />
                      <p className="small-note" style={{ marginTop: 10 }}>
                        {p.media}
                      </p>
                    </td>
                  ))}
                </tr>
                <tr className="different">
                  <th scope="row">Estimated first-year total</th>
                  {selected.map((p) => (
                    <td key={p.id} aria-live="polite">
                      <strong>{annualCost(p.id)}</strong>
                    </td>
                  ))}
                </tr>
              </>
            ) : null}
          </tbody>
        </table>
      </div>
      <div className="compare-actions">
        <button className="button secondary" aria-label={copyState} onClick={copy}>
          {copyState === 'Link copied' ? <Check size={18} /> : <Copy size={18} />}
          <span role="status">{copyState}</span>
        </button>
        <button
          className="plain-button"
          onClick={() => {
            announceToolUse('comparison_used');
            window.print();
          }}
        >
          <PrintIcon size={19} /> Print comparison
        </button>
        <a href="/cost-calculator/" className="text-link">
          Work out your costs <ArrowRight size={18} />
        </a>
      </div>
      <p className="small-note" style={{ marginTop: 24 }}>
        Resolution and rated speeds describe manufacturer specifications, not a quality score.
        Actual speed depends on settings, media, and print data. OS support is version-dependent.
        AI-generated editorial renders based on manufacturer reference imagery. Visual details may
        vary. Product specifications verified from official manufacturer sources.
      </p>
    </section>
  );
}
