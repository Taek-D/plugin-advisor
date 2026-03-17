"use client";

import { useState } from "react";
import Link from "next/link";
import { Copy, Check } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { getCategoryIcon } from "@/lib/optimizer-utils";
import { PLUGINS } from "@/lib/plugins";

type RecommendPluginCardProps = {
  pluginId: string;
  reason: string;
};

export default function RecommendPluginCard({
  pluginId,
  reason,
}: RecommendPluginCardProps) {
  const { t } = useI18n();
  const [copied, setCopied] = useState(false);

  const plugin = PLUGINS[pluginId];
  if (!plugin) return null;

  const Icon = getCategoryIcon(plugin.category);

  function handleCopy() {
    navigator.clipboard.writeText(plugin.install.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="surface-panel-soft flex items-start gap-3 rounded-2xl p-4">
      {/* Category icon */}
      <div className="mt-0.5 shrink-0 text-muted-foreground">
        <Icon className="h-5 w-5" />
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <Link
          href={"/plugins/" + plugin.id}
          className="text-sm font-semibold text-blue-400 underline-offset-2 hover:underline"
        >
          {plugin.name}
        </Link>
        <p className="mt-0.5 truncate text-xs text-muted-foreground">
          {plugin.desc}
        </p>
        <p className="mt-1 text-xs text-foreground/70">
          <span className="font-medium text-muted-foreground">
            {t.optimizer.complementReason}:{" "}
          </span>
          {reason}
        </p>
      </div>

      {/* Copy button */}
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
  );
}
