import type { ConflictWarning } from "./types";

export type ConflictPair = {
  ids: [string, string];
  msg: string;
};

export type RedundancyGroup = {
  ids: string[];
  msg: string;
  msgEn: string;
};

export const CONFLICT_PAIRS: ConflictPair[] = [
  {
    ids: ["omc", "superpowers"],
    msg: "OMC와 Superpowers는 기능이 크게 겹쳐요. 둘 다 설치하면 명령어 충돌이 발생할 수 있어요.",
  },
  {
    ids: ["playwright", "puppeteer"],
    msg: "Playwright와 Puppeteer는 동일한 브라우저 자동화 도구예요. 하나만 사용하는 것을 권장해요.",
  },
  {
    ids: ["brave-search", "tavily"],
    msg: "Brave Search와 Tavily는 둘 다 웹 검색 MCP예요. 하나만 설치해도 충분해요.",
  },
];

export const REDUNDANCY_GROUPS: RedundancyGroup[] = [
  {
    ids: ["brave-search", "exa", "tavily", "perplexity"],
    msg: "여러 검색 플러그인이 추천됐어요. 하나만 골라도 충분해요.",
    msgEn: "Multiple search plugins recommended. One is usually enough.",
  },
  {
    ids: ["taskmaster", "todoist", "linear"],
    msg: "태스크 관리 도구가 여러 개 추천됐어요. 프로젝트 규모에 맞는 하나를 선택하세요.",
    msgEn: "Multiple task management tools recommended. Pick one that fits your project size.",
  },
  {
    ids: ["bkit", "bkit-starter"],
    msg: "bkit과 bkit Starter는 같은 플러그인이에요. 초보자는 bkit Starter, 숙련자는 bkit을 선택하세요.",
    msgEn: "bkit and bkit Starter are the same plugin. Choose Starter for beginners, bkit for advanced users.",
  },
];

export function getConflicts(selectedIds: string[]): ConflictWarning[] {
  const warnings: ConflictWarning[] = [];
  for (const pair of CONFLICT_PAIRS) {
    const [a, b] = pair.ids;
    if (selectedIds.includes(a) && selectedIds.includes(b)) {
      warnings.push({ ids: [a, b], msg: pair.msg });
    }
  }
  return warnings;
}

export function getRedundancies(selectedIds: string[]): RedundancyGroup[] {
  return REDUNDANCY_GROUPS.filter(
    (group) => group.ids.filter((id) => selectedIds.includes(id)).length >= 2
  );
}
