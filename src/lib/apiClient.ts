import { ofetch } from "ofetch";

const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5000";

const apiClient = ofetch.create({
  baseURL: `${apiBaseUrl.replace(/\/$/, "")}/api/v1`,
  credentials: "include",
  headers: {
    Accept: "application/json",
  },
  onRequest({ options }) {
    options.headers = new Headers(options.headers);
    options.headers.set("Accept", "application/json");
    if (typeof window !== "undefined") {
      const accessToken = window.sessionStorage.getItem(
        "assessment_access_token",
      );
      if (accessToken) {
        options.headers.set("Authorization", `Bearer ${accessToken}`);
      }
    }
  },
});

export default apiClient;
