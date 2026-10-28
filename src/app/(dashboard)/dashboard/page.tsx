"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useEffect, useMemo, useState } from "react";
import { getMe, type User } from "@/api/auth.api";
import {
  type Assessment,
  createAssessment,
  getAssessments,
  publishAssessment,
} from "@/api/recruiter.api";
import apiClient from "@/lib/apiClient";

type Attempt = { id: string; expiresAt: string; status: string };

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [assessmentId, setAssessmentId] = useState("");
  const [message, setMessage] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    durationMinutes: 60,
    totalMarks: 100,
    passingMarks: 40,
  });

  useEffect(() => {
    getMe()
      .then((response) => setUser(response.data))
      .catch(() => router.replace("/login"));
  }, [router]);

  useEffect(() => {
    if (user?.role === "RECRUITER") {
      getAssessments()
        .then((response) => {
          const data = response.data;
          setAssessments(Array.isArray(data) ? data : data.assessments);
        })
        .catch((error) =>
          setMessage(
            error instanceof Error
              ? error.message
              : "Could not load assessments",
          ),
        );
    }
  }, [user]);

  const greeting = useMemo(
    () =>
      user
        ? `Good to see you, ${user.name.split(" ")[0]}`
        : "Loading your workspace",
    [user],
  );

  async function submitAssessment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      const response = await createAssessment(form);
      setAssessments((current) => [response.data, ...current]);
      setShowCreate(false);
      setMessage("Assessment created as draft.");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Could not create assessment",
      );
    }
  }

  async function startAssessment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      const response = await apiClient<{ data: Attempt }>(
        `/attempts/${assessmentId}/start`,
        { method: "POST", body: {} },
      );
      router.push(`/attempts/${response.data.id}`);
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Could not start assessment",
      );
    }
  }

  if (!user)
    return (
      <main className="mx-auto max-w-7xl px-6 py-16">
        <p className="text-muted-foreground">Loading workspace...</p>
      </main>
    );

  return (
    <main className="mx-auto max-w-7xl px-6 py-12">
      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-medium text-primary">{user.role}</p>
          <h1 className="mt-2 text-4xl font-semibold">{greeting}</h1>
          <p className="mt-2 text-muted-foreground">
            {user.role === "RECRUITER"
              ? "Build and manage your technical assessment pipeline."
              : "Your invited assessments and attempts live here."}
          </p>
        </div>
        {user.role === "RECRUITER" && (
          <button
            type="button"
            onClick={() => setShowCreate((value) => !value)}
            className="rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground"
          >
            {showCreate ? "Close form" : "Create assessment"}
          </button>
        )}
      </div>
      {message && (
        <p className="mt-6 rounded-lg border bg-muted/50 p-4 text-sm">
          {message}
        </p>
      )}
      {user.role === "RECRUITER" ? (
        <section className="mt-10 space-y-4">
          {showCreate && (
            <form
              onSubmit={submitAssessment}
              className="grid gap-4 rounded-2xl border bg-card p-6 md:grid-cols-2"
            >
              <input
                required
                placeholder="Assessment title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="h-11 rounded-lg border bg-background px-3 md:col-span-2"
              />
              <textarea
                placeholder="Description"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                className="min-h-24 rounded-lg border bg-background p-3 md:col-span-2"
              />
              <label className="text-sm">
                Duration (minutes)
                <input
                  required
                  type="number"
                  min={1}
                  value={form.durationMinutes}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      durationMinutes: Number(e.target.value),
                    })
                  }
                  className="mt-2 h-11 w-full rounded-lg border bg-background px-3"
                />
              </label>
              <label className="text-sm">
                Total marks
                <input
                  required
                  type="number"
                  min={1}
                  value={form.totalMarks}
                  onChange={(e) =>
                    setForm({ ...form, totalMarks: Number(e.target.value) })
                  }
                  className="mt-2 h-11 w-full rounded-lg border bg-background px-3"
                />
              </label>
              <label className="text-sm">
                Passing marks
                <input
                  required
                  type="number"
                  min={0}
                  value={form.passingMarks}
                  onChange={(e) =>
                    setForm({ ...form, passingMarks: Number(e.target.value) })
                  }
                  className="mt-2 h-11 w-full rounded-lg border bg-background px-3"
                />
              </label>
              <button
                type="submit"
                className="h-11 rounded-lg bg-primary text-sm font-medium text-primary-foreground md:col-span-2"
              >
                Save draft
              </button>
            </form>
          )}
          {assessments.length === 0 ? (
            <div className="rounded-2xl border border-dashed p-10 text-center text-muted-foreground">
              No assessments yet. Create your first draft.
            </div>
          ) : (
            assessments.map((assessment) => (
              <article
                key={assessment.id}
                className="flex flex-col justify-between gap-4 rounded-2xl border bg-card p-6 md:flex-row md:items-center"
              >
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="font-semibold">{assessment.title}</h2>
                    <span className="rounded-full bg-muted px-2.5 py-1 text-xs">
                      {assessment.status}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {assessment.durationMinutes} minutes ·{" "}
                    {assessment.totalMarks} marks · pass at{" "}
                    {assessment.passingMarks}
                  </p>
                  <Link
                    href={`/assessments/${assessment.id}`}
                    className="mt-3 inline-block text-sm font-medium text-primary hover:underline"
                  >
                    Manage questions
                  </Link>
                </div>
                {assessment.status === "DRAFT" && (
                  <button
                    type="button"
                    onClick={() =>
                      publishAssessment(assessment.id)
                        .then(() =>
                          setAssessments((current) =>
                            current.map((item) =>
                              item.id === assessment.id
                                ? { ...item, status: "PUBLISHED" }
                                : item,
                            ),
                          ),
                        )
                        .catch((error) =>
                          setMessage(
                            error instanceof Error
                              ? error.message
                              : "Could not publish assessment",
                          ),
                        )
                    }
                    className="rounded-lg border px-4 py-2 text-sm hover:bg-muted"
                  >
                    Publish
                  </button>
                )}
              </article>
            ))
          )}
        </section>
      ) : user.role === "ADMIN" ? (
        <section className="mt-10 max-w-2xl rounded-2xl border bg-card p-6">
          <p className="text-sm font-medium text-primary">Administration</p>
          <h2 className="mt-2 text-xl font-semibold">
            Manage the assessment platform
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Admin tools are available from the backend. Your account is
            authenticated with administrator permissions.
          </p>
        </section>
      ) : (
        <section className="mt-10 max-w-xl rounded-2xl border bg-card p-6">
          <h2 className="text-xl font-semibold">Start an invited assessment</h2>
          <Link
            href="/profile"
            className="mt-4 inline-block text-sm font-medium text-primary hover:underline"
          >
            Complete your candidate profile →
          </Link>
          <p className="mt-2 text-sm text-muted-foreground">
            Paste the assessment ID from your invitation.
          </p>
          <form onSubmit={startAssessment} className="mt-5 flex gap-3">
            <input
              required
              value={assessmentId}
              onChange={(e) => setAssessmentId(e.target.value)}
              placeholder="Assessment ID"
              className="h-11 min-w-0 flex-1 rounded-lg border bg-background px-3"
            />
            <button
              type="submit"
              className="rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground"
            >
              Start
            </button>
          </form>
        </section>
      )}
    </main>
  );
}
