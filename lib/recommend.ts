import type { AnalysisResult } from "./types";
import { PLUGINS, REASONS } from "./plugins";

export function recommend(text: string): AnalysisResult {
  const lower = text.toLowerCase();
  const matchedKeywords: Record<string, string[]> = {};
  const scores: Record<string, number> = {};

  Object.values(PLUGINS).forEach((p) => {
    const matched = p.keywords.filter((kw) => lower.includes(kw.toLowerCase()));
    if (matched.length > 0) {
      scores[p.id] = matched.length;
      matchedKeywords[p.id] = matched;
    }
  });

  if (scores.omc && scores.superpowers) {
    scores.superpowers = Math.max(0, scores.superpowers - 1);
    if (!scores.superpowers) delete scores.superpowers;
  }

  const sorted = Object.entries(scores)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);

  if (!sorted.length) {
    return {
      summary:
        "특정 키워드가 부족해요. 더 구체적인 설명을 추가하면 정확도가 올라가요.",
      recommendations: [
        {
          pluginId: "bkit",
          priority: 1,
          reason: REASONS.bkit,
          matchedKeywords: [],
        },
        {
          pluginId: "context7",
          priority: 2,
          reason: REASONS.context7,
          matchedKeywords: [],
        },
      ],
      warning:
        "더 구체적인 내용(기술 스택, 주요 기능 등)을 입력하면 더 정확한 추천이 가능해요.",
      inputText: text,
    };
  }

  const topPlugin = PLUGINS[sorted[0][0]];
  return {
    summary: `${topPlugin.name} 중심의 프로젝트로 파악됐어요. ${sorted.length}개 플러그인 조합을 추천해요.`,
    recommendations: sorted.map(([id], i) => ({
      pluginId: id,
      priority: i + 1,
      reason: REASONS[id],
      matchedKeywords: matchedKeywords[id] || [],
    })),
    warning:
      sorted.length >= 4
        ? "플러그인이 많으면 충돌 위험이 있어요. 핵심 1-2개 먼저 써보세요."
        : null,
    inputText: text,
  };
}
