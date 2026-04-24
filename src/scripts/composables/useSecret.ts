import { EncryptJWT, jwtDecrypt, type JWTPayload } from "jose";

const encoder = new TextEncoder();

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
    localStorage.setItem("ACCOUNT_TOKEN", token);
    localStorage.setItem("ACCOUNT_SALT", saltHex);

    return true;
  },
  index: "Encrypt",
};

export const Decrypt = {
  value: async (pin: string) => {
    const token = localStorage.getItem("ACCOUNT_TOKEN");
    const saltHex = localStorage.getItem("ACCOUNT_SALT");

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

export const list = {
  index: "secret",
  list: [Encrypt, Decrypt],
};

export default list;
