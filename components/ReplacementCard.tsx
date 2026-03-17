"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Copy, Check } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { PLUGINS } from "@/lib/plugins";

type ReplacementCardProps = {
  original: string;
  reason: "unverified" | "partial" | "deprecated";
  replacement: string | null;
};

export default function ReplacementCard({
  original,
  reason,
  replacement,
}: ReplacementCardProps) {
  const { t, locale } = useI18n();
  const [copied, setCopied] = useState(false);

  const originalPlugin = PLUGINS[original];
  const replacementPlugin = replacement ? PLUGINS[replacement] : null;

  if (!originalPlugin) return null;

  const reasonLabels: Record<typeof reason, string> = {
    unverified: locale === "ko" ? "미검증" : "Unverified",
    partial: locale === "ko" ? "부분검증" : "Partial",
    deprecated: locale === "ko" ? "지원중단" : "Deprecated",
  };

  const reasonColors: Record<typeof reason, string> = {
    unverified: "bg-yellow-500/10 text-yellow-400",
    partial: "bg-orange-500/10 text-orange-400",
    deprecated: "bg-red-500/10 text-red-400",
  };

  function handleCopy() {
    if (!replacementPlugin) return;
    navigator.clipboard.writeText(replacementPlugin.install.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="surface-panel-soft rounded-2xl p-4">
      {/* Arrow row: original -> replacement */}
      <div className="mb-2 flex items-center gap-2 text-sm">
        <span className="text-muted-foreground line-through">
          {originalPlugin.name}
        </span>
        <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />
        {replacementPlugin ? (
          <Link
            href={"/plugins/" + replacementPlugin.id}
            className="font-semibold text-blue-400 underline-offset-2 hover:underline"
          >
            {replacementPlugin.name}
          </Link>
        ) : (
          <span className="text-muted-foreground">
            {locale === "ko" ? "대안 없음" : "No alternative available"}
          </span>
        )}

        {/* Reason badge */}
        <span
          className={[
            "ml-auto rounded-full px-2 py-0.5 text-xs font-semibold",
            reasonColors[reason],
          ].join(" ")}
        >
          {reasonLabels[reason]}
        </span>
      </div>

      {/* Replacement details + copy button */}
      {replacementPlugin && (
        <div className="flex items-start justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            {replacementPlugin.desc}
          </p>
          <button
            onClick={handleCopy}
            className="shrink-0 rounded-lg bg-white/5 px-3 py-1.5 text-xs font-medium text-foreground/80 transition-colors hover:bg-white/10"
            aria-label={copied ? t.optimizer.installCopied : t.optimizer.installCopy}
          >
            <span className="flex items-center gap-1">
              {copied ? (
                <Check className="h-3.5 w-3.5 text-green-400" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
              {copied ? t.optimizer.installCopied : t.optimizer.installCopy}
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
