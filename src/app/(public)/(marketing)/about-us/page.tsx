import Link from "next/link";

const steps = [
  {
    number: "01",
    title: "Build a focused assessment",
    description:
      "Set the duration, marks and passing threshold, then combine multiple-choice, written and coding questions in one draft.",
  },
  {
    number: "02",
    title: "Invite the right candidates",
    description:
      "Share an assessment with a candidate and keep the invitation, acceptance and attempt lifecycle in one place.",
  },
  {
    number: "03",
    title: "Review evidence, not guesses",
    description:
      "Use timed attempts, automatic scoring and manual evaluation to make a consistent, evidence-based hiring decision.",
  },
];

export default function AboutUsPage() {
  return (
    <main>
      <section className="mx-auto max-w-5xl px-6 pb-16 pt-20">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
          How it works
        </p>
        <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight sm:text-6xl">
          Better technical hiring starts with better evidence.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
          Developer Assessments gives recruiters and candidates a clear,
          structured way to run technical evaluations from invitation to final
          report.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/login"
            className="rounded-lg bg-primary px-5 py-3 text-sm font-medium text-primary-foreground"
          >
            Open workspace
          </Link>
          <Link
            href="/register"
            className="rounded-lg border px-5 py-3 text-sm font-medium hover:bg-muted"
          >
            Join as a candidate
          </Link>
        </div>
      </section>

      <section className="border-y bg-muted/30">
        <div className="mx-auto grid max-w-5xl gap-4 px-6 py-12 md:grid-cols-3">
          {steps.map((step) => (
            <article
              key={step.number}
              className="rounded-2xl border bg-card p-6"
            >
              <span className="text-sm font-semibold text-primary">
                {step.number}
              </span>
              <h2 className="mt-5 text-xl font-semibold">{step.title}</h2>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                {step.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-5xl gap-8 px-6 py-16 md:grid-cols-2">
        <div>
          <p className="text-sm font-semibold text-primary">
            Designed for trust
          </p>
          <h2 className="mt-3 text-3xl font-semibold">
            A fairer process for every participant.
          </h2>
        </div>
        <div className="space-y-4 text-sm leading-7 text-muted-foreground">
          <p>
            Server-side timers and attempt rules help candidates get the same
            conditions while recruiters spend less time coordinating details.
          </p>
          <p>
            Role-based workspaces keep assessment management, candidate
            profiles, evaluation and reporting focused on the people who need
            them.
          </p>
        </div>
      </section>
    </main>
  );
}
