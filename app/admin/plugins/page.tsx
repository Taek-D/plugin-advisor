import Link from "next/link";
import AdminLogoutButton from "@/components/admin/AdminLogoutButton";
import AdminPluginManager from "@/components/admin/AdminPluginManager";
import { requireAdminSession } from "@/lib/admin-session";

export const dynamic = "force-dynamic";

export default function AdminPluginsPage() {
  requireAdminSession("/admin/plugins");

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-2 text-sm font-semibold text-primary">관리자 전용</div>
          <h1 className="font-heading text-3xl font-extrabold text-foreground">
            플러그인 관리
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            플러그인 DB를 직접 관리합니다. 커스텀 플러그인을 추가하거나 기존 플러그인을 숨길 수 있습니다.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/suggestions"
            className="inline-flex h-10 items-center rounded-full border border-input px-4 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            제안 검토
          </Link>
          <AdminLogoutButton />
        </div>
      </div>

      <AdminPluginManager />
    </main>
  );
}
