"use client";

import type { Plugin, Recommendation, VersionInfo } from "@/lib/types";
import { useI18n } from "@/lib/i18n";
import { pluginDescEn } from "@/lib/i18n/plugins-en";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import HighlightedText from "./HighlightedText";

type Props = {
  plugin: Plugin;
  recommendation: Recommendation;
  selected: boolean;
  inConflict: boolean;
  onToggle: () => void;
  onDetail: () => void;
  version?: VersionInfo;
};

export default function PluginCard({
  plugin,
  recommendation,
  selected,
  inConflict,
  onToggle,
  onDetail,
  version,
}: Props) {
  const { locale, t } = useI18n();
  const desc = locale === "en" ? pluginDescEn[plugin.id]?.desc || plugin.desc : plugin.desc;

  const difficultyCopy = {
    beginner: locale === "en" ? "Beginner-friendly" : "입문자 친화",
    intermediate: locale === "en" ? "Intermediate" : "중간 난이도",
    advanced: locale === "en" ? "Advanced" : "고급 설정",
  } as const;

  const verificationCopy = {
    verified: locale === "en" ? "Install verified" : "설치 검증됨",
    partial: locale === "en" ? "Partially verified" : "부분 검증",
    unverified: locale === "en" ? "Not verified" : "검증 전",
  } as const;

  const metadataBadge =
    plugin.installMode === "safe-copy"
      ? locale === "en"
        ? "Verified copy-safe"
        : "검증된 설치"
      : plugin.installMode === "external-setup"
        ? locale === "en"
          ? "Account setup"
          : "계정 연결 필요"
        : locale === "en"
          ? "Manual review"
          : "수동 확인 필요";

  return (
    <div
      className={cn(
        "group rounded-[24px] border bg-card/70 p-4 transition-all sm:p-5",
        inConflict
          ? "border-destructive/50 bg-bg-error-subtle"
          : selected
            ? "border-current shadow-[0_18px_45px_rgba(0,0,0,0.18)]"
            : "border-white/10 hover:border-muted-foreground"
      )}
      style={{ color: selected ? plugin.color : undefined }}
    >
      <div className="flex gap-4">
        <div
          role="checkbox"
          aria-checked={selected}
          aria-label={`${plugin.name} 선택`}
          tabIndex={0}
          onClick={onToggle}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              onToggle();
            }
          }}
          className={cn(
            "mt-0.5 flex h-6 w-6 flex-shrink-0 cursor-pointer items-center justify-center rounded-md border-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            selected ? "border-current bg-current" : "border-muted-foreground"
          )}
          style={
            selected
              ? { borderColor: plugin.color, backgroundColor: plugin.color }
              : undefined
          }
        >
          {selected && <span className="text-xs font-bold text-white">✓</span>}
        </div>

        <div className="min-w-0 flex-1">
          <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  onClick={onDetail}
                  className="cursor-pointer font-heading text-base font-bold text-white transition-colors hover:text-primary"
                >
                  {plugin.name}
                </span>
                <Badge
                  className="border-transparent"
                  style={{
                    color: plugin.color,
                    background: `${plugin.color}18`,
                  }}
                >
                  {plugin.tag}
                </Badge>
                {recommendation.priority === 1 && <Badge>{t.card.core}</Badge>}
                {version?.latestVersion && (
                  <Badge variant="outline" className="font-medium text-primary">
                    {version.latestVersion}
                  </Badge>
                )}
              </div>

              <div className="mt-2 flex flex-wrap gap-1.5">
                <Badge variant="outline" className="border-white/10 bg-white/5 text-primary">
                  {metadataBadge}
                </Badge>
                <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[11px] text-muted-foreground">
                  {difficultyCopy[plugin.difficulty]}
                </span>
                <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[11px] text-muted-foreground">
                  {verificationCopy[plugin.verificationStatus]}
                </span>
                {inConflict && <Badge variant="destructive">{t.card.conflict}</Badge>}
              </div>
            </div>

            <Button
              variant="outline"
              size="xs"
              onClick={onDetail}
              className="rounded-full border-white/10 bg-white/5"
            >
              {t.card.detail}
            </Button>
          </div>

          <div className="mb-3 rounded-2xl border border-white/10 bg-background/45 px-3 py-3 text-sm leading-relaxed text-foreground">
            <HighlightedText
              text={recommendation.reason}
              keywords={recommendation.matchedKeywords}
              color={plugin.color}
            />
          </div>

          {recommendation.matchedKeywords.length > 0 && (
            <div className="mb-2 flex flex-wrap gap-1">
              {recommendation.matchedKeywords.slice(0, 5).map((keyword) => (
                <span
                  key={keyword}
                  className="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] text-text-dim"
                  style={{ background: `${plugin.color}10` }}
                >
                  {keyword}
                </span>
              ))}
              {recommendation.matchedKeywords.length > 5 && (
                <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] text-text-dim">
                  +{recommendation.matchedKeywords.length - 5}
                </span>
              )}
            </div>
          )}

          <div className="mt-1 text-xs leading-relaxed text-muted-foreground sm:text-[13px]">
            {desc}
          </div>
        </div>
      </div>
    </div>
  );
}
