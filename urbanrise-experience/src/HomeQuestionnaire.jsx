import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import desktopScene from '../../assets/background/version_section_desktop_banner.png';
import mobileScene from '../../assets/background/version_section_mobile_banner.png';
import { features } from './abundance-features.js';
import { ChapterTitle, useChapterMotion } from './ChapterMotion.jsx';
import SectionScenery from './SectionScenery.jsx';

const questions = [
  ['Energy', 'When the power goes out, what happens at home?', ['Total blackout', 'The inverter starts beeping', 'We barely notice']],
  ['Energy', 'Does your home make any of its own power?', ['No', 'Some solar in common areas', 'Yes, solar powers our home']],
  ['Water', 'Has your building ordered water tankers this year?', ['Often', 'Sometimes', 'Never']],
  ['Water', 'Does your building harvest rainwater?', ['No idea', 'Yes, not sure it works', 'Yes, and we use it']],
  ['Air', 'Do you know the air quality inside your home right now?', ['No idea', 'I check outdoor air on an app', 'Yes, we measure indoors']],
  ['Air', 'How is the air at home cleaned?', ['It isn’t', 'A purifier in one room', 'Built into the home']],
  ['Mobility', 'Can you charge an EV at your parking spot?', ['No', 'Only with a cable or workaround', 'Yes, a dedicated charger']],
  ['Mobility', 'Is your building ready for more EVs?', ['Not at all', 'A few shared points', 'Every parking is EV-ready']],
  ['Nature', 'What do you see from your window?', ['Mostly concrete', 'A few trees', 'Green, every day']],
  ['Nature', 'Where’s the nearest green space you actually use?', ['Need to drive there', 'Walk outside the complex', 'Inside my building']],
  ['Community', 'How many neighbours do you know by name?', ['Zero', 'A few', 'Many']],
  ['Community', 'Where do evenings happen for your family?', ['Inside the flat', 'Outside the complex', 'In common spaces at home']],
];

function QuestionnaireResult({ answers, titleRef, onRetake }) {
  const points = answers.reduce((sum, answer) => sum + answer, 0);
  const score = Math.round(100 * points / (questions.length * 2));
  const lowScoringAnswers = questions.filter((_, index) => answers[index] === 0);
  const scores = features.map(({ name }, index) => ({ name, percent: 25 * (answers[index * 2] + answers[index * 2 + 1]) }));
  const lowest = Math.min(...scores.map(({ percent }) => percent));
  const weakest = scores.filter(({ percent }) => percent === lowest).map(({ name }) => name);

  return (
    <div className="questionnaire-body questionnaire-result">
      <h3 ref={titleRef} tabIndex={-1}>Your home score</h3>
      <p className="questionnaire-score"><strong>{score}</strong> / 100</p>
      {weakest.length < scores.length && <p className="followup-muted">Lowest scores in {weakest.join(', ')}</p>}
      <ul className="questionnaire-scores" aria-label="Scores by category">
        {scores.map(({ name, percent }) => (
          <li key={name}>
            <span>{name}</span><span>{percent}%</span>
            <div className="questionnaire-track" aria-hidden="true"><span style={{ transform: `scaleX(${percent / 100})` }} /></div>
          </li>
        ))}
      </ul>
      {lowScoringAnswers.length > 0 && (
        <details className="questionnaire-issues">
          <summary>Review {lowScoringAnswers.length} low-scoring {lowScoringAnswers.length === 1 ? 'answer' : 'answers'}</summary>
          <ul>{lowScoringAnswers.map(([, question, options]) => <li key={question}>{question}<span>{options[0]}</span></li>)}</ul>
        </details>
      )}
      <p className="questionnaire-upgrade">These six priorities shape the design of Abundance at The Lifescape.</p>
      <div className="followup-actions">
        <a className="followup-action" href="#access">See early access details</a>
        <button className="followup-action followup-action--quiet" type="button" onClick={onRetake}>Retake</button>
      </div>
    </div>
  );
}

export default function HomeQuestionnaire() {
  const section = useRef(null);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [choosing, setChoosing] = useState(null);
  const title = useRef(null);
  const timer = useRef(null);
  const focusNext = useRef(false);
  const reducedMotion = useReducedMotion();
  const finished = step === questions.length;
  useChapterMotion(section);

  useEffect(() => () => clearTimeout(timer.current), []);
  useEffect(() => {
    if (!focusNext.current) return;
    title.current?.focus({ preventScroll: true });
    focusNext.current = false;
  }, [step]);

  function goTo(nextStep) {
    focusNext.current = true;
    setStep(nextStep);
  }

  function choose(answer) {
    if (timer.current !== null) return;
    const advance = () => {
      timer.current = null;
      setAnswers(current => [...current.slice(0, step), answer]);
      setChoosing(null);
      goTo(step + 1);
    };
    if (reducedMotion) advance();
    else {
      setChoosing(answer);
      timer.current = setTimeout(advance, 140);
    }
  }

  const [category, question, options] = questions[step] ?? [];

  return (
    <section ref={section} className="followup-section home-questionnaire" id="version" aria-labelledby="versionTitle" data-motion-chapter>
      <SectionScenery desktop={desktopScene} mobile={mobileScene} chapterEffect="dissolve" />
      <div className="followup-wrap followup-split">
        <div className="followup-story" data-chapter-heading>
          <p className="followup-kicker" data-chapter-intro>Home check · About 90 seconds</p>
          <ChapterTitle id="versionTitle" lines={['How does your', 'home measure up?']} accent={false} />
          <p className="followup-lead" data-chapter-intro>Answer 12 questions about daily life at home, from power cuts to time outdoors. See how your home scores across the six priorities behind Abundance.</p>
          <ol className="questionnaire-features" aria-label="Home check categories" data-chapter-group="stagger">
            {features.map(({ id, name, icon }, index) => (
              <li key={id} data-chapter-item data-complete={step >= (index + 1) * 2} aria-current={!finished && Math.floor(step / 2) === index ? 'step' : undefined}>
                <span className="followup-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d={icon} /></svg></span>
                {name}
                {step >= (index + 1) * 2 && <span className="sr-only"> completed</span>}
              </li>
            ))}
          </ol>
        </div>
        <div className="followup-panel" data-chapter-surface>
          <div className="followup-toolbar"><strong>Your home today</strong><span>The Lifescape</span></div>
          {finished ? <QuestionnaireResult answers={answers} titleRef={title} onRetake={() => { setAnswers([]); goTo(0); }} /> : (
            <div className="questionnaire-body">
              <div className="questionnaire-meta"><span>{category}</span><span>{step + 1} / {questions.length}</span></div>
              <div className="questionnaire-track" aria-hidden="true"><span style={{ transform: `scaleX(${step / questions.length})` }} /></div>
              <div key={step} className="questionnaire-question" data-leaving={choosing !== null}>
                <h3 ref={title} tabIndex={-1} id="version-question">{question}</h3>
                <div className="questionnaire-options" role="group" aria-labelledby="version-question">
                  {options.map((option, index) => (
                    <button type="button" key={option} aria-pressed={(choosing ?? answers[step]) === index} onClick={() => choose(index)}>{option}</button>
                  ))}
                </div>
                <div className="questionnaire-meta questionnaire-actions">
                  <button className="followup-action followup-action--quiet" type="button" disabled={step === 0 || choosing !== null} onClick={() => goTo(step - 1)}>Back</button>
                  <span>Choose an answer to continue</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
