import type { ApiError, ApiResult } from "./types";

/** Trailing slashes stripped so `${BASE}${path}` never doubles up. */
const BASE = (import.meta.env.VITE_API_BASE ?? "").replace(/\/+$/, "");
const TIMEOUT_MS = 15_000;

/** Held in memory only. The persisted form stays the PIN-encrypted
 *  ACCOUNT_TOKEN in localStorage - see useSecret. */
let TOKEN: string | null = null;

export const setToken = (token: string | null) => {
  TOKEN = token;
};

export const hasToken = () => TOKEN !== null;

const fail = (
  code: string,
  message: string,
  status = 0,
): { ok: false; error: ApiError } => ({
  ok: false,
  error: { code, message, status },
});

/** Pull `{ code, message }` off an error body when the server sends one,
 *  otherwise fall back to the status line. */
const errorFrom = (status: number, body: unknown): ApiError => {
  if (body && typeof body === "object") {
    const shape = body as { code?: unknown; message?: unknown; error?: unknown };
    const message =
      typeof shape.message === "string"
        ? shape.message
        : typeof shape.error === "string"
          ? shape.error
          : `Request failed with status ${status}.`;
    const code = typeof shape.code === "string" ? shape.code : `http_${status}`;

    return { code, message, status };
  }

  if (status === 401 || status === 403) {
    return {
      code: "unauthorized",
      message: "Your token was rejected. Log in again.",
      status,
    };
  }

  return {
    code: `http_${status}`,
    message: `Request failed with status ${status}.`,
    status,
  };
};

const parse = async (response: Response): Promise<unknown> => {
  if (response.status === 204) return undefined;

  const text = await response.text();
  if (!text) return undefined;

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
};

export async function request<T>(
  path: string,
  init: RequestInit = {},
): Promise<ApiResult<T>> {
  if (!BASE) {
    return fail(
      "no_base",
      "No API server is configured (VITE_API_BASE is unset).",
    );
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  const headers = new Headers(init.headers);
  if (TOKEN) headers.set("Authorization", `Bearer ${TOKEN}`);
  if (init.body !== undefined && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  if (!headers.has("Accept")) headers.set("Accept", "application/json");

  let response: Response;

  try {
    response = await fetch(`${BASE}${path}`, {
      ...init,
      headers,
      signal: controller.signal,
    });
  } catch {
    return controller.signal.aborted
      ? fail("timeout", "The server took too long to answer.")
      : fail(
          "network",
          "Could not reach the server. Check your connection.",
        );
  } finally {
    clearTimeout(timer);
  }

  const body = await parse(response);

  if (!response.ok) return { ok: false, error: errorFrom(response.status, body) };

  return { ok: true, data: body as T };
}

export const get = <T>(path: string, init: RequestInit = {}) =>
  request<T>(path, { ...init, method: "GET" });

export const post = <T>(path: string, body?: unknown, init: RequestInit = {}) =>
  request<T>(path, {
    ...init,
    method: "POST",
    body: body === undefined ? undefined : JSON.stringify(body),
  });
