"use client";

import { useMemo, useState, type ChangeEvent } from "react";
import { Lightbulb, Loader2, Send } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { trackEvent } from "@/lib/analytics";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Props = {
  sourcePage: string;
  variant?: "banner" | "inline";
};

type FormState = {
  repositoryUrl: string;
  reason: string;
  pluginName: string;
  submitterName: string;
  contact: string;
};

const INITIAL_FORM: FormState = {
  repositoryUrl: "",
  reason: "",
  pluginName: "",
  submitterName: "",
  contact: "",
};

export default function PluginSuggestionCallout({
  sourcePage,
  variant = "inline",
}: Props) {
  const { locale } = useI18n();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const copy = useMemo(
    () => ({
      title:
        locale === "en"
          ? "Suggest a plugin we might be missing"
          : "플러그인을 제안할 수 있어요",
      desc:
        locale === "en"
          ? "If you know a useful Claude Code plugin that is not in the catalog yet, send it to the review queue."
          : "카탈로그에 아직 없는 유용한 Claude Code 플러그인을 알고 있다면 검토 큐로 제안해 주세요.",
      button: locale === "en" ? "Suggest a plugin" : "플러그인 제안하기",
      dialogTitle:
        locale === "en" ? "Submit a plugin suggestion" : "플러그인 제안 보내기",
      dialogDesc:
        locale === "en"
          ? "Your suggestion goes only to the admin review queue. It will not be published automatically."
          : "제안은 관리자 검토 큐로만 전달되며, 자동으로 공개 카탈로그에 반영되지는 않습니다.",
      success:
        locale === "en"
          ? "Suggestion received. We will review it before deciding whether to include it."
          : "제안을 접수했어요. 실제 반영 여부는 관리자 검토 후 결정됩니다.",
      repositoryLabel: locale === "en" ? "Repository URL" : "저장소 URL",
      repositoryPlaceholder:
        locale === "en"
          ? "https://github.com/owner/repo"
          : "https://github.com/owner/repo",
      reasonLabel: locale === "en" ? "Why should we review it?" : "왜 검토해볼 만한지",
      reasonPlaceholder:
        locale === "en"
          ? "Explain what problem it solves, who it helps, or why it stands out."
          : "어떤 문제를 해결하는지, 누구에게 유용한지, 왜 눈여겨볼 만한지 적어주세요.",
      pluginNameLabel: locale === "en" ? "Plugin name (optional)" : "플러그인 이름 (선택)",
      submitterLabel: locale === "en" ? "Your name (optional)" : "이름 또는 닉네임 (선택)",
      contactLabel: locale === "en" ? "Contact (optional)" : "연락처 (선택)",
      cancel: locale === "en" ? "Cancel" : "닫기",
      submit: locale === "en" ? "Send suggestion" : "제안 보내기",
    }),
    [locale]
  );
  const canSubmit = Boolean(form.repositoryUrl.trim() && form.reason.trim());

  const resetFeedback = () => {
    setError(null);
    setSubmitted(false);
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) {
      trackEvent("plugin_suggestion_open", { sourcePage });
      resetFeedback();
    }
    setOpen(nextOpen);
  };

  const updateField =
    (key: keyof FormState) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((current) => ({ ...current, [key]: event.target.value }));
    };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/plugin-suggestions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          sourcePage,
        }),
      });

      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(data.error ?? "제안을 저장하지 못했습니다.");
      }

      trackEvent("plugin_suggestion_submit", { sourcePage });
      setSubmitted(true);
      setForm(INITIAL_FORM);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "제안을 저장하지 못했습니다."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Card
        className={
          variant === "banner"
            ? "surface-panel-soft mb-6 rounded-[24px] p-5 sm:p-6"
            : "surface-panel-soft mt-8 rounded-[24px] p-5"
        }
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Lightbulb className="h-4 w-4" />
            </span>
            <div>
              <div className="mb-1 text-base font-semibold text-foreground">
                {copy.title}
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {copy.desc}
              </p>
            </div>
          </div>

          <Button className="rounded-full" onClick={() => handleOpenChange(true)}>
            {copy.button}
          </Button>
        </div>
      </Card>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent onClose={() => handleOpenChange(false)}>
          <DialogHeader>
            <DialogTitle>{copy.dialogTitle}</DialogTitle>
            <DialogDescription>{copy.dialogDesc}</DialogDescription>
          </DialogHeader>

          {submitted ? (
            <div className="rounded-2xl border border-primary/20 bg-primary/5 px-4 py-4 text-sm leading-relaxed text-muted-foreground">
              {copy.success}
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">
                  {copy.repositoryLabel}
                </label>
                <Input
                  value={form.repositoryUrl}
                  onChange={updateField("repositoryUrl")}
                  placeholder={copy.repositoryPlaceholder}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">
                  {copy.reasonLabel}
                </label>
                <Textarea
                  value={form.reason}
                  onChange={updateField("reason")}
                  rows={5}
                  placeholder={copy.reasonPlaceholder}
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">
                    {copy.pluginNameLabel}
                  </label>
                  <Input value={form.pluginName} onChange={updateField("pluginName")} />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">
                    {copy.submitterLabel}
                  </label>
                  <Input
                    value={form.submitterName}
                    onChange={updateField("submitterName")}
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">
                  {copy.contactLabel}
                </label>
                <Input value={form.contact} onChange={updateField("contact")} />
              </div>

              {error && (
                <div className="rounded-2xl border border-destructive/30 bg-destructive/5 px-3 py-3 text-sm text-destructive">
                  {error}
                </div>
              )}
            </div>
          )}

          <DialogFooter className="mt-6 gap-2">
            <Button variant="outline" onClick={() => handleOpenChange(false)}>
              {copy.cancel}
            </Button>
            {!submitted && (
            <Button onClick={handleSubmit} disabled={loading || !canSubmit}>
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {copy.submit}
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    {copy.submit}
                    <Send className="h-4 w-4" />
                  </span>
                )}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
