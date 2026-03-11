import { NextRequest, NextResponse } from "next/server";
import { createPluginSuggestion } from "@/lib/plugin-suggestions-store";
import { parsePluginSuggestionPayload } from "@/lib/plugin-suggestions";
import { checkRateLimit, cleanupExpiredEntries } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  try {
    cleanupExpiredEntries();
    const { allowed } = checkRateLimit(request, {
      name: "plugin-suggestions",
      maxRequests: 3,
      windowMs: 60 * 60_000,
    });
    if (!allowed) {
      return NextResponse.json(
        { error: "제안 제출이 너무 많습니다. 1시간 후 다시 시도해 주세요." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const parsed = parsePluginSuggestionPayload(body);

    if (!parsed.ok) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    const created = await createPluginSuggestion(parsed.data);

    return NextResponse.json(
      {
        id: created.id,
        status: created.status,
      },
      { status: 201 }
    );
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "플러그인 제안을 저장하는 중 오류가 발생했습니다.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
