"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AlertTriangle, Check, ExternalLink } from "lucide-react";
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
  const [versionLoading, setVersionLoading] = useState(true);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  useEffect(() => {
    setVersion(null);
    setVersionLoading(true);
    fetchVersions([plugin.id]).then((versions) => {
      if (versions[plugin.id]) {
        setVersion(versions[plugin.id]);
      }
    }).finally(() => setVersionLoading(false));
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
      <Button variant="outline" size="sm" asChild className="mb-8 font-mono text-xs">
        <Link href="/plugins">{t.detail.backToList}</Link>
      </Button>

      <div className="mb-8 flex flex-wrap items-center gap-3">
        <h1 className="font-heading text-2xl font-extrabold sm:text-3xl">{plugin.name}</h1>
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
          {locale === "en"
            ? plugin.difficulty === "beginner" ? "Beginner-friendly" : plugin.difficulty === "intermediate" ? "Intermediate" : "Advanced"
            : plugin.difficulty === "beginner" ? "입문자 친화" : plugin.difficulty === "intermediate" ? "중간 난이도" : "고급 설정"}
        </Badge>
        <Badge variant="outline">
          {locale === "en"
            ? plugin.verificationStatus === "verified" ? "Install verified" : plugin.verificationStatus === "partial" ? "Partially verified" : "Not verified"
            : plugin.verificationStatus === "verified" ? "설치 검증됨" : plugin.verificationStatus === "partial" ? "부분 검증" : "검증 전"}
        </Badge>
        <Button variant="outline" size="sm" asChild className="font-mono text-[0.6875rem]">
          <a href={plugin.url} target="_blank" rel="noreferrer">
            GitHub <ExternalLink className="ml-1 inline h-3 w-3" />
          </a>
        </Button>
      </div>

      <p className="mb-8 text-sm leading-[1.9] text-muted-foreground">
        {longDesc}
      </p>

      <div className="mb-8">
        <div className="mb-2.5 text-[0.6875rem] font-medium uppercase tracking-widest text-text-dim">
          {t.detail.features}
        </div>
        <div className="flex flex-wrap gap-2">
          {plugin.features.map((feature) => (
            <span
              key={feature}
              className="rounded-sm px-2.5 py-1 text-xs"
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

      <div className="mb-8">
        <div className="mb-2.5 text-[0.6875rem] font-medium uppercase tracking-widest text-text-dim">
          {t.detail.install}
        </div>

        {(plugin.prerequisites.length > 0 || plugin.requiredSecrets.length > 0) && (
          <div className="mb-4 rounded-md border border-border bg-card/70 px-4 py-3 text-sm text-muted-foreground">
            {plugin.prerequisites.map((item) => (
              <div key={`${plugin.id}-prereq-${item}`}>- {item}</div>
            ))}
            {plugin.requiredSecrets.map((item) => (
              <div key={`${plugin.id}-secret-${item}`}>- {item}</div>
            ))}
          </div>
        )}

        <div className="flex flex-col gap-2">
          {plugin.install.map((command, index) => (
            <div
              key={`${plugin.id}-${index}`}
              className="flex items-center gap-2 rounded-md border border-border bg-card/70 px-4 py-2.5"
            >
              <code className="flex-1 overflow-x-auto text-xs text-muted-foreground">
                {command}
              </code>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyCommand(command, index)}
                aria-label={`${t.detail.copy}: ${command}`}
                className="shrink-0 font-mono text-[0.6875rem]"
              >
                {copiedIdx === index ? (
                  <span className="flex items-center gap-1">
                    <Check className="h-3 w-3 text-primary" />
                    {t.detail.copied}
                  </span>
                ) : (
                  t.detail.copy
                )}
              </Button>
            </div>
          ))}
        </div>
      </div>

      {versionLoading ? (
        <Card className="mb-8 p-4">
          <div className="mb-1.5 h-3 w-24 animate-pulse rounded bg-muted" />
          <div className="flex items-center gap-3">
            <div className="h-4 w-16 animate-pulse rounded bg-muted" />
            <div className="h-3 w-20 animate-pulse rounded bg-muted" />
          </div>
        </Card>
      ) : version?.latestVersion ? (
        <Card className="mb-8 p-4">
          <div className="mb-1.5 text-[0.6875rem] font-medium uppercase tracking-widest text-text-dim">
            {t.detail.latestVersion}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-bold text-primary">
              {version.latestVersion}
            </span>
            {version.publishedAt && (
              <span className="text-xs text-muted-foreground">
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
                className="text-xs text-primary transition-colors hover:underline"
              >
                Release Notes <ExternalLink className="ml-1 inline h-3 w-3" />
              </a>
            )}
          </div>
        </Card>
      ) : null}

      {plugin.conflicts.length > 0 && (
        <div className="mb-8 rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          <AlertTriangle className="mr-1 inline h-3.5 w-3.5" />
          <strong>{plugin.conflicts.map((id) => PLUGINS[id]?.name).join(", ")}</strong>{" "}
          {t.detail.conflictWarning}
        </div>
      )}

      <div className="mb-10">
        <div className="mb-2.5 text-[0.6875rem] font-medium uppercase tracking-widest text-text-dim">
          {t.detail.keywords}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {plugin.keywords.map((keyword) => (
            <span
              key={keyword}
              className="rounded-sm border border-primary/20 bg-primary/5 px-2 py-0.5 text-xs text-primary"
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
