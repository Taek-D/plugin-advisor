import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { PLUGINS, REASONS } from "@/lib/plugins";
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
- Recommend 3-5 plugins max, sorted by relevance
- Use Korean for summary, reason, warning
- Only use plugin IDs from the available list
- matchedKeywords should reflect actual concepts found in the input
- If omc and superpowers are both recommended, note potential conflict in warning`;

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "AI 분석 기능이 설정되지 않았어요. (API 키 없음)" },
        { status: 503 }
      );
    }

    const { text } = await req.json();
    if (!text || typeof text !== "string") {
      return NextResponse.json(
        { error: "분석할 텍스트가 필요해요." },
        { status: 400 }
      );
    }

    const client = new Anthropic({ apiKey });
    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `다음 프로젝트를 분석하고 최적의 Claude Code 플러그인을 추천해줘:\n\n${text.slice(0, 4000)}`,
        },
      ],
    });

    const content = message.content[0];
    if (content.type !== "text") {
      throw new Error("Unexpected response type");
    }

    const parsed = JSON.parse(content.text);

    // Validate plugin IDs
    const validIds = new Set(Object.keys(PLUGINS));
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
    const msg = e instanceof Error ? e.message : "AI 분석 중 오류가 발생했어요.";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
