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
} from "lucide-react";
import Link from "next/link";

const features = [
  {
    title: "Build with clarity",
    description:
      "Create focused assessments with the right mix of coding, written and multiple-choice questions.",
    icon: Code2,
    glow: "glow-purple",
  },
  {
    title: "Keep it fair",
    description:
      "Server-side timers and consistent attempt rules give every candidate the same conditions.",
    icon: ShieldCheck,
    glow: "glow-cyan",
  },
  {
    title: "Decide with evidence",
    description:
      "See scores, completion data and performance signals in one focused workspace.",
    icon: FileCheck2,
    glow: "glow-purple",
  },
];

const workflow = [
  ["01", "Create", "focused assessments"],
  ["02", "Invite", "the right candidates"],
  ["03", "Evaluate", "with real evidence"],
  ["04", "Decide", "with confidence"],
];

const platformSignals = [
  "Timed attempts",
  "Role-based access",
  "Automatic scoring",
  "Coding questions",
  "Manual review",
  "Candidate insights",
];

const processSteps = [
  {
    number: "01",
    icon: FileQuestion,
    title: "Shape the challenge",
    description:
      "Set duration, marks and a passing threshold. Add the question types that reveal how a candidate thinks.",
  },
  {
    number: "02",
    icon: Users,
    title: "Bring candidates in",
    description:
      "Invite candidates into a clear flow with a single assessment link and everything they need to get started.",
  },
  {
    number: "03",
    icon: TimerReset,
    title: "Run a fair attempt",
    description:
      "Server-side timers and attempt rules keep the experience consistent from the first question to the final submit.",
  },
  {
    number: "04",
    icon: BarChart3,
    title: "Review the signal",
    description:
      "Compare outcomes, inspect submissions and use evidence to move the right people forward.",
  },
];

