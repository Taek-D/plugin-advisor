"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ExternalLink, Loader2, PlusCircle } from "lucide-react";
import type { PluginSuggestion, PluginSuggestionStatus } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type Props = {
  item: PluginSuggestion;
};

function statusLabel(status: PluginSuggestionStatus): string {
  switch (status) {
    case "pending":
      return "검토 대기";
    case "hold":
      return "추가 확인";
    case "approved":
      return "검토 통과";
    case "rejected":
      return "반영 안 함";
  }
}

function statusClasses(status: PluginSuggestionStatus): string {
  switch (status) {
    case "pending":
      return "border-warning/20 bg-warning/10 text-warning";
    case "hold":
      return "border-sky-500/20 bg-sky-500/10 text-sky-300";
    case "approved":
      return "border-primary/20 bg-primary/10 text-primary";
    case "rejected":
      return "border-destructive/20 bg-destructive/10 text-destructive";
  }
}

export default function AdminSuggestionReviewCard({ item }: Props) {
  const router = useRouter();
  const [status, setStatus] = useState<PluginSuggestionStatus>(item.status);
  const [adminNotes, setAdminNotes] = useState(item.admin_notes ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSaved(false);

    try {
      const response = await fetch(`/api/admin/plugin-suggestions/${item.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status,
          adminNotes,
        }),
      });

      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(data.error ?? "저장에 실패했습니다.");
      }

      setSaved(true);
      router.refresh();
      window.setTimeout(() => setSaved(false), 2000);
    } catch (saveError) {
      setError(
        saveError instanceof Error ? saveError.message : "저장에 실패했습니다."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="surface-panel-soft rounded-[24px] p-5">
      <div className="mb-4 flex flex-col gap-3 border-b border-white/10 pb-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-base font-semibold text-foreground">
              {item.plugin_name || "이름 미입력 제안"}
            </span>
            <span
              className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${statusClasses(status)}`}
            >
              {statusLabel(status)}
            </span>
          </div>

          <div className="text-xs text-muted-foreground">
            제안 시각: {new Date(item.created_at).toLocaleString("ko-KR")}
          </div>

          {item.normalized_repo && (
            <div className="text-xs text-primary">{item.normalized_repo}</div>
          )}
        </div>

        <a
          href={item.repository_url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
        >
          원본 저장소 열기
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(260px,0.8fr)]">
        <div>
          <div className="mb-2 text-xs font-semibold tracking-wide text-text-dim">
            제안 이유
          </div>
          <p className="rounded-2xl border border-white/10 bg-background/40 px-4 py-4 text-sm leading-relaxed text-muted-foreground">
            {item.reason}
          </p>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-background/40 px-3 py-3 text-sm">
              <div className="mb-1 text-xs font-semibold tracking-wide text-text-dim">
                제안자
              </div>
              <div className="text-muted-foreground">
                {item.submitter_name || "익명"}
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-background/40 px-3 py-3 text-sm">
              <div className="mb-1 text-xs font-semibold tracking-wide text-text-dim">
                연락처
              </div>
              <div className="break-all text-muted-foreground">
                {item.contact || "없음"}
              </div>
            </div>
          </div>

          {item.source_page && (
            <div className="mt-3 text-xs text-text-dim">
              제출 위치: {item.source_page}
            </div>
          )}
        </div>

        <div className="space-y-3">
          <div>
            <label className="mb-2 block text-xs font-semibold tracking-wide text-text-dim">
              검토 상태
            </label>
            <select
              value={status}
              onChange={(event) =>
                setStatus(event.target.value as PluginSuggestionStatus)
              }
              className="h-11 w-full rounded-2xl border border-input bg-background px-3 text-sm text-foreground"
            >
              <option value="pending">검토 대기</option>
              <option value="hold">추가 확인</option>
              <option value="approved">검토 통과</option>
              <option value="rejected">반영 안 함</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-xs font-semibold tracking-wide text-text-dim">
              관리자 메모
            </label>
            <Textarea
              rows={6}
              value={adminNotes}
              onChange={(event) => setAdminNotes(event.target.value)}
              placeholder="검토 근거, 보류 이유, 후속 작업 메모를 남겨둘 수 있습니다."
            />
          </div>

          {item.reviewed_at && (
            <div className="text-xs text-text-dim">
              마지막 검토: {new Date(item.reviewed_at).toLocaleString("ko-KR")}
            </div>
          )}

          {error && (
            <div className="rounded-2xl border border-destructive/30 bg-destructive/5 px-3 py-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <Button
            onClick={handleSave}
            disabled={saving}
            className="w-full rounded-full"
          >
            {saving ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                저장 중...
              </span>
            ) : saved ? (
              "저장됨"
            ) : (
              "검토 상태 저장"
            )}
          </Button>

          {status === "approved" && (
            <Button
              variant="outline"
              className="w-full rounded-full gap-2"
              onClick={() => {
                const params = new URLSearchParams({
                  name: item.plugin_name || "",
                  url: item.repository_url,
                  desc: item.reason.slice(0, 120),
                });
                router.push(`/admin/plugins?add=1&${params.toString()}`);
              }}
            >
              <PlusCircle className="h-4 w-4" />
              플러그인으로 추가
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
