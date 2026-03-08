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
  const desc = locale === "en" ? (pluginDescEn[plugin.id]?.desc || plugin.desc) : plugin.desc;

  return (
    <div
      className={cn(
        "group rounded-md border bg-card p-4 transition-colors",
        inConflict
          ? "border-destructive/50 bg-bg-error-subtle"
          : selected
            ? "border-current"
            : "border-border hover:border-muted-foreground"
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
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onToggle(); } }}
          className={cn(
            "mt-0.5 flex h-5 w-5 flex-shrink-0 cursor-pointer items-center justify-center rounded-sm border-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            selected ? "border-current bg-current" : "border-muted-foreground"
          )}
          style={
            selected
              ? { borderColor: plugin.color, backgroundColor: plugin.color }
              : undefined
          }
        >
          {selected && (
            <span className="text-xs font-bold text-white">✓</span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span
              onClick={onDetail}
              className="cursor-pointer font-heading text-sm font-bold text-white transition-colors hover:text-primary"
            >
              {plugin.name}
            </span>
            <Badge
              className="border-transparent"
              style={{
                color: plugin.color,
                background: plugin.color + "18",
              }}
            >
              {plugin.tag}
            </Badge>
            {version?.latestVersion && (
              <Badge variant="outline" className="font-medium text-primary">
                {version.latestVersion}
              </Badge>
            )}
            {recommendation.priority === 1 && (
              <Badge>{t.card.core}</Badge>
            )}
            {inConflict && (
              <Badge variant="destructive">{t.card.conflict}</Badge>
            )}
            <Button
              variant="outline"
              size="xs"
              onClick={onDetail}
              className="ml-auto"
            >
              {t.card.detail}
            </Button>
          </div>

          <div className="mb-2.5 rounded-sm bg-background/50 px-3 py-2 text-sm leading-relaxed text-foreground">
            <HighlightedText
              text={recommendation.reason}
              keywords={recommendation.matchedKeywords}
              color={plugin.color}
            />
          </div>

          {recommendation.matchedKeywords.length > 0 && (
            <div className="mb-2 flex flex-wrap gap-1">
              {recommendation.matchedKeywords.slice(0, 5).map((kw, i) => (
                <span
                  key={i}
                  className="inline-flex items-center rounded-sm px-1.5 py-0.5 text-[11px] text-text-dim"
                  style={{ background: plugin.color + "10" }}
                >
                  {kw}
                </span>
              ))}
              {recommendation.matchedKeywords.length > 5 && (
                <span className="inline-flex items-center rounded-sm px-1.5 py-0.5 text-[11px] text-text-dim">
                  +{recommendation.matchedKeywords.length - 5}
                </span>
              )}
            </div>
          )}

          <div className="mt-1 text-[13px] leading-relaxed text-muted-foreground sm:text-xs">{desc}</div>
        </div>
      </div>
    </div>
  );
}
