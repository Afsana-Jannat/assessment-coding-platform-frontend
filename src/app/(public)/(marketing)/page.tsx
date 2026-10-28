import Link from "next/link";

const features = [
  [
    "Structured assessments",
    "Build draft assessments with duration, marks and a clear passing threshold.",
  ],
  [
    "Fair candidate flow",
    "Invite candidates and enforce a server-side timed attempt.",
  ],
  [
    "Actionable reports",
    "Review scores, performance and assessment outcomes in one place.",
  ],
];

export default function HomePage() {
  return (
    <main>
      <section className="mx-auto grid max-w-7xl gap-12 px-6 pb-20 pt-20 lg:grid-cols-[1.1fr_.9fr] lg:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            Technical hiring, simplified
          </p>
          <h1 className="mt-5 max-w-3xl text-5xl font-semibold tracking-tight sm:text-6xl">
            Find the people who can actually do the work.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
            A focused assessment platform for recruiters and candidates. Create
            meaningful tests, run secure attempts, and make decisions with
            evidence.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/login"
              className="rounded-lg bg-primary px-5 py-3 font-medium text-primary-foreground"
            >
              Open workspace
            </Link>
            <Link
              href="/register"
              className="rounded-lg border px-5 py-3 font-medium hover:bg-muted"
            >
              Join as candidate
            </Link>
          </div>
        </div>
        <div className="rounded-3xl border bg-card p-5 shadow-xl shadow-primary/5">
          <div className="rounded-2xl bg-muted p-6">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Assessment overview</span>
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs text-primary">
                Live
              </span>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-background p-4">
                <p className="text-2xl font-semibold">24</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Candidates invited
                </p>
              </div>
              <div className="rounded-xl bg-background p-4">
                <p className="text-2xl font-semibold">86%</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Average completion
                </p>
              </div>
            </div>
            <div className="mt-3 rounded-xl bg-background p-4">
              <div className="flex justify-between text-sm">
                <span>Frontend Engineer</span>
                <span className="text-muted-foreground">18 submissions</span>
              </div>
              <div className="mt-4 h-2 rounded-full bg-muted">
                <div className="h-full w-3/4 rounded-full bg-primary" />
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="border-t bg-muted/40">
        <div className="mx-auto grid max-w-7xl gap-4 px-6 py-16 md:grid-cols-3">
          {features.map(([title, description]) => (
            <article
              key={title}
              className="rounded-2xl border bg-background p-6"
            >
              <h2 className="font-semibold">{title}</h2>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                {description}
              </p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
