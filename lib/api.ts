import axios from "axios";

const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_BASE_URL}`,
});

// Attach access token to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auto-refresh when 401 is received
let isRefreshing = false;
let failedQueue: Array<{ resolve: (token: string) => void; reject: (err: unknown) => void }> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token!);
  });
  failedQueue = [];
};

const forceClientLogout = () => {
  localStorage.clear();
  if (window.location.pathname !== "/auth") {
    window.location.replace("/auth");
  }
};

// What a signed-in user without the right plan sees wherever a page surfaces
// the server's refusal (inline notices, toasts, alerts). The gate itself lives
// on the backend: requireFeature answers 403 with PLAN_REFUSAL_TEXT, and the
// interceptor below rewrites that one body so every page shows the same
// professional message — one wording for reading data, one for actions.
export const SUBSCRIPTION_REQUIRED_MESSAGE =
  "No data available. Please subscribe to view this data.";
export const SUBSCRIPTION_ACTION_MESSAGE =
  "A subscription is required to continue. Please subscribe to proceed.";

/** The backend's exact refusal text (audit-backend src/middleware/auth.js). */
export const PLAN_REFUSAL_TEXT = "Your plan does not include this feature";

export const isPlanRefusalBody = (body: unknown): boolean =>
  (body as { message?: unknown } | null)?.message === PLAN_REFUSAL_TEXT;

type MarkedError = { subscriptionMessage?: string };

/** The professional message when `err` is the backend's plan refusal, else null. */
export function subscriptionMessage(err: unknown): string | null {
  return (err as MarkedError | null)?.subscriptionMessage ?? null;
}

/** For catch blocks with a fixed failure text: the subscription message on a
 *  plan refusal, otherwise the page's own text. */
export const failureMessage = (err: unknown, fallback: string): string =>
  subscriptionMessage(err) ?? fallback;

function normalizeSubscriptionError(error: unknown) {
  if (!axios.isAxiosError(error) || error.response?.status !== 403) return;
  const res = error.response;
  let body: unknown = res.data;
  const asText = typeof body === "string"; // authFetch requests arrive as raw text
  if (asText) {
    try {
      body = JSON.parse(body as string);
    } catch {
      return;
    }
  }
  if (!isPlanRefusalBody(body)) return;
  const method = (error.config?.method ?? "get").toLowerCase();
  const msg =
    method === "get" ? SUBSCRIPTION_REQUIRED_MESSAGE : SUBSCRIPTION_ACTION_MESSAGE;
  const friendly = { message: msg, error: msg };
  res.data = asText ? JSON.stringify(friendly) : friendly;
  error.message = msg;
  (error as MarkedError).subscriptionMessage = msg;
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    normalizeSubscriptionError(error);
    const originalRequest = error.config;

    // Only attempt refresh on 401 and only once
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Queue requests while refresh is in progress
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem("refreshToken");

      if (!refreshToken) {
        // No refresh token — force logout
        // localStorage.clear();
        // window.location.href = "/login";
        forceClientLogout();
        isRefreshing = false;
        return Promise.reject(error);
      }

      try {

        const { data } = await axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/refresh-token`,
          { refreshToken }
        );

        // Save new tokens
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);

        // Retry all queued requests with new token
        processQueue(null, data.accessToken);

        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        forceClientLogout();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);

export default api;
