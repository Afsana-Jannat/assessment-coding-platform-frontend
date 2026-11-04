import type { ApiResponse } from "@/api/auth.api";
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
  startAt?: string | null;
  endAt?: string | null;
}) =>
  apiClient<ApiResponse<Assessment>>("/assessments", {
    method: "POST",
    body: payload,
  });

export const updateAssessment = (
  assessmentId: string,
  payload: Partial<{
    title: string;
    description: string | null;
    instructions: string | null;
    durationMinutes: number;
    totalMarks: number;
    passingMarks: number;
    startAt: string | null;
    endAt: string | null;
  }>,
) =>
  apiClient<ApiResponse<Assessment>>(`/assessments/${assessmentId}`, {
    method: "PATCH",
    body: payload,
  });

export const deleteAssessment = (assessmentId: string) =>
  apiClient<ApiResponse<Assessment>>(`/assessments/${assessmentId}`, {
    method: "DELETE",
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

export const updateQuestion = (
  assessmentId: string,
  questionId: string,
  payload: Partial<{
    questionText: string;
    type: Question["type"];
    marks: number;
    order: number;
    difficulty: Question["difficulty"];
    explanation: string | null;
    referenceAnswer: string | null;
    options: { optionText: string; isCorrect: boolean }[];
  }>,
) =>
  apiClient<ApiResponse<Question>>(
    `/assessments/${assessmentId}/questions/${questionId}`,
    {
      method: "PATCH",
      body: payload,
    },
  );

export const deleteQuestion = (assessmentId: string, questionId: string) =>
  apiClient<ApiResponse<Question>>(
    `/assessments/${assessmentId}/questions/${questionId}`,
    { method: "DELETE" },
  );

export type Invitation = {
  id: string;
  status: string;
  message?: string | null;
  expiresAt?: string | null;
  assessment?: { id: string; title: string };
  candidate?: { id: string; name?: string; email?: string };
};

export const createInvitation = (payload: {
  candidateId: string;
  assessmentId: string;
  message?: string;
  expiresAt?: string;
}) =>
  apiClient<ApiResponse<Invitation>>("/invitations", {
    method: "POST",
    body: payload,
  });

export const acceptInvitation = (invitationId: string) =>
  apiClient<ApiResponse<Invitation>>(`/invitations/${invitationId}/accept`, {
    method: "PATCH",
    body: {},
  });

export const declineInvitation = (invitationId: string) =>
  apiClient<ApiResponse<Invitation>>(`/invitations/${invitationId}/decline`, {
    method: "PATCH",
    body: {},
  });

export type ReportData = Record<string, unknown>;

export const getRecruiterReport = (from?: string, to?: string) =>
  apiClient<ApiResponse<ReportData>>(
    `/reports/overview${reportDateQuery(from, to)}`,
  );

export const getAdminReport = (from?: string, to?: string) =>
  apiClient<ApiResponse<ReportData>>(
    `/reports/admin/overview${reportDateQuery(from, to)}`,
  );

function reportDateQuery(from?: string, to?: string) {
  const params = new URLSearchParams();
  if (from) params.set("from", from);
  if (to) params.set("to", to);
  const query = params.toString();
  return query ? `?${query}` : "";
}

export const getRecruiterRevenue = (from?: string, to?: string) =>
  apiClient<ApiResponse<ReportData>>(
    `/reports/revenue${reportDateQuery(from, to)}`,
  );

export const getAdminRevenue = (from?: string, to?: string) =>
  apiClient<ApiResponse<ReportData>>(
    `/reports/admin/revenue${reportDateQuery(from, to)}`,
  );

export const getAdminAssessmentReport = (from?: string, to?: string) =>
  apiClient<ApiResponse<ReportData>>(
    `/reports/admin/assessments${reportDateQuery(from, to)}`,
  );

export const getAdminCandidateReport = (from?: string, to?: string) =>
  apiClient<ApiResponse<ReportData>>(
    `/reports/admin/candidates${reportDateQuery(from, to)}`,
  );

export const getAssessmentReport = (assessmentId: string) =>
  apiClient<ApiResponse<ReportData>>(`/reports/assessments/${assessmentId}`);

export const getCandidateReport = (candidateId: string) =>
  apiClient<ApiResponse<ReportData>>(`/reports/candidates/${candidateId}`);

export type StripeCheckout = {
  paymentId: string;
  sessionId: string;
  checkoutUrl: string | null;
};

export const createStripeCheckout = (assessmentId: string) =>
  apiClient<ApiResponse<StripeCheckout>>(
    "/payments/stripe/create-checkout-session",
    {
      method: "POST",
      body: { assessmentId },
    },
  );

export type BkashPayment = {
  paymentID: string;
  bkashURL: string;
  transactionStatus?: string;
  amount?: string;
  currency?: string;
  statusCode?: string;
  statusMessage?: string;
};

export const createBkashPayment = (assessmentId: string) =>
  apiClient<ApiResponse<BkashPayment>>("/payments/bkash/create", {
    method: "POST",
    body: { assessmentId },
  });

export const executeBkashPayment = (paymentID: string) =>
  apiClient<ApiResponse<BkashPayment>>("/payments/bkash/execute", {
    method: "POST",
    body: { paymentID },
  });

export const queryBkashPayment = (paymentID: string) =>
  apiClient<ApiResponse<BkashPayment>>(`/payments/bkash/query/${paymentID}`);

export type Evaluation = {
  id: string;
  answerId: string;
  marksObtained: number;
  feedback?: string | null;
  evaluatedAt: string;
};

export const evaluateAnswer = (payload: {
  answerId: string;
  marksObtained: number;
  feedback?: string;
}) =>
  apiClient<ApiResponse<Evaluation>>("/evaluations", {
    method: "POST",
    body: payload,
  });
