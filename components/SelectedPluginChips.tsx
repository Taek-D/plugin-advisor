"use client";

import {
  Layers,
  GitBranch,
  Code,
  FlaskConical,
  BookOpen,
  Database,
  Shield,
  Plug,
  Palette,
  Server,
  X,
} from "lucide-react";
import { useI18n } from "@/lib/i18n";
import type { Plugin, PluginCategory } from "@/lib/types";
import type { LucideIcon } from "lucide-react";

type SelectedPluginChipsProps = {
  plugins: Plugin[];
  onRemove: (pluginId: string) => void;
};

const CATEGORY_ICONS: Record<PluginCategory, LucideIcon> = {
  orchestration: Layers,
  workflow: GitBranch,
  "code-quality": Code,
  testing: FlaskConical,
  documentation: BookOpen,
  data: Database,
  security: Shield,
  integration: Plug,
  "ui-ux": Palette,
  devops: Server,
};

export default function SelectedPluginChips({
  plugins,
  onRemove,
}: SelectedPluginChipsProps) {
  const { t } = useI18n();

  return (
    <div className="flex flex-wrap gap-2">
      {plugins.map((plugin) => {
        const Icon = CATEGORY_ICONS[plugin.category] || Plug;
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
