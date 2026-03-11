import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  createAdminSessionToken,
  getAdminSessionMaxAgeSeconds,
  normalizeAdminNextPath,
  safeCompareSecret,
  verifyAdminSessionToken,
} from "./admin-session-core";

const ADMIN_COOKIE_NAME = "plugin-advisor-admin";

export {
  createAdminSessionToken,
  getAdminSessionMaxAgeSeconds,
  normalizeAdminNextPath,
  safeCompareSecret,
  verifyAdminSessionToken,
};

export function getAdminCookieName(): string {
  return ADMIN_COOKIE_NAME;
}

export function getAdminReviewPassword(): string {
  const password = process.env.ADMIN_REVIEW_PASSWORD;
  if (!password) {
    throw new Error("ADMIN_REVIEW_PASSWORD is not configured.");
  }
  return password;
}

export function getAdminSessionSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) {
    throw new Error("ADMIN_SESSION_SECRET is not configured.");
  }
  return secret;
}

export function isAdminSessionActive(): boolean {
  const token = cookies().get(ADMIN_COOKIE_NAME)?.value;
  try {
    return verifyAdminSessionToken(token, getAdminSessionSecret());
  } catch {
    return false;
  }
}

export function requireAdminSession(nextPath = "/admin/suggestions"): void {
  if (!isAdminSessionActive()) {
    redirect(`/admin/login?next=${encodeURIComponent(nextPath)}`);
  }
}
