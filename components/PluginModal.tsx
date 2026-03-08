"use client";

import { useEffect } from "react";
import Link from "next/link";
import type { Plugin, VersionInfo } from "@/lib/types";
import { PLUGINS } from "@/lib/plugins";
import { useI18n } from "@/lib/i18n";
import { pluginDescEn } from "@/lib/i18n/plugins-en";

type Props = {
  plugin: Plugin | null;
  onClose: () => void;
  version?: VersionInfo;
};

export default function PluginModal({ plugin, onClose, version }: Props) {
  const { locale, t } = useI18n();

  useEffect(() => {
    if (!plugin) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleEsc);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEsc);
    };
  }, [plugin, onClose]);

  if (!plugin) return null;

  const longDesc = locale === "en"
    ? (pluginDescEn[plugin.id]?.longDesc || plugin.longDesc)
    : plugin.longDesc;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-5"
      onClick={onClose}
    >
      <div
        className="animate-fade-in fixed inset-0 flex flex-col overflow-y-auto rounded-none border border-[#252545] bg-[#0D0D1E] p-6 md:static md:max-h-[80vh] md:max-w-[500px] md:rounded-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-heading text-base font-extrabold">
              {plugin.name}
            </span>
            <span
              className="rounded-[3px] px-1.5 py-0.5 text-[9px] font-bold tracking-wide"
              style={{
                color: plugin.color,
                background: plugin.color + "20",
              }}
            >
              {plugin.tag}
            </span>
          </div>
          <button
            onClick={onClose}
            className="min-h-[44px] min-w-[44px] bg-transparent text-lg text-text-sub"
          >
            ×
          </button>
        </div>

        <p className="mb-4 text-xs leading-[1.8] text-[#888]">
          {longDesc}
        </p>

        <div className="mb-3.5">
          <div className="mb-2 text-[9px] tracking-[2px] text-[#444]">
            {t.detail.features}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {plugin.features.map((f, i) => (
              <span
                key={i}
                className="rounded px-2 py-[3px] text-[10px]"
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
          <div className="mb-3.5 rounded-md border border-[#301010] bg-[#120808] px-3 py-2.5 text-[11px] text-[#FF6060]">
            ⚠{" "}
            <strong>
              {plugin.conflicts.map((c) => PLUGINS[c]?.name).join(", ")}
            </strong>{" "}
            {t.detail.conflictWarning}
          </div>
        )}

        {version?.latestVersion && (
          <div className="mb-3 rounded-[5px] border border-border-main bg-[#060610] px-3 py-2">
            <div className="flex flex-wrap items-center gap-2 text-[10px]">
              <span className="font-bold text-success">
                {version.latestVersion}
              </span>
              {version.publishedAt && (
                <span className="text-[#555]">
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
                  className="text-accent hover:underline"
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
            className="block rounded-md p-2.5 text-center text-[11px] tracking-wide no-underline"
            style={{
              color: plugin.color,
              background: plugin.color + "20",
              border: `1px solid ${plugin.color}40`,
            }}
          >
            {t.detail.githubLink}
          </a>
          <Link
            href={`/plugins/${plugin.id}`}
            onClick={onClose}
            className="block rounded-md border border-border-main p-2 text-center text-[10px] text-text-sub hover:border-[#30306A] hover:text-[#CCC]"
          >
            {t.detail.detailPage}
          </Link>
        </div>
      </div>
    </div>
  );
}