export default function HomePage() {
  return (
    <main className="overflow-hidden">
      <section className="relative mx-auto max-w-7xl px-6 pb-24 pt-20 lg:pb-32 lg:pt-28">
        <div className="mesh-orb orb-one" />
        <div className="mesh-orb orb-two" />
        <div className="relative grid items-center gap-14 lg:grid-cols-[1.05fr_.95fr]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary">
              <Sparkles className="size-3.5" />
              The evidence-first hiring platform
            </div>
            <h1 className="mt-7 max-w-3xl text-5xl font-semibold leading-[1.05] tracking-[-0.04em] sm:text-7xl">
              Hire for <span className="gradient-text">capability,</span>
              <br /> not credentials.
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-8 text-muted-foreground">
              Build meaningful technical assessments, run secure candidate
              attempts, and make confident hiring decisions from one calm,
              focused workspace.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                href="/login"
                className="group inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3.5 font-medium text-primary-foreground transition hover:bg-primary/90"
              >
                Open workspace
                <ArrowUpRight className="size-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/register"
                className="rounded-xl border border-border px-5 py-3.5 font-medium transition hover:border-primary/50 hover:bg-muted"
              >
                Join as candidate
              </Link>
            </div>
            <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-xs text-muted-foreground">
              {[
                "Structured workflows",
                "Fair by design",
                "Actionable reports",
              ].map((item) => (
                <span key={item} className="inline-flex items-center gap-2">
                  <CircleCheck className="size-4 text-cyan-300" /> {item}
                </span>
              ))}
            </div>
          </div>

          <div className="hero-console relative mx-auto w-full max-w-xl">
            <div className="absolute -inset-8 rounded-full bg-primary/10 blur-3xl" />
            <div className="code-window relative p-3">
              <div className="rounded-[0.8rem] bg-[#101010] p-5 sm:p-6">
                <div className="flex items-center justify-between border-b border-white/10 pb-5">
                  <div className="flex items-center gap-2">
                    <span className="size-2.5 rounded-full bg-red-400/80" />
                    <span className="size-2.5 rounded-full bg-amber-300/80" />
                    <span className="size-2.5 rounded-full bg-emerald-300/80" />
                    <span className="ml-3 text-xs text-muted-foreground">
                      assessment.overview
                    </span>
                  </div>
                  <span className="rounded-full bg-emerald-400/10 px-2.5 py-1 text-[10px] text-emerald-300">
                    LIVE
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3 py-6">
                  <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                    <p className="text-3xl font-semibold">24</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Candidates invited
                    </p>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                    <p className="text-3xl font-semibold text-cyan-200">86%</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Avg. completion
                    </p>
                  </div>
                </div>
                <div className="rounded-xl border border-primary/20 bg-primary/[0.06] p-4">
                  <div className="flex items-center justify-between text-sm">
                    <span>Frontend Engineer</span>
                    <span className="text-xs text-muted-foreground">
                      18 submissions
                    </span>
                  </div>
                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
                    <div className="h-full w-3/4 rounded-full bg-gradient-to-r from-primary to-cyan-300" />
                  </div>
                  <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                    <span>Passing threshold</span>
                    <span className="text-foreground">75 / 100</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-border/70 bg-white/[0.02]">
        <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-border/70 px-6 py-8 md:grid-cols-4">
          {workflow.map(([number, title, text]) => (
            <div key={number} className="px-4 first:pl-0 last:pr-0 md:px-8">
              <p className="text-xs text-primary">{number}</p>
              <p className="mt-2 font-medium">{title}</p>
              <p className="text-xs text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="overflow-hidden border-b border-border/70 py-5">
        <div className="marquee-track flex gap-3">
          {[0, 1]
            .flatMap((copy) =>
              platformSignals.map((signal) => ({ copy, signal })),
            )
            .map(({ copy, signal }) => (
              <span
                key={`${signal}-${copy}`}
                className="inline-flex items-center gap-3 whitespace-nowrap rounded-full border border-border bg-card px-4 py-2 text-xs text-muted-foreground"
              >
                <span className="size-1.5 rounded-full bg-cyan-300" />
                {signal}
              </span>
            ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            Everything in one flow
          </p>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
            Less coordination.
            <br />
            <span className="text-muted-foreground">Better signal.</span>
          </h2>
        </div>
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {features.map(({ title, description, icon: Icon, glow }) => (
            <article
              key={title}
              className="bento-card relative overflow-hidden rounded-2xl border bg-card p-7 transition hover:-translate-y-1"
            >
              <div className={`glow ${glow}`} />
              <Icon className="relative size-6 text-primary" />
              <h3 className="relative mt-14 text-xl font-semibold">{title}</h3>
              <p className="relative mt-3 text-sm leading-6 text-muted-foreground">
                {description}
              </p>
              <div className="relative mt-7 flex items-center gap-2 text-xs font-medium text-primary">
                Explore the workflow <ArrowUpRight className="size-3.5" />
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-border/70 bg-muted/20">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-24 lg:grid-cols-[.8fr_1.2fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
              A complete hiring loop
            </p>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
              From first question
              <br />
              <span className="text-muted-foreground">to final signal.</span>
            </h2>
            <p className="mt-6 max-w-md text-sm leading-7 text-muted-foreground">
              Every part of the assessment lifecycle lives in one place, so
              recruiters can focus on the quality of the decision—not the
              logistics around it.
            </p>
            <Link
              href="/about-us"
              className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-primary"
            >
              See how it works <ArrowUpRight className="size-4" />
            </Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {processSteps.map(({ number, icon: Icon, title, description }) => (
              <article
                key={number}
                className="group rounded-2xl border border-border bg-card p-6 transition hover:border-primary/40 hover:bg-primary/[0.04]"
              >
                <div className="flex items-center justify-between">
                  <Icon className="size-5 text-primary" />
                  <span className="text-xs text-muted-foreground">
                    {number}
                  </span>
                </div>
                <h3 className="mt-8 font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="grid gap-4 lg:grid-cols-2">
          <article className="bento-card relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/15 via-card to-card p-8 sm:p-10">
            <div className="glow glow-purple" />
            <div className="relative">
              <div className="flex items-center gap-3 text-sm text-primary">
                <MousePointer2 className="size-4" /> For hiring teams
              </div>
              <h2 className="mt-8 max-w-md text-3xl font-semibold tracking-tight">
                Replace gut feeling with a repeatable process.
              </h2>
              <div className="mt-8 space-y-3 text-sm text-muted-foreground">
                {[
                  "Create assessments in minutes",
                  "Track every candidate in one workspace",
                  "Compare results with consistent criteria",
                ].map((item) => (
                  <p key={item} className="flex items-center gap-2">
                    <CircleCheck className="size-4 text-cyan-300" /> {item}
                  </p>
                ))}
              </div>
              <Link
                href="/login"
                className="mt-9 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground"
              >
                Open recruiter workspace <ArrowUpRight className="size-4" />
              </Link>
            </div>
          </article>
          <article className="bento-card relative overflow-hidden rounded-3xl border border-cyan-300/20 bg-gradient-to-br from-cyan-300/10 via-card to-card p-8 sm:p-10">
            <div className="glow glow-cyan" />
            <div className="relative">
              <div className="flex items-center gap-3 text-sm text-cyan-200">
                <Code2 className="size-4" /> For candidates
              </div>
              <h2 className="mt-8 max-w-md text-3xl font-semibold tracking-tight">
                Show what you can actually build.
              </h2>
              <div className="mt-8 space-y-3 text-sm text-muted-foreground">
                {[
                  "Clear instructions before every attempt",
                  "A focused, distraction-free experience",
                  "A fair chance to demonstrate your skills",
                ].map((item) => (
                  <p key={item} className="flex items-center gap-2">
                    <CircleCheck className="size-4 text-cyan-300" /> {item}
                  </p>
                ))}
              </div>
              <Link
                href="/register"
                className="mt-9 inline-flex items-center gap-2 rounded-lg border border-cyan-200/30 px-4 py-2.5 text-sm font-medium text-cyan-100 transition hover:bg-cyan-300/10"
              >
                Join as a candidate <ArrowUpRight className="size-4" />
              </Link>
            </div>
          </article>
        </div>
      </section>

      <section className="border-y border-border/70 bg-white/[0.02]">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-6 py-16 sm:grid-cols-4">
          {[
            ["01", "One workspace", "for the full assessment lifecycle"],
            ["02", "Fair attempts", "with server-side timing rules"],
            ["03", "Real signal", "from scores and submissions"],
            ["04", "Clear decisions", "backed by consistent evidence"],
          ].map(([number, title, text]) => (
            <div key={number} className="metric">
              <p className="text-xs text-primary">{number}</p>
              <div className="mt-3 text-lg font-semibold">{title}</div>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                {text}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/15 via-card to-cyan-300/5 px-7 py-12 sm:px-12 sm:py-16">
          <div className="relative max-w-2xl">
            <p className="text-sm font-semibold text-cyan-200">
              Ready when you are
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              Turn technical hiring into a competitive advantage.
            </h2>
            <p className="mt-4 text-muted-foreground">
              Create your first assessment and see the difference a focused
              process makes.
            </p>
            <Link
              href="/register"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-foreground px-5 py-3.5 font-medium text-background transition hover:bg-foreground/90"
            >
              Get started <ArrowUpRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
