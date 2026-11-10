import { ofetch } from 'ofetch';

const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:5000';

const baseURL = `${apiBaseUrl.replace(/\/$/, '')}/api/v1`;

const ACCESS_TOKEN_KEY = 'assessment_access_token';
const REFRESH_TOKEN_KEY = 'assessment_refresh_token';

let refreshPromise: Promise<string> | null = null;

function getAccessToken() {
  if (typeof window === 'undefined') return null;

  return window.sessionStorage.getItem(ACCESS_TOKEN_KEY);
}

function clearSession() {
  if (typeof window === 'undefined') return;

  window.sessionStorage.removeItem(ACCESS_TOKEN_KEY);
  window.sessionStorage.removeItem(REFRESH_TOKEN_KEY);
}

async function refreshAccessToken(): Promise<string> {
  if (!refreshPromise) {
    refreshPromise = ofetch<{
      success: boolean;
      data: {
        accessToken: string;
        refreshToken: string;
      };
    }>('/auth/refresh-token', {
      baseURL,
      method: 'POST',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
      },
    })
      .then((response) => {
        const { accessToken, refreshToken } = response.data;

        if (!accessToken || !refreshToken) {
          throw new Error('Invalid token refresh response');
        }

        window.sessionStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
        window.sessionStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);

        return accessToken;
      })
      .catch((error) => {
        clearSession();
        throw error;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

const rawApiClient = ofetch.create({
  baseURL,
  credentials: 'include',

  headers: {
    Accept: 'application/json',
  },

  onRequest({ options }) {
    const headers = new Headers(options.headers);
    const accessToken = getAccessToken();

    headers.set('Accept', 'application/json');

    if (accessToken) {
      headers.set('Authorization', `Bearer ${accessToken}`);
    }

    options.headers = headers;
  },
});

async function apiClient<T>(
  request: Parameters<typeof rawApiClient<T>>[0],
  options: Parameters<typeof rawApiClient<T>>[1] = {}
): Promise<T> {
  try {
    return await rawApiClient<T>(request, options);
  } catch (error) {
    if (
      typeof window === 'undefined' ||
      !error ||
      typeof error !== 'object' ||
      !('response' in error) ||
      (error as { response?: { status?: number } }).response?.status !== 401
    ) {
      throw error;
    }

    const url = String(request);

    if (
      url.includes('/auth/login') ||
      url.includes('/auth/register') ||
      url.includes('/auth/google') ||
      url.includes('/auth/refresh-token')
    ) {
      throw error;
    }

    const headers = new Headers(options.headers);
    const alreadyRetried = headers.get('x-auth-retried') === 'true';

    if (alreadyRetried) {
      clearSession();
      throw error;
    }

    headers.set('x-auth-retried', 'true');

    const newAccessToken = await refreshAccessToken();

    headers.set('Authorization', `Bearer ${newAccessToken}`);

    return rawApiClient<T>(request, {
      ...options,
      headers,
      credentials: 'include',
    });
  }
}

export default apiClient;
