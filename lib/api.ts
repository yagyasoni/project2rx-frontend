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

/** Clears the saved login from this browser and goes to the sign-in page. */
export const signOutToSignIn = forceClientLogout;

// ── What the server says about the ACCOUNT itself ────────────
// (audit-backend src/middleware/auth.js)
//   ACCOUNT_DELETED   the login is still valid but an admin deleted the
//                     account. The paywall component shows "Account No
//                     Longer Exists".
//   ACCOUNT_INACTIVE  an admin marked the account inactive.
// Any request can be the first to get one of these replies, so the
// interceptor below turns them into browser events. The paywall component
// (components/inactiveAccount.tsx) listens and reacts at once, instead of
// waiting for its next timed check.
export const ACCOUNT_DELETED_CODE = "ACCOUNT_DELETED";
export const ACCOUNT_INACTIVE_CODE = "ACCOUNT_INACTIVE";
export const ACCOUNT_DELETED_EVENT = "auditprorx:account-deleted";
export const ACCOUNT_RECHECK_EVENT = "auditprorx:account-recheck";

/** The `code` field of a refused request, or null. */
export function refusalCode(error: unknown): string | null {
  if (!axios.isAxiosError(error)) return null;
  let body: unknown = error.response?.data;
  if (typeof body === "string") {
    // authFetch requests arrive as raw text
    try {
      body = JSON.parse(body);
    } catch {
      return null;
    }
  }
  const code = (body as { code?: unknown } | null)?.code;
  return typeof code === "string" ? code : null;
}

export const isAccountDeleted = (error: unknown): boolean =>
  refusalCode(error) === ACCOUNT_DELETED_CODE;

const announce = (eventName: string) => {
  if (typeof window !== "undefined") window.dispatchEvent(new Event(eventName));
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

// ── The server's own reason for a failure ────────────────────
// The backend sends a specific text when it refuses a request on purpose
// ("Subscription is already canceled", "Incorrect admin password"). These two
// readers hand that text to the screen. `fallback` is the screen's own text.
//
//   1. plan refusal            → the subscription wording (as before)
//   2. no reply at all         → SERVER_UNREACHABLE_MESSAGE
//   3. status 4xx or 502 with a text in `message`, `error` or `errors[0]`
//                              → that text
//   4. anything else           → fallback
//
// A 500 never shows the server's text: it can be a raw database or code
// error. Neither reader can throw; any surprise gives the fallback.
export const SERVER_UNREACHABLE_MESSAGE =
  "Could not reach the server. Please check your connection and try again.";

const MAX_REPLY_TEXT = 300;

/** The text of a reply body, or null when it has none that may be shown. */
export function replyText(status: number | undefined, body: unknown): string | null {
  try {
    if (typeof status !== "number") return null;
    if (!((status >= 400 && status < 500) || status === 502)) return null;

    let data: unknown = body;
    if (typeof data === "string") {
      const trimmed = data.trim();
      if (!trimmed.startsWith("{")) return null; // an HTML error page, plain text
      data = JSON.parse(trimmed);
    }
    if (!data || typeof data !== "object" || Array.isArray(data)) return null;

    const fields = data as { message?: unknown; error?: unknown; errors?: unknown };
    const candidates: unknown[] = [
      fields.message,
      fields.error,
      Array.isArray(fields.errors) ? fields.errors[0] : undefined,
    ];
    for (const value of candidates) {
      if (typeof value !== "string") continue;
      const text = value.trim();
      if (text && text.length <= MAX_REPLY_TEXT) return text;
    }
    return null;
  } catch {
    return null;
  }
}

/** For catch blocks around `api` / `adminApi` / `axios` calls. */
export function apiErrorMessage(err: unknown, fallback: string): string {
  try {
    const sub = subscriptionMessage(err);
    if (sub) return sub;
    if (!axios.isAxiosError(err)) return fallback;
    if (!err.response) return SERVER_UNREACHABLE_MESSAGE;
    return replyText(err.response.status, err.response.data) ?? fallback;
  } catch {
    return fallback;
  }
}

/** For `authFetch` replies, which do not throw on 4xx / 5xx: call it when
 *  `!res.ok`. Reads a copy, so the caller can still read the body. */
export async function replyErrorMessage(
  res: Response,
  fallback: string,
): Promise<string> {
  try {
    const body = await res.clone().text();
    return replyText(res.status, body) ?? fallback;
  } catch {
    return fallback;
  }
}

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

    // The server says the account behind this login was deleted. Tell the
    // paywall component (it shows "Account No Longer Exists") and stop here:
    // there is no session to renew and nothing to retry.
    const code = refusalCode(error);
    if (code === ACCOUNT_DELETED_CODE) {
      announce(ACCOUNT_DELETED_EVENT);
      return Promise.reject(error);
    }
    // The account was marked inactive: let the paywall check the status now.
    if (code === ACCOUNT_INACTIVE_CODE) announce(ACCOUNT_RECHECK_EVENT);

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
        if (isAccountDeleted(refreshError)) {
          // The session cannot be renewed because the account was deleted.
          // Keep the page and let the popup explain it; its "Back to sign
          // in" button clears the saved login.
          announce(ACCOUNT_DELETED_EVENT);
        } else {
          forceClientLogout();
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);

export default api;
