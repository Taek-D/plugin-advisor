import { NextRequest, NextResponse } from "next/server";
import {
  getAdminCookieName,
  getAdminSessionSecret,
  verifyAdminSessionToken,
} from "@/lib/admin-session";
import { PLUGINS } from "@/lib/plugins";
import { deletePlugin, getCustomPlugins, restorePlugin } from "@/lib/plugin-store";

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

export async function DELETE(request: NextRequest, context: Context) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = context.params;
    const { added } = await getCustomPlugins();
    const isCustom = added.some((p) => p.id === id);
    const isCore = id in PLUGINS;

    if (!isCustom && !isCore) {
      return NextResponse.json({ error: "플러그인을 찾을 수 없습니다." }, { status: 404 });
    }

    await deletePlugin(id, isCustom);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "플러그인을 삭제하는 중 오류가 발생했습니다.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, context: Context) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = context.params;
    const body = (await request.json()) as { action?: string };

    if (body.action !== "restore") {
      return NextResponse.json({ error: "올바르지 않은 action입니다." }, { status: 400 });
    }

    const { deleted } = await getCustomPlugins();
    if (!deleted.includes(id)) {
      return NextResponse.json(
        { error: "해당 플러그인은 삭제 상태가 아닙니다." },
        { status: 400 }
      );
    }

    await restorePlugin(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "플러그인을 복원하는 중 오류가 발생했습니다.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
