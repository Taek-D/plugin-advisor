import { NextRequest, NextResponse } from "next/server";
import {
  createAdminSessionToken,
  getAdminCookieName,
  getAdminReviewPassword,
  getAdminSessionMaxAgeSeconds,
  getAdminSessionSecret,
  normalizeAdminNextPath,
  safeCompareSecret,
} from "@/lib/admin-session";
import { checkRateLimit, cleanupExpiredEntries } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  try {
    cleanupExpiredEntries();
    const { allowed } = checkRateLimit(request, {
      name: "admin-login",
      maxRequests: 5,
      windowMs: 5 * 60_000,
    });
    if (!allowed) {
      return NextResponse.json(
        { error: "로그인 시도가 너무 많습니다. 5분 후 다시 시도해 주세요." },
        { status: 429 }
      );
    }

    const body = (await request.json()) as {
      password?: unknown;
      next?: unknown;
    };

    if (typeof body.password !== "string" || !body.password.trim()) {
      return NextResponse.json(
        { error: "관리자 비밀번호를 입력해 주세요." },
        { status: 400 }
      );
    }

    const expectedPassword = getAdminReviewPassword();
    if (!safeCompareSecret(body.password.trim(), expectedPassword)) {
      return NextResponse.json(
        { error: "비밀번호가 올바르지 않습니다." },
        { status: 401 }
      );
    }

    const nextPath = normalizeAdminNextPath(
      typeof body.next === "string" ? body.next : undefined
    );

    const response = NextResponse.json({ ok: true, next: nextPath });
    response.cookies.set({
      name: getAdminCookieName(),
      value: createAdminSessionToken(getAdminSessionSecret()),
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: getAdminSessionMaxAgeSeconds(),
    });

    return response;
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "관리자 로그인 처리 중 오류가 발생했습니다.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
