"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { getMe, type User } from "@/api/auth.api";
import {
  getAdminReport,
  getRecruiterReport,
  type ReportData,
} from "@/api/recruiter.api";

function numericEntries(data: ReportData) {
  return Object.entries(data).filter(
    ([, value]) => typeof value === "number" && Number.isFinite(value),
  );
}

export default function ReportsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [report, setReport] = useState<ReportData | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    getMe()
      .then(async ({ data }) => {
        setUser(data);
        if (data.role === "CANDIDATE") {
          setMessage("Reports are available to recruiters and administrators.");
          return;
        }
        const response =
          data.role === "ADMIN"
            ? await getAdminReport()
            : await getRecruiterReport();
        setReport(response.data);
      })
      .catch((error) =>
        setMessage(
          error instanceof Error ? error.message : "Could not load report",
        ),
      );
  }, []);

  const metrics = useMemo(
    () => (report ? numericEntries(report) : []),
    [report],
  );

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <Link
        href="/dashboard"
        className="text-sm text-muted-foreground hover:text-foreground"
      >
        ← Back to dashboard
      </Link>
      <p className="mt-6 text-sm font-medium text-primary">Analytics</p>
      <h1 className="mt-2 text-4xl font-semibold">Reports overview</h1>
      <p className="mt-2 text-muted-foreground">
        Review platform activity using the reports available for your role.
      </p>
      {message && (
        <div className="mt-8 rounded-xl border bg-muted/40 p-5 text-sm">
          {message}
          {user?.role === "CANDIDATE" && (
            <Link
              href="/dashboard"
              className="ml-2 font-medium text-primary hover:underline"
            >
              Return to dashboard
            </Link>
          )}
        </div>
      )}
      {report && (
        <>
          {metrics.length > 0 && (
            <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {metrics.map(([key, value]) => (
                <article key={key} className="rounded-2xl border bg-card p-5">
                  <p className="text-sm capitalize text-muted-foreground">
                    {key.replace(/([A-Z])/g, " $1")}
                  </p>
                  <p className="mt-3 text-3xl font-semibold">{String(value)}</p>
                </article>
              ))}
            </section>
          )}
          <section className="mt-8 rounded-2xl border bg-card p-6">
            <h2 className="font-semibold">Report details</h2>
            <pre className="mt-4 max-h-[32rem] overflow-auto rounded-lg bg-muted/50 p-4 text-xs leading-6">
              {JSON.stringify(report, null, 2)}
            </pre>
          </section>
        </>
      )}
      {!message && !report && (
        <p className="mt-8 text-sm text-muted-foreground">Loading report...</p>
      )}
    </main>
  );
}
