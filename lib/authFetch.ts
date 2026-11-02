// authFetch — drop-in replacement for `fetch(url)` against our API.
//
// Sends the user's access token and refreshes it on 401 exactly like the
// shared axios client in lib/api.ts, because it is built on that client (so
// the two can never race on a token refresh). Call sites keep their
// fetch-style handling untouched: `res.ok`, `res.status`, `await res.json()`.
import type { AxiosError, AxiosResponse, Method } from "axios";
import api from "@/lib/api";

type AuthFetchInit = {
  method?: Method;
  headers?: Record<string, string>;
  body?: BodyInit | null;
};

// Statuses the Response constructor refuses a body for.
const NO_BODY = new Set([204, 205, 304]);

function toResponse(r: AxiosResponse<string>): Response {
  const headers = new Headers();
  const ct = r.headers?.["content-type"];
  if (typeof ct === "string") headers.set("content-type", ct);
  return new Response(NO_BODY.has(r.status) ? null : (r.data ?? ""), {
    status: r.status,
    statusText: r.statusText,
    headers,
  });
}

export async function authFetch(
  url: string,
  init: AuthFetchInit = {},
): Promise<Response> {
  try {
    const r = await api.request<string>({
      url,
      method: init.method ?? "GET",
      headers: init.headers,
      data: init.body,
      responseType: "text",
      // Keep the raw body: callers parse with res.json() themselves.
      transformResponse: (d) => d,
    });
    return toResponse(r);
  } catch (e) {
    const err = e as AxiosError<string>;
    // 4xx / 5xx: hand back a normal Response, as fetch would.
    if (err.response) return toResponse(err.response);
    // Network failure: reject, as fetch would.
    throw e;
  }
}
