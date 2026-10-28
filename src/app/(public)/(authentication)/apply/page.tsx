import Link from "next/link";

export default function RecruiterAccessPage() {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-xl items-center px-6">
      <div className="rounded-2xl border bg-card p-8 shadow-sm">
        <p className="text-sm font-semibold text-primary">Recruiter access</p>
        <h1 className="mt-3 text-3xl font-semibold">
          Recruiter accounts are managed by administrators
        </h1>
        <p className="mt-4 text-muted-foreground">
          Ask a platform administrator to create your recruiter account. Once
          provisioned, sign in to create and publish assessments.
        </p>
        <Link
          href="/login"
          className="mt-6 inline-flex rounded-lg bg-primary px-5 py-3 text-sm font-medium text-primary-foreground"
        >
          Go to sign in
        </Link>
      </div>
    </main>
  );
}
