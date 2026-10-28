"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";
import { getAuthenticatedUser, getRoleHome, register } from "@/api/auth.api";

export function RegisterForm() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setPending(true);
    setError("");
    try {
      await register({
        name: form.name,
        email: form.email,
        password: form.password,
      });
      const user = await getAuthenticatedUser();
      router.push(getRoleHome(user.role));
      router.refresh();
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to create account",
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <h1 className="text-3xl font-semibold">Create your account</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Candidates can register instantly. Recruiter accounts are provisioned
          by an admin.
        </p>
      </div>
      <label className="block text-sm font-medium">
        Full name
        <input
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="mt-2 h-11 w-full rounded-lg border bg-background px-3"
        />
      </label>
      <label className="block text-sm font-medium">
        Email
        <input
          required
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="mt-2 h-11 w-full rounded-lg border bg-background px-3"
        />
      </label>
      <label className="block text-sm font-medium">
        Password
        <input
          required
          minLength={8}
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="mt-2 h-11 w-full rounded-lg border bg-background px-3"
        />
      </label>
      <label className="block text-sm font-medium">
        Confirm password
        <input
          required
          type="password"
          value={form.confirmPassword}
          onChange={(e) =>
            setForm({ ...form, confirmPassword: e.target.value })
          }
          className="mt-2 h-11 w-full rounded-lg border bg-background px-3"
        />
      </label>
      {error && (
        <p className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="h-11 w-full rounded-lg bg-primary font-medium text-primary-foreground disabled:opacity-60"
      >
        {pending ? "Creating account..." : "Create account"}
      </button>
      <p className="text-center text-sm text-muted-foreground">
        Already registered?{" "}
        <Link
          className="font-medium text-primary hover:underline"
          href="/login"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}

export default RegisterForm;
