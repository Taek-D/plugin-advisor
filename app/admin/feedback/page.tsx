import Link from "next/link";
import AdminLogoutButton from "@/components/admin/AdminLogoutButton";
import { requireAdminSession } from "@/lib/admin-session";
import { getSupabaseAdminClient } from "@/lib/supabase-admin";

export const dynamic = "force-dynamic";

type FeedbackRow = {
  id: string;
  created_at: string;
  type: "bug" | "feature" | "other";
  rating: number | null;
  message: string;
  page: string;
};

const TYPE_STYLES: Record<FeedbackRow["type"], string> = {
  bug: "bg-red-500/10 text-red-400 border-red-500/20",
  feature: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  other: "bg-muted text-muted-foreground border-border",
};

const TYPE_LABELS: Record<FeedbackRow["type"], string> = {
  bug: "버그",
  feature: "기능 제안",
  other: "기타",
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function AdminFeedbackPage() {
  requireAdminSession("/admin/feedback");

  const supabase = getSupabaseAdminClient();
  const { data: items, error } = await supabase
    .from("feedback")
    .select("*")
    .order("created_at", { ascending: false });

  const feedback = (items ?? []) as FeedbackRow[];

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-2 text-sm font-semibold text-primary">관리자 전용</div>
          <h1 className="font-heading text-3xl font-extrabold text-foreground">
            피드백 목록
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            사용자가 제출한 피드백을 확인합니다. 총 {feedback.length}개.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/plugins"
            className="inline-flex h-10 items-center rounded-full border border-input px-4 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            플러그인 관리
          </Link>
          <Link
            href="/admin/suggestions"
            className="inline-flex h-10 items-center rounded-full border border-input px-4 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            제안 검토
          </Link>
          <AdminLogoutButton />
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          피드백을 불러오는 중 오류가 발생했습니다.
        </div>
      )}

      {feedback.length === 0 ? (
        <div className="rounded-[20px] border border-border bg-background p-8 text-center text-sm text-muted-foreground">
          아직 접수된 피드백이 없습니다.
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {feedback.map((item) => (
            <div
              key={item.id}
              className="rounded-[20px] border border-border bg-background px-5 py-4"
            >
              <div className="mb-2 flex flex-wrap items-center gap-3">
                <span
                  className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${TYPE_STYLES[item.type]}`}
                >
                  {TYPE_LABELS[item.type]}
                </span>
                {item.rating && (
                  <span className="text-xs text-yellow-500">
                    {"★".repeat(item.rating)}{"☆".repeat(5 - item.rating)}
                  </span>
                )}
                <span className="text-xs text-muted-foreground">
                  {item.page}
                </span>
                <span className="ml-auto text-xs text-muted-foreground">
                  {formatDate(item.created_at)}
                </span>
              </div>
              <p className="text-sm leading-relaxed text-foreground">{item.message}</p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
