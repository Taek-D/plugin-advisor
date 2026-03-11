import type { PluginSuggestionStatus } from "@/lib/types";
import AdminLogoutButton from "@/components/admin/AdminLogoutButton";
import AdminSuggestionReviewList from "@/components/admin/AdminSuggestionReviewList";
import { requireAdminSession } from "@/lib/admin-session";
import { listPluginSuggestions } from "@/lib/plugin-suggestions-store";
import { isPluginSuggestionStatus } from "@/lib/plugin-suggestions";

export const dynamic = "force-dynamic";

type Props = {
  searchParams?: {
    q?: string;
    status?: string;
  };
};

export default async function AdminSuggestionsPage({ searchParams }: Props) {
  requireAdminSession("/admin/suggestions");

  const query = typeof searchParams?.q === "string" ? searchParams.q : "";
  const status =
    typeof searchParams?.status === "string" &&
    (searchParams.status === "all" || isPluginSuggestionStatus(searchParams.status))
      ? (searchParams.status as PluginSuggestionStatus | "all")
      : "all";

  const items = await listPluginSuggestions({
    query,
    status,
  });

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-2 text-sm font-semibold text-primary">
            관리자 전용
          </div>
          <h1 className="font-heading text-3xl font-extrabold text-foreground">
            플러그인 제안 검토
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            공개로 들어온 플러그인 제안을 검토하고 승인, 보류, 거절 상태를 관리합니다.
          </p>
        </div>
        <AdminLogoutButton />
      </div>

      <form
        action="/admin/suggestions"
        method="get"
        className="surface-panel-soft mb-6 grid gap-3 rounded-[24px] p-4 sm:grid-cols-[minmax(0,1fr)_180px_auto]"
      >
        <input
          type="text"
          name="q"
          defaultValue={query}
          placeholder="이름, 저장소 URL, owner/repo, 제안 이유 검색"
          className="h-11 rounded-2xl border border-input bg-background px-3 text-sm text-foreground"
        />
        <select
          name="status"
          defaultValue={status}
          className="h-11 rounded-2xl border border-input bg-background px-3 text-sm text-foreground"
        >
          <option value="all">전체 상태</option>
          <option value="pending">검토 대기</option>
          <option value="hold">추가 확인</option>
          <option value="approved">검토 통과</option>
          <option value="rejected">반영 안 함</option>
        </select>
        <button
          type="submit"
          className="h-11 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          필터 적용
        </button>
      </form>

      <div className="mb-4 text-sm text-muted-foreground">
        총 {items.length}개의 제안이 현재 조건에 맞게 표시되고 있습니다.
      </div>

      <AdminSuggestionReviewList items={items} />
    </main>
  );
}
