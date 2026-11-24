import { useRef, useState } from 'react';
import desktopScene from '../../assets/background/carbon-solar-terraces.webp';
import compactDesktopScene from '../../assets/background/carbon-solar-terraces-1440.webp';
import mobileScene from '../../assets/background/carbon-solar-terraces-mobile.webp';
import compactMobileScene from '../../assets/background/carbon-solar-terraces-mobile-540.webp';
import { carbonAssumptions, carbonCategories, estimateCarbon } from './carbon-model.js';
import { ChapterTitle, useChapterMotion } from './ChapterMotion.jsx';
import SectionScenery from './SectionScenery.jsx';
import './carbon-calculator.css';

const initialHousehold = {
  people: 4, electricity: 400, water: 540, car: 800, twoWheeler: 400, cylinders: 1,
  fuel: 'petrol', switchToEV: true,
};

const fields = [
  { key: 'people', label: 'People at home', min: 1, max: 8, step: 1 },
  { key: 'electricity', label: 'Electricity per month', min: 50, max: 1500, step: 10, unit: 'kWh', hint: 'Use the units shown on your electricity bill.' },
  { key: 'water', label: 'Water per day', min: 100, max: 2000, step: 10, unit: 'L', hint: 'Enter the total litres used by your household.' },
  { key: 'car', label: 'Car travel per month', min: 0, max: 3000, step: 50, unit: 'km' },
  { key: 'twoWheeler', label: 'Two-wheeler travel per month', min: 0, max: 2000, step: 50, unit: 'km' },
  { key: 'cylinders', label: 'LPG cylinders per month', min: 0, max: 4, step: 0.25, hint: 'Based on 14.2 kg domestic cylinders.' },
];

const fuels = [['petrol', 'Petrol'], ['diesel', 'Diesel'], ['ev', 'Already EV']];
const number = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 });
const kilograms = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 });
const tonnes = kg => (kg / 1000).toFixed(1);

function CarbonRange({ field, value, onChange, children }) {
  const { key, label, min, max, step, unit, hint } = field;
  const id = `carbon-${key}`;
  const displayValue = `${number.format(value)}${unit ? ` ${unit}` : ''}`;

  return (
    <div className="carbon-field" data-chapter-item>
      <label htmlFor={id}>{label}</label>
      <span className="carbon-field-value" aria-hidden="true">{displayValue}</span>
      <input id={id} type="range" min={min} max={max} step={step} value={value}
        style={{ '--carbon-range-fill': `${(value - min) / (max - min) * 100}%` }}
        aria-valuetext={displayValue} aria-describedby={hint ? `${id}-hint` : undefined}
        onChange={event => onChange(key, event.target.valueAsNumber)} />
      {hint && <p id={`${id}-hint`} className="carbon-hint">{hint}</p>}
      {children}
    </div>
  );
}

