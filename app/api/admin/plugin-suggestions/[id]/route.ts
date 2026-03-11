import { NextRequest, NextResponse } from "next/server";
import {
  getAdminCookieName,
  getAdminSessionSecret,
  verifyAdminSessionToken,
} from "@/lib/admin-session";
import { parseAdminSuggestionPatch } from "@/lib/plugin-suggestions";
import { updatePluginSuggestion } from "@/lib/plugin-suggestions-store";

function isAuthorized(request: NextRequest): boolean {
  return verifyAdminSessionToken(
    request.cookies.get(getAdminCookieName())?.value,
    getAdminSessionSecret()
  );
}

type Context = {
  params: {
    id: string;
  };
};

export async function PATCH(request: NextRequest, context: Context) {
  try {
    if (!isAuthorized(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const parsed = parseAdminSuggestionPatch(await request.json());
    if (!parsed.ok) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    const updated = await updatePluginSuggestion(context.params.id, parsed.data);
    return NextResponse.json({ item: updated });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "제안 상태를 수정하는 중 오류가 발생했습니다.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
