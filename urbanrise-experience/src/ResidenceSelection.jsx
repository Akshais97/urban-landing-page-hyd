import { useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import lineupDesktop from '../../assets/background/configuration-villas.webp';
import lineupCompactDesktop from '../../assets/background/configuration-villas-1440.webp';
import lineupMobile from '../../assets/background/configuration-villas-mobile.webp';
import lineupCompactMobile from '../../assets/background/configuration-villas-mobile-540.webp';
import accessDesktop from '../../assets/background/early-access-desktop-banner.png';
import accessMobile from '../../assets/background/early-access-mobile-banner.png';
import AbundanceStory from './AbundanceStory.jsx';
import { ChapterTitle, useChapterMotion } from './ChapterMotion.jsx';
import SectionScenery from './SectionScenery.jsx';

const models = [
  { name: '3-bedroom', bathrooms: '2 bathrooms', size: '1,500–1,550 sq ft' },
  { name: 'Larger 3-bedroom', bathrooms: '3 bathrooms', size: '1,700–1,750 sq ft' },
  { name: '4-bedroom', bathrooms: '3 bathrooms', size: '1,950–2,000 sq ft' },
];

function Configuration({ model, onChoose }) {
  const section = useRef(null);
  useChapterMotion(section);

  return (
    <section ref={section} className="followup-section residence-configuration" id="lineup" aria-labelledby="lineupTitle"
      data-motion-chapter data-smoked-glass>
      <SectionScenery desktop={lineupDesktop} mobile={lineupMobile} compactDesktop={lineupCompactDesktop}
        compactMobile={lineupCompactMobile} chapterEffect="depth" />
      <div className="followup-wrap">
        <header className="followup-story configuration-heading photo-intro" data-chapter-heading>
          <p className="followup-kicker" data-chapter-intro>Abundance residences</p>
          <ChapterTitle id="lineupTitle" lines={['Find your home', 'at The Lifescape']} />
          <p className="followup-lead" data-chapter-intro>All three layouts share the same Abundance features, including on-site renewable energy, landscaped terraces and clubhouses.</p>
        </header>
        <div className="configuration-grid" role="group" aria-label="Choose a residence layout" data-chapter-group="flow">
          {models.map(({ name, bathrooms, size }) => (
            <button type="button" key={name} className="followup-panel configuration-model" data-chapter-item data-chapter-glass="panel"
              aria-pressed={model === name} onClick={() => onChoose(name)}>
              <strong>{name}</strong>
              <span className="configuration-spec">{bathrooms}<span>{size}</span></span>
              <span className="configuration-link">Select this layout <span aria-hidden="true">↗</span></span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

const perks = [
  'First pick of residence, floor and view',
  'A private visit to The Lifescape site',
  'Priority access when homes are released',
];

function EarlyAccess({ model, onModelChange, confirmation, setConfirmation, modelField, section }) {
  const [errors, setErrors] = useState({});
  const nameField = useRef(null);
  const phoneField = useRef(null);
  const confirmationTitle = useRef(null);

  function clearError(field) {
    setErrors(current => ({ ...current, [field]: '' }));
  }

  function submit(event) {
    event.preventDefault();
    const name = nameField.current.value.trim();
    const phone = phoneField.current.value.trim();
    const fieldErrors = {
      name: name.length > 1 ? '' : 'Enter your full name.',
      phone: /^[0-9\s()-]+$/.test(phone) && phone.replace(/[\s()-]/g, '').length === 10
        ? '' : 'Enter a 10-digit mobile number.',
    };
    setErrors(fieldErrors);
    if (fieldErrors.name || fieldErrors.phone) {
      (fieldErrors.name ? nameField : phoneField).current.focus();
      return;
    }
    setConfirmation({ firstName: name.split(/\s+/)[0], model });
    requestAnimationFrame(() => confirmationTitle.current?.focus({ preventScroll: true }));
  }

  function edit() {
    setConfirmation(null);
    requestAnimationFrame(() => nameField.current?.focus({ preventScroll: true }));
  }

  return (
    <section ref={section} className="followup-section founding-access" id="access" aria-labelledby="accessTitle" data-smoked-glass>
      <SectionScenery desktop={accessDesktop} mobile={accessMobile} />
      <div className="followup-wrap followup-split">
        <div className="followup-story photo-intro">
          <p className="followup-kicker">Founding 222 · Early access</p>
          <h2 id="accessTitle">See Abundance<br />before launch</h2>
          <p className="followup-lead">The first release at The Lifescape is limited to 222 homes.</p>
          <ul className="founding-perks">{perks.map(perk => <li key={perk}>{perk}</li>)}</ul>
          <a className="followup-action followup-action--quiet" href="https://wa.me/918943214897" target="_blank" rel="noopener noreferrer" data-chapter-glass="control">
            Or chat on WhatsApp <span aria-hidden="true">↗</span>
          </a>
        </div>
        <div className="followup-panel founding-card" data-chapter-glass="panel">
          <div className="followup-toolbar"><strong>Early access preview</strong><span>Founding 222</span></div>
          <form className="founding-form" id="accessForm" hidden={Boolean(confirmation)} noValidate onSubmit={submit}>
            <fieldset>
              <legend>Contact details</legend>
              <label htmlFor="accessName">Your name</label>
              <div className="founding-field" data-chapter-glass="control">
                <input id="accessName" ref={nameField} name="name" autoComplete="name" placeholder="Full name" required
                  aria-invalid={Boolean(errors.name)} aria-describedby="accessNameError" onChange={() => clearError('name')} />
              </div>
              <span id="accessNameError" className="founding-error">{errors.name}</span>
              <label htmlFor="accessPhone">Mobile number</label>
              <div className="founding-field" data-chapter-glass="control">
                <input id="accessPhone" ref={phoneField} name="phone" type="tel" inputMode="tel" autoComplete="tel-national" placeholder="10-digit mobile" required
                  aria-invalid={Boolean(errors.phone)} aria-describedby="accessPhoneError" onChange={() => clearError('phone')} />
              </div>
              <span id="accessPhoneError" className="founding-error">{errors.phone}</span>
            </fieldset>
            <fieldset>
              <legend>Residence preferences</legend>
              <label htmlFor="accessModel">Residence layout</label>
              <div className="founding-field" data-chapter-glass="control">
                <select id="accessModel" name="model" ref={modelField} value={model} onChange={event => onModelChange(event.target.value)}>
                  {models.map(({ name, bathrooms }) => <option key={name} value={name}>{name} · {bathrooms}</option>)}
                </select>
              </div>
            </fieldset>
            {(errors.name || errors.phone) && <p className="founding-error" role="alert">Please check the highlighted fields.</p>}
            <button className="followup-action" type="submit" data-chapter-glass="action">Preview early access <span aria-hidden="true">↗</span></button>
            <p className="founding-note">Preview form: your details stay on this page.</p>
          </form>
          {confirmation && (
            <div className="founding-confirmation" id="accessDone">
              <p className="followup-kicker">Selection ready</p>
              <h3 ref={confirmationTitle} tabIndex={-1}>Welcome home, {confirmation.firstName}.</h3>
              <p>You selected the <strong>{confirmation.model}</strong> layout.</p>
              <p className="founding-note">This selection is a local preview.</p>
              <button className="followup-action followup-action--quiet" type="button" onClick={edit} data-chapter-glass="control">Edit my details</button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default function ResidenceSelection({ children }) {
  const [model, setModel] = useState(models[0].name);
  const [confirmation, setConfirmation] = useState(null);
  const section = useRef(null);
  const modelField = useRef(null);
  const reducedMotion = useReducedMotion();

  function choose(name) {
    setModel(name);
    setConfirmation(null);
    section.current.scrollIntoView({ behavior: reducedMotion ? 'instant' : 'smooth', block: 'start' });
    requestAnimationFrame(() => modelField.current?.focus({ preventScroll: true }));
  }

  return (
    <>
      <Configuration model={model} onChoose={choose} />
      {children}
      <AbundanceStory />
      <EarlyAccess model={model} onModelChange={setModel} confirmation={confirmation} setConfirmation={setConfirmation}
        modelField={modelField} section={section} />
    </>
  );
}
