"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AlertTriangle, ExternalLink } from "lucide-react";
import type { Plugin, VersionInfo } from "@/lib/types";
import { PLUGINS } from "@/lib/plugins";
import { fetchVersions } from "@/lib/versions";
import { useI18n } from "@/lib/i18n";
import { pluginDescEn } from "@/lib/i18n/plugins-en";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import RelatedPlugins from "./RelatedPlugins";
import PluginSuggestionCallout from "./PluginSuggestionCallout";

type Props = {
  plugin: Plugin;
};

export default function PluginDetail({ plugin }: Props) {
  const { locale, t } = useI18n();
  const [version, setVersion] = useState<VersionInfo | null>(null);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  useEffect(() => {
    setVersion(null);
    fetchVersions([plugin.id]).then((versions) => {
      if (versions[plugin.id]) {
        setVersion(versions[plugin.id]);
      }
    });
  }, [plugin.id]);

  const copyCommand = (command: string, index: number) => {
    navigator.clipboard.writeText(command);
    setCopiedIdx(index);
    window.setTimeout(() => setCopiedIdx(null), 2000);
  };

  const longDesc =
    locale === "en"
      ? pluginDescEn[plugin.id]?.longDesc || plugin.longDesc
      : plugin.longDesc;

  return (
    <div>
      <Button variant="outline" size="xs" asChild className="mb-6 font-mono text-[10px]">
        <Link href="/plugins">{t.detail.backToList}</Link>
      </Button>

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <h1 className="font-heading text-xl font-extrabold">{plugin.name}</h1>
        <Badge
          className="border-transparent"
          style={{
            color: plugin.color,
            background: `${plugin.color}18`,
          }}
        >
          {plugin.tag}
        </Badge>
        {version?.latestVersion && (
          <Badge variant="outline" className="text-primary">
            {version.latestVersion}
          </Badge>
        )}
        <Badge variant="outline">
          {locale === "en" ? plugin.difficulty : `난이도 ${plugin.difficulty}`}
        </Badge>
        <Badge variant="outline">
          {locale === "en"
            ? plugin.verificationStatus
            : `검증 ${plugin.verificationStatus}`}
        </Badge>
        <Button variant="outline" size="xs" asChild className="font-mono text-[9px]">
          <a href={plugin.url} target="_blank" rel="noreferrer">
            GitHub <ExternalLink className="ml-1 inline h-3 w-3" />
          </a>
        </Button>
      </div>

      <p className="mb-6 text-xs leading-[1.8] text-muted-foreground">
        {longDesc}
      </p>

      <div className="mb-6">
        <div className="mb-2 text-[9px] tracking-[2px] text-text-dim">
          {t.detail.features}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {plugin.features.map((feature) => (
            <span
              key={feature}
              className="rounded-sm px-2 py-[3px] text-[10px]"
              style={{
                color: plugin.color,
                background: `${plugin.color}15`,
                border: `1px solid ${plugin.color}30`,
              }}
            >
              {feature}
            </span>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <div className="mb-2 text-[9px] tracking-[2px] text-text-dim">
          {t.detail.install}
        </div>

        {(plugin.prerequisites.length > 0 || plugin.requiredSecrets.length > 0) && (
          <div className="mb-3 rounded-md border border-border bg-background px-3 py-2.5 text-xs text-muted-foreground">
            {plugin.prerequisites.map((item) => (
              <div key={`${plugin.id}-prereq-${item}`}>- {item}</div>
            ))}
            {plugin.requiredSecrets.map((item) => (
              <div key={`${plugin.id}-secret-${item}`}>- {item}</div>
            ))}
          </div>
        )}

        <div className="flex flex-col gap-1.5">
          {plugin.install.map((command, index) => (
            <div
              key={`${plugin.id}-${index}`}
              className="flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2"
            >
              <code className="flex-1 overflow-x-auto text-[11px] text-muted-foreground">
                {command}
              </code>
              <Button
                variant="outline"
                size="xs"
                onClick={() => copyCommand(command, index)}
                className="shrink-0 font-mono text-[9px]"
              >
                {copiedIdx === index ? t.detail.copied : t.detail.copy}
              </Button>
            </div>
          ))}
        </div>
      </div>

      {version?.latestVersion && (
        <Card className="mb-6 p-3">
          <div className="mb-1 text-[9px] tracking-[2px] text-text-dim">
            {t.detail.latestVersion}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-bold text-primary">
              {version.latestVersion}
            </span>
            {version.publishedAt && (
              <span className="text-[10px] text-muted-foreground">
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
                className="text-[10px] text-primary transition-colors hover:underline"
              >
                Release Notes <ExternalLink className="ml-1 inline h-3 w-3" />
              </a>
            )}
          </div>
        </Card>
      )}

      {plugin.conflicts.length > 0 && (
        <div className="mb-6 rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2.5 text-[11px] text-destructive">
          <AlertTriangle className="mr-1 inline h-3.5 w-3.5" />
          <strong>{plugin.conflicts.map((id) => PLUGINS[id]?.name).join(", ")}</strong>{" "}
          {t.detail.conflictWarning}
        </div>
      )}

      <div className="mb-8">
        <div className="mb-2 text-[9px] tracking-[2px] text-text-dim">
          {t.detail.keywords}
        </div>
        <div className="flex flex-wrap gap-1">
          {plugin.keywords.map((keyword) => (
            <span
              key={keyword}
              className="rounded-sm border border-primary/20 bg-primary/5 px-[7px] py-0.5 text-[10px] text-[#7070FF]"
            >
              {keyword}
            </span>
          ))}
        </div>
      </div>

      <RelatedPlugins currentId={plugin.id} category={plugin.category} />
      <PluginSuggestionCallout sourcePage={`/plugins/${plugin.id}`} />
    </div>
  );
}
