"use client";

import { useParams, useRouter } from "next/navigation";
import { type FormEvent, useEffect, useState } from "react";
import apiClient from "@/lib/apiClient";

type Question = {
  id: string;
  questionText: string;
  type: "MCQ" | "WRITTEN" | "CODING";
  marks: number;
  options?: { id: string; optionText: string }[];
};
type Attempt = {
  id: string;
  status: string;
  expiresAt: string;
  assessment: { id: string; title: string; durationMinutes: number };
  questions?: Question[];
};

export default function AttemptPage() {
  const { attemptId } = useParams<{ attemptId: string }>();
  const router = useRouter();
  const [attempt, setAttempt] = useState<Attempt | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);

  useEffect(() => {
    apiClient<{ data: Attempt }>(`/attempts/${attemptId}`)
      .then((response) => setAttempt(response.data))
      .catch((error) =>
        setMessage(
          error instanceof Error ? error.message : "Could not load attempt",
        ),
      );
  }, [attemptId]);

  useEffect(() => {
    if (!attempt) return;
    const updateRemaining = () => {
      const remaining = Math.max(
        0,
        Math.floor((new Date(attempt.expiresAt).getTime() - Date.now()) / 1000),
      );
      setSecondsLeft(remaining);
      if (remaining === 0) setMessage("This attempt has expired.");
    };
    updateRemaining();
    const timer = window.setInterval(updateRemaining, 1000);
    return () => window.clearInterval(timer);
  }, [attempt]);

  useEffect(() => {
    if (!attempt) return;
    if (attempt.questions) {
      setQuestions(attempt.questions);
      return;
    }
    setMessage(
      "The backend did not include questions in this attempt. Please ask the administrator to enable the candidate attempt questions endpoint.",
    );
  }, [attempt]);

  async function saveAnswer(
    question: Question,
    value: string,
    answerText = "",
  ) {
    setAnswers((current) => ({ ...current, [question.id]: value }));
    try {
      await apiClient(`/answers`, {
        method: "POST",
        body: {
          attemptId,
          questionId: question.id,
          ...(question.type === "MCQ"
            ? { selectedOptionId: value }
            : { answerText: answerText || value }),
        },
      });
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Could not save answer",
      );
    }
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    try {
      await apiClient(`/attempts/${attemptId}/submit`, {
        method: "POST",
        body: {},
      });
      router.push("/dashboard");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Could not submit attempt",
      );
    }
  }

  if (!attempt)
    return (
      <main className="mx-auto max-w-3xl px-6 py-16">
        <p className="text-muted-foreground">
          {message || "Loading attempt..."}
        </p>
      </main>
    );

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <div className="flex items-start justify-between gap-5">
        <div>
          <p className="text-sm font-medium text-primary">Active attempt</p>
          <h1 className="mt-2 text-3xl font-semibold">
            {attempt.assessment.title}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Time limit: {attempt.assessment.durationMinutes} minutes
          </p>
        </div>
        <span className="rounded-full bg-primary/10 px-3 py-1 text-xs text-primary">
          {attempt.status}
        </span>
      </div>
      {message && (
        <p className="mt-6 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
          {message}
        </p>
      )}
      <form onSubmit={submit} className="mt-8 space-y-5">
        {questions.length === 0 && (
          <div className="rounded-2xl border border-dashed p-8 text-center text-sm text-muted-foreground">
            Questions are not available yet. Ask the recruiter to add questions.
          </div>
        )}
        {questions.map((question, index) => (
          <fieldset
            key={question.id}
            className="rounded-2xl border bg-card p-6"
          >
            <legend className="px-2 text-sm text-muted-foreground">
              Question {index + 1} · {question.marks} marks
            </legend>
            <p className="mt-2 font-medium">{question.questionText}</p>
            {question.type === "MCQ" ? (
              <div className="mt-5 space-y-3">
                {question.options?.map((option) => (
                  <label
                    key={option.id}
                    className="flex cursor-pointer items-center gap-3 rounded-lg border p-3 text-sm hover:bg-muted"
                  >
                    <input
                      required
                      type="radio"
                      name={question.id}
                      checked={answers[question.id] === option.id}
                      onChange={() => saveAnswer(question, option.id)}
                    />
                    {option.optionText}
                  </label>
                ))}
              </div>
            ) : (
              <textarea
                required
                value={answers[question.id] ?? ""}
                onChange={(event) =>
                  setAnswers((current) => ({
                    ...current,
                    [question.id]: event.target.value,
                  }))
                }
                onBlur={(event) => saveAnswer(question, event.target.value)}
                className="mt-5 min-h-32 w-full rounded-lg border bg-background p-3"
                placeholder="Write your answer..."
              />
            )}
          </fieldset>
        ))}
        <button
          type="submit"
          disabled={attempt.status !== "IN_PROGRESS" || secondsLeft === 0}
          className="h-11 w-full rounded-lg bg-primary font-medium text-primary-foreground"
        >
          {secondsLeft === null
            ? "Submit assessment"
            : `Submit assessment (${Math.floor(secondsLeft / 60)}:${String(secondsLeft % 60).padStart(2, "0")})`}
        </button>
      </form>
    </main>
  );
}
