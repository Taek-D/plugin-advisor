import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, cleanupExpiredEntries } from "@/lib/rate-limit";
import { getSupabaseAdminClient, SupabaseNotConfiguredError } from "@/lib/supabase-admin";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  try {
    cleanupExpiredEntries();
    const { allowed } = checkRateLimit(request, {
      name: "newsletter",
      maxRequests: 3,
      windowMs: 60 * 60_000,
    });
    if (!allowed) {
      return NextResponse.json(
        { error: "구독 시도가 너무 많습니다. 1시간 후 다시 시도해 주세요." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";

    if (!email || !EMAIL_RE.test(email)) {
      return NextResponse.json(
        { error: "유효한 이메일 주소를 입력해 주세요." },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdminClient();
    const table = supabase.from("newsletter_subscribers");
    // @ts-expect-error — Supabase generated types pending regeneration for newsletter_subscribers table
    const { error } = await table.upsert(
      { email, source: "landing", confirmed: false },
      { onConflict: "email", ignoreDuplicates: true }
    );
    if (error) throw error;

    // 중복이든 신규든 항상 성공 응답 — 이메일 존재 여부 비노출 (보안)
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    if (error instanceof SupabaseNotConfiguredError) {
      return NextResponse.json(
        { error: "뉴스레터 구독 기능이 현재 사용할 수 없습니다." },
        { status: 503 }
      );
    }
    return NextResponse.json(
      { error: "구독 처리 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
