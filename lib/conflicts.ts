import type { ConflictWarning } from "./types";

const CONFLICT_REASONS: Record<string, string> = {
  "omc-superpowers":
    "OMC와 Superpowers는 기능이 크게 겹쳐요. 둘 다 설치하면 명령어 충돌이 발생할 수 있어요.",
  "superpowers-omc":
    "OMC와 Superpowers는 기능이 크게 겹쳐요. 둘 다 설치하면 명령어 충돌이 발생할 수 있어요.",
};

export function getConflicts(selectedIds: string[]): ConflictWarning[] {
  const warnings: ConflictWarning[] = [];
  selectedIds.forEach((a) => {
    selectedIds.forEach((b) => {
      if (a >= b) return;
      const key = `${a}-${b}`;
      if (CONFLICT_REASONS[key]) {
        warnings.push({ ids: [a, b], msg: CONFLICT_REASONS[key] });
      }
    });
  });
  return warnings;
}
