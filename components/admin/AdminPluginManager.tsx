"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Plus, Loader2, RotateCcw, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Plugin, PluginCategory } from "@/lib/types";

type PluginWithMeta = Plugin & {
  isCustom: boolean;
  isDeleted: boolean;
};

const CATEGORIES: PluginCategory[] = [
  "orchestration",
  "workflow",
  "code-quality",
  "testing",
  "documentation",
  "data",
  "security",
  "integration",
  "ui-ux",
  "devops",
];

const CATEGORY_LABELS: Record<PluginCategory, string> = {
  orchestration: "오케스트레이션",
  workflow: "워크플로",
  "code-quality": "코드 품질",
  testing: "테스팅",
  documentation: "문서화",
  data: "데이터",
  security: "보안",
  integration: "통합",
  "ui-ux": "UI/UX",
  devops: "DevOps",
};

type FormState = {
  id: string;
  name: string;
  tag: string;
  color: string;
  category: PluginCategory;
  desc: string;
  longDesc: string;
  url: string;
  githubRepo: string;
  install: string;
  features: string;
  keywords: string;
  conflicts: string;
};

const EMPTY_FORM: FormState = {
  id: "",
  name: "",
  tag: "",
  color: "#6366F1",
  category: "integration",
  desc: "",
  longDesc: "",
  url: "",
  githubRepo: "",
  install: "",
  features: "",
  keywords: "",
  conflicts: "",
};

function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9가-힣]+/g, "-")
    .replace(/^-|-$/g, "");
}

