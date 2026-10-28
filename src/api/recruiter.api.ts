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
