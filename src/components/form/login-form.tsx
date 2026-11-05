"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";
import { getAuthenticatedUser, getRoleHome, login } from "@/api/auth.api";
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
      const user = await getAuthenticatedUser();
      router.push(getRoleHome(user.role));
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
    <form onSubmit={handleSubmit} className="lamp-login-form">
      <label className="lamp-input-group">
        Email
        <span className="lamp-input-wrap">
          <input
            required
            type="email"
            value={form.email}
            placeholder="you@company.com"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </span>
      </label>
      <label className="lamp-input-group">
        Password
        <span className="lamp-input-wrap">
          <input
            required
            minLength={6}
            type="password"
            value={form.password}
            placeholder="Enter your password"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </span>
      </label>
      {error && <p className="lamp-form-error">{error}</p>}
      <div className="lamp-forgot-row">
        <span className="lamp-forgot">Secure account access</span>
      </div>
      <button type="submit" disabled={pending} className="lamp-submit">
        {pending ? "Authenticating..." : "Sign in to workspace"}
      </button>
      <div className="lamp-or-divider">
        <span />
        <small>OR CONTINUE WITH</small>
        <span />
      </div>
      <div className="lamp-google">
        <GoogleLoginButton />
      </div>
      <p className="lamp-register">
        New here?{" "}
        <Link className="font-medium" href="/register">
          Create a candidate account
        </Link>
      </p>
      <div className="lamp-merchant-links">
        <Link href="/register">
          <span>Recruiter</span>
          <span>workspace →</span>
        </Link>
        <Link href="/apply">
          <span>Candidate</span>
          <span>access →</span>
        </Link>
      </div>
    </form>
  );
}