function splitLines(value: string): string[] {
  return value
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

function splitComma(value: string): string[] {
  return value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export default function AdminPluginManager() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [plugins, setPlugins] = useState<PluginWithMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    if (searchParams.get("add") === "1") {
      const name = searchParams.get("name") || "";
      const url = searchParams.get("url") || "";
      const desc = searchParams.get("desc") || "";
      setForm((prev) => ({
        ...prev,
        name,
        id: slugify(name),
        url,
        desc,
      }));
      setShowForm(true);
    }
  }, [searchParams]);

  const fetchPlugins = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/plugins");
      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        throw new Error(data.error ?? "목록을 불러오지 못했습니다.");
      }
      const data = (await res.json()) as { plugins: PluginWithMeta[] };
      setPlugins(data.plugins);
    } catch (e) {
      setError(e instanceof Error ? e.message : "오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchPlugins();
  }, [fetchPlugins]);

  const handleNameChange = (name: string) => {
    setForm((prev) => ({
      ...prev,
      name,
      id: prev.id === "" || prev.id === slugify(prev.name) ? slugify(name) : prev.id,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError(null);

    const payload = {
      id: form.id.trim(),
      name: form.name.trim(),
      tag: form.tag.trim(),
      color: form.color.trim(),
      category: form.category,
      desc: form.desc.trim(),
      longDesc: form.longDesc.trim(),
      url: form.url.trim(),
      githubRepo: form.githubRepo.trim() || null,
      install: splitLines(form.install),
      features: splitLines(form.features),
      keywords: splitComma(form.keywords),
      conflicts: splitComma(form.conflicts),
    };

    try {
      const res = await fetch("/api/admin/plugins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        throw new Error(data.error ?? "플러그인 추가에 실패했습니다.");
      }
      setForm(EMPTY_FORM);
      setShowForm(false);
      await fetchPlugins();
      router.refresh();
    } catch (e) {
      setFormError(e instanceof Error ? e.message : "오류가 발생했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    setActionLoading(id + ":delete");
    try {
      const res = await fetch(`/api/admin/plugins/${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        throw new Error(data.error ?? "삭제에 실패했습니다.");
      }
      await fetchPlugins();
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "삭제 중 오류가 발생했습니다.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleRestore = async (id: string) => {
    setActionLoading(id + ":restore");
    try {
      const res = await fetch(`/api/admin/plugins/${encodeURIComponent(id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "restore" }),
      });
      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        throw new Error(data.error ?? "복원에 실패했습니다.");
      }
      await fetchPlugins();
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "복원 중 오류가 발생했습니다.");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {loading ? "로딩 중..." : `총 ${plugins.length}개 플러그인`}
        </div>
        <Button
          className="rounded-full gap-2"
          onClick={() => setShowForm((v) => !v)}
        >
          {showForm ? (
            <>
              <ChevronUp className="h-4 w-4" />
              닫기
            </>
          ) : (
            <>
              <Plus className="h-4 w-4" />
              새 플러그인 추가
            </>
          )}
        </Button>
      </div>

      {showForm && (
        <Card className="surface-panel-soft rounded-[24px] p-6">
          <h2 className="mb-4 text-base font-semibold text-foreground">새 플러그인 추가</h2>
          <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-semibold tracking-wide text-text-dim">
                  이름 <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  required
                  className="h-10 w-full rounded-2xl border border-input bg-background px-3 text-sm text-foreground"
                  placeholder="플러그인 이름"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold tracking-wide text-text-dim">
                  ID <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  value={form.id}
                  onChange={(e) => setForm((prev) => ({ ...prev, id: e.target.value }))}
                  required
                  className="h-10 w-full rounded-2xl border border-input bg-background px-3 text-sm text-foreground font-mono"
                  placeholder="plugin-id"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold tracking-wide text-text-dim">
                  태그 <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  value={form.tag}
                  onChange={(e) => setForm((prev) => ({ ...prev, tag: e.target.value }))}
                  required
                  className="h-10 w-full rounded-2xl border border-input bg-background px-3 text-sm text-foreground font-mono uppercase"
                  placeholder="TAG"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold tracking-wide text-text-dim">
                  색상 <span className="text-destructive">*</span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={form.color}
                    onChange={(e) => setForm((prev) => ({ ...prev, color: e.target.value }))}
                    className="h-10 w-12 cursor-pointer rounded-xl border border-input bg-background p-1"
                  />
                  <input
                    type="text"
                    value={form.color}
                    onChange={(e) => setForm((prev) => ({ ...prev, color: e.target.value }))}
                    className="h-10 flex-1 rounded-2xl border border-input bg-background px-3 text-sm text-foreground font-mono"
                    placeholder="#6366F1"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold tracking-wide text-text-dim">
                  카테고리 <span className="text-destructive">*</span>
                </label>
                <select
                  value={form.category}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, category: e.target.value as PluginCategory }))
                  }
                  className="h-10 w-full rounded-2xl border border-input bg-background px-3 text-sm text-foreground"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {CATEGORY_LABELS[cat]}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold tracking-wide text-text-dim">
                  URL <span className="text-destructive">*</span>
                </label>
                <input
                  type="url"
                  value={form.url}
                  onChange={(e) => setForm((prev) => ({ ...prev, url: e.target.value }))}
                  required
                  className="h-10 w-full rounded-2xl border border-input bg-background px-3 text-sm text-foreground"
                  placeholder="https://github.com/..."
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold tracking-wide text-text-dim">
                짧은 설명 <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                value={form.desc}
                onChange={(e) => setForm((prev) => ({ ...prev, desc: e.target.value }))}
                required
                className="h-10 w-full rounded-2xl border border-input bg-background px-3 text-sm text-foreground"
                placeholder="한 줄 설명"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold tracking-wide text-text-dim">
                GitHub 저장소 (선택)
              </label>
              <input
                type="text"
                value={form.githubRepo}
                onChange={(e) => setForm((prev) => ({ ...prev, githubRepo: e.target.value }))}
                className="h-10 w-full rounded-2xl border border-input bg-background px-3 text-sm text-foreground"
                placeholder="owner/repo"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold tracking-wide text-text-dim">
                상세 설명 (선택)
              </label>
              <textarea
                value={form.longDesc}
                onChange={(e) => setForm((prev) => ({ ...prev, longDesc: e.target.value }))}
                rows={3}
                className="w-full rounded-2xl border border-input bg-background px-3 py-2 text-sm text-foreground resize-none"
                placeholder="플러그인에 대한 상세 설명"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-semibold tracking-wide text-text-dim">
                  설치 명령어 (줄바꿈으로 구분)
                </label>
                <textarea
                  value={form.install}
                  onChange={(e) => setForm((prev) => ({ ...prev, install: e.target.value }))}
                  rows={3}
                  className="w-full rounded-2xl border border-input bg-background px-3 py-2 text-sm text-foreground font-mono resize-none"
                  placeholder="/plugin install example"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold tracking-wide text-text-dim">
                  주요 기능 (줄바꿈으로 구분)
                </label>
                <textarea
                  value={form.features}
                  onChange={(e) => setForm((prev) => ({ ...prev, features: e.target.value }))}
                  rows={3}
                  className="w-full rounded-2xl border border-input bg-background px-3 py-2 text-sm text-foreground resize-none"
                  placeholder="기능 1&#10;기능 2"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold tracking-wide text-text-dim">
                  키워드 (쉼표로 구분)
                </label>
                <textarea
                  value={form.keywords}
                  onChange={(e) => setForm((prev) => ({ ...prev, keywords: e.target.value }))}
                  rows={2}
                  className="w-full rounded-2xl border border-input bg-background px-3 py-2 text-sm text-foreground resize-none"
                  placeholder="keyword1, keyword2"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold tracking-wide text-text-dim">
                  충돌 플러그인 ID (쉼표로 구분)
                </label>
                <textarea
                  value={form.conflicts}
                  onChange={(e) => setForm((prev) => ({ ...prev, conflicts: e.target.value }))}
                  rows={2}
                  className="w-full rounded-2xl border border-input bg-background px-3 py-2 text-sm text-foreground resize-none font-mono"
                  placeholder="omc, superpowers"
                />
              </div>
            </div>

            {formError && (
              <div className="rounded-2xl border border-destructive/30 bg-destructive/5 px-3 py-3 text-sm text-destructive">
                {formError}
              </div>
            )}

            <div className="flex gap-3">
              <Button type="submit" disabled={submitting} className="rounded-full">
                {submitting ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    추가 중...
                  </span>
                ) : (
                  "플러그인 추가"
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="rounded-full"
                onClick={() => {
                  setShowForm(false);
                  setForm(EMPTY_FORM);
                  setFormError(null);
                }}
              >
                취소
              </Button>
            </div>
          </form>
        </Card>
      )}

      {error && (
        <div className="rounded-2xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-16 text-muted-foreground">
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          플러그인 목록 로딩 중...
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {plugins.map((plugin) => (
            <PluginCard
              key={plugin.id}
              plugin={plugin}
              actionLoading={actionLoading}
              onDelete={handleDelete}
              onRestore={handleRestore}
            />
          ))}
        </div>
      )}
    </div>
  );
}

