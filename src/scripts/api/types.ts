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

export type StorageEntry = {
  id: string;
  name: string;
  size: number;
  uploadedAt: string;
  url?: string;
};

export type StoragePage = {
  entries: StorageEntry[];
  cursor?: string;
};

export type Avatar = {
  id: string;
  name: string;
  thumbnail?: string;
};

export type AvatarSearchResult = {
  results: Avatar[];
};
