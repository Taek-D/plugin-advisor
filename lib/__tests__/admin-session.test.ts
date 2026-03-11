import { describe, expect, it } from "vitest";
import {
  createAdminSessionToken,
  normalizeAdminNextPath,
  safeCompareSecret,
  verifyAdminSessionToken,
} from "../admin-session-core";

describe("admin session helpers", () => {
  it("creates a token that verifies before expiration", () => {
    const secret = "super-secret";
    const now = Date.UTC(2026, 2, 9, 0, 0, 0);
    const token = createAdminSessionToken(secret, now);

    expect(verifyAdminSessionToken(token, secret, now + 1000)).toBe(true);
  });

  it("rejects tampered tokens", () => {
    const secret = "super-secret";
    const token = createAdminSessionToken(secret, Date.UTC(2026, 2, 9, 0, 0, 0));
    const tampered = `${token}x`;

    expect(verifyAdminSessionToken(tampered, secret)).toBe(false);
  });

  it("uses a safe equality check for secrets", () => {
    expect(safeCompareSecret("abc123", "abc123")).toBe(true);
    expect(safeCompareSecret("abc123", "abc124")).toBe(false);
  });

  it("only allows admin paths for next redirects", () => {
    expect(normalizeAdminNextPath("/admin/suggestions")).toBe("/admin/suggestions");
    expect(normalizeAdminNextPath("/advisor")).toBe("/admin/suggestions");
    expect(normalizeAdminNextPath(undefined)).toBe("/admin/suggestions");
  });
});
