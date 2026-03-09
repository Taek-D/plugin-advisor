import type { AnalysisResult, NotRecommendedPlugin, Plugin } from "./types";
import { PLUGINS } from "./plugins";
import { REASONS } from "./plugin-reasons";
import { PRESET_PACKS } from "./presets";
import { buildPreflightChecks, buildSetupWarnings } from "./setup";

const BEGINNER_KEYWORDS = [
  "초보",
  "입문",
  "처음",
  "시작",
  "beginner",
  "first",
  "starter",
  "setup",
];

const PACK_SIGNALS: Record<string, string[]> = {
  "beginner-essential": [
    "초보",
    "입문",
    "처음",
    "시작",
    "learn",
    "guide",
    "튜토리얼",
    "처음 써",
  ],
  "webapp-starter": [
    "react",
    "next",
    "next.js",
    "frontend",
    "프론트",
    "landing",
    "웹앱",
    "saas",
    "ui",
    "browser",
  ],
  "backend-start": [
    "backend",
    "백엔드",
    "api",
    "auth",
    "인증",
    "database",
    "db",
    "sql",
    "server",
    "rest",
  ],
  "data-research": [
    "crawl",
    "scrape",
    "크롤링",
    "리서치",
    "research",
    "search",
    "검색",
    "data",
    "데이터 수집",
    "monitoring",
  ],
};

const PACK_SUMMARIES: Record<string, { ko: string; en: string }> = {
  "beginner-essential": {
    ko: "Claude Code 첫 세팅에 맞는 기본 조합으로 판단했어요. 학습과 정확한 문서 참조, 빠른 생산성 향상에 집중한 2-3개 세트를 추천해요.",
    en: "This looks like a first-time Claude Code setup. Recommend a small starter set focused on onboarding, accurate docs, and quick wins.",
  },
  "webapp-starter": {
    ko: "웹앱 시작 흐름으로 판단했어요. 공식 문서 확인, 브라우저 테스트, 배포 준비를 균형 있게 잡은 세트를 추천해요.",
    en: "This looks like a web app workflow. Recommend a balanced set for docs, browser testing, and deployment readiness.",
  },
  "backend-start": {
    ko: "백엔드 API 시작 흐름으로 판단했어요. 공식 문서, 보안 점검, 백엔드 연결을 우선하는 세트를 추천해요.",
    en: "This looks like a backend API workflow. Recommend a set that prioritizes docs, security, and backend setup.",
  },
  "data-research": {
    ko: "데이터 수집과 리서치 흐름으로 판단했어요. 수집, 검색, 코드베이스 파악에 강한 세트를 추천해요.",
    en: "This looks like a data collection and research workflow. Recommend a set tuned for crawling, search, and codebase understanding.",
  },
};

const PACK_EXCLUSIONS: Record<string, string[]> = {
  "beginner-essential": ["omc", "uiux", "postgres", "filesystem"],
  "webapp-starter": ["uiux"],
  "backend-start": ["postgres"],
  "data-research": [],
};

const MATCH_WEIGHT = 3;
const PRESET_BONUS = 4;

const INTENT_SIGNALS = {
  gsd: [
    "get shit done",
    "context rot",
    "spec-driven",
    "spec driven",
    "requirements",
    "roadmap",
    "phase",
    "milestone",
    "verify-work",
    "execute-phase",
    "plan-phase",
  ],
  fireauto: [
    "fireauto",
    "freainer",
    "seo-manager",
    "security-guard",
    "researcher",
    "planner",
    "uiux-upgrade",
    "daisyui",
    "reddit",
    "launch",
    "런칭",
    "출시",
  ],
  "agency-agents": [
    "agency agents",
    "the agency",
    "specialist agents",
    "specialist team",
    "expert personas",
    "persona-driven",
    "dream team",
    "cross-functional",
    "multi-role",
    "role-based",
  ],
} as const;

const AGENCY_ROLE_SIGNALS = [
  "frontend",
  "backend",
  "marketing",
  "project management",
  "pm",
  "design",
  "testing",
  "support",
  "ux",
  "devops",
] as const;

type KeywordMatch = {
  score: number;
  matched: string[];
};

function getKeywordMatches(text: string): Record<string, KeywordMatch> {
  const lower = text.toLowerCase();
  const matches: Record<string, KeywordMatch> = {};

  for (const plugin of Object.values(PLUGINS)) {
    const matched = plugin.keywords.filter((keyword) =>
      lower.includes(keyword.toLowerCase())
    );
    if (matched.length > 0) {
      matches[plugin.id] = {
        score: matched.length,
        matched,
      };
    }
  }

  return matches;
}

function countSignalHits(lower: string, signals: readonly string[]): number {
  return signals.reduce(
    (count, signal) => count + (lower.includes(signal.toLowerCase()) ? 1 : 0),
    0
  );
}

function isBeginner(text: string): boolean {
  const lower = text.toLowerCase();
  return BEGINNER_KEYWORDS.some((keyword) => lower.includes(keyword));
}

