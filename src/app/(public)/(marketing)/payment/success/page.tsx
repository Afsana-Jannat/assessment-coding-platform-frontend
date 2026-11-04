import Link from "next/link";

export default function PaymentSuccessPage() {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-xl items-center px-6 py-16">
      <section className="w-full rounded-2xl border bg-card p-8 text-center shadow-sm">
        <p className="text-sm font-semibold text-primary">Payment complete</p>
        <h1 className="mt-3 text-3xl font-semibold">Assessment unlocked</h1>
        <p className="mt-4 text-muted-foreground">
          Your payment was received. Return to the dashboard to continue
          managing your assessment.
        </p>
        <Link
          href="/dashboard"
          className="mt-7 inline-flex rounded-lg bg-primary px-5 py-3 text-sm font-medium text-primary-foreground"
        >
          Return to dashboard
        </Link>
      </section>
    </main>
  );
}
