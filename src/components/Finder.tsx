import { useEffect, useRef, useState } from 'react';
import { ArrowRightIcon as ArrowRight } from '@phosphor-icons/react/dist/csr/ArrowRight';
import { ArrowLeftIcon as ArrowLeft } from '@phosphor-icons/react/dist/csr/ArrowLeft';
import { ArrowCounterClockwiseIcon as ArrowCounterClockwise } from '@phosphor-icons/react/dist/csr/ArrowCounterClockwise';
import { recommend, type FinderAnswers } from '../lib/recommend';
import {
  systemNames,
  connectionNames,
  type OperatingSystem,
  type Connection,
} from '../data/printers';

const steps = ['Sales platform', 'Operating system', 'Weekly orders', 'Connection', 'Budget'];
const titles = [
  'How do you sell?',
  'What do you print from?',
  'How many orders do you ship?',
  'How would you like to connect?',
  'What is your printer budget?',
];
const descriptions = [
  'We’ll tailor the setup guidance to your selling workflow.',
  'Choose the device you will actually use to print shipping labels.',
  'A typical week is enough. This helps us explain media handling and long-term cost.',
  'Select the connection you need. Bluetooth and Wi-Fi are different workflows.',
  'Your maximum hardware budget in US dollars. Labels and shipping are separate.',
];
export default function Finder({ compact = false }: { compact?: boolean }) {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [answers, setAnswers] = useState<FinderAnswers>({
    platform: '',
    os: 'windows',
    volume: 50,
    connection: 'any',
    budget: 300,
  });
  const [picked, setPicked] = useState<Record<number, boolean>>({});
  const [error, setError] = useState('');
  const heading = useRef<HTMLHeadingElement>(null);
  const form = useRef<HTMLFormElement>(null);
  const mounted = useRef(false);
  useEffect(() => {
    if (compact) return;
    const platform = new URLSearchParams(window.location.search).get('platform');
    if (platform && ['Etsy', 'Shopify', 'eBay', 'Other'].includes(platform)) {
      setAnswers((a) => ({ ...a, platform }));
      setPicked({ 0: true });
      setStep(1);
    }
  }, [compact]);
  useEffect(() => {
    if (mounted.current) heading.current?.focus();
    mounted.current = true;
  }, [step, done]);
  const update = <K extends keyof FinderAnswers>(key: K, value: FinderAnswers[K]) => {
    setAnswers((a) => ({ ...a, [key]: value }));
    setPicked((p) => ({ ...p, [step]: true }));
    setError('');
  };
  const next = (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    const invalid = (message: string) => {
      setError(message);
      form.current?.querySelector<HTMLInputElement>('input')?.focus();
    };
    if ((step === 0 || step === 1 || step === 3) && !picked[step]) {
      invalid('Choose an option to continue.');
      return;
    }
    if (
      step === 2 &&
      (!Number.isFinite(answers.volume) ||
        answers.volume < 0 ||
        answers.volume > 100000 ||
        !Number.isInteger(answers.volume))
    ) {
      invalid('Enter a whole number of orders between 0 and 100,000.');
      return;
    }
    if (
      step === 4 &&
      (!Number.isFinite(answers.budget) || answers.budget < 1 || answers.budget > 100000)
    ) {
      invalid('Enter a budget between $1 and $100,000.');
      return;
    }
    if (compact) {
      window.location.assign(`/printer-finder/?platform=${encodeURIComponent(answers.platform)}`);
      return;
    }
    setError('');
    if (step === 4) setDone(true);
    else setStep((s) => s + 1);
  };
  const reset = () => {
    setDone(false);
    setStep(0);
    setPicked({});
    setError('');
    setAnswers({ platform: '', os: 'windows', volume: 50, connection: 'any', budget: 300 });
    window.history.replaceState(null, '', '/printer-finder/');
  };
  function choices<K extends keyof FinderAnswers>(
    key: K,
    options: { value: FinderAnswers[K]; label: string }[],
  ) {
    return (
      <fieldset
        className="choices"
        aria-invalid={!!error}
        aria-describedby={error ? 'finder-error' : undefined}
      >
        <legend className="sr-only">{titles[step]}</legend>
        {options.map((option) => (
          <label className="option native-option" key={String(option.value)}>
            <input
              type="radio"
              name={`finder-${step}`}
              value={String(option.value)}
              checked={!!picked[step] && answers[key] === option.value}
              onChange={() => update(key, option.value)}
              aria-invalid={!!error}
              aria-describedby={error ? 'finder-error' : undefined}
            />
            {option.label}
          </label>
        ))}
      </fieldset>
    );
  }
  if (done) {
    const { matches, excluded, platformNote } = recommend(answers);
    const eligibleIds = matches.map((match) => match.printer.id);
    return (
      <section className="results" aria-label="Your printer recommendations">
        <p className="product-fit">Your shortlist, explained</p>
        <h2 ref={heading} tabIndex={-1}>
          {matches.length ? 'A clearer place to start.' : 'Let’s revisit your setup.'}
        </h2>
        <p className="results-intro">
          {systemNames[answers.os]} · {answers.volume} orders/week ·{' '}
          {connectionNames[answers.connection]} · Budget ${answers.budget}
        </p>
        <div className="helper">
          <strong>Compatibility matches, not a hands-on verdict.</strong> Current prices are not
          verified for every model. A result is not a guarantee that today’s price fits your budget.
          Confirm the exact model, OS release, and print app before buying.
        </div>
        <p className="small-note" style={{ marginTop: 20 }}>
          {platformNote} <a href="/guides/etsy-shopify-ebay/">Read the platform workflow guide.</a>
        </p>
        {!matches.length ? (
          <div className="empty-result">
            <h3>No verified match in this catalog.</h3>
            <p>
              We won’t substitute an incompatible printer. Review the reasons below before changing
              your connection or budget. A different setup may expand the shortlist.
            </p>
            <button className="button" onClick={() => setDone(false)}>
              Adjust my answers <ArrowLeft size={18} />
            </button>
          </div>
        ) : (
          matches.map(({ printer: p, reasons, cautions }, index) => (
            <article className="result" key={p.id}>
              <div>
                <img src={p.image} alt={p.imageAlt} width="220" height="220" />
                <p className="small-note editorial-image-caption">
                  Editorial render based on manufacturer references.
                </p>
              </div>
              <div>
                <p className="product-fit">
                  {index === 0 ? 'Start here' : 'Also consider'} · {p.fit}
                </p>
                <h3>{p.name}</h3>
                <ul>
                  {reasons.map((reason) => (
                    <li key={reason}>{reason}</li>
                  ))}
                </ul>
                <details>
                  <summary>Trade-offs &amp; what to verify</summary>
                  {cautions.map((caution) => (
                    <p key={caution}>{caution}</p>
                  ))}
                  <p>{p.limitations[0]}</p>
                </details>
                <p className="small-note">
                  {p.price === null ? <strong>Price check required. </strong> : null}
                  {p.priceNote}
                </p>
                <div className="result-actions">
                  <a className="button" href={`/printers/${p.id}/`}>
                    View the evidence <ArrowRight size={17} />
                  </a>
                  <a
                    className="text-link"
                    href={
                      eligibleIds.length > 1
                        ? `/compare/?printers=${[p.id, ...eligibleIds.filter((id) => id !== p.id)].slice(0, 3).join(',')}`
                        : '/compare/'
                    }
                  >
                    {eligibleIds.length > 1 ? 'Compare my matches' : 'Compare all models'}
                  </a>
                </div>
              </div>
            </article>
          ))
        )}
        {excluded.length ? (
          <details className="excluded">
            <summary>
              Why {excluded.length} {excluded.length === 1 ? 'model was' : 'models were'} excluded
            </summary>
            {excluded.map((p) => (
              <p key={p.name} style={{ marginTop: 15 }}>
                <strong>{p.name}:</strong> {p.reason}
              </p>
            ))}
          </details>
        ) : null}
        <div className="form-navigation">
          <button className="plain-button" onClick={() => setDone(false)}>
            <ArrowLeft size={17} /> Edit answers
          </button>
          <button className="plain-button" onClick={reset}>
            <ArrowCounterClockwise size={17} /> Start over
          </button>
        </div>
      </section>
    );
  }
  return (
    <form
      ref={form}
      onSubmit={next}
      className={compact ? 'finder-compact' : 'finder-wizard'}
      noValidate
    >
      {!compact ? (
        <>
          <div className="progress-label">
            <span>Step {step + 1} of 5</span>
            <span>{steps[step]}</span>
          </div>
          <div
            className="progress-track"
            role="progressbar"
            aria-label="Finder progress"
            aria-valuemin={0}
            aria-valuemax={5}
            aria-valuenow={step + 1}
            aria-valuetext={`Step ${step + 1} of 5: ${steps[step]}`}
          >
            {steps.map((name, i) => (
              <span key={name} className={i <= step ? 'complete' : ''} />
            ))}
          </div>
        </>
      ) : null}
      <h2 className="wizard-title" ref={heading} tabIndex={-1}>
        {titles[step]}
      </h2>
      {!compact ? <p className="wizard-description">{descriptions[step]}</p> : null}
      {step === 0
        ? choices(
            'platform',
            ['Etsy', 'Shopify', 'eBay', 'Other'].map((value) => ({ value, label: value })),
          )
        : null}
      {step === 1
        ? choices(
            'os',
            (Object.entries(systemNames) as [OperatingSystem, string][]).map(([value, label]) => ({
              value,
              label,
            })),
          )
        : null}
      {step === 2 ? (
        <label className="field number-question">
          Orders per week
          <input
            type="number"
            min="0"
            max="100000"
            step="1"
            value={Number.isNaN(answers.volume) ? '' : answers.volume}
            onChange={(e) => update('volume', e.currentTarget.valueAsNumber)}
            aria-describedby="volume-help"
            aria-invalid={!!error}
            aria-errormessage={error ? 'finder-error' : undefined}
          />
          <small id="volume-help">
            We assume one shipping label per order. You can adjust waste in the cost calculator.
          </small>
        </label>
      ) : null}
      {step === 3
        ? choices(
            'connection',
            (Object.entries(connectionNames) as [Connection, string][]).map(([value, label]) => ({
              value,
              label,
            })),
          )
        : null}
      {step === 4 ? (
        <>
          <label className="field number-question">
            Maximum printer budget (USD)
            <input
              type="number"
              min="1"
              max="100000"
              step="0.01"
              value={Number.isNaN(answers.budget) ? '' : answers.budget}
              onChange={(e) => update('budget', e.currentTarget.valueAsNumber)}
              aria-invalid={!!error}
              aria-describedby={error ? 'finder-error' : undefined}
            />
          </label>
          <div className="helper">
            We exclude models whose dated verified price exceeds your cap. Models without a verified
            price can appear as <strong>potential matches with a price-check requirement</strong>.
          </div>
        </>
      ) : null}
      {error ? (
        <p id="finder-error" className="error" role="alert" style={{ marginTop: 18 }}>
          {error}
        </p>
      ) : null}
      <div className="form-navigation">
        {step > 0 ? (
          <button
            type="button"
            className="plain-button"
            onClick={() => {
              setStep((s) => s - 1);
              setError('');
            }}
          >
            <ArrowLeft size={17} /> Back
          </button>
        ) : (
          <span className="small-note">
            {compact ? 'Five questions. A more considered choice.' : 'Your setup comes first.'}
          </span>
        )}
        <button className="button" type="submit">
          {step === 4 ? 'See my matches' : compact ? 'Find my printer' : 'Continue'}
          <ArrowRight size={18} />
        </button>
      </div>
      <p className="privacy-note">No email required. Your answers stay in this browser tab.</p>
    </form>
  );
}
