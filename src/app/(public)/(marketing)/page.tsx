import {
  ArrowUpRight,
  BarChart3,
  CircleCheck,
  Code2,
  FileCheck2,
  FileQuestion,
  MousePointer2,
  ShieldCheck,
  Sparkles,
  TimerReset,
  Users,
} from 'lucide-react';
import Link from 'next/link';

const features = [
  {
    title: 'Build with clarity',
    description:
      'Create focused assessments with the right mix of coding, written and multiple-choice questions.',
    icon: Code2,
    glow: 'glow-purple',
  },
  {
    title: 'Keep it fair',
    description:
      'Server-side timers and consistent attempt rules give every candidate the same conditions.',
    icon: ShieldCheck,
    glow: 'glow-cyan',
  },
  {
    title: 'Decide with evidence',
    description:
      'See scores, completion data and performance signals in one focused workspace.',
    icon: FileCheck2,
    glow: 'glow-purple',
  },
];

const workflow = [
  ['01', 'Create', 'focused assessments'],
  ['02', 'Invite', 'the right candidates'],
  ['03', 'Evaluate', 'with real evidence'],
  ['04', 'Decide', 'with confidence'],
];

const platformSignals = [
  'Timed attempts',
  'Role-based access',
  'Automatic scoring',
  'Coding questions',
  'Manual review',
  'Candidate insights',
];

const processSteps = [
  {
    number: '01',
    icon: FileQuestion,
    title: 'Shape the challenge',
    description:
      'Set duration, marks and a passing threshold. Add the question types that reveal how a candidate thinks.',
  },
  {
    number: '02',
    icon: Users,
    title: 'Bring candidates in',
    description:
      'Invite candidates into a clear flow with a single assessment link and everything they need to get started.',
  },
  {
    number: '03',
    icon: TimerReset,
    title: 'Run a fair attempt',
    description:
      'Server-side timers and attempt rules keep the experience consistent from the first question to the final submit.',
  },
  {
    number: '04',
    icon: BarChart3,
    title: 'Review the signal',
    description:
      'Compare outcomes, inspect submissions and use evidence to move the right people forward.',
  },
];

