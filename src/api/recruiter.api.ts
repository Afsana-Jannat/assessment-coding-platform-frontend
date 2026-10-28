import apiClient from "@/lib/apiClient";

export type Assessment = {
  id: string;
  title: string;
  description?: string | null;
  instructions?: string | null;
  durationMinutes: number;
  totalMarks: number;
  passingMarks: number;
  status: "DRAFT" | "PUBLISHED" | "ONGOING" | "COMPLETED" | "ARCHIVED";
  startAt?: string | null;
  endAt?: string | null;
};

type ApiResponse<T> = { success: boolean; data: T; message?: string };

export const getAssessments = () =>
  apiClient<ApiResponse<Assessment[] | { assessments: Assessment[] }>>(
    "/assessments",
  );

export const createAssessment = (payload: {
  title: string;
  description?: string;
  instructions?: string;
  durationMinutes: number;
  totalMarks: number;
  passingMarks: number;
}) =>
  apiClient<ApiResponse<Assessment>>("/assessments", {
    method: "POST",
    body: payload,
  });

export const publishAssessment = (assessmentId: string) =>
  apiClient<ApiResponse<Assessment>>(`/assessments/${assessmentId}/publish`, {
    method: "PATCH",
    body: {},
  });

export const getAssessment = (assessmentId: string) =>
  apiClient<ApiResponse<Assessment>>(`/assessments/${assessmentId}`);

export type Question = {
  id: string;
  questionText: string;
  type: "MCQ" | "WRITTEN" | "CODING";
  marks: number;
  order: number;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  options?: { id: string; optionText: string; isCorrect: boolean }[];
};

export const getQuestions = (assessmentId: string) =>
  apiClient<ApiResponse<Question[] | { questions: Question[] }>>(
    `/assessments/${assessmentId}/questions?page=1&limit=100`,
  );

export const createQuestion = (
  assessmentId: string,
  payload: {
    questionText: string;
    type: Question["type"];
    marks: number;
    order: number;
    difficulty: Question["difficulty"];
    options?: { optionText: string; isCorrect: boolean }[];
  },
) =>
  apiClient<ApiResponse<Question>>(`/assessments/${assessmentId}/questions`, {
    method: "POST",
    body: payload,
  });
