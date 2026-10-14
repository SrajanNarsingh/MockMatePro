
import React, { useState } from 'react';
import {
  AudioLines,
  LayoutDashboard,
  MessageSquareText,
  BarChart3,
  Target,
  Clock3,
  TrendingUp,
  GraduationCap,
  Code2,
  ChevronDown,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  Send,
  Sparkles,
  Lightbulb,
  Check,
  RotateCcw,
  FileText,
  Menu,
  X,
} from 'lucide-react';

import {
  createInterview,
  submitAnswer,
  apiConfigured,
} from './api.js';

const roles = [
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'Data Analyst',
];

const levels = ['Beginner', 'Intermediate', 'Advanced'];

function Brand() {
  return (
    <div className="brand">
      <div className="brandmark">
        <AudioLines />
      </div>
      <div>
        <b>
          mockmate <span>pro</span>
        </b>
        <small>INTERVIEW STUDIO</small>
      </div>
    </div>
  );
}

export default function App() {
  const [role, setRole] = useState(roles[0]);
  const [level, setLevel] = useState('Intermediate');
  const [stage, setStage] = useState('setup');
  const [session, setSession] = useState(null);
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [reviews, setReviews] = useState({});
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [menu, setMenu] = useState(false);

  const questions = session?.questions || [];
  const q = questions[idx];
  const answer = q ? answers[q.id] || '' : '';
  const mode = session?.demoMode || !apiConfigured();

  const reset = () => {
    setStage('setup');
    setSession(null);
    setIdx(0);
    setAnswers({});
    setReviews({});
    setError('');
    setMenu(false);
  };

  const goToDashboard = () => {
    reset();
  };

  const goToInterview = () => {
    setMenu(false);
    setError('');

    if (session?.questions?.length) {
      setStage('interview');
    } else {
      setStage('setup');
      setError('Start an interview first to practice.');
    }
  };

  const goToResults = () => {
    setMenu(false);
    setError('');

    if (session && Object.keys(reviews).length > 0) {
      setStage('results');
    } else {
      setStage('setup');
      setError('Complete an interview to view your results.');
    }
  };

  async function start() {
    setBusy(true);
    setError('');

    try {
      const s = await createInterview({
        role,
        difficulty: level,
      });

      if (!s.questions?.length) {
        throw new Error('No questions returned by the API');
      }

      setSession(s);
      setIdx(0);
      setAnswers({});
      setReviews({});
      setStage('interview');
      setMenu(false);
    } catch (e) {
      setError(
        e.message + '. Check the backend URL or use demo mode.'
      );
    } finally {
      setBusy(false);
    }
  }

  async function submit() {
    if (!answer.trim()) {
      setError('Write an answer before submitting.');
      return;
    }

    setBusy(true);
    setError('');

    try {
      const r = await submitAnswer({
        interviewId: session._id || session.id,
        questionId: q.id,
        question: q.text,
        answer,
      });

      const nextReviews = {
        ...reviews,
        [q.id]: r,
      };

      setReviews(nextReviews);

      if (idx < questions.length - 1) {
        setIdx(idx + 1);
      } else {
        setStage('results');
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  const count = questions.filter(
    (question) => (answers[question.id] || '').trim()
  ).length;

  const scores = Object.values(reviews)
    .map((review) => Number(review.score))
    .filter(Number.isFinite);

  const avg = scores.length
    ? Math.round(
        (scores.reduce((a, b) => a + b, 0) / scores.length) * 10
      )
    : null;

  return (
    <div className="shell">
      <aside className={`sidebar ${menu ? 'open' : ''}`}>
        <div className="brandrow">
          <Brand />
          <button
            className="close"
            onClick={() => setMenu(false)}
            aria-label="Close navigation"
          >
            <X />
          </button>
        </div>

        <label className="navlabel">WORKSPACE</label>

        <button
          className={`nav ${stage === 'setup' ? 'active' : ''}`}
          onClick={goToDashboard}
        >
          <LayoutDashboard />
          Dashboard
        </button>

        <button
          className={`nav ${stage === 'interview' ? 'active' : ''}`}
          onClick={goToInterview}
        >
          <MessageSquareText />
          Practice interview
        </button>

        <button
          className={`nav ${stage === 'results' ? 'active' : ''}`}
          onClick={goToResults}
        >
          <BarChart3 />
          My results
        </button>

        <div className="sidefill" />

        <div className="tip">
          <Lightbulb />
          <b>Interview tip</b>
          <p>
            State your approach, give an example, and explain the result.
          </p>
        </div>

        <div className="user">
          <div className="avatar">S</div>
          <div>
            <b>Candidate</b>
            <small>Practice workspace</small>
          </div>
        </div>
      </aside>

      <main>
        <header>
          <button
            className="menubtn"
            onClick={() => setMenu(true)}
            aria-label="Open navigation"
          >
            <Menu />
          </button>

          <div className="crumb">
            Workspace <span>/</span>{' '}
            <b>
              {stage === 'setup'
                ? 'Dashboard'
                : stage === 'interview'
                  ? 'Practice interview'
                  : 'Interview results'}
            </b>
          </div>

          <span className={`mode ${mode ? 'demo' : 'live'}`}>
            {mode ? 'Demo mode' : 'Connected API'}
          </span>
        </header>

        <div className="content">
          {error && (
            <div className="error" role="alert">
              {error}
              <button
                onClick={() => setError('')}
                aria-label="Dismiss error"
              >
                ×
              </button>
            </div>
          )}

          {stage === 'setup' && (
            <>
              <section className="welcome">
                <div>
                  <label className="eyebrow">
                    <Sparkles /> YOUR NEXT OPPORTUNITY STARTS HERE
                  </label>
                  <h1>Practice with purpose.</h1>
                  <p>
                    Build confidence one interview question at a time.
                  </p>
                </div>

                <div className="orb">
                  <AudioLines />
                </div>
              </section>

              <div className="stats">
                <div>
                  <Target />
                  <span>Focus role</span>
                  <b>{role}</b>
                  <small>Selected for this session</small>
                </div>

                <div>
                  <Clock3 />
                  <span>Session length</span>
                  <b>~10 minutes</b>
                  <small>3 questions per practice</small>
                </div>

                <div>
                  <TrendingUp />
                  <span>Practice level</span>
                  <b>{level}</b>
                  <small>Change it anytime</small>
                </div>
              </div>

              <div className="columns">
                <section className="panel">
                  <div className="panelhead">
                    <div>
                      <label className="eyebrow">GET STARTED</label>
                      <h2>Set up your interview</h2>
                      <p>Choose what you want to practice today.</p>
                    </div>
                    <GraduationCap />
                  </div>

                  <label className="fieldlabel" htmlFor="role">
                    Target job role
                  </label>

                  <div className="select">
                    <Code2 />
                    <select
                      id="role"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                    >
                      {roles.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                    <ChevronDown />
                  </div>

                  <label className="fieldlabel space">
                    Difficulty level
                  </label>

                  <div className="levels">
                    {levels.map((l) => (
                      <button
                        key={l}
                        className={level === l ? 'chosen' : ''}
                        onClick={() => setLevel(l)}
                      >
                        {l}
                      </button>
                    ))}
                  </div>

                  <div className="note">
                    <ShieldCheck />
                    <div>
                      <b>Personalized practice</b>
                      <p>Questions are matched to your role and level.</p>
                    </div>
                  </div>

                  <button
                    className="primary full"
                    onClick={start}
                    disabled={busy}
                  >
                    {busy ? (
                      'Preparing…'
                    ) : (
                      <>
                        Start interview <ArrowRight />
                      </>
                    )}
                  </button>

                  <small className="privacy">
                    Prototype only. Do not enter sensitive personal
                    information.
                  </small>
                </section>

                <section className="panel how">
                  <label className="eyebrow">HOW IT WORKS</label>
                  <h2>A little practice goes a long way.</h2>

                  {[
                    ['01', 'Choose your focus', 'Select a role and difficulty.'],
                    ['02', 'Answer thoughtfully', 'Explain your reasoning clearly.'],
                    ['03', 'Review feedback', 'Find a practical next step.'],
                  ].map((item) => (
                    <div className="step" key={item[0]}>
                      <strong>{item[0]}</strong>
                      <div>
                        <b>{item[1]}</b>
                        <p>{item[2]}</p>
                      </div>
                    </div>
                  ))}
                </section>
              </div>
            </>
          )}

          {stage === 'interview' && q && (
            <section className="workarea">
              <div className="workhead">
                <div>
                  <label className="eyebrow">PRACTICE SESSION</label>
                  <h1>Your interview, your pace.</h1>
                  <p>
                    {role} · {level} level
                  </p>
                </div>

                <button className="secondary" onClick={reset}>
                  End session
                </button>
              </div>

              <div className="progress">
                <div>
                  <b>
                    QUESTION {idx + 1} OF {questions.length}
                  </b>
                  <b>
                    {Math.round(((idx + 1) / questions.length) * 100)}%
                  </b>
                </div>

                <div className="bar">
                  <span
                    style={{
                      width: `${((idx + 1) / questions.length) * 100}%`,
                    }}
                  />
                </div>

                <div className="dots">
                  {questions.map((question, i) => (
                    <button
                      className={
                        i === idx
                          ? 'current'
                          : reviews[question.id]
                            ? 'done'
                            : ''
                      }
                      onClick={() => setIdx(i)}
                      key={question.id}
                    >
                      {reviews[question.id] ? <Check /> : i + 1}
                    </button>
                  ))}
                </div>
              </div>

              <div className="panel question">
                <label className="eyebrow">INTERVIEW QUESTION</label>
                <h2>{q.text}</h2>

                <div className="note">
                  <Lightbulb />
                  <span>
                    Tip: state your main point, explain why, then give a
                    specific example.
                  </span>
                </div>

                <label className="fieldlabel" htmlFor="answer">
                  Your answer
                </label>

                <textarea
                  id="answer"
                  value={answer}
                  onChange={(e) =>
                    setAnswers((current) => ({
                      ...current,
                      [q.id]: e.target.value,
                    }))
                  }
                  placeholder="Write your answer here…"
                  rows="8"
                />

                <div className="wordcount">
                  {answer.trim()
                    ? answer.trim().split(/\s+/).length
                    : 0}{' '}
                  words
                  <span>Suggested: 50–150 words</span>
                </div>

                <div className="actions">
                  <button
                    className="secondary"
                    onClick={() => setIdx((i) => Math.max(0, i - 1))}
                    disabled={idx === 0 || busy}
                  >
                    <ArrowLeft /> Previous
                  </button>

                  <button
                    className="primary"
                    onClick={submit}
                    disabled={busy}
                  >
                    {busy ? (
                      'Submitting…'
                    ) : (
                      <>
                        Submit answer <Send />
                      </>
                    )}
                  </button>
                </div>
              </div>

              <p className="disclaimer">
                {mode
                  ? 'Demo mode: sample questions and illustrative feedback, not a real AI evaluation.'
                  : 'Connected mode: feedback comes from the configured backend.'}
              </p>
            </section>
          )}

          {stage === 'results' && (
            <section className="workarea">
              <div className="welcome">
                <div>
                  <label className="eyebrow">SESSION COMPLETE</label>
                  <h1>Practice makes progress.</h1>
                  <p>
                    Review your responses and choose what to improve next.
                  </p>
                </div>

                <div className="orb">
                  <Check />
                </div>
              </div>

              <div className="stats resultsstats">
                <div>
                  <span>Questions answered</span>
                  <b>
                    {count} / {questions.length}
                  </b>
                </div>

                <div>
                  <span>Feedback received</span>
                  <b>
                    {Object.keys(reviews).length} / {questions.length}
                  </b>
                </div>

                <div>
                  <span>Practice score</span>
                  <b>{avg === null ? '—' : `${avg}%`}</b>
                </div>
              </div>

              <section className="panel">
                <div className="panelhead">
                  <div>
                    <label className="eyebrow">YOUR REVIEW</label>
                    <h2>Answer-by-answer feedback</h2>
                  </div>
                </div>

                {questions.map((question, i) => (
                  <div className="review" key={question.id}>
                    <b>
                      {String(i + 1).padStart(2, '0')} · {question.text}
                    </b>

                    <p>
                      <strong>Your answer:</strong>{' '}
                      {answers[question.id] || 'No answer recorded.'}
                    </p>

                    {reviews[question.id] ? (
                      <div className="feedback">
                        <b>
                          {reviews[question.id].score != null
                            ? `Practice score: ${reviews[question.id].score}/10`
                            : 'Feedback'}
                        </b>

                        <p>
                          {reviews[question.id].feedback ||
                            reviews[question.id].message ||
                            'No feedback returned.'}
                        </p>

                        {reviews[question.id].demoMode && (
                          <small>Sample feedback for demonstration.</small>
                        )}
                      </div>
                    ) : (
                      <p>Feedback unavailable.</p>
                    )}
                  </div>
                ))}
              </section>

              <div className="actions end">
                <button className="secondary" onClick={reset}>
                  <RotateCcw /> New session
                </button>

                <button
                  className="primary"
                  onClick={() => window.print()}
                >
                  <FileText /> Print results
                </button>
              </div>
            </section>
          )}

          <footer>
            © 2026 MockMate Pro
            <span>Prototype for academic evaluation</span>
          </footer>
        </div>
      </main>
    </div>
  );
}