type PluginCardProps = {
  plugin: PluginWithMeta;
  actionLoading: string | null;
  onDelete: (id: string) => Promise<void>;
  onRestore: (id: string) => Promise<void>;
};

function PluginCard({ plugin, actionLoading, onDelete, onRestore }: PluginCardProps) {
  const isDeleting = actionLoading === plugin.id + ":delete";
  const isRestoring = actionLoading === plugin.id + ":restore";
  const busy = isDeleting || isRestoring;

  return (
    <Card
      className={`surface-panel-soft rounded-[20px] p-4 flex flex-col gap-3 transition-opacity ${
        plugin.isDeleted ? "opacity-50" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span
            className="h-3 w-3 shrink-0 rounded-full"
            style={{ backgroundColor: plugin.color }}
          />
          <span className="truncate text-sm font-semibold text-foreground">{plugin.name}</span>
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          <span className="rounded-md border border-white/10 bg-background/40 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
            {plugin.tag}
          </span>
          {plugin.isCustom && (
            <span className="rounded-full border border-primary/30 bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
              커스텀
            </span>
          )}
          {plugin.isDeleted && (
            <span className="rounded-full border border-destructive/30 bg-destructive/10 px-1.5 py-0.5 text-[10px] font-semibold text-destructive">
              숨김
            </span>
          )}
        </div>
      </div>

      <p className="text-xs leading-relaxed text-muted-foreground line-clamp-2">{plugin.desc}</p>

      <div className="mt-auto flex items-center justify-between">
        <span className="text-[11px] text-text-dim">
          {CATEGORY_LABELS[plugin.category] ?? plugin.category}
        </span>
        <div className="flex gap-1.5">
          {plugin.isDeleted ? (
            <button
              onClick={() => void onRestore(plugin.id)}
              disabled={busy}
              className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary transition-colors hover:bg-primary/20 disabled:opacity-50"
            >
              {isRestoring ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <RotateCcw className="h-3 w-3" />
              )}
              복원
            </button>
          ) : (
            <button
              onClick={() => void onDelete(plugin.id)}
              disabled={busy}
              className="inline-flex items-center gap-1 rounded-full border border-destructive/30 bg-destructive/10 px-2.5 py-1 text-xs font-medium text-destructive transition-colors hover:bg-destructive/20 disabled:opacity-50"
            >
              {isDeleting ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <Trash2 className="h-3 w-3" />
              )}
              삭제
            </button>
          )}
        </div>
      </div>
    </Card>
  );
}