function CarbonInputs({ household, onChange }) {
  return (
    <section className="carbon-panel" aria-labelledby="carbon-inputs-title" data-chapter-surface data-chapter-group="flow" data-chapter-glass="panel">
      <h3 id="carbon-inputs-title">How you live today</h3>
      <p className="carbon-panel-copy">Adjust the values to match your household.</p>
      {fields.map(field => (
        <CarbonRange key={field.key} field={field} value={household[field.key]} onChange={onChange}>
          {field.key === 'car' && (
            <fieldset className="carbon-fuels">
              <legend>Car fuel</legend>
              <div>
                {fuels.map(([id, label]) => (
                  <label key={id} data-chapter-glass="control">
                    <input type="radio" name="carbon-fuel" value={id} checked={household.fuel === id}
                      onChange={() => onChange('fuel', id)} />
                    <span>{label}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          )}
        </CarbonRange>
      ))}
      {household.fuel !== 'ev' && (
        <label className="carbon-ev">
          <input type="checkbox" checked={household.switchToEV}
            onChange={event => onChange('switchToEV', event.target.checked)} />
          <span>I’d switch to electric with charging at home</span>
        </label>
      )}
    </section>
  );
}

function CarbonBreakdown({ result }) {
  const { today, abundance, todayTotal, abundanceTotal, saved } = result;
  const model = carbonAssumptions;

  return (
    <details className="carbon-breakdown">
      <summary>Emissions breakdown and assumptions</summary>
      <table>
        <caption>Annual emissions in kg CO₂</caption>
        <thead><tr><th scope="col">Source</th><th scope="col">Today</th><th scope="col">Abundance</th><th scope="col">Saved</th></tr></thead>
        <tbody>
          {carbonCategories.map(([id, label]) => (
            <tr key={id}>
              <th scope="row">{label}</th>
              <td>{kilograms.format(today[id])}</td>
              <td>{kilograms.format(abundance[id])}</td>
              <td>{kilograms.format(today[id] - abundance[id])}</td>
            </tr>
          ))}
        </tbody>
        <tfoot><tr><th scope="row">Total</th><td>{kilograms.format(todayTotal)}</td>
          <td>{kilograms.format(abundanceTotal)}</td><td>{kilograms.format(saved)}</td></tr></tfoot>
      </table>
      <p className="carbon-hint">The Abundance scenario assumes {model.efficiencySaving * 100}% lower electricity demand,
        {' '}{model.renewableShare * 100}% renewable electricity, {model.waterSaving * 100}% lower water supply emissions,
        and {model.greenCover} kg of annual CO₂ absorption from green cover. The model uses {model.grid} kg CO₂ per grid kWh.</p>
    </details>
  );
}

function CarbonResults({ result, people }) {
  const [copyFeedback, setCopyFeedback] = useState(null);
  const { todayTotal, abundanceTotal, saved, reduction } = result;
  const trees = kilograms.format(saved / carbonAssumptions.treeAbsorption);
  const report = `My household’s estimated footprint is ${tonnes(todayTotal)} t CO₂ a year. The Abundance scenario estimates ${tonnes(abundanceTotal)} t, ${reduction}% less. Indicative estimate based on planning assumptions.`;

  async function copyResult() {
    try {
      await navigator.clipboard.writeText(report);
      setCopyFeedback({ report, message: 'Estimate copied.' });
    } catch {
      setCopyFeedback({ report, message: 'Copy is unavailable. You can share the estimate on WhatsApp.' });
    }
  }

  return (
    <section className="carbon-panel carbon-results" aria-labelledby="carbon-results-title" data-chapter-surface data-chapter-glass="panel">
      <h3 id="carbon-results-title">Your annual carbon picture</h3>
      <p className="carbon-panel-copy">Tonnes of CO₂ per year for your household.</p>
      <div className="carbon-totals" data-chapter-group="stagger">
        {[
          ['Your home today', todayTotal],
          ['Abundance scenario', abundanceTotal],
        ].map(([label, total], index) => (
          <div key={label} className="carbon-total" data-projection={index === 1} data-chapter-item data-chapter-glass="control">
            <span>{label}</span>
            <strong>{tonnes(total)}<small> t</small></strong>
            <span>{tonnes(total / people)} t per person</span>
          </div>
        ))}
      </div>
      <p className="sr-only" role="status">{report}</p>
      <p className="carbon-saving"><strong>{reduction}%</strong> estimated reduction with Abundance</p>
      <div className="carbon-comparison" aria-hidden="true" data-chapter-meter>
        <div><span>Today</span><span className="carbon-bar"><span className="carbon-bar-fill"><i /></span></span></div>
        <div><span>Abundance</span><span className="carbon-bar"><span className="carbon-bar-fill"><i style={{ transform: `scaleX(${abundanceTotal / todayTotal})` }} /></span></span></div>
      </div>
      <dl className="carbon-equivalents">
        <div><dt>kg CO₂ saved per year</dt><dd>{kilograms.format(saved)}</dd></div>
        <div><dt>Mature trees’ yearly absorption</dt><dd>{trees}</dd></div>
        <div><dt>Tonnes saved over 10 years</dt><dd>{kilograms.format(saved / 100)}</dd></div>
      </dl>
      <CarbonBreakdown result={result} />
      <p className="carbon-hint carbon-note">Illustrative estimate based on planning assumptions. Actual results depend on household use and final Abundance engineering data.</p>
      <div className="carbon-actions">
        <a href={`https://wa.me/?text=${encodeURIComponent(report)}`} target="_blank" rel="noopener noreferrer" data-chapter-glass="action">Share on WhatsApp</a>
        <button type="button" onClick={copyResult} data-chapter-glass="control">Copy result</button>
      </div>
      <p className="carbon-hint carbon-feedback" role="status">{copyFeedback?.report === report && copyFeedback.message}</p>
    </section>
  );
}

export default function CarbonCalculator() {
  const section = useRef(null);
  const [household, setHousehold] = useState(initialHousehold);
  const result = estimateCarbon(household);
  const updateHousehold = (key, value) => setHousehold(current => ({ ...current, [key]: value }));
  useChapterMotion(section);

  return (
    <section className="carbon-calculator" ref={section} id="carbon-calculator" aria-labelledby="carbon-title"
      data-motion-chapter data-smoked-glass>
      <SectionScenery className="carbon-scenery" desktop={desktopScene} mobile={mobileScene}
        compactDesktop={compactDesktopScene} compactMobile={compactMobileScene} chapterEffect="depth" />
      <div className="chapter-edge" data-chapter-edge aria-hidden="true" />
      <div className="carbon-wrap">
        <header className="carbon-heading photo-intro" data-chapter-heading>
          <p data-chapter-intro>Carbon calculator</p>
          <ChapterTitle id="carbon-title" lines={['Your home has a carbon bill.', 'See what Abundance could cut.']} />
        </header>
        <div className="carbon-tool">
          <CarbonInputs household={household} onChange={updateHousehold} />
          <CarbonResults result={result} people={household.people} />
        </div>
      </div>
    </section>
  );
}
