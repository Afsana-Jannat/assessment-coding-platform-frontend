import apiClient from "@/lib/apiClient";

export type LoginPayload = { email: string; password: string };
export type RegisterPayload = { name: string; email: string; password: string };
export type TokenResponse = { accessToken: string; refreshToken: string };

export type User = {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "RECRUITER" | "CANDIDATE";
  status: string;
  candidate?: { id: string } | null;
  recruiter?: { id: string; companyName?: string | null } | null;
};

type ApiResponse<T> = { success: boolean; data: T; message?: string };

export const login = async (payload: LoginPayload) => {
  const response = await apiClient<ApiResponse<TokenResponse>>("/auth/login", {
    method: "POST",
    body: payload,
  });
  saveTokens(response.data);
  return response;
};

export const getAuthenticatedUser = async () => {
  const response = await getMe();
  return response.data;
};

export const register = async (payload: RegisterPayload) => {
  const response = await apiClient<
    ApiResponse<TokenResponse & { user: User; candidate: unknown }>
  >("/auth/register", {
    method: "POST",
    body: payload,
  });
  saveTokens(response.data);
  return response;
};

export const googleLogin = async (idToken: string) => {
  const response = await apiClient<ApiResponse<TokenResponse>>("/auth/google", {
    method: "POST",
    body: { idToken },
  });
  saveTokens(response.data);
  return response;
};

export const getMe = () => apiClient<ApiResponse<User>>("/auth/me");

export const refreshToken = async () => {
  const response = await apiClient<ApiResponse<TokenResponse>>(
    "/auth/refresh-token",
    {
      method: "POST",
    },
  );
  saveTokens(response.data);
  return response;
};

function saveTokens(tokens: TokenResponse) {
  if (typeof window !== "undefined") {
    window.sessionStorage.setItem(
      "assessment_access_token",
      tokens.accessToken,
    );
    window.sessionStorage.setItem(
      "assessment_refresh_token",
      tokens.refreshToken,
    );
  }
}

export const logout = () => {
  if (typeof window !== "undefined") {
    window.sessionStorage.removeItem("assessment_access_token");
    window.sessionStorage.removeItem("assessment_refresh_token");
  }
};

export const getRoleHome = (role: User["role"]) => {
  if (role === "ADMIN") return "/dashboard?view=admin";
  if (role === "RECRUITER") return "/dashboard?view=recruiter";
  return "/dashboard?view=candidate";
};
