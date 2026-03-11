import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { PLUGINS } from "@/lib/plugins";
import { REASONS } from "@/lib/plugin-reasons";
import { checkRateLimit, cleanupExpiredEntries } from "@/lib/rate-limit";
import type { AnalysisResult } from "@/lib/types";

const SYSTEM_PROMPT = `You are a Claude Code plugin advisor. Given a project description, analyze it and recommend the most suitable plugins from the available list.

Available plugins:
${Object.values(PLUGINS)
  .map((p) => `- ${p.id}: ${p.name} (${p.category}) — ${p.desc}`)
  .join("\n")}

Respond in valid JSON only (no markdown, no code fences). Format:
{
  "summary": "1-2 sentence Korean summary of the project analysis",
  "recommendations": [
    {
      "pluginId": "plugin_id",
      "priority": 1,
      "reason": "Korean explanation why this plugin fits",
      "matchedKeywords": ["relevant", "keywords"]
    }
  ],
  "warning": "optional Korean warning or null"
}

Rules:
- Recommend only from the provided candidate list when one is supplied
- Keep recommendations to 2-3 plugins max
- Use Korean for summary, reason, warning
- Only use plugin IDs from the available list
- matchedKeywords should reflect actual concepts found in the input
- Focus on explaining a safe starter setup rather than maximizing plugin count`;

export async function POST(req: NextRequest) {
  try {
    cleanupExpiredEntries();
    const { allowed } = checkRateLimit(req, {
      name: "analyze",
      maxRequests: 5,
      windowMs: 60_000,
    });
    if (!allowed) {
      return NextResponse.json(
        { error: "요청이 너무 많아요. 잠시 후 다시 시도해 주세요." },
        { status: 429 }
      );
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "AI 분석 기능이 설정되지 않았어요. (API 키 없음)" },
        { status: 503 }
      );
    }

    const { text, candidatePluginIds } = await req.json();
    if (!text || typeof text !== "string") {
      return NextResponse.json(
        { error: "분석할 텍스트가 필요해요." },
        { status: 400 }
      );
    }

    const allowedPluginIds = Array.isArray(candidatePluginIds)
      ? candidatePluginIds.filter((pluginId): pluginId is string => typeof pluginId === "string")
      : [];
    const availablePlugins = (allowedPluginIds.length > 0
      ? allowedPluginIds.map((pluginId) => PLUGINS[pluginId]).filter(Boolean)
      : Object.values(PLUGINS))
      .map((plugin) => `- ${plugin.id}: ${plugin.name} (${plugin.category}) — ${plugin.desc}`)
      .join("\n");

    const client = new Anthropic({ apiKey });
    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      system: `${SYSTEM_PROMPT}\n\nAllowed plugins for this request:\n${availablePlugins}`,
      messages: [
        {
          role: "user",
          content: `다음 프로젝트를 분석하고, 초보자도 이해하기 쉬운 한국어 설명으로 안전한 스타터 세트를 설명해줘:\n\n${text.slice(0, 4000)}`,
        },
      ],
    });

    const content = message.content[0];
    if (content.type !== "text") {
      throw new Error("Unexpected response type");
    }

    const parsed = JSON.parse(content.text);

    // Validate plugin IDs
    const validIds = new Set(
      allowedPluginIds.length > 0 ? allowedPluginIds : Object.keys(PLUGINS)
    );
    const validRecs = parsed.recommendations.filter(
      (r: { pluginId: string }) => validIds.has(r.pluginId)
    );

    // Fill in default reasons if missing
    const recommendations = validRecs.map(
      (r: { pluginId: string; priority: number; reason?: string; matchedKeywords?: string[] }, i: number) => ({
        pluginId: r.pluginId,
        priority: i + 1,
        reason: r.reason || REASONS[r.pluginId] || "",
        matchedKeywords: r.matchedKeywords || [],
      })
    );

    const result: AnalysisResult = {
      summary: parsed.summary || "AI 분석 완료",
      recommendations,
      warning: parsed.warning || null,
      inputText: text,
    };

    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json(
      { error: "AI 분석 중 오류가 발생했어요." },
      { status: 500 }
    );
  }
}
