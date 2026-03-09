"use client";

import { useState } from "react";
import { Check, Copy, Terminal, ExternalLink } from "lucide-react";
import { saveFavorite } from "@/lib/favorites";
import { useI18n } from "@/lib/i18n";
import { trackEvent } from "@/lib/analytics";
import { getManualSetupPlugins, getSafeCopyPlugins } from "@/lib/setup";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Props = {
  selectedIds: string[];
  readyToCopy?: boolean;
};

export default function InstallScript({ selectedIds, readyToCopy = false }: Props) {
  const { locale, t } = useI18n();
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);
  const [favName, setFavName] = useState("");
  const [saved, setSaved] = useState(false);
  const [reportedInstalled, setReportedInstalled] = useState(false);

  if (!selectedIds.length) return null;

  const safePlugins = getSafeCopyPlugins(selectedIds);
  const manualPlugins = getManualSetupPlugins(selectedIds);

  const copyStatus = readyToCopy
    ? locale === "en"
      ? "Checklist complete"
      : "체크리스트 완료"
    : locale === "en"
      ? "Checklist required"
      : "체크리스트 필요";

  const script = [
    t.installScript.scriptComment1,
    t.installScript.scriptComment2,
    "",
    ...safePlugins.flatMap((plugin) => [`# ${plugin.name}`, ...plugin.install, ""]),
  ].join("\n");

  const handleCopy = () => {
    navigator.clipboard.writeText(script);
    setCopied(true);
    trackEvent("script_copy", { pluginCount: safePlugins.length });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveFavorite = () => {
    if (!favName.trim()) return;
    saveFavorite(favName.trim(), selectedIds);
    trackEvent("favorite_save", { pluginCount: selectedIds.length });
    setSaved(true);
    setSaving(false);
    setFavName("");
    setTimeout(() => setSaved(false), 2000);
  };

  const handleInstallComplete = () => {
    setReportedInstalled(true);
    trackEvent("install_complete", { pluginCount: selectedIds.length });
  };

  return (
    <Card className="surface-panel rounded-[24px] p-5">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2 text-xs font-medium tracking-wide text-text-dim">
            <span>{t.installScript.title}</span>
            <span
              className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                readyToCopy
                  ? "border border-primary/20 bg-primary/10 text-primary"
                  : "border border-warning/20 bg-warning/10 text-warning"
              }`}
            >
              {copyStatus}
            </span>
          </div>

          <div className="mt-2 flex flex-wrap gap-2">
            <span className="rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-[11px] font-semibold text-primary">
              {safePlugins.length} {locale === "en" ? "verified plugins" : "개 검증 플러그인"}
            </span>
            {manualPlugins.length > 0 && (
              <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-semibold text-muted-foreground">
                {manualPlugins.length} {locale === "en" ? "manual steps" : "개 수동 단계"}
              </span>
            )}
          </div>

          <p className="mt-3 text-xs leading-relaxed text-text-dim">
            {locale === "en"
              ? "Copy-safe commands are grouped first. Anything with account setup or manual review stays below."
              : "바로 복사해도 되는 검증 명령만 위에 모았습니다. 계정 연결이나 수동 확인이 필요한 항목은 아래에 따로 남겨둡니다."}
          </p>
        </div>

        <div className="flex w-full flex-col gap-2 sm:w-auto sm:items-end">
          {saving ? (
            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center sm:gap-1.5">
              <Input
                type="text"
                value={favName}
                onChange={(event) => setFavName(event.target.value)}
                onKeyDown={(event) => event.key === "Enter" && handleSaveFavorite()}
                placeholder={t.installScript.comboName}
                className="h-9 w-full text-xs sm:h-8 sm:w-[150px]"
                autoFocus
              />
              <Button
                variant="outline"
                size="xs"
                onClick={handleSaveFavorite}
                disabled={!favName.trim()}
                className="h-9 font-bold sm:h-8"
              >
                {t.installScript.save}
              </Button>
              <button
                onClick={() => setSaving(false)}
                className="text-left text-xs text-muted-foreground transition-colors hover:text-foreground sm:text-center"
              >
                닫기
              </button>
            </div>
          ) : (
            <Button
              variant="outline"
              size="xs"
              onClick={() => (saved ? undefined : setSaving(true))}
              className="h-10 w-full rounded-full sm:h-8 sm:w-auto"
            >
              {saved ? t.installScript.saved : t.installScript.saveFavorite}
            </Button>
          )}

          <Button
            onClick={handleCopy}
            size="sm"
            className="min-h-[44px] w-full rounded-full px-4 sm:min-h-0 sm:w-auto"
            disabled={safePlugins.length === 0 || !readyToCopy}
          >
            <span className="flex items-center gap-1.5">
              {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              {copied
                ? t.installScript.copyDone
                : locale === "en"
                  ? "COPY VERIFIED COMMANDS"
                  : "검증된 명령만 복사"}
            </span>
          </Button>
        </div>
      </div>

      {safePlugins.length > 0 ? (
        <pre className="overflow-x-auto whitespace-pre-wrap rounded-2xl border border-white/10 bg-black/20 p-4 text-[13px] leading-[1.9] sm:text-xs">
          {script.split("\n").map((line, index) => (
            <span
              key={index}
              className={line.startsWith("#") ? "text-text-faint" : "text-muted-foreground"}
            >
              {line}
              {"\n"}
            </span>
          ))}
        </pre>
      ) : (
        <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-3 text-sm leading-relaxed text-muted-foreground">
          {locale === "en"
            ? "No fully verified copy-safe commands are available for this selection. Follow the manual steps below instead."
            : "이번 선택에는 한 번에 복사해도 안전한 명령이 없습니다. 아래 수동 단계를 확인해 주세요."}
        </div>
      )}

      {!readyToCopy && safePlugins.length > 0 && (
        <div className="mt-3 rounded-2xl border border-warning/20 bg-warning/5 px-3 py-3 text-sm text-muted-foreground">
          {locale === "en"
            ? "Finish the checklist above before copying the verified commands."
            : "위 체크리스트를 먼저 완료한 뒤 검증된 명령 복사를 진행해 주세요."}
        </div>
      )}

      {manualPlugins.length > 0 && (
        <div className="mt-4 space-y-3">
          <div className="text-xs font-medium tracking-wide text-text-dim">
            {locale === "en" ? "MANUAL OR ACCOUNT-SETUP STEPS" : "수동 확인이 필요한 단계"}
          </div>

          {manualPlugins.map((plugin) => (
            <div
              key={plugin.id}
              className="rounded-2xl border border-white/10 bg-white/5 px-3 py-3"
            >
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <span className="text-sm font-semibold text-foreground">{plugin.name}</span>
                <span className="rounded-full border border-primary/20 bg-primary/5 px-2 py-1 text-[11px] text-primary">
                  {plugin.installMode === "external-setup"
                    ? locale === "en"
                      ? "External setup"
                      : "계정 연결 필요"
                    : locale === "en"
                      ? "Manual review"
                      : "수동 확인 필요"}
                </span>
              </div>

              <div className="space-y-1.5">
                {plugin.install.map((command, index) => (
                  <div
                    key={`${plugin.id}-${index}`}
                    className="flex items-center gap-2 rounded-2xl border border-white/10 bg-background/60 px-3 py-2"
                  >
                    <code className="flex-1 overflow-x-auto text-[11px] text-muted-foreground">
                      {command}
                    </code>
                    <Button
                      variant="outline"
                      size="xs"
                      onClick={() => navigator.clipboard.writeText(command)}
                    >
                      {t.detail.copy}
                    </Button>
                  </div>
                ))}
              </div>

              {(plugin.prerequisites.length > 0 || plugin.requiredSecrets.length > 0) && (
                <div className="mt-2 space-y-1 text-xs text-muted-foreground">
                  {plugin.prerequisites.map((item) => (
                    <div key={`${plugin.id}-${item}`}>- {item}</div>
                  ))}
                  {plugin.requiredSecrets.map((item) => (
                    <div key={`${plugin.id}-${item}`}>- {item}</div>
                  ))}
                </div>
              )}

              <a
                href={plugin.url}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-flex items-center gap-1 text-xs text-primary hover:underline"
              >
                {locale === "en" ? "Open official setup page" : "공식 설치 페이지 열기"}
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 flex items-start gap-2.5 rounded-2xl border border-primary/20 bg-primary/5 px-3 py-3">
        <Terminal className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
        <span className="text-xs leading-relaxed text-muted-foreground">
          {t.installScript.guide}
        </span>
      </div>

      <Button
        variant="outline"
        className="mt-4 h-11 w-full rounded-full border-white/10 bg-white/5"
        onClick={handleInstallComplete}
        disabled={reportedInstalled}
      >
        {reportedInstalled
          ? locale === "en"
            ? "Installation reported"
            : "설치 완료로 기록했어요"
          : locale === "en"
            ? "I finished this setup"
            : "설치 완료했어요"}
      </Button>
    </Card>
  );
}
