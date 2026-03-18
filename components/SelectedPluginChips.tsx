"use client";

import { X } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { getCategoryIcon } from "@/lib/optimizer-utils";
import { Badge } from "@/components/ui/badge";
import type { Plugin } from "@/lib/types";

type SelectedPluginChipsProps = {
  plugins: Plugin[];
  onRemove: (pluginId: string) => void;
};

export default function SelectedPluginChips({
  plugins,
  onRemove,
}: SelectedPluginChipsProps) {
  const { t } = useI18n();

  return (
    <div className="flex flex-wrap gap-2">
      {plugins.map((plugin) => {
        const Icon = getCategoryIcon(plugin.category);
        const desc = plugin.desc || t.optimizer.chipNoDesc;

        return (
          <div
            key={plugin.id}
            className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5"
          >
            <Icon className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
            <span className="text-xs font-semibold text-foreground">
              {plugin.name}
            </span>
            {plugin.type === "mcp" ? (
              <Badge className="px-1 py-0 text-[10px] border-blue-500/30 bg-blue-500/10 text-blue-400">
                MCP
              </Badge>
            ) : (
              <Badge className="px-1 py-0 text-[10px] border-purple-500/30 bg-purple-500/10 text-purple-400">
                Plugin
              </Badge>
            )}
            <span className="hidden max-w-[140px] truncate text-xs text-muted-foreground sm:inline">
              {desc}
            </span>
            <button
              onClick={() => onRemove(plugin.id)}
              aria-label={`${plugin.name} ${t.optimizer.removePlugin}`}
              className="ml-1 rounded-full p-0.5 text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
