import { get, hasToken, post, request, setToken } from "./client";
import type {
  ActivationResult,
  AvatarSearchResult,
  DownloadLink,
  StoragePage,
  UpdateIPResult,
} from "./types";

/**
 * The Abyss API client. Every call resolves to an ApiResult - it never throws,
 * so callers branch on `.ok` instead of wrapping in try/catch.
 */
const api = {
  request,
  get,
  post,
  setToken,
  hasToken,

  /** Point the account at the caller's current IP. Requires a token. */
  updateIP: () => post<UpdateIPResult>("/account/ip"),

  downloads: {
    injector: () => get<DownloadLink>("/downloads/injector"),
    console: () => get<DownloadLink>("/downloads/console"),
  },

  client: {
    activate: () => post<ActivationResult>("/client/activate"),
  },

  storage: {
    list: (cursor?: string) =>
      get<StoragePage>(
        cursor ? `/storage?cursor=${encodeURIComponent(cursor)}` : "/storage",
      ),
  },

  avatars: {
    search: (query: string) =>
      get<AvatarSearchResult>(`/avatars?q=${encodeURIComponent(query)}`),
  },
};

/** Registered through the compose array in scripts/composables, which is what
 *  puts every entry below on `$api` in templates. */
export const list = {
  index: "api",
  list: Object.entries(api).map(([index, value]) => ({ index, value })),
};

export type Api = typeof api;
export * from "./types";
export default api;
