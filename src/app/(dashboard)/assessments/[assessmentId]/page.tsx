"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { type FormEvent, useEffect, useState } from "react";
import {
  type Assessment,
  createQuestion,
  getAssessment,
  getQuestions,
  type Question,
} from "@/api/recruiter.api";

export default function AssessmentQuestionsPage() {
  const { assessmentId } = useParams<{ assessmentId: string }>();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [assessment, setAssessment] = useState<{
    title: string;
    status: Assessment["status"];
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    questionText: "",
    type: "MCQ" as Question["type"],
    marks: 10,
    difficulty: "MEDIUM" as Question["difficulty"],
    options: ["", "", ""],
    correctOption: 0,
  });

  useEffect(() => {
    Promise.all([getAssessment(assessmentId), getQuestions(assessmentId)])
      .then(([assessmentResponse, questionsResponse]) => {
        setAssessment({
          title: assessmentResponse.data.title,
          status: assessmentResponse.data.status,
        });
        const data = questionsResponse.data;
        setQuestions(Array.isArray(data) ? data : data.questions);
      })
      .catch((error) =>
        setMessage(
          error instanceof Error ? error.message : "Could not load assessment",
        ),
      )
      .finally(() => setIsLoading(false));
  }, [assessmentId]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (assessment?.status !== "DRAFT" || isSubmitting) return;
    const optionValues = form.options.map((option) => option.trim());
    if (
      form.type === "MCQ" &&
      (optionValues.length < 2 ||
        optionValues.some((option) => option.length === 0))
    ) {
      setMessage("MCQ questions need at least two non-empty options.");
      return;
    }
    setIsSubmitting(true);
    try {
      const question = await createQuestion(assessmentId, {
        questionText: form.questionText.trim(),
        type: form.type,
        marks: form.marks,
        order: questions.length + 1,
        difficulty: form.difficulty,
        ...(form.type === "MCQ"
          ? {
              options: optionValues.map((optionText, index) => ({
                optionText,
                isCorrect: index === form.correctOption,
              })),
            }
          : {}),
      });
      setQuestions((current) => [...current, question.data]);
      setForm((current) => ({
        ...current,
        questionText: "",
        options: ["", "", ""],
        correctOption: 0,
      }));
      setMessage("Question added to the draft.");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Could not create question",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <Link
        href="/dashboard"
        className="text-sm text-muted-foreground hover:text-foreground"
      >
        ← Back to dashboard
      </Link>
      <div className="mt-5">
        <p className="text-sm font-medium text-primary">Assessment builder</p>
        <h1 className="mt-2 text-4xl font-semibold">
          {assessment?.title ?? "Questions"}
        </h1>
        <p className="mt-2 text-muted-foreground">
          {assessment?.status === "DRAFT"
            ? "Add questions while the assessment is still a draft."
            : "Published assessments cannot be changed."}
        </p>
      </div>
      {message && (
        <p className="mt-6 rounded-lg border bg-muted/50 p-4 text-sm">
          {message}
        </p>
      )}
      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_1.2fr]">
        {isLoading ? (
          <div className="rounded-2xl border p-8 text-sm text-muted-foreground">
            Loading assessment...
          </div>
        ) : assessment?.status !== "DRAFT" ? (
          <div className="rounded-2xl border bg-muted/40 p-8 text-sm text-muted-foreground">
            This assessment is already published and is read-only.
          </div>
        ) : (
          <form
            onSubmit={submit}
            className="space-y-4 rounded-2xl border bg-card p-6"
          >
            <h2 className="font-semibold">Add a question</h2>
            <textarea
              required
              value={form.questionText}
              onChange={(event) =>
                setForm({ ...form, questionText: event.target.value })
              }
              placeholder="Write the question..."
              className="min-h-28 w-full rounded-lg border bg-background p-3"
            />
            <div className="grid grid-cols-2 gap-3">
              <label className="text-sm">
                Type
                <select
                  value={form.type}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      type: event.target.value as Question["type"],
                    })
                  }
                  className="mt-2 h-11 w-full rounded-lg border bg-background px-3"
                >
                  <option value="MCQ">MCQ</option>
                  <option value="WRITTEN">Written</option>
                  <option value="CODING">Coding</option>
                </select>
              </label>
              <label className="text-sm">
                Difficulty
                <select
                  value={form.difficulty}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      difficulty: event.target.value as Question["difficulty"],
                    })
                  }
                  className="mt-2 h-11 w-full rounded-lg border bg-background px-3"
                >
                  <option value="EASY">Easy</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HARD">Hard</option>
                </select>
              </label>
            </div>
            <label className="block text-sm">
              Marks
              <input
                required
                min={1}
                type="number"
                value={form.marks}
                onChange={(event) =>
                  setForm({ ...form, marks: Number(event.target.value) })
                }
                className="mt-2 h-11 w-full rounded-lg border bg-background px-3"
              />
            </label>
            {form.type === "MCQ" && (
              <div className="space-y-3">
                <p className="text-sm font-medium">Options</p>
                {form.options.map((option, index) => {
                  const label = String.fromCharCode(65 + index);
                  return (
                    <div key={label} className="flex gap-2">
                      <input
                        required
                        value={option}
                        onChange={(event) =>
                          setForm({
                            ...form,
                            options: form.options.map((item, itemIndex) =>
                              itemIndex === index ? event.target.value : item,
                            ),
                          })
                        }
                        placeholder={`Option ${label}`}
                        className="h-10 flex-1 rounded-lg border bg-background px-3"
                      />
                      <label className="flex items-center gap-1 text-xs">
                        <input
                          type="radio"
                          name="correct"
                          checked={form.correctOption === index}
                          onChange={() =>
                            setForm({ ...form, correctOption: index })
                          }
                        />{" "}
                        correct
                      </label>
                    </div>
                  );
                })}
              </div>
            )}
            <button
              type="submit"
              disabled={isSubmitting}
              className="h-11 w-full rounded-lg bg-primary text-sm font-medium text-primary-foreground"
            >
              {isSubmitting ? "Adding question..." : "Add question"}
            </button>
          </form>
        )}
        <section className="space-y-3">
          {questions.length === 0 ? (
            <div className="rounded-2xl border border-dashed p-10 text-center text-sm text-muted-foreground">
              No questions yet.
            </div>
          ) : (
            questions.map((question, index) => (
              <article
                key={question.id}
                className="rounded-2xl border bg-card p-5"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs font-medium text-primary">
                    Question {index + 1} · {question.type}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {question.marks} marks · {question.difficulty}
                  </span>
                </div>
                <p className="mt-3 font-medium">{question.questionText}</p>
                {question.options && (
                  <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                    {question.options.map((option) => (
                      <li
                        key={option.id}
                        className={
                          option.isCorrect ? "font-medium text-primary" : ""
                        }
                      >
                        {option.isCorrect ? "✓ " : "• "}
                        {option.optionText}
                      </li>
                    ))}
                  </ul>
                )}
              </article>
            ))
          )}
        </section>
      </div>
    </main>
  );
}
