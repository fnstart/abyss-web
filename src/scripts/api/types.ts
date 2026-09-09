/** Every api call resolves to one of these - nothing in the client throws. */
export type ApiResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: ApiError };

export type ApiError = {
  /** Stable machine-readable tag: the server's own code, or one of the
   *  client-side ones - no_base, network, timeout, unauthorized, bad_response. */
  code: string;
  /** Safe to show a user. */
  message: string;
  /** HTTP status, or 0 when the request never reached the server. */
  status: number;
};

export type DownloadLink = {
  url: string;
  version?: string;
  sha256?: string;
};

export type UpdateIPResult = {
  ip: string;
  updatedAt: string;
};

export type ActivationResult = {
  activated: boolean;
  expiresAt?: string;
};

/** Mirrors the global StorageItem in types/globals.d.ts - Storage.vue reads
 *  `items`, so the field names here are the ones its page already consumes. */
export type StorageEntry = {
  id: string;
  name: string;
  size?: number;
  updatedAt?: string;
  url?: string;
};

export type StoragePage = {
  items: StorageEntry[];
  cursor?: string | null;
};

export type Avatar = {
  id: string;
  name: string;
  thumbnail?: string;
};

/** Search.vue assigns `result.data` straight to a list, so this is the array
 *  itself rather than a wrapper object. */
export type AvatarSearchResult = Avatar[];
