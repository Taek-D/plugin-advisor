import type { AnalysisResult } from "./types";
import { PLUGINS } from "./plugins";
import { REASONS } from "./plugin-reasons";
import { CONFLICT_PAIRS, getRedundancies } from "./conflicts";

export const COMPLEMENTS: Record<string, { pluginId: string; reason: string; reasonEn: string }> = {
  omc: {
    pluginId: "context7",
    reason: "OMC와 함께 쓰면 최신 문서 참조로 정확도가 높아져요.",
    reasonEn: "Pair with OMC for accurate latest docs reference.",
  },
  "bkit-starter": {
    pluginId: "context7",
    reason: "입문자에게 최신 라이브러리 문서가 큰 도움이 돼요.",
    reasonEn: "Latest library docs help beginners a lot.",
  },
  playwright: {
    pluginId: "uiux",
    reason: "E2E 테스트와 함께 UI 품질을 높여보세요.",
    reasonEn: "Boost UI quality alongside E2E testing.",
  },
  supabase: {
    pluginId: "security",
    reason: "백엔드 개발 시 보안 검증은 필수예요.",
    reasonEn: "Security checks are essential for backend dev.",
  },
  firecrawl: {
    pluginId: "exa",
    reason: "크롤링 데이터를 시맨틱 검색으로 더 잘 활용해보세요.",
    reasonEn: "Leverage crawled data better with semantic search.",
  },
};

const BEGINNER_KEYWORDS = ["초보", "입문", "시작", "beginner", "start", "first"];

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

  // Beginner boost
  const isBeginnerInput = BEGINNER_KEYWORDS.some((kw) => lower.includes(kw));
  if (isBeginnerInput) {
    scores["bkit-starter"] = (scores["bkit-starter"] ?? 0) + 2;
    if (!matchedKeywords["bkit-starter"]) {
      matchedKeywords["bkit-starter"] = [];
    }
  }

  for (const pair of CONFLICT_PAIRS) {
    const [a, b] = pair.ids;
    if (scores[a] && scores[b]) {
      const weaker = scores[a] < scores[b] ? a : b;
      scores[weaker] = Math.max(0, scores[weaker] - 1);
      if (!scores[weaker]) delete scores[weaker];
    }
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

  const recommendedIds = sorted.map(([id]) => id);

  // Category diversity note
  const categories = new Set(
    recommendedIds.map((id) => PLUGINS[id]?.category).filter(Boolean)
  );
  const hasDiverseCategories = categories.size >= 3;

  const topPlugin = PLUGINS[sorted[0][0]];
  const baseSummary = `${topPlugin.name} 중심의 프로젝트로 파악됐어요. ${sorted.length}개 플러그인 조합을 추천해요.`;
  const summary = hasDiverseCategories
    ? `${baseSummary} 다양한 카테고리에 걸친 균형 잡힌 조합이에요.`
    : baseSummary;

  // Complements: collect unique complement suggestions not already in recommended list
  const complementsMap = new Map<string, string>();
  for (const id of recommendedIds) {
    const comp = COMPLEMENTS[id];
    if (comp && !recommendedIds.includes(comp.pluginId) && !complementsMap.has(comp.pluginId)) {
      complementsMap.set(comp.pluginId, comp.reason);
    }
  }
  const complements = Array.from(complementsMap.entries()).map(([pluginId, reason]) => ({
    pluginId,
    reason,
  }));

  // Redundancies
  const redundancyGroups = getRedundancies(recommendedIds);
  const redundancies = redundancyGroups.map((g) => ({ ids: g.ids, msg: g.msg }));

  return {
    summary,
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
    complements: complements.length > 0 ? complements : undefined,
    redundancies: redundancies.length > 0 ? redundancies : undefined,
  };
}
