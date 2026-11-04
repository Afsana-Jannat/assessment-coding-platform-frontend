import Link from "next/link";

export default function PaymentCancelPage() {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-xl items-center px-6 py-16">
      <section className="w-full rounded-2xl border bg-card p-8 text-center shadow-sm">
        <p className="text-sm font-semibold text-muted-foreground">
          Payment canceled
        </p>
        <h1 className="mt-3 text-3xl font-semibold">No payment was taken</h1>
        <p className="mt-4 text-muted-foreground">
          You can return to your dashboard and try again whenever you are ready.
        </p>
        <Link
          href="/dashboard"
          className="mt-7 inline-flex rounded-lg border px-5 py-3 text-sm font-medium hover:bg-muted"
        >
          Return to dashboard
        </Link>
      </section>
    </main>
  );
}
