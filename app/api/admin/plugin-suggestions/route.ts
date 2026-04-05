import { NextRequest, NextResponse } from "next/server";
import {
  getAdminCookieName,
  getAdminSessionSecret,
  verifyAdminSessionToken,
} from "@/lib/admin-session";
import { listPluginSuggestions } from "@/lib/plugin-suggestions-store";
import { isPluginSuggestionStatus } from "@/lib/plugin-suggestions";

function isAuthorized(request: NextRequest): boolean {
  return verifyAdminSessionToken(
    request.cookies.get(getAdminCookieName())?.value,
    getAdminSessionSecret()
  );
}

export async function GET(request: NextRequest) {
  try {
    if (!isAuthorized(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const query = request.nextUrl.searchParams.get("q") ?? undefined;
    const rawStatus = request.nextUrl.searchParams.get("status") ?? "all";
    const status =
      rawStatus === "all"
        ? "all"
        : isPluginSuggestionStatus(rawStatus)
          ? rawStatus
          : undefined;

    const items = await listPluginSuggestions({ query, status });

    return NextResponse.json({ items });
  } catch {
    return NextResponse.json(
      { error: "제안 목록을 불러오는 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