function scorePack(
  packId: string,
  text: string,
  matches: Record<string, KeywordMatch>
): number {
  const lower = text.toLowerCase();
  const signalScore =
    PACK_SIGNALS[packId]?.reduce(
      (score, keyword) => score + (lower.includes(keyword.toLowerCase()) ? 2 : 0),
      0
    ) ?? 0;
  const preset = PRESET_PACKS.find((pack) => pack.id === packId);
  if (!preset) return signalScore;

  const pluginScore = preset.pluginIds.reduce(
    (score, pluginId) => score + (matches[pluginId]?.score ?? 0),
    0
  );

  return signalScore + pluginScore;
}

function getPackId(text: string, matches: Record<string, KeywordMatch>): string {
  if (isBeginner(text)) return "beginner-essential";

  const packIds = PRESET_PACKS.map((pack) => pack.id);
  const scores = packIds.map((packId) => ({
    packId,
    score: scorePack(packId, text, matches),
  }));
  scores.sort((a, b) => b.score - a.score);

  if (!scores[0] || scores[0].score <= 0) {
    return "beginner-essential";
  }

  return scores[0].packId;
}

function getTrustScore(plugin: Plugin, beginnerInput: boolean): number {
  let score = 0;

  if (plugin.verificationStatus === "verified") score += 4;
  if (plugin.verificationStatus === "partial") score += 1;
  if (plugin.verificationStatus === "unverified") score -= 4;

  if (plugin.installMode === "safe-copy") score += 3;
  if (plugin.installMode === "external-setup") score += 1;
  if (plugin.installMode === "manual-required") score -= 3;

  if (plugin.difficulty === "beginner") score += 3;
  if (plugin.difficulty === "advanced") score += beginnerInput ? -5 : -2;

  if (plugin.officialStatus === "official") score += 1;
  if (plugin.officialStatus === "unknown") score -= 1;

  if (plugin.maintenanceStatus === "unclear") score -= 2;
  if (plugin.maintenanceStatus === "stale") score -= 3;

  return score;
}

function getAgencyRoleHitCount(lower: string): number {
  return countSignalHits(lower, AGENCY_ROLE_SIGNALS);
}

function getIntentDrivenPluginIds(text: string): string[] {
  const lower = text.toLowerCase();
  const ids: string[] = [];

  const gsdHits = countSignalHits(lower, INTENT_SIGNALS.gsd);
  if (gsdHits >= 2) ids.push("gsd");

  const fireautoHits = countSignalHits(lower, INTENT_SIGNALS.fireauto);
  if (fireautoHits >= 2) ids.push("fireauto");

  const agencyHits = countSignalHits(lower, INTENT_SIGNALS["agency-agents"]);
  const roleHits = getAgencyRoleHitCount(lower);
  if (agencyHits >= 1 || roleHits >= 3) ids.push("agency-agents");

  return ids;
}

function getCandidatePluginIds(
  presetPluginIds: string[],
  matches: Record<string, KeywordMatch>,
  text: string
): string[] {
  const matchedIds = Object.entries(matches)
    .filter(([, match]) => match.score > 0)
    .map(([pluginId]) => pluginId);
  const intentDrivenIds = getIntentDrivenPluginIds(text);

  return Array.from(new Set([...presetPluginIds, ...matchedIds, ...intentDrivenIds]));
}

function passesIntentGate(pluginId: string, text: string): boolean {
  const lower = text.toLowerCase();

  if (pluginId === "gsd") {
    return countSignalHits(lower, INTENT_SIGNALS.gsd) >= 2;
  }

  if (pluginId === "fireauto") {
    return countSignalHits(lower, INTENT_SIGNALS.fireauto) >= 2;
  }

  if (pluginId === "agency-agents") {
    return (
      countSignalHits(lower, INTENT_SIGNALS["agency-agents"]) >= 1 ||
      getAgencyRoleHitCount(lower) >= 3
    );
  }

  return true;
}

function getIntentBoost(pluginId: string, text: string): number {
  const lower = text.toLowerCase();

  if (pluginId === "gsd") {
    const hits = countSignalHits(lower, INTENT_SIGNALS.gsd);
    if (hits >= 4) return 10;
    if (hits >= 2) return 6;
    return 0;
  }

  if (pluginId === "fireauto") {
    const hits = countSignalHits(lower, INTENT_SIGNALS.fireauto);
    if (hits >= 4) return 9;
    if (hits >= 2) return 5;
    return 0;
  }

  if (pluginId === "agency-agents") {
    const explicitHits = countSignalHits(lower, INTENT_SIGNALS["agency-agents"]);
    const roleHits = getAgencyRoleHitCount(lower);
    if (explicitHits >= 1) return 10;
    if (roleHits >= 4) return 7;
    if (roleHits >= 3) return 4;
    return 0;
  }

  return 0;
}

