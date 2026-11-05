import { useEffect, useState } from 'react';
import {
  printers,
  systemNames,
  connectionNames,
  type OperatingSystem,
  type Connection,
} from '../data/printers';
import { diagnose, problems, type Problem } from '../lib/troubleshooter';
import { announceToolUse } from '../lib/analytics';
export default function Troubleshooter() {
  const [problem, setProblem] = useState<Problem>('detection'),
    [os, setOs] = useState<OperatingSystem>('windows'),
    [connection, setConnection] = useState<Exclude<Connection, 'any'>>('usb'),
    [model, setModel] = useState(''),
    [shown, setShown] = useState(false);
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  const result = diagnose(problem, os, connection, model);
  return (
    <section className="workbench" aria-label="Printer diagnosis">
      <form
        className="workbench-controls"
        onChange={() => setShown(false)}
        onSubmit={(e) => {
          e.preventDefault();
          setShown(true);
          announceToolUse('printer_troubleshooter_used');
        }}
      >
        <fieldset disabled={!ready} style={{ display: 'contents' }}>
          <legend className="sr-only">Describe your printer setup</legend>
          <label className="field">
            What is happening?
            <select value={problem} onChange={(e) => setProblem(e.target.value as Problem)}>
              {Object.entries(problems).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            Operating system
            <select value={os} onChange={(e) => setOs(e.target.value as OperatingSystem)}>
              {Object.entries(systemNames).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            Print connection
            <select
              value={connection}
              onChange={(e) => setConnection(e.target.value as Exclude<Connection, 'any'>)}
            >
              {(['usb', 'wifi', 'bluetooth'] as const).map((value) => (
                <option key={value} value={value}>
                  {connectionNames[value]}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            Exact model (optional)
            <select value={model} onChange={(e) => setModel(e.target.value)}>
              <option value="">General guidance / another model</option>
              {printers.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} · {p.model}
                </option>
              ))}
            </select>
          </label>
          <button className="button" type="submit" disabled={!ready}>
            Show diagnostic steps
          </button>
          <p className="small-note">
            No uploads, remote diagnostics or personal details. Your choices stay in this tab. We
            cannot inspect your hardware or guarantee a repair.
          </p>
        </fieldset>
      </form>
      <div className="workbench-output" aria-live="polite">
        {!shown ? (
          <>
            <h2>Start with the print path.</h2>
            <p>
              Choose a problem and your setup. We’ll separate connection restrictions from layout,
              media and driver checks.
            </p>
            <p className="small-note">
              No factory-reset combinations or undocumented driver procedures.
            </p>
          </>
        ) : (
          <>
            <h2>{problems[problem]}</h2>
            <p>
              {systemNames[os]} · {connectionNames[connection]}
              {result.printer ? ` · ${result.printer.name}` : ''}
            </p>
            {result.warning && <p className="helper">{result.warning}</p>}
            <ol>
              {result.steps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
            {result.setup && (
              <>
                <h3>For this exact model</h3>
                <p>{result.setup}</p>
              </>
            )}
            {result.sources.length > 0 && (
              <>
                <h3>Official documentation</h3>
                <ul>
                  {result.sources.map((source) => (
                    <li key={source.url}>
                      <a href={source.url} target="_blank" rel="noopener noreferrer">
                        {source.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </>
            )}
            <p>
              <a href="/tools/label-preview/">Inspect layout and possible clipping</a> ·{' '}
              <a href="/guides/common-thermal-printer-setup-problems/">Read the setup checklist</a>
            </p>
            <p className="small-note">
              If the problem persists, contact the manufacturer with the model, OS version and error
              shown. Do not share shipping-label addresses publicly.
            </p>
          </>
        )}
      </div>
    </section>
  );
}
