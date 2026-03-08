"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { Plugin, VersionInfo } from "@/lib/types";
import { PLUGINS } from "@/lib/plugins";
import { fetchVersions } from "@/lib/versions";
import { useI18n } from "@/lib/i18n";
import { pluginDescEn } from "@/lib/i18n/plugins-en";
import RelatedPlugins from "./RelatedPlugins";
import ReviewSection from "./ReviewSection";

type Props = {
  plugin: Plugin;
};

export default function PluginDetail({ plugin }: Props) {
  const { locale, t } = useI18n();
  const [version, setVersion] = useState<VersionInfo | null>(null);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  useEffect(() => {
    setVersion(null);
    fetchVersions([plugin.id]).then((v) => {
      if (v[plugin.id]) setVersion(v[plugin.id]);
    });
  }, [plugin.id]);

  const copyCommand = (cmd: string, idx: number) => {
    navigator.clipboard.writeText(cmd);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const longDesc = locale === "en"
    ? (pluginDescEn[plugin.id]?.longDesc || plugin.longDesc)
    : plugin.longDesc;

  return (
    <div>
      <Link
        href="/plugins"
        className="mb-6 inline-block rounded border border-border-main px-3 py-1.5 font-mono text-[10px] text-text-sub hover:border-[#30306A] hover:text-[#CCC]"
      >
        {t.detail.backToList}
      </Link>

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <h1 className="font-heading text-xl font-extrabold">{plugin.name}</h1>
        <span
          className="rounded-[3px] px-2 py-1 text-[10px] font-bold tracking-wide"
          style={{
            color: plugin.color,
            background: plugin.color + "18",
          }}
        >
          {plugin.tag}
        </span>
        {version?.latestVersion && (
          <span className="rounded-[3px] border border-border-main px-1.5 py-0.5 text-[9px] text-success">
            {version.latestVersion}
          </span>
        )}
        {plugin.url && (
          <a
            href={plugin.url}
            target="_blank"
            rel="noreferrer"
            className="rounded border border-border-main px-2 py-1 font-mono text-[9px] text-text-sub hover:border-[#30306A] hover:text-[#CCC]"
          >
            GitHub →
          </a>
        )}
      </div>

      <p className="mb-6 text-xs leading-[1.8] text-[#888]">
        {longDesc}
      </p>

      <div className="mb-6">
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

      <div className="mb-6">
        <div className="mb-2 text-[9px] tracking-[2px] text-[#444]">
          {t.detail.install}
        </div>
        <div className="flex flex-col gap-1.5">
          {plugin.install.map((cmd, i) => (
            <div
              key={i}
              className="flex items-center gap-2 rounded-[5px] border border-[#121224] bg-[#040408] px-3 py-2"
            >
              <code className="flex-1 overflow-x-auto text-[11px] text-[#777]">
                {cmd}
              </code>
              <button
                onClick={() => copyCommand(cmd, i)}
                className="shrink-0 rounded border border-border-main px-2 py-1 font-mono text-[9px] text-text-sub hover:text-accent"
              >
                {copiedIdx === i ? t.detail.copied : t.detail.copy}
              </button>
            </div>
          ))}
        </div>
      </div>

      {version?.latestVersion && (
        <div className="mb-6 rounded-[7px] border border-border-main bg-card p-3">
          <div className="mb-1 text-[9px] tracking-[2px] text-[#444]">
            {t.detail.latestVersion}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-bold text-success">
              {version.latestVersion}
            </span>
            {version.publishedAt && (
              <span className="text-[10px] text-[#555]">
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
                className="text-[10px] text-accent hover:underline"
              >
                Release Notes →
              </a>
            )}
          </div>
        </div>
      )}

      {plugin.conflicts.length > 0 && (
        <div className="mb-6 rounded-[7px] border border-[#301010] bg-[#120808] px-3 py-2.5 text-[11px] text-[#FF6060]">
          ⚠{" "}
          <strong>
            {plugin.conflicts.map((c) => PLUGINS[c]?.name).join(", ")}
          </strong>{" "}
          {t.detail.conflictWarning}
        </div>
      )}

      <div className="mb-8">
        <div className="mb-2 text-[9px] tracking-[2px] text-[#444]">
          {t.detail.keywords}
        </div>
        <div className="flex flex-wrap gap-1">
          {plugin.keywords.map((kw, i) => (
            <span
              key={i}
              className="rounded-[3px] border border-accent/20 bg-accent/5 px-[7px] py-0.5 text-[10px] text-[#7070FF]"
            >
              {kw}
            </span>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <ReviewSection pluginId={plugin.id} />
      </div>

      <RelatedPlugins currentId={plugin.id} category={plugin.category} />
    </div>
  );
}
