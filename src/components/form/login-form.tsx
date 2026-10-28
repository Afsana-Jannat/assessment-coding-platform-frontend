"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";
import { login } from "@/api/auth.api";
import GoogleLoginButton from "@/components/auth/google-login-button";

export default function LoginForm() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");
    try {
      await login(form);
      router.push("/dashboard");
      router.refresh();
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to log in",
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <h1 className="text-3xl font-semibold">Welcome back</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Sign in to manage assessments and attempts.
        </p>
      </div>
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
          minLength={6}
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
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
        {pending ? "Signing in..." : "Sign in"}
      </button>
      <GoogleLoginButton />
      <p className="text-center text-sm text-muted-foreground">
        New here?{" "}
        <Link
          className="font-medium text-primary hover:underline"
          href="/register"
        >
          Create a candidate account
        </Link>
      </p>
    </form>
  );
}