export default function HomePage() {
  return (
    <main className="futuristic-home">
      <section className="fh-hero">
        <div className="fh-grid-bg" aria-hidden="true" />
        <div className="fh-orb fh-orb-one" aria-hidden="true" />
        <div className="fh-orb fh-orb-two" aria-hidden="true" />
        <div className="fh-hero-inner">
          <div className="fh-hero-copy">
            <div className="fh-eyebrow">
              <span className="fh-eyebrow-icon">
                <Sparkles className="size-4" />
              </span>
              THE EVIDENCE-FIRST HIRING PLATFORM
              <span className="fh-live-dot" />
            </div>

            <h1>
              Hire for <span className="fh-gradient-text">capability.</span>
              <br />
              Not just credentials.
            </h1>

            <p className="fh-hero-description">
              Build meaningful technical assessments, run secure candidate
              attempts, and make confident hiring decisions from one calm,
              focused workspace.
            </p>

            <div className="fh-hero-actions">
              <Link href="/login" className="fh-button fh-button-primary">
                Open workspace <ArrowUpRight className="size-4" />
              </Link>
              <Link href="/register" className="fh-button fh-button-ghost">
                Join as candidate
              </Link>
            </div>

            <div className="fh-trust-row">
              {[
                'Structured workflows',
                'Fair by design',
                'Actionable reports',
              ].map((item) => (
                <span key={item}>
                  <CircleCheck className="size-4" />
                  {item}
                </span>
              ))}
            </div>

            <div className="fh-hero-footnote">
              <span className="fh-footnote-line" />A smarter way to discover
              real potential
            </div>
          </div>

          <div className="fh-visual" aria-label="Assessment dashboard preview">
            <div className="fh-visual-aura" />
            <div className="fh-orbit fh-orbit-a" />
            <div className="fh-orbit fh-orbit-b" />
            <div className="fh-orbit-dot fh-orbit-dot-a" />
            <div className="fh-orbit-dot fh-orbit-dot-b" />

            <div className="fh-float-chip fh-chip-top">
              <span className="fh-chip-icon">
                <ShieldCheck className="size-4" />
              </span>
              Secure assessment
              <span className="fh-chip-check">
                <CircleCheck className="size-3.5" />
              </span>
            </div>

            <div className="fh-dashboard">
              <div className="fh-dashboard-top">
                <div className="fh-window-dots">
                  <i />
                  <i />
                  <i />
                </div>
                <span className="fh-window-label">ASSESSMENT / OVERVIEW</span>
                <span className="fh-live-label">
                  <span /> LIVE
                </span>
              </div>

              <div className="fh-dashboard-heading">
                <div>
                  <span className="fh-overline">WORKSPACE OVERVIEW</span>
                  <h2>Good morning, team.</h2>
                  <p>Your hiring pipeline at a glance.</p>
                </div>
                <div className="fh-avatar-stack">
                  <span>A</span>
                  <span>J</span>
                  <span>+4</span>
                </div>
              </div>

              <div className="fh-stat-grid">
                <div className="fh-stat-card">
                  <span className="fh-stat-label">Candidates invited</span>
                  <strong>24</strong>
                  <small>
                    <span>↗ 12%</span> this month
                  </small>
                </div>
                <div className="fh-stat-card fh-stat-highlight">
                  <span className="fh-stat-label">Avg. completion</span>
                  <strong>
                    86<em>%</em>
                  </strong>
                  <small>
                    <span>↗ 8.4%</span> this month
                  </small>
                </div>
              </div>

              <div className="fh-progress-panel">
                <div className="fh-panel-title">
                  <div>
                    <span className="fh-panel-icon">
                      <Code2 className="size-4" />
                    </span>
                    <span>Frontend Engineer</span>
                  </div>
                  <span className="fh-status-pill">IN PROGRESS</span>
                </div>
                <div className="fh-progress-meta">
                  <span>Assessment completion</span>
                  <b>76%</b>
                </div>
                <div className="fh-progress-track">
                  <span />
                </div>
                <div className="fh-progress-bottom">
                  <span>18 of 24 submissions</span>
                  <span>Updated just now</span>
                </div>
              </div>

              <div className="fh-dashboard-bottom">
                <div className="fh-mini-avatars">
                  <span>MK</span>
                  <span>TR</span>
                  <span>SA</span>
                </div>
                <span>Team activity is looking good</span>
                <span className="fh-activity-pulse" />
              </div>
            </div>

            <div className="fh-float-chip fh-chip-bottom">
              <span className="fh-score-ring">
                <CircleCheck className="size-4" />
              </span>
              <span>
                <b>Top performer</b>
                <small>Strong problem-solving</small>
              </span>
            </div>
            <div className="fh-side-caption">
              BUILT FOR BETTER DECISIONS <span>✳</span>
            </div>
          </div>
        </div>
        <div className="fh-scroll-cue">
          <span /> SCROLL TO EXPLORE
        </div>
      </section>

      <section className="fh-workflow">
        <div className="fh-section-shell fh-workflow-inner">
          <div className="fh-workflow-intro">
            <span className="fh-kicker">A CLEARER WAY FORWARD</span>
            <p>
              From first question
              <br />
              to confident decision.
            </p>
          </div>
          <div className="fh-workflow-steps">
            {workflow.map(([number, title, text]) => (
              <div key={number} className="fh-workflow-step">
                <span>{number}</span>
                <div>
                  <b>{title}</b>
                  <small>{text}</small>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="fh-signal-strip" aria-label="Platform capabilities">
        <div className="fh-marquee-track">
          {[0, 1]
            .flatMap((copy) =>
              platformSignals.map((signal) => ({ copy, signal }))
            )
            .map(({ copy, signal }) => (
              <span key={`${signal}-${copy}`}>
                <i />
                {signal}
              </span>
            ))}
        </div>
      </section>

      <section className="fh-section fh-features">
        <div className="fh-section-shell">
          <div className="fh-section-heading">
            <div>
              <span className="fh-kicker">EVERYTHING IN ONE FLOW</span>
              <h2>
                Less coordination.
                <br />
                <span>Better signal.</span>
              </h2>
            </div>
            <p>
              Everything your team needs to evaluate talent with more clarity,
              consistency, and confidence.
            </p>
          </div>

          <div className="fh-feature-grid">
            {features.map(({ title, description, icon: Icon, glow }, index) => (
              <article key={title} className={`fh-feature-card ${glow}`}>
                <div className="fh-card-topline">
                  <span>0{index + 1} / PLATFORM</span>
                  <ArrowUpRight className="size-4" />
                </div>
                <div className="fh-feature-icon">
                  <Icon className="size-6" />
                </div>
                <h3>{title}</h3>
                <p>{description}</p>
                <div className="fh-feature-bottom">
                  <span>DESIGNED FOR CLARITY</span>
                  <i />
                </div>
                <div className="fh-card-glow" />
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="fh-process">
        <div className="fh-section-shell fh-process-layout">
          <div className="fh-process-copy">
            <span className="fh-kicker">A COMPLETE HIRING LOOP</span>
            <h2>
              From first question
              <br />
              <span>to final signal.</span>
            </h2>
            <p>
              Every part of the assessment lifecycle lives in one place, so
              recruiters can focus on the quality of the decision—not the
              logistics around it.
            </p>
            <Link href="/about-us" className="fh-text-link">
              See how it works <ArrowUpRight className="size-4" />
            </Link>
            <div className="fh-process-decoration">
              <span>01</span>
              <i />
              <span>04</span>
            </div>
          </div>

          <div className="fh-process-grid">
            {processSteps.map(({ number, icon: Icon, title, description }) => (
              <article key={number} className="fh-process-card">
                <div className="fh-process-card-head">
                  <span className="fh-process-icon">
                    <Icon className="size-5" />
                  </span>
                  <span>{number}</span>
                </div>
                <h3>{title}</h3>
                <p>{description}</p>
                <div className="fh-process-card-line" />
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="fh-section fh-audience">
        <div className="fh-section-shell">
          <div className="fh-section-heading fh-audience-heading">
            <div>
              <span className="fh-kicker">MADE FOR BOTH SIDES</span>
              <h2>
                One platform.
                <br />
                <span>Shared confidence.</span>
              </h2>
            </div>
            <p>
              A better experience for the people making decisions—and the people
              proving what they can do.
            </p>
          </div>

          <div className="fh-audience-grid">
            <article className="fh-audience-card fh-recruiter-card">
              <div className="fh-audience-orb" />
              <div className="fh-audience-content">
                <div className="fh-audience-label">
                  <MousePointer2 className="size-4" /> FOR HIRING TEAMS
                </div>
                <h3>Replace gut feeling with a repeatable process.</h3>
                <div className="fh-audience-list">
                  {[
                    'Create assessments in minutes',
                    'Track every candidate in one workspace',
                    'Compare results with consistent criteria',
                  ].map((item) => (
                    <p key={item}>
                      <CircleCheck className="size-4" />
                      {item}
                    </p>
                  ))}
                </div>
                <Link href="/login" className="fh-button fh-button-primary">
                  Open recruiter workspace <ArrowUpRight className="size-4" />
                </Link>
              </div>
              <div className="fh-audience-watermark">01</div>
            </article>

            <article className="fh-audience-card fh-candidate-card">
              <div className="fh-audience-orb" />
              <div className="fh-audience-content">
                <div className="fh-audience-label">
                  <Code2 className="size-4" /> FOR CANDIDATES
                </div>
                <h3>Show what you can actually build.</h3>
                <div className="fh-audience-list">
                  {[
                    'Clear instructions before every attempt',
                    'A focused, distraction-free experience',
                    'A fair chance to demonstrate your skills',
                  ].map((item) => (
                    <p key={item}>
                      <CircleCheck className="size-4" />
                      {item}
                    </p>
                  ))}
                </div>
                <Link href="/register" className="fh-button fh-button-outline">
                  Join as a candidate <ArrowUpRight className="size-4" />
                </Link>
              </div>
              <div className="fh-audience-watermark">02</div>
            </article>
          </div>
        </div>
      </section>

      <section className="fh-proof">
        <div className="fh-section-shell fh-proof-grid">
          {[
            ['01', 'One workspace', 'for the full assessment lifecycle'],
            ['02', 'Fair attempts', 'with server-side timing rules'],
            ['03', 'Real signal', 'from scores and submissions'],
            ['04', 'Clear decisions', 'backed by consistent evidence'],
          ].map(([number, title, text]) => (
            <div key={number} className="fh-proof-item">
              <span>{number}</span>
              <b>{title}</b>
              <small>{text}</small>
            </div>
          ))}
        </div>
      </section>

      <section className="fh-final">
        <div className="fh-final-shell">
          <div className="fh-final-stars" aria-hidden="true">
            ✳ <span>✦</span> ✧
          </div>
          <span className="fh-kicker">READY WHEN YOU ARE</span>
          <h2>
            Turn technical hiring
            <br />
            into a <span>competitive advantage.</span>
          </h2>
          <p>
            Create your first assessment and see the difference a focused
            process makes.
          </p>
          <Link href="/register" className="fh-button fh-button-final">
            Get started <ArrowUpRight className="size-4" />
          </Link>
          <div className="fh-final-orbit fh-final-orbit-one" />
          <div className="fh-final-orbit fh-final-orbit-two" />
        </div>
      </section>
    </main>
  );
}
