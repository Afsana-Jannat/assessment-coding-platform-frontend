"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useEffect, useState } from "react";
import {
  type AdminCandidate,
  type AdminRecruiter,
  type AuditLog,
  createRecruiterAccount,
  getAdminCandidates,
  getAdminRecruiters,
  getAuditLogs,
  updateCandidateStatus,
  updateRecruiterStatus,
} from "@/api/admin.api";
import { getMe } from "@/api/auth.api";

type Tab = "candidates" | "recruiters" | "audit";

const pageSize = 10;

function formatDate(value: string) {
  return new Date(value).toLocaleString();
}

export default function AdminWorkspacePage() {
  const router = useRouter();
  const [authLoading, setAuthLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [tab, setTab] = useState<Tab>("candidates");
  const [candidates, setCandidates] = useState<AdminCandidate[]>([]);
  const [recruiters, setRecruiters] = useState<AdminRecruiter[]>([]);
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [submittedSearch, setSubmittedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [actionFilter, setActionFilter] = useState("");
  const [entityFilter, setEntityFilter] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [pendingId, setPendingId] = useState("");
  const [message, setMessage] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createPending, setCreatePending] = useState(false);
  const [recruiterForm, setRecruiterForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    designation: "",
    companyName: "",
    companyWebsite: "",
    companyDescription: "",
  });

  useEffect(() => {
    getMe()
      .then(({ data }) => {
        if (data.role !== "ADMIN") {
          router.replace("/dashboard");
          return;
        }
        setIsAdmin(true);
      })
      .catch(() => router.replace("/login"))
      .finally(() => setAuthLoading(false));
  }, [router]);

  useEffect(() => {
    if (!isAdmin) return;
    let active = true;
    setIsLoading(true);
    setMessage("");
    const request =
      tab === "candidates"
        ? getAdminCandidates({
            page,
            limit: pageSize,
            search: submittedSearch || undefined,
            status: statusFilter || undefined,
          }).then(({ data }) => {
            if (!active) return;
            setCandidates(data.candidates);
            setTotalPages(data.meta.totalPages);
          })
        : tab === "recruiters"
          ? getAdminRecruiters({
              page,
              limit: pageSize,
              search: submittedSearch || undefined,
            }).then(({ data }) => {
              if (!active) return;
              setRecruiters(data.recruiters);
              setTotalPages(data.meta.totalPages);
            })
          : getAuditLogs({
              page,
              limit: pageSize,
              action: actionFilter || undefined,
              entity: entityFilter || undefined,
              from: from || undefined,
              to: to || undefined,
            }).then(({ data }) => {
              if (!active) return;
              setLogs(data.logs);
              setTotalPages(data.meta.totalPages);
            });

    request
      .catch((error: unknown) => {
        if (active) {
          setMessage(
            error instanceof Error
              ? error.message
              : "Could not load admin data",
          );
        }
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [
    actionFilter,
    entityFilter,
    from,
    page,
    statusFilter,
    submittedSearch,
    tab,
    to,
    isAdmin,
  ]);

  function changeTab(nextTab: Tab) {
    setTab(nextTab);
    setPage(1);
    setMessage("");
  }

  function applySearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPage(1);
    setSubmittedSearch(search.trim());
  }

  async function changeCandidateStatus(
    candidate: AdminCandidate,
    status: "ACTIVE" | "BLOCKED",
  ) {
    setPendingId(candidate.id);
    setMessage("");
    try {
      const { data } = await updateCandidateStatus(candidate.id, status);
      setCandidates((current) =>
        statusFilter && statusFilter !== data.status
          ? current.filter((item) => item.id !== candidate.id)
          : current.map((item) =>
              item.id === candidate.id
                ? {
                    ...item,
                    user: { ...item.user, status: data.status },
                  }
                : item,
            ),
      );
      setMessage(`${candidate.name} is now ${data.status.toLowerCase()}.`);
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Could not update candidate",
      );
    } finally {
      setPendingId("");
    }
  }

  async function changeRecruiterStatus(
    recruiter: AdminRecruiter,
    status: "ACTIVE" | "BLOCKED",
  ) {
    setPendingId(recruiter.id);
    setMessage("");
    try {
      const { data } = await updateRecruiterStatus(recruiter.id, status);
      setMessage(`${data.name} is now ${data.status.toLowerCase()}.`);
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Could not update recruiter",
      );
    } finally {
      setPendingId("");
    }
  }

  async function createRecruiter(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setCreatePending(true);
    setMessage("");
    try {
      const payload = {
        name: recruiterForm.name.trim(),
        email: recruiterForm.email.trim(),
        password: recruiterForm.password,
        phone: recruiterForm.phone.trim() || undefined,
        designation: recruiterForm.designation.trim() || undefined,
        companyName: recruiterForm.companyName.trim() || undefined,
        companyWebsite: recruiterForm.companyWebsite.trim() || undefined,
        companyDescription:
          recruiterForm.companyDescription.trim() || undefined,
      };
      const { data } = await createRecruiterAccount(payload);
      setRecruiterForm({
        name: "",
        email: "",
        password: "",
        phone: "",
        designation: "",
        companyName: "",
        companyWebsite: "",
        companyDescription: "",
      });
      setShowCreateForm(false);
      setSearch("");
      setSubmittedSearch("");
      if (tab !== "recruiters") setTab("recruiters");
      setPage(1);
      setMessage(`Recruiter account created for ${data.name}.`);
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Could not create recruiter",
      );
    } finally {
      setCreatePending(false);
    }
  }

  if (authLoading || !isAdmin) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-16">
        <p className="text-muted-foreground">
          Verifying administrator access...
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-12">
      <Link
        href="/dashboard"
        className="text-sm text-muted-foreground hover:text-foreground"
      >
        ← Back to dashboard
      </Link>
      <div className="mt-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-medium text-primary">Platform controls</p>
          <h1 className="mt-2 text-4xl font-semibold">Admin workspace</h1>
          <p className="mt-2 text-muted-foreground">
            Manage accounts and review platform activity.
          </p>
        </div>
        <Link
          href="/reports"
          className="rounded-lg border px-4 py-2.5 text-center text-sm font-medium hover:bg-muted"
        >
          View reports
        </Link>
      </div>

      <div className="mt-8 flex flex-wrap gap-2 border-b pb-3">
        {(["candidates", "recruiters", "audit"] as const).map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => changeTab(item)}
            aria-pressed={tab === item}
            className={`rounded-lg px-4 py-2 text-sm font-medium capitalize ${
              tab === item
                ? "bg-primary text-primary-foreground"
                : "border hover:bg-muted"
            }`}
          >
            {item === "audit" ? "Audit log" : item}
          </button>
        ))}
        <button
          type="button"
          onClick={() => setShowCreateForm((value) => !value)}
          className="ml-auto rounded-lg border px-4 py-2 text-sm font-medium hover:bg-muted"
        >
          {showCreateForm ? "Close recruiter form" : "Create recruiter"}
        </button>
      </div>

      {message && (
        <output className="mt-5 block rounded-lg border bg-muted/50 p-4 text-sm">
          {message}
        </output>
      )}

      {showCreateForm && (
        <form
          onSubmit={createRecruiter}
          className="mt-6 grid gap-4 rounded-2xl border bg-card p-6 md:grid-cols-2"
        >
          <div className="md:col-span-2">
            <h2 className="font-semibold">Provision recruiter account</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Share the temporary password with the recruiter through a secure
              channel.
            </p>
          </div>
          <label className="text-sm">
            Full name
            <input
              required
              minLength={2}
              value={recruiterForm.name}
              onChange={(event) =>
                setRecruiterForm({ ...recruiterForm, name: event.target.value })
              }
              className="mt-2 h-11 w-full rounded-lg border bg-background px-3"
            />
          </label>
          <label className="text-sm">
            Email
            <input
              required
              type="email"
              value={recruiterForm.email}
              onChange={(event) =>
                setRecruiterForm({
                  ...recruiterForm,
                  email: event.target.value,
                })
              }
              className="mt-2 h-11 w-full rounded-lg border bg-background px-3"
            />
          </label>
          <label className="text-sm">
            Temporary password
            <input
              required
              minLength={8}
              type="password"
              value={recruiterForm.password}
              onChange={(event) =>
                setRecruiterForm({
                  ...recruiterForm,
                  password: event.target.value,
                })
              }
              className="mt-2 h-11 w-full rounded-lg border bg-background px-3"
            />
          </label>
          <label className="text-sm">
            Company
            <input
              value={recruiterForm.companyName}
              onChange={(event) =>
                setRecruiterForm({
                  ...recruiterForm,
                  companyName: event.target.value,
                })
              }
              className="mt-2 h-11 w-full rounded-lg border bg-background px-3"
            />
          </label>
          <label className="text-sm">
            Phone
            <input
              value={recruiterForm.phone}
              onChange={(event) =>
                setRecruiterForm({
                  ...recruiterForm,
                  phone: event.target.value,
                })
              }
              className="mt-2 h-11 w-full rounded-lg border bg-background px-3"
            />
          </label>
          <label className="text-sm">
            Designation
            <input
              value={recruiterForm.designation}
              onChange={(event) =>
                setRecruiterForm({
                  ...recruiterForm,
                  designation: event.target.value,
                })
              }
              className="mt-2 h-11 w-full rounded-lg border bg-background px-3"
            />
          </label>
          <label className="text-sm md:col-span-2">
            Company website
            <input
              type="url"
              value={recruiterForm.companyWebsite}
              onChange={(event) =>
                setRecruiterForm({
                  ...recruiterForm,
                  companyWebsite: event.target.value,
                })
              }
              placeholder="https://example.com"
              className="mt-2 h-11 w-full rounded-lg border bg-background px-3"
            />
          </label>
          <label className="text-sm md:col-span-2">
            Company description
            <textarea
              value={recruiterForm.companyDescription}
              onChange={(event) =>
                setRecruiterForm({
                  ...recruiterForm,
                  companyDescription: event.target.value,
                })
              }
              className="mt-2 min-h-20 w-full rounded-lg border bg-background p-3"
            />
          </label>
          <button
            type="submit"
            disabled={createPending}
            className="h-11 rounded-lg bg-primary font-medium text-primary-foreground disabled:opacity-60 md:col-span-2"
          >
            {createPending ? "Creating account..." : "Create recruiter account"}
          </button>
        </form>
      )}

      {tab !== "audit" ? (
        <section className="mt-6 rounded-2xl border bg-card p-5">
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
            <div>
              <h2 className="text-lg font-semibold capitalize">
                {tab} directory
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Search, review and manage {tab}.
              </p>
            </div>
            <form
              onSubmit={applySearch}
              className="flex w-full gap-2 lg:max-w-xl"
            >
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder={`Search ${tab} by name or email`}
                className="h-11 min-w-0 flex-1 rounded-lg border bg-background px-3"
              />
              {tab === "candidates" && (
                <select
                  aria-label="Filter candidates by status"
                  value={statusFilter}
                  onChange={(event) => {
                    setStatusFilter(event.target.value);
                    setPage(1);
                  }}
                  className="h-11 rounded-lg border bg-background px-2 text-sm"
                >
                  <option value="">All statuses</option>
                  <option value="ACTIVE">Active</option>
                  <option value="BLOCKED">Blocked</option>
                  <option value="DELETED">Deleted</option>
                </select>
              )}
              <button
                type="submit"
                className="rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground"
              >
                Search
              </button>
            </form>
          </div>

          {isLoading ? (
            <p className="py-12 text-center text-sm text-muted-foreground">
              Loading {tab}...
            </p>
          ) : tab === "candidates" ? (
            candidates.length === 0 ? (
              <p className="py-12 text-center text-sm text-muted-foreground">
                No candidates match these filters.
              </p>
            ) : (
              <div className="mt-5 overflow-x-auto">
                <table className="w-full min-w-[760px] text-left text-sm">
                  <thead className="border-b text-xs uppercase text-muted-foreground">
                    <tr>
                      <th className="px-3 py-3 font-medium">Candidate</th>
                      <th className="px-3 py-3 font-medium">Status</th>
                      <th className="px-3 py-3 font-medium">Email verified</th>
                      <th className="px-3 py-3 font-medium">Joined</th>
                      <th className="px-3 py-3 text-right font-medium">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {candidates.map((candidate) => (
                      <tr key={candidate.id}>
                        <td className="px-3 py-4">
                          <p className="font-medium">{candidate.name}</p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {candidate.email}
                          </p>
                        </td>
                        <td className="px-3 py-4">
                          <span className="rounded-full bg-muted px-2.5 py-1 text-xs">
                            {candidate.user.status}
                          </span>
                        </td>
                        <td className="px-3 py-4">
                          {candidate.user.emailVerified ? "Yes" : "No"}
                        </td>
                        <td className="px-3 py-4 text-muted-foreground">
                          {formatDate(candidate.createdAt)}
                        </td>
                        <td className="px-3 py-4">
                          {candidate.user.status !== "DELETED" && (
                            <div className="flex justify-end gap-2">
                              {(candidate.user.status === "ACTIVE"
                                ? ["BLOCKED"]
                                : ["ACTIVE"]
                              ).map((status) => (
                                <button
                                  key={status}
                                  type="button"
                                  disabled={pendingId === candidate.id}
                                  onClick={() =>
                                    changeCandidateStatus(
                                      candidate,
                                      status as "ACTIVE" | "BLOCKED",
                                    )
                                  }
                                  className="rounded-lg border px-3 py-2 text-xs hover:bg-muted disabled:opacity-50"
                                >
                                  {pendingId === candidate.id
                                    ? "Saving..."
                                    : status === "BLOCKED"
                                      ? "Block"
                                      : "Activate"}
                                </button>
                              ))}
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          ) : recruiters.length === 0 ? (
            <p className="py-12 text-center text-sm text-muted-foreground">
              No recruiters match this search.
            </p>
          ) : (
            <div className="mt-5 overflow-x-auto">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead className="border-b text-xs uppercase text-muted-foreground">
                  <tr>
                    <th className="px-3 py-3 font-medium">Recruiter</th>
                    <th className="px-3 py-3 font-medium">Company</th>
                    <th className="px-3 py-3 font-medium">Designation</th>
                    <th className="px-3 py-3 font-medium">Joined</th>
                    <th className="px-3 py-3 text-right font-medium">
                      Set account status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {recruiters.map((recruiter) => (
                    <tr key={recruiter.id}>
                      <td className="px-3 py-4">
                        <p className="font-medium">{recruiter.name}</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {recruiter.email}
                        </p>
                      </td>
                      <td className="px-3 py-4">
                        {recruiter.companyName || "—"}
                      </td>
                      <td className="px-3 py-4">
                        {recruiter.designation || "—"}
                      </td>
                      <td className="px-3 py-4 text-muted-foreground">
                        {formatDate(recruiter.createdAt)}
                      </td>
                      <td className="px-3 py-4">
                        <div className="flex justify-end gap-2">
                          {(["ACTIVE", "BLOCKED"] as const).map((status) => (
                            <button
                              key={status}
                              type="button"
                              disabled={pendingId === recruiter.id}
                              onClick={() =>
                                changeRecruiterStatus(recruiter, status)
                              }
                              className="rounded-lg border px-3 py-2 text-xs hover:bg-muted disabled:opacity-50"
                            >
                              {pendingId === recruiter.id
                                ? "Saving..."
                                : status === "ACTIVE"
                                  ? "Activate"
                                  : "Block"}
                            </button>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="mt-3 text-xs text-muted-foreground">
                The backend recruiter list does not include current account
                status; choose the desired status explicitly.
              </p>
            </div>
          )}
        </section>
      ) : (
        <section className="mt-6 rounded-2xl border bg-card p-5">
          <div>
            <h2 className="text-lg font-semibold">Audit log</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Review administrative and platform activity.
            </p>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <label className="text-xs text-muted-foreground">
              Action contains
              <input
                value={actionFilter}
                onChange={(event) => {
                  setActionFilter(event.target.value);
                  setPage(1);
                }}
                placeholder="e.g. CANDIDATE_BLOCKED"
                className="mt-1 h-10 w-full rounded-lg border bg-background px-3 text-sm text-foreground"
              />
            </label>
            <label className="text-xs text-muted-foreground">
              Entity contains
              <input
                value={entityFilter}
                onChange={(event) => {
                  setEntityFilter(event.target.value);
                  setPage(1);
                }}
                placeholder="e.g. CANDIDATE"
                className="mt-1 h-10 w-full rounded-lg border bg-background px-3 text-sm text-foreground"
              />
            </label>
            <label className="text-xs text-muted-foreground">
              From
              <input
                type="date"
                value={from}
                onChange={(event) => {
                  setFrom(event.target.value);
                  setPage(1);
                }}
                className="mt-1 h-10 w-full rounded-lg border bg-background px-3 text-sm text-foreground"
              />
            </label>
            <label className="text-xs text-muted-foreground">
              To
              <input
                type="date"
                value={to}
                onChange={(event) => {
                  setTo(event.target.value);
                  setPage(1);
                }}
                className="mt-1 h-10 w-full rounded-lg border bg-background px-3 text-sm text-foreground"
              />
            </label>
          </div>
          {isLoading ? (
            <p className="py-12 text-center text-sm text-muted-foreground">
              Loading audit log...
            </p>
          ) : logs.length === 0 ? (
            <p className="py-12 text-center text-sm text-muted-foreground">
              No audit events match these filters.
            </p>
          ) : (
            <div className="mt-5 space-y-3">
              {logs.map((log) => (
                <article
                  key={log.id}
                  className="rounded-xl border bg-background p-4"
                >
                  <div className="flex flex-col justify-between gap-2 sm:flex-row">
                    <div>
                      <p className="font-medium">{log.action}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {log.entity}
                        {log.entityId ? ` · ${log.entityId}` : ""}
                      </p>
                    </div>
                    <time
                      dateTime={log.createdAt}
                      className="text-xs text-muted-foreground"
                    >
                      {formatDate(log.createdAt)}
                    </time>
                  </div>
                  {log.user && (
                    <p className="mt-3 text-xs text-muted-foreground">
                      By {log.user.name} ({log.user.email}) · {log.user.role}
                    </p>
                  )}
                  {log.details && (
                    <pre className="mt-3 overflow-x-auto whitespace-pre-wrap rounded-lg bg-muted/50 p-3 text-xs">
                      {log.details}
                    </pre>
                  )}
                </article>
              ))}
            </div>
          )}
        </section>
      )}

      <div className="mt-5 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Page {page} of {Math.max(totalPages, 1)}
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            disabled={page <= 1 || isLoading}
            onClick={() => setPage((current) => current - 1)}
            className="rounded-lg border px-4 py-2 text-sm disabled:opacity-50"
          >
            Previous
          </button>
          <button
            type="button"
            disabled={page >= totalPages || isLoading}
            onClick={() => setPage((current) => current + 1)}
            className="rounded-lg border px-4 py-2 text-sm disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </main>
  );
}
