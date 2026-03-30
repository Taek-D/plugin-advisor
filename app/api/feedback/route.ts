import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, cleanupExpiredEntries } from "@/lib/rate-limit";
import { getSupabaseAdminClient, SupabaseNotConfiguredError } from "@/lib/supabase-admin";

const VALID_TYPES = ["bug", "feature", "other"] as const;
type FeedbackType = (typeof VALID_TYPES)[number];

export async function POST(request: NextRequest) {
  try {
    cleanupExpiredEntries();
    const { allowed } = checkRateLimit(request, {
      name: "feedback",
      maxRequests: 5,
      windowMs: 60 * 60_000,
    });
    if (!allowed) {
      return NextResponse.json(
        { error: "피드백 제출이 너무 많습니다. 1시간 후 다시 시도해 주세요." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const message = typeof body.message === "string" ? body.message.trim() : "";
    const type =
      typeof body.type === "string" && VALID_TYPES.includes(body.type as FeedbackType)
        ? (body.type as FeedbackType)
        : null;
    const page = typeof body.page === "string" ? body.page : "unknown";
    const rawRating = typeof body.rating === "number" ? body.rating : null;
    const rating =
      rawRating !== null && rawRating >= 1 && rawRating <= 5
        ? Math.round(rawRating)
        : null;

    if (!message || message.length > 500) {
      return NextResponse.json(
        { error: "메시지는 1~500자여야 합니다." },
        { status: 400 }
      );
    }
    if (!type) {
      return NextResponse.json(
        { error: "유효한 피드백 유형을 선택해 주세요." },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdminClient();
    const { error } = await supabase.from("feedback").insert({
      page,
      message,
      type,
      rating,
    });
    if (error) throw error;

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    if (error instanceof SupabaseNotConfiguredError) {
      return NextResponse.json(
        { error: "피드백 기능이 현재 사용할 수 없습니다." },
        { status: 503 }
      );
    }
    return NextResponse.json(
      { error: "피드백 저장 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
