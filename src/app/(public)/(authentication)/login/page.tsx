import Link from "next/link";
import LoginForm from "@/components/form/login-form";

export default function LoginPage() {
  return (
    <main className="mx-auto grid min-h-[calc(100vh-9rem)] max-w-7xl items-center gap-12 px-6 py-12 lg:grid-cols-2">
      <div className="hidden rounded-3xl bg-primary p-12 text-primary-foreground lg:block">
        <p className="text-sm font-semibold uppercase tracking-widest opacity-70">
          Developer Assessments
        </p>
        <h1 className="mt-8 text-5xl font-semibold leading-tight">
          Turn skills into confident hiring decisions.
        </h1>
        <p className="mt-6 max-w-md text-primary-foreground/75">
          Invite candidates, run timed assessments, and review results from one
          focused workspace.
        </p>
        <Link
          href="/"
          className="mt-10 inline-block text-sm underline underline-offset-4"
        >
          Back to home
        </Link>
      </div>
      <div className="mx-auto w-full max-w-md">
        <LoginForm />
      </div>
    </main>
  );
}
