"use client";

import Link from "next/link";
import { type FormEvent, useEffect, useState } from "react";
import { getMe, type User } from "@/api/auth.api";
import {
  getAdminAssessmentReport,
  getAdminCandidateReport,
  getAdminReport,
  getAdminRevenue,
  getAssessmentReport,
  getCandidateReport,
  getRecruiterReport,
  getRecruiterRevenue,
  type ReportData,
} from "@/api/recruiter.api";

type ReportMode =
  | "recruiter-overview"
  | "recruiter-revenue"
  | "assessment"
  | "candidate"
  | "admin-overview"
  | "admin-revenue"
  | "admin-assessments"
  | "admin-candidates";

function labelFor(key: string) {
  return key
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[_-]/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function displayValue(value: unknown): string {
  if (value === null || value === undefined || value === "") return "—";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value === "string" || typeof value === "number") {
    return String(value);
  }
  if (Array.isArray(value)) {
    return value.map((item) => displayValue(item)).join(", ");
  }
  if (typeof value === "object") {
    return Object.entries(value)
      .map(([key, entry]) => `${labelFor(key)}: ${displayValue(entry)}`)
      .join(" · ");
  }
  return String(value);
}

function uniqueKeys(values: string[], prefix: string) {
  const occurrences = new Map<string, number>();
  return values.map((value) => {
    const occurrence = occurrences.get(value) ?? 0;
    occurrences.set(value, occurrence + 1);
    return `${prefix}-${value}-${occurrence}`;
  });
}

function flattenRows(value: Record<string, unknown>, prefix = "") {
  const result: Record<string, string> = {};
  for (const [key, entry] of Object.entries(value)) {
    const name = prefix ? `${prefix}.${labelFor(key)}` : labelFor(key);
    if (entry !== null && typeof entry === "object" && !Array.isArray(entry)) {
      Object.assign(
        result,
        flattenRows(entry as Record<string, unknown>, name),
      );
    } else {
      result[name] = displayValue(entry);
    }
  }
  return result;
}

