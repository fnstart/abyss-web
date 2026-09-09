import { ref, type Ref } from "vue";
import { EncryptJWT, jwtDecrypt, type JWTPayload } from "jose";
import api from "@/scripts/api";

/** What Unlock answers with - it never throws. */
export type UnlockResult =
  | { ok: true; payload: JWTPayload }
  | { ok: false; reason: "no_token" }
  | { ok: false; reason: "malformed" }
  | { ok: false; reason: "locked"; retryIn: number }
  | { ok: false; reason: "wrong_pin"; attempts: number };

const encoder = new TextEncoder();

const TOKEN_KEY = "ACCOUNT_TOKEN";
const SALT_KEY = "ACCOUNT_SALT";
const FAILURE_KEY = "ACCOUNT_PIN_FAILURES";
const LOCK_KEY = "ACCOUNT_PIN_LOCKED_UNTIL";

/** Wrong PINs tolerated before the lockout starts. */
const FREE_ATTEMPTS = 5;
const LOCK_BASE_MS = 60_000;
const LOCK_MAX_MS = 15 * 60_000;

export const FAILURES = ref(Number(localStorage.getItem(FAILURE_KEY) ?? 0));
export const LOCKED_UNTIL = ref(Number(localStorage.getItem(LOCK_KEY) ?? 0));

async function deriveKey(pin: string, salt: Uint8Array): Promise<Uint8Array> {
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(pin),
    "PBKDF2",
    false,
    ["deriveBits"],
  );

  const bits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: salt as unknown as BufferSource,
      iterations: 100_000,
      hash: "SHA-256",
    },
    keyMaterial,
    256,
  );
  return new Uint8Array(bits);
}

/** Milliseconds left on the lockout, 0 when the user may try again. */
const lockRemaining = () => Math.max(0, LOCKED_UNTIL.value - Date.now());

const recordFailure = () => {
  FAILURES.value += 1;
  localStorage.setItem(FAILURE_KEY, String(FAILURES.value));

  const over = FAILURES.value - FREE_ATTEMPTS;
  if (over < 1) return;

  // 1m, 2m, 4m ... capped at 15m.
  const wait = Math.min(LOCK_BASE_MS * 2 ** (over - 1), LOCK_MAX_MS);
  LOCKED_UNTIL.value = Date.now() + wait;
  localStorage.setItem(LOCK_KEY, String(LOCKED_UNTIL.value));
};

const clearFailures = () => {
  FAILURES.value = 0;
  LOCKED_UNTIL.value = 0;
  localStorage.removeItem(FAILURE_KEY);
  localStorage.removeItem(LOCK_KEY);
};

/** The bearer string the api sends: the PALT out of the decrypted JWT. */
const bearerOf = (payload: JWTPayload): string | null =>
  typeof payload.token === "string" ? payload.token : null;

export const Encrypt = {
  value: async (jwt: JWTPayload, pin: string) => {
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const secret = await deriveKey(pin, salt);

    const token = await new EncryptJWT(jwt)
      .setProtectedHeader({ alg: "dir", enc: "A256GCM" })
      .encrypt(secret);

    const saltHex = Array.from(salt)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(SALT_KEY, saltHex);

    // A freshly stored token starts from a clean slate.
    clearFailures();

    return true;
  },
  index: "Encrypt",
};

export const Decrypt = {
  value: async (pin: string) => {
    const token = localStorage.getItem(TOKEN_KEY);
    const saltHex = localStorage.getItem(SALT_KEY);

    if (!token || !saltHex || !pin) return null;

    const salt = new Uint8Array(
      saltHex.match(/.{2}/g)!.map((b) => parseInt(b, 16)),
    );
    const secret = await deriveKey(pin, salt);

    const { payload } = await jwtDecrypt(token, secret);
    return payload;
  },
  index: "Decrypt",
};

/**
 * Decrypt for the UI: never throws, counts wrong PINs, enforces the lockout and
 * hands the token to the api client on success.
 */
export const Unlock = {
  value: async (pin: string): Promise<UnlockResult> => {
    if (!HasToken.value()) {
      return { ok: false, reason: "no_token" };
    }

    const waiting = lockRemaining();
    if (waiting > 0) {
      return { ok: false, reason: "locked", retryIn: waiting };
    }

    let payload: JWTPayload | null;

    try {
      payload = await Decrypt.value(pin);
    } catch {
      // jwtDecrypt throws on a key that does not open the token - a wrong PIN.
      recordFailure();
      return { ok: false, reason: "wrong_pin", attempts: FAILURES.value };
    }

    if (!payload) {
      return { ok: false, reason: "no_token" };
    }

    const bearer = bearerOf(payload);
    if (!bearer) {
      return { ok: false, reason: "malformed" };
    }

    api.setToken(bearer);
    clearFailures();

    return { ok: true, payload };
  },
  index: "Unlock",
};

/** Whether an encrypted token is stored at all - not whether it is unlocked. */
export const HasToken = {
  value: () =>
    localStorage.getItem(TOKEN_KEY) !== null &&
    localStorage.getItem(SALT_KEY) !== null,
  index: "HasToken",
};

/** Whether this session has already unlocked and armed the api client. */
export const IsUnlocked = {
  value: () => api.hasToken(),
  index: "IsUnlocked",
};

/** Drop the stored token entirely and disarm the api client. */
export const Forget = {
  value: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(SALT_KEY);
    clearFailures();
    api.setToken(null);

    return true;
  },
  index: "Forget",
};

/** Seconds left on the lockout, for a countdown in the popups. */
export const LockedFor = {
  value: () => Math.ceil(lockRemaining() / 1000),
  index: "LockedFor",
};

export const Attempts: { value: Ref<number>; index: string } = {
  value: FAILURES,
  index: "Attempts",
};

export const list = {
  index: "secret",
  list: [
    Encrypt,
    Decrypt,
    Unlock,
    HasToken,
    IsUnlocked,
    Forget,
    LockedFor,
    Attempts,
  ],
};

export default list;
