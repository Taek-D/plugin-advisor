"use client";

import { useEffect } from "react";
import Link from "next/link";
import type { Plugin, VersionInfo } from "@/lib/types";
import { PLUGINS } from "@/lib/plugins";
import { useI18n } from "@/lib/i18n";
import { pluginDescEn } from "@/lib/i18n/plugins-en";
import { AlertTriangle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type Props = {
  plugin: Plugin | null;
  onClose: () => void;
  version?: VersionInfo;
};

export default function PluginModal({ plugin, onClose, version }: Props) {
  const { locale, t } = useI18n();

  useEffect(() => {
    if (!plugin) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [plugin, onClose]);

  if (!plugin) return null;

  const longDesc = locale === "en"
    ? (pluginDescEn[plugin.id]?.longDesc || plugin.longDesc)
    : plugin.longDesc;

  return (
    <Dialog open={!!plugin} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        onClose={onClose}
        aria-label={plugin.name}
      >
        <DialogHeader className="mb-4">
          <div className="flex items-center gap-2">
            <DialogTitle className="font-heading">
              {plugin.name}
            </DialogTitle>
            <Badge
              className="border-transparent"
              style={{
                color: plugin.color,
                background: plugin.color + "20",
              }}
            >
              {plugin.tag}
            </Badge>
          </div>
        </DialogHeader>

        <DialogDescription className="mb-4 text-xs leading-[1.8]">
          {longDesc}
        </DialogDescription>

        <div className="mb-3.5">
          <div className="mb-2 text-xs font-medium uppercase tracking-wide text-text-dim">
            {t.detail.features}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {plugin.features.map((f, i) => (
              <span
                key={i}
                className="rounded-md px-2 py-[3px] text-xs"
                style={{
                  color: plugin.color,
                  background: plugin.color + "15",
                  border: `1px solid ${plugin.color}30`,
                }}
              >
                {f}
              </span>
            ))}
          </div>
        </div>

        {plugin.conflicts.length > 0 && (
          <div className="mb-3.5 rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2.5 text-sm text-destructive">
            <AlertTriangle className="mr-1 inline h-3.5 w-3.5" />
            <strong>
              {plugin.conflicts.map((c) => PLUGINS[c]?.name).join(", ")}
            </strong>{" "}
            {t.detail.conflictWarning}
          </div>
        )}

        {version?.latestVersion && (
          <div className="mb-3 rounded-md border border-border bg-background px-3 py-2">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="font-bold text-primary">
                {version.latestVersion}
              </span>
              {version.publishedAt && (
                <span className="text-text-dim">
                  {new Date(version.publishedAt).toLocaleDateString(
                    locale === "en" ? "en-US" : "ko-KR"
                  )}
                </span>
              )}
              {version.releaseUrl && (
                <a
                  href={version.releaseUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary transition-colors hover:underline"
                >
                  Release Notes
                </a>
              )}
            </div>
          </div>
        )}

        <div className="mt-auto flex flex-col gap-2">
          <a
            href={plugin.url}
            target="_blank"
            rel="noreferrer"
            className="block rounded-md p-2.5 text-center text-sm no-underline text-primary transition-colors hover:underline"
            style={{
              background: plugin.color + "20",
              border: `1px solid ${plugin.color}40`,
            }}
          >
            {t.detail.githubLink}
          </a>
          <Button variant="outline" asChild className="w-full">
            <Link
              href={`/plugins/${plugin.id}`}
              onClick={onClose}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              {t.detail.detailPage}
            </Link>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
