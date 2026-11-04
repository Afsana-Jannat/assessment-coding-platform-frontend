"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { type FormEvent, useEffect, useState } from "react";
import {
  type Assessment,
  createQuestion,
  deleteAssessment,
  deleteQuestion,
  evaluateAnswer,
  getAssessment,
  getQuestions,
  type Question,
  updateAssessment,
  updateQuestion,
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
  const [evaluationForm, setEvaluationForm] = useState({
    answerId: "",
    marksObtained: 0,
    feedback: "",
  });
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(
    null,
  );
  const [isSavingAssessment, setIsSavingAssessment] = useState(false);
  const [assessmentForm, setAssessmentForm] = useState({
    title: "",
    description: "",
    instructions: "",
    durationMinutes: 60,
    totalMarks: 100,
    passingMarks: 40,
    startAt: "",
    endAt: "",
  });

  useEffect(() => {
    Promise.all([getAssessment(assessmentId), getQuestions(assessmentId)])
      .then(([assessmentResponse, questionsResponse]) => {
        setAssessment({
          title: assessmentResponse.data.title,
          status: assessmentResponse.data.status,
        });
        setAssessmentForm({
          title: assessmentResponse.data.title,
          description: assessmentResponse.data.description ?? "",
          instructions: assessmentResponse.data.instructions ?? "",
          durationMinutes: assessmentResponse.data.durationMinutes,
          totalMarks: assessmentResponse.data.totalMarks,
          passingMarks: assessmentResponse.data.passingMarks,
          startAt: assessmentResponse.data.startAt
            ? assessmentResponse.data.startAt.slice(0, 16)
            : "",
          endAt: assessmentResponse.data.endAt
            ? assessmentResponse.data.endAt.slice(0, 16)
            : "",
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
      const payload = {
        questionText: form.questionText.trim(),
        type: form.type,
        marks: form.marks,
        order: editingQuestionId
          ? (questions.find((question) => question.id === editingQuestionId)
              ?.order ?? questions.length + 1)
          : questions.length + 1,
        difficulty: form.difficulty,
        ...(form.type === "MCQ"
          ? {
              options: optionValues.map((optionText, index) => ({
                optionText,
                isCorrect: index === form.correctOption,
              })),
            }
          : {}),
      };
      if (editingQuestionId) {
        const question = await updateQuestion(
          assessmentId,
          editingQuestionId,
          payload,
        );
        setQuestions((current) =>
          current.map((item) =>
            item.id === editingQuestionId ? question.data : item,
          ),
        );
      } else {
        const question = await createQuestion(assessmentId, payload);
        setQuestions((current) => [...current, question.data]);
      }
      setEditingQuestionId(null);
      setForm((current) => ({
        ...current,
        questionText: "",
        options: ["", "", ""],
        correctOption: 0,
      }));
      setMessage(
        editingQuestionId
          ? "Question updated in the draft."
          : "Question added to the draft.",
      );
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Could not create question",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function saveAssessment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSavingAssessment) return;
    setIsSavingAssessment(true);
    setMessage("");
    try {
      const { data } = await updateAssessment(assessmentId, {
        title: assessmentForm.title.trim(),
        description: assessmentForm.description.trim() || null,
        instructions: assessmentForm.instructions.trim() || null,
        durationMinutes: assessmentForm.durationMinutes,
        totalMarks: assessmentForm.totalMarks,
        passingMarks: assessmentForm.passingMarks,
        startAt: assessmentForm.startAt || null,
        endAt: assessmentForm.endAt || null,
      });
      setAssessment({ title: data.title, status: data.status });
      setMessage("Assessment details updated.");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Could not update assessment",
      );
    } finally {
      setIsSavingAssessment(false);
    }
  }

  async function removeQuestion(questionId: string) {
    if (!window.confirm("Delete this question from the draft?")) return;
    try {
      await deleteQuestion(assessmentId, questionId);
      setQuestions((current) =>
        current.filter((question) => question.id !== questionId),
      );
      setMessage("Question deleted.");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Could not delete question",
      );
    }
  }

  function editQuestion(question: Question) {
    const options = question.options?.map((option) => option.optionText) ?? [];
    const correctOption = question.options?.findIndex(
      (option) => option.isCorrect,
    );
    setEditingQuestionId(question.id);
    setForm({
      questionText: question.questionText,
      type: question.type,
      marks: question.marks,
      difficulty: question.difficulty,
      options: options.length >= 2 ? options : ["", "", ""],
      correctOption:
        correctOption !== undefined && correctOption >= 0 ? correctOption : 0,
    });
  }

  async function removeAssessment() {
    if (!window.confirm("Delete this draft assessment?")) return;
    try {
      await deleteAssessment(assessmentId);
      window.location.assign("/dashboard");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Could not delete assessment",
      );
    }
  }

  async function submitEvaluation(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isEvaluating) return;
    setIsEvaluating(true);
    setMessage("");
    try {
      await evaluateAnswer({
        answerId: evaluationForm.answerId.trim(),
        marksObtained: evaluationForm.marksObtained,
        feedback: evaluationForm.feedback.trim() || undefined,
      });
      setEvaluationForm({
        answerId: "",
        marksObtained: 0,
        feedback: "",
      });
      setMessage(
        "Answer evaluated. The candidate's attempt score was updated.",
      );
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Could not evaluate answer",
      );
    } finally {
      setIsEvaluating(false);
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
      {assessment?.status === "DRAFT" && (
        <form
          onSubmit={saveAssessment}
          className="mt-8 grid gap-4 rounded-2xl border bg-card p-6 md:grid-cols-2"
        >
          <h2 className="font-semibold md:col-span-2">Assessment details</h2>
          <input
            required
            value={assessmentForm.title}
            onChange={(event) =>
              setAssessmentForm({
                ...assessmentForm,
                title: event.target.value,
              })
            }
            className="h-11 rounded-lg border bg-background px-3 md:col-span-2"
            placeholder="Assessment title"
          />
          <textarea
            value={assessmentForm.description}
            onChange={(event) =>
              setAssessmentForm({
                ...assessmentForm,
                description: event.target.value,
              })
            }
            className="min-h-20 rounded-lg border bg-background p-3"
            placeholder="Description"
          />
          <textarea
            value={assessmentForm.instructions}
            onChange={(event) =>
              setAssessmentForm({
                ...assessmentForm,
                instructions: event.target.value,
              })
            }
            className="min-h-20 rounded-lg border bg-background p-3"
            placeholder="Candidate instructions"
          />
          <label className="text-sm">
            Duration (minutes)
            <input
              min={1}
              type="number"
              value={assessmentForm.durationMinutes}
              onChange={(event) =>
                setAssessmentForm({
                  ...assessmentForm,
                  durationMinutes: Number(event.target.value),
                })
              }
              className="mt-2 h-11 w-full rounded-lg border bg-background px-3"
            />
          </label>
          <label className="text-sm">
            Total marks
            <input
              min={1}
              type="number"
              value={assessmentForm.totalMarks}
              onChange={(event) =>
                setAssessmentForm({
                  ...assessmentForm,
                  totalMarks: Number(event.target.value),
                })
              }
              className="mt-2 h-11 w-full rounded-lg border bg-background px-3"
            />
          </label>
          <label className="text-sm">
            Passing marks
            <input
              min={1}
              type="number"
              value={assessmentForm.passingMarks}
              onChange={(event) =>
                setAssessmentForm({
                  ...assessmentForm,
                  passingMarks: Number(event.target.value),
                })
              }
              className="mt-2 h-11 w-full rounded-lg border bg-background px-3"
            />
          </label>
          <label className="text-sm">
            Opens at (optional)
            <input
              type="datetime-local"
              value={assessmentForm.startAt}
              onChange={(event) =>
                setAssessmentForm({
                  ...assessmentForm,
                  startAt: event.target.value,
                })
              }
              className="mt-2 h-11 w-full rounded-lg border bg-background px-3"
            />
          </label>
          <label className="text-sm">
            Closes at (optional)
            <input
              type="datetime-local"
              value={assessmentForm.endAt}
              onChange={(event) =>
                setAssessmentForm({
                  ...assessmentForm,
                  endAt: event.target.value,
                })
              }
              className="mt-2 h-11 w-full rounded-lg border bg-background px-3"
            />
          </label>
          <div className="flex gap-3 md:col-span-2">
            <button
              type="submit"
              disabled={isSavingAssessment}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-60"
            >
              {isSavingAssessment ? "Saving..." : "Save details"}
            </button>
            <button
              type="button"
              onClick={removeAssessment}
              className="rounded-lg border border-destructive/40 px-4 py-2 text-sm text-destructive"
            >
              Delete draft
            </button>
          </div>
        </form>
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
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-semibold">
                {editingQuestionId ? "Edit question" : "Add a question"}
              </h2>
              {editingQuestionId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingQuestionId(null);
                    setForm({
                      ...form,
                      questionText: "",
                      options: ["", "", ""],
                      correctOption: 0,
                    });
                  }}
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Cancel edit
                </button>
              )}
            </div>
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
                {assessment?.status === "DRAFT" && (
                  <div className="mt-4 flex gap-4 text-sm">
                    <button
                      type="button"
                      onClick={() => editQuestion(question)}
                      className="text-primary hover:underline"
                    >
                      Edit question
                    </button>
                    <button
                      type="button"
                      onClick={() => removeQuestion(question.id)}
                      className="text-destructive hover:underline"
                    >
                      Delete question
                    </button>
                  </div>
                )}
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
      {assessment && assessment.status !== "DRAFT" && (
        <section className="mt-10 rounded-2xl border bg-card p-6">
          <h2 className="text-xl font-semibold">Manual answer evaluation</h2>
          <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
            Evaluate written or coding answers and update the attempt score. The
            backend does not currently provide a list of pending answers, so you
            need the answer ID to submit an evaluation.
          </p>
          <form
            onSubmit={submitEvaluation}
            className="mt-5 grid gap-4 md:grid-cols-2"
          >
            <label className="text-sm md:col-span-2">
              Answer ID
              <input
                required
                value={evaluationForm.answerId}
                onChange={(event) =>
                  setEvaluationForm({
                    ...evaluationForm,
                    answerId: event.target.value,
                  })
                }
                placeholder="Answer UUID"
                className="mt-2 h-11 w-full rounded-lg border bg-background px-3"
              />
            </label>
            <label className="text-sm">
              Marks obtained
              <input
                required
                type="number"
                min={0}
                step={1}
                value={evaluationForm.marksObtained}
                onChange={(event) =>
                  setEvaluationForm({
                    ...evaluationForm,
                    marksObtained: Number(event.target.value),
                  })
                }
                className="mt-2 h-11 w-full rounded-lg border bg-background px-3"
              />
            </label>
            <label className="text-sm">
              Feedback
              <textarea
                maxLength={1000}
                value={evaluationForm.feedback}
                onChange={(event) =>
                  setEvaluationForm({
                    ...evaluationForm,
                    feedback: event.target.value,
                  })
                }
                className="mt-2 min-h-11 w-full rounded-lg border bg-background p-3"
              />
            </label>
            <button
              type="submit"
              disabled={isEvaluating}
              className="h-11 rounded-lg bg-primary font-medium text-primary-foreground disabled:opacity-60 md:col-span-2"
            >
              {isEvaluating ? "Saving evaluation..." : "Submit evaluation"}
            </button>
          </form>
        </section>
      )}
    </main>
  );
}
