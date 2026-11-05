"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getMe, logout, type User } from "@/api/auth.api";

export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    getMe()
      .then((response) => setUser(response.data))
      .catch(() => setUser(null));
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between px-6">
        <Link
          href="/"
          className="flex items-center gap-3 font-semibold tracking-tight"
        >
          <span className="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-primary to-cyan-300 text-sm text-primary-foreground shadow-lg shadow-primary/20">
            DA
          </span>
          <span className="hidden sm:inline">Developer Assessments</span>
        </Link>
        <nav className="flex items-center gap-3 text-sm">
          <Link
            href="/about-us"
            className="mr-2 hidden text-muted-foreground transition hover:text-foreground sm:inline"
          >
            How it works
          </Link>
          {user ? (
            <>
              <span className="hidden text-xs text-muted-foreground sm:inline">
                {user.role.toLowerCase()}
              </span>
              <Link
                href="/dashboard"
                className="rounded-lg bg-primary px-4 py-2 text-primary-foreground transition hover:bg-primary/90"
              >
                Dashboard
              </Link>
              <button
                type="button"
                onClick={() => {
                  logout();
                  setUser(null);
                  router.push("/login");
                  router.refresh();
                }}
                className="rounded-lg border border-border px-4 py-2 transition hover:bg-muted"
              >
                Sign out
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="rounded-lg border border-border px-4 py-2 transition hover:bg-muted"
            >
              Sign in
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
