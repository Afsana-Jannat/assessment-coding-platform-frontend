"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getMe, type User } from "@/api/auth.api";

export default function Header() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    getMe()
      .then((response) => setUser(response.data))
      .catch(() => setUser(null));
  }, []);

  return (
    <header className="border-b bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground">
            DA
          </span>
          <span>Developer Assessments</span>
        </Link>
        <nav className="flex items-center gap-5 text-sm">
          <Link
            href="/about-us"
            className="text-muted-foreground hover:text-foreground"
          >
            How it works
          </Link>
          {user ? (
            <Link
              href="/dashboard"
              className="rounded-lg bg-primary px-4 py-2 text-primary-foreground"
            >
              Dashboard
            </Link>
          ) : (
            <Link
              href="/login"
              className="rounded-lg border px-4 py-2 hover:bg-muted"
            >
              Sign in
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
