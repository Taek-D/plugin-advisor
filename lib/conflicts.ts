import type { ConflictWarning } from "./types";

export type ConflictPair = {
  ids: [string, string];
  msg: string;
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