function DataSection({
  title,
  value,
  depth = 0,
}: {
  title: string;
  value: unknown;
  depth?: number;
}) {
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return (
        <section className="rounded-xl border p-4">
          <h3 className="font-medium">{labelFor(title)}</h3>
          <p className="mt-3 text-sm text-muted-foreground">No records.</p>
        </section>
      );
    }
    if (value.every((item) => item !== null && typeof item === "object")) {
      const rows = value.map((row) =>
        flattenRows(row as Record<string, unknown>),
      );
      const columns = [...new Set(rows.flatMap((row) => Object.keys(row)))];
      const rowKeys = uniqueKeys(
        rows.map((row) => JSON.stringify(row)),
        title,
      );
      return (
        <section className="rounded-xl border p-4">
          <h3 className="font-medium">{labelFor(title)}</h3>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead className="border-b text-xs uppercase text-muted-foreground">
                <tr>
                  {columns.map((column) => (
                    <th key={column} className="px-3 py-2 font-medium">
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y">
                {rows.map((row, index) => (
                  <tr key={rowKeys[index]}>
                    {columns.map((column) => (
                      <td
                        key={column}
                        className="max-w-[24rem] break-words px-3 py-3 align-top"
                      >
                        {row[column] || "—"}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      );
    }
    const itemKeys = uniqueKeys(value.map(displayValue), title);
    return (
      <section className="rounded-xl border p-4">
        <h3 className="font-medium">{labelFor(title)}</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {value.map((item, index) => (
            <span
              key={itemKeys[index]}
              className="rounded-full bg-muted px-3 py-1 text-xs"
            >
              {displayValue(item)}
            </span>
          ))}
        </div>
      </section>
    );
  }

  if (value !== null && typeof value === "object") {
    const entries = Object.entries(value);
    const scalarEntries = entries.filter(
      ([, entry]) =>
        entry === null ||
        typeof entry !== "object" ||
        (Array.isArray(entry) &&
          entry.every((item) => typeof item !== "object")),
    );
    const nestedEntries = entries.filter(
      ([, entry]) =>
        entry !== null &&
        typeof entry === "object" &&
        !(
          Array.isArray(entry) &&
          entry.every((item) => typeof item !== "object")
        ),
    );

    return (
      <section className="rounded-xl border p-4">
        <h3 className="font-medium">{labelFor(title)}</h3>
        {scalarEntries.length > 0 && (
          <dl className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {scalarEntries.map(([key, entry]) => (
              <div key={key} className="rounded-lg bg-muted/40 p-3">
                <dt className="text-xs text-muted-foreground">
                  {labelFor(key)}
                </dt>
                <dd className="mt-1 break-words text-sm font-medium">
                  {displayValue(entry)}
                </dd>
              </div>
            ))}
          </dl>
        )}
        {nestedEntries.length > 0 && (
          <div
            className={`mt-3 grid gap-3 ${depth < 1 ? "lg:grid-cols-2" : ""}`}
          >
            {nestedEntries.map(([key, entry]) => (
              <DataSection
                key={key}
                title={key}
                value={entry}
                depth={depth + 1}
              />
            ))}
          </div>
        )}
      </section>
    );
  }

  return (
    <section className="rounded-xl border p-4">
      <h3 className="font-medium">{labelFor(title)}</h3>
      <p className="mt-3 text-sm">{displayValue(value)}</p>
    </section>
  );
}

const recruiterModes: { value: ReportMode; label: string }[] = [
  { value: "recruiter-overview", label: "Overview" },
  { value: "recruiter-revenue", label: "Revenue" },
  { value: "assessment", label: "Assessment detail" },
  { value: "candidate", label: "Candidate detail" },
];

const adminModes: { value: ReportMode; label: string }[] = [
  { value: "admin-overview", label: "Overview" },
  { value: "admin-revenue", label: "Revenue" },
  { value: "admin-assessments", label: "Assessments" },
  { value: "admin-candidates", label: "Candidates" },
];

export default function ReportsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [mode, setMode] = useState<ReportMode>("recruiter-overview");
  const [report, setReport] = useState<ReportData | null>(null);
  const [assessmentId, setAssessmentId] = useState("");
  const [candidateId, setCandidateId] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getMe()
      .then(({ data }) => {
        setUser(data);
        setMode(
          data.role === "ADMIN" ? "admin-overview" : "recruiter-overview",
        );
      })
      .catch((error: unknown) =>
        setMessage(
          error instanceof Error ? error.message : "Could not load your role",
        ),
      );
  }, []);

  async function loadReport(event?: FormEvent<HTMLFormElement>) {
    event?.preventDefault();
    if (!user || user.role === "CANDIDATE") return;
    if (mode === "assessment" && !assessmentId.trim()) {
      setMessage("Enter an assessment ID to view its report.");
      return;
    }
    if (mode === "candidate" && !candidateId.trim()) {
      setMessage("Enter a candidate ID to view their report.");
      return;
    }
    if (from && to && new Date(from).getTime() > new Date(to).getTime()) {
      setMessage("The start date must be on or before the end date.");
      return;
    }

    setIsLoading(true);
    setMessage("");
    setReport(null);
    try {
      const response =
        mode === "admin-overview"
          ? await getAdminReport(from || undefined, to || undefined)
          : mode === "admin-revenue"
            ? await getAdminRevenue(from || undefined, to || undefined)
            : mode === "admin-assessments"
              ? await getAdminAssessmentReport(
                  from || undefined,
                  to || undefined,
                )
              : mode === "admin-candidates"
                ? await getAdminCandidateReport(
                    from || undefined,
                    to || undefined,
                  )
                : mode === "recruiter-overview"
                  ? await getRecruiterReport(from || undefined, to || undefined)
                  : mode === "recruiter-revenue"
                    ? await getRecruiterRevenue(
                        from || undefined,
                        to || undefined,
                      )
                    : mode === "assessment"
                      ? await getAssessmentReport(assessmentId.trim())
                      : await getCandidateReport(candidateId.trim());
      setReport(response.data);
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Could not load this report",
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (!user || user.role === "CANDIDATE") return;
    let active = true;
    const request =
      user.role === "ADMIN" ? getAdminReport() : getRecruiterReport();
    setIsLoading(true);
    request
      .then(({ data }) => {
        if (active) setReport(data);
      })
      .catch((error: unknown) => {
        if (active) {
          setMessage(
            error instanceof Error ? error.message : "Could not load report",
          );
        }
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, [user]);

  const modes = user?.role === "ADMIN" ? adminModes : recruiterModes;
  const hasDateFilter =
    mode === "admin-overview" ||
    mode === "admin-revenue" ||
    mode === "admin-assessments" ||
    mode === "admin-candidates" ||
    mode === "recruiter-overview" ||
    mode === "recruiter-revenue";

  return (
    <main className="mx-auto max-w-7xl px-6 py-12">
      <Link
        href="/dashboard"
        className="text-sm text-muted-foreground hover:text-foreground"
      >
        ← Back to dashboard
      </Link>
      <div className="mt-6">
        <p className="text-sm font-medium text-primary">Analytics</p>
        <h1 className="mt-2 text-4xl font-semibold">Reports</h1>
        <p className="mt-2 text-muted-foreground">
          Explore assessment outcomes, candidate performance, and revenue.
        </p>
      </div>

      {user?.role === "CANDIDATE" ? (
        <div className="mt-8 rounded-xl border bg-muted/40 p-5 text-sm">
          Reports are available to recruiters and administrators.
        </div>
      ) : (
        <form
          onSubmit={loadReport}
          className="mt-8 grid gap-4 rounded-2xl border bg-card p-5 md:grid-cols-2 lg:grid-cols-4"
        >
          <label className="text-sm">
            Report
            <select
              value={mode}
              onChange={(event) => {
                setMode(event.target.value as ReportMode);
                setReport(null);
                setMessage("");
              }}
              className="mt-2 h-11 w-full rounded-lg border bg-background px-3"
            >
              {modes.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
          {mode === "assessment" && (
            <label className="text-sm">
              Assessment ID
              <input
                value={assessmentId}
                onChange={(event) => setAssessmentId(event.target.value)}
                className="mt-2 h-11 w-full rounded-lg border bg-background px-3"
                required
              />
            </label>
          )}
          {mode === "candidate" && (
            <label className="text-sm">
              Candidate ID
              <input
                value={candidateId}
                onChange={(event) => setCandidateId(event.target.value)}
                className="mt-2 h-11 w-full rounded-lg border bg-background px-3"
                required
              />
            </label>
          )}
          {hasDateFilter && (
            <>
              <label className="text-sm">
                From
                <input
                  type="date"
                  value={from}
                  onChange={(event) => setFrom(event.target.value)}
                  className="mt-2 h-11 w-full rounded-lg border bg-background px-3"
                />
              </label>
              <label className="text-sm">
                To
                <input
                  type="date"
                  value={to}
                  onChange={(event) => setTo(event.target.value)}
                  className="mt-2 h-11 w-full rounded-lg border bg-background px-3"
                />
              </label>
            </>
          )}
          <button
            type="submit"
            disabled={isLoading || !user}
            className="h-11 self-end rounded-lg bg-primary px-4 font-medium text-primary-foreground disabled:opacity-60"
          >
            {isLoading ? "Loading..." : "Load report"}
          </button>
        </form>
      )}

      {message && (
        <p
          role="alert"
          className="mt-6 rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive"
        >
          {message}
        </p>
      )}
      {isLoading && !report && (
        <p className="mt-8 text-sm text-muted-foreground">Loading report...</p>
      )}
      {report && (
        <div className="mt-8 space-y-4">
          {Object.entries(report).map(([key, value]) => (
            <DataSection key={key} title={key} value={value} />
          ))}
        </div>
      )}
    </main>
  );
}
