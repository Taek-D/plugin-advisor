import { createHmac, timingSafeEqual } from "node:crypto";

const ADMIN_SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7;

type AdminSessionPayload = {
  scope: "plugin-advisor-admin";
  exp: number;
};

function encodePayload(payload: AdminSessionPayload): string {
  return Buffer.from(JSON.stringify(payload)).toString("base64url");
}

function decodePayload(value: string): AdminSessionPayload | null {
  try {
    const parsed = JSON.parse(
      Buffer.from(value, "base64url").toString("utf8")
    ) as AdminSessionPayload;

    if (
      parsed.scope !== "plugin-advisor-admin" ||
      typeof parsed.exp !== "number"
    ) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

function signPayload(payloadValue: string, secret: string): string {
  return createHmac("sha256", secret).update(payloadValue).digest("base64url");
}

export function safeCompareSecret(input: string, expected: string): boolean {
  const inputBuffer = Buffer.from(input);
  const expectedBuffer = Buffer.from(expected);

  if (inputBuffer.length !== expectedBuffer.length) {
    return false;
  }

  return timingSafeEqual(inputBuffer, expectedBuffer);
}

export function createAdminSessionToken(
  secret: string,
  now = Date.now()
): string {
  const payloadValue = encodePayload({
    scope: "plugin-advisor-admin",
    exp: now + ADMIN_SESSION_TTL_MS,
  });
  const signature = signPayload(payloadValue, secret);
  return `${payloadValue}.${signature}`;
}

export function verifyAdminSessionToken(
  token: string | null | undefined,
  secret: string,
  now = Date.now()
): boolean {
  if (!token) return false;

  const [payloadValue, signature] = token.split(".");
  if (!payloadValue || !signature) return false;

  const expectedSignature = signPayload(payloadValue, secret);
  if (!safeCompareSecret(signature, expectedSignature)) {
    return false;
  }

  const payload = decodePayload(payloadValue);
  if (!payload) return false;

  return payload.exp > now;
}

export function getAdminSessionMaxAgeSeconds(): number {
  return Math.floor(ADMIN_SESSION_TTL_MS / 1000);
}

export function normalizeAdminNextPath(value: string | undefined): string {
  if (!value || !value.startsWith("/admin")) {
    return "/admin/suggestions";
  }
  return value;
}
