import type { ApiResponse } from "@/api/auth.api";
import apiClient from "@/lib/apiClient";

type PageMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type AdminCandidate = {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone?: string | null;
  createdAt: string;
  user: {
    status: "ACTIVE" | "BLOCKED" | "DELETED";
    emailVerified: boolean;
  };
};

export type AdminRecruiter = {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone?: string | null;
  designation?: string | null;
  companyName?: string | null;
  companyWebsite?: string | null;
  createdAt: string;
};

export type AuditLog = {
  id: string;
  action: string;
  entity: string;
  entityId?: string | null;
  details?: string | null;
  createdAt: string;
  user?: {
    id: string;
    name: string;
    email: string;
    role: string;
  } | null;
};

export type AuditLogResult = {
  meta: PageMeta;
  logs: AuditLog[];
};

type ListParams = {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};

function queryString(params: Record<string, string | number | undefined>) {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") search.set(key, String(value));
  }
  return search.toString();
}

export const getAdminCandidates = (params: ListParams & { status?: string }) =>
  apiClient<ApiResponse<{ candidates: AdminCandidate[]; meta: PageMeta }>>(
    `/admin/candidates?${queryString(params)}`,
  );

export const getAdminRecruiters = (params: ListParams) =>
  apiClient<ApiResponse<{ recruiters: AdminRecruiter[]; meta: PageMeta }>>(
    `/admin/recruiters?${queryString(params)}`,
  );

export const createRecruiterAccount = (payload: {
  name: string;
  email: string;
  password: string;
  phone?: string;
  designation?: string;
  companyName?: string;
  companyWebsite?: string;
  companyDescription?: string;
}) =>
  apiClient<ApiResponse<AdminRecruiter>>("/admin/recruiters", {
    method: "POST",
    body: payload,
  });

export const updateCandidateStatus = (
  candidateId: string,
  status: "ACTIVE" | "BLOCKED",
) =>
  apiClient<
    ApiResponse<{
      id: string;
      name: string;
      email: string;
      role: "CANDIDATE";
      status: "ACTIVE" | "BLOCKED";
      updatedAt: string;
    }>
  >(`/admin/candidates/${candidateId}/status`, {
    method: "PATCH",
    body: { status },
  });

export const updateRecruiterStatus = (
  recruiterId: string,
  status: "ACTIVE" | "BLOCKED",
) =>
  apiClient<
    ApiResponse<{
      id: string;
      name: string;
      email: string;
      role: "RECRUITER";
      status: "ACTIVE" | "BLOCKED";
      updatedAt: string;
    }>
  >(`/admin/recruiters/${recruiterId}/status`, {
    method: "PATCH",
    body: { status },
  });

export const getAuditLogs = (params: {
  page?: number;
  limit?: number;
  action?: string;
  entity?: string;
  from?: string;
  to?: string;
}) =>
  apiClient<ApiResponse<AuditLogResult>>(`/audit-logs?${queryString(params)}`);