function buildNotRecommended(
  packId: string,
  beginnerInput: boolean,
  matches: Record<string, KeywordMatch>
): NotRecommendedPlugin[] {
  const ids = new Set<string>(PACK_EXCLUSIONS[packId] ?? []);
  for (const [pluginId, match] of Object.entries(matches)) {
    if (!match.score) continue;
    const plugin = PLUGINS[pluginId];
    if (
      beginnerInput &&
      (plugin.difficulty === "advanced" ||
        plugin.verificationStatus === "unverified" ||
        plugin.installMode === "manual-required")
    ) {
      ids.add(pluginId);
    }
  }

  return Array.from(ids)
    .sort((a, b) => (matches[b]?.score ?? 0) - (matches[a]?.score ?? 0))
    .map((pluginId) => PLUGINS[pluginId])
    .filter(Boolean)
    .slice(0, 3)
    .map((plugin) => {
      if (plugin.verificationStatus === "unverified") {
        return {
          pluginId: plugin.id,
          reason: "아직 설치 검증이 충분하지 않아 이번 추천 세트에서는 보수적으로 제외했어요.",
          reasonEn:
            "This plugin is not fully verified yet, so it was left out of the starter recommendation.",
        };
      }
      if (plugin.installMode === "manual-required") {
        return {
          pluginId: plugin.id,
          reason: "예시 경로나 수동 치환값이 필요해서 초보자 기본 흐름에서는 제외했어요.",
          reasonEn:
            "This plugin needs manual path or placeholder changes, so it was excluded from the beginner-friendly flow.",
        };
      }
      return {
        pluginId: plugin.id,
        reason: "첫 세팅보다 익숙해진 뒤에 도입하는 편이 안전한 플러그인이에요.",
        reasonEn:
          "This plugin is safer to introduce after you are comfortable with the basics.",
      };
    });
}

function getConfidenceLevel(text: string, packId: string, matches: Record<string, KeywordMatch>) {
  const packScore = scorePack(packId, text, matches);
  if (packScore >= 8) return "high" as const;
  if (packScore >= 3) return "medium" as const;
  return "low" as const;
}

export function recommend(text: string): AnalysisResult {
  const matches = getKeywordMatches(text);
  const beginnerInput = isBeginner(text);
  const recommendedPackId = getPackId(text, matches);
  const preset = PRESET_PACKS.find((pack) => pack.id === recommendedPackId) ?? PRESET_PACKS[0];
  const presetIds = new Set(preset.pluginIds);
  const candidatePluginIds = getCandidatePluginIds(preset.pluginIds, matches, text);

  const rankedPlugins = candidatePluginIds
    .map((pluginId) => {
      const plugin = PLUGINS[pluginId];
      const matchScore = matches[pluginId]?.score ?? 0;
      const trustScore = getTrustScore(plugin, beginnerInput);
      const presetBonus = presetIds.has(pluginId) ? PRESET_BONUS : 0;
      const intentBoost = getIntentBoost(pluginId, text);
      return {
        plugin,
        score: trustScore + presetBonus + matchScore * MATCH_WEIGHT + intentBoost,
        matchScore,
        intentBoost,
        matchedKeywords: matches[pluginId]?.matched ?? [],
      };
    })
    .filter(({ plugin, matchScore, intentBoost }) => {
      if (
        beginnerInput &&
        (plugin.installMode === "manual-required" ||
          (plugin.difficulty === "advanced" &&
            plugin.verificationStatus === "unverified"))
      ) {
        return false;
      }

      if (presetIds.has(plugin.id)) return true;
      if (!passesIntentGate(plugin.id, text)) return false;
      return matchScore > 0 || intentBoost > 0;
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  const recommendations = rankedPlugins.map(({ plugin, matchedKeywords }, index) => ({
    pluginId: plugin.id,
    priority: index + 1,
    reason: REASONS[plugin.id] || plugin.desc,
    matchedKeywords,
  }));

  const selectedIds = recommendations.map((recommendation) => recommendation.pluginId);
  const confidenceLevel = getConfidenceLevel(text, recommendedPackId, matches);
  const preflightChecks = buildPreflightChecks(selectedIds);
  const setupWarnings = buildSetupWarnings(selectedIds);
  const notRecommended = buildNotRecommended(
    recommendedPackId,
    beginnerInput,
    matches
  );

  const summary =
    PACK_SUMMARIES[recommendedPackId]?.ko ??
    "현재 상황에 맞는 검증된 스타터 세트를 추천해요.";

  const warning =
    confidenceLevel === "low"
      ? "입력 내용이 아직 넓어요. 어떤 앱을 만들지, 프론트/백엔드/데이터 중 어디가 핵심인지 더 적어주면 추천 정확도가 올라가요."
      : setupWarnings.length > 0
        ? "일부 플러그인은 계정 연결이나 수동 설정이 필요해요. 체크리스트를 먼저 확인하고 진행하세요."
        : null;

  return {
    summary,
    recommendations,
    warning,
    inputText: text,
    recommendedPackId,
    confidenceLevel,
    preflightChecks,
    setupWarnings,
    notRecommended,
  };
}
