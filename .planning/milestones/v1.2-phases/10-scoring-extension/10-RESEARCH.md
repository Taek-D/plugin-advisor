# Phase 10: Scoring Extension - Research

**Researched:** 2026-03-18
**Domain:** TypeScript pure-function extension — scoring.ts typeScope parameter
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

- typeScope 파라미터 타입: `ItemType | 'both'` ('mcp' | 'plugin' | 'both')
- 기본값: `'both'` — 하위 호환성 유지, 기존 코드가 typeScope 없이 호출해도 동일 동작
- ScoringResult에 typeScope 필드 추가하여 반환
- 타입 감지 로직은 scorePlugins 외부(호출자 = 옵티마이저/recommend.ts)에서 처리
- 호출자가 입력 ID들의 type을 확인하여 MCP만이면 'mcp', Plugin만이면 'plugin', 섞여있으면 'both'로 typeScope 결정 후 전달
- scorePlugins는 순수 스코어링만 담당, 타입 감지 책임 없음
- buildCoverage는 전체 10개 카테고리 대비 커버리지 유지 (변경 없음)
- calculateScore도 기존과 동일 (변경 없음)
- buildComplements만 typeScope에 맞는 항목으로 필터링
- buildReplacements도 typeScope에 맞는 항목으로 필터링
- ScoringResult에 typeScope 필드 포함하여 반환
- UI 라벨 생성 책임은 UI 컴포넌트 (scoring.ts는 데이터만 반환)

### Claude's Discretion

- buildComplements/buildReplacements 내부의 필터링 구현 방식 (early filter vs late filter)
- 타입 감지 유틸리티 함수의 위치와 이름
- 테스트 구조 (기존 scoring.test.ts 확장 vs 신규 파일)

### Deferred Ideas (OUT OF SCOPE)

None — discussion stayed within phase scope. SCORE-04 (크로스 타입 충돌 감지)는 Future Requirements로 이미 정의됨.
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| SCORE-01 | scorePlugins에 typeScope 파라미터가 추가되어 MCP/Plugin별 보완 추천이 분리된다 | scoring.ts:189 시그니처 변경, ScoringResult 타입 확장으로 구현 가능 |
| SCORE-02 | 보완 추천에서 MCP 분석 시 Plugin 타입이 추천되지 않고, Plugin 분석 시 MCP 타입이 추천되지 않는다 | buildComplements/buildReplacements에 plugin.type 기반 필터링 추가 |
| SCORE-03 | 커버리지 분석이 typeScope 내에서만 계산된다 | buildCoverage는 전체 기준 유지, complements/replacements만 필터링 (CONTEXT.md 결정) |
</phase_requirements>

---

## Summary

Phase 10은 `lib/scoring.ts`의 `scorePlugins` 함수에 `typeScope: ItemType | 'both'` 파라미터를 추가하는 단일-파일 변경이다. Phase 9에서 13개 Plugin 항목(type: 'plugin')이 DB에 추가되었으므로, 이제 `buildComplements`와 `buildReplacements`가 MCP 전용 입력에도 Plugin 항목을 보완으로 추천하게 된다는 문제가 생겼다. 이 phase는 그 문제를 해결한다.

변경 범위는 좁다. `scorePlugins` 시그니처 + `ScoringResult` 타입 + `buildComplements` 내 1-line 필터 + `buildReplacements` 내 1-line 필터 + 호출자(OptimizerApp.tsx)의 typeScope 결정 로직. `buildCoverage`와 `calculateScore`는 손대지 않는다. 기본값 `'both'`로 기존 호출 코드(recommend.ts 등)는 변경 없이 동작이 유지된다.

**Primary recommendation:** `buildComplements`와 `buildReplacements`에서 candidates 필터링 시 `plugin.type`을 typeScope과 대조하는 single-line guard를 삽입한다. typeScope='both'이면 필터 없음. 호출자(OptimizerApp)에서 `selectedPlugins`의 type 분포를 확인하여 typeScope을 결정한 뒤 scorePlugins에 전달한다.

---

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| TypeScript (기존) | 프로젝트 기준 | 타입 시스템 | 이미 사용 중 |
| Vitest (기존) | 프로젝트 기준 | 단위 테스트 | 이미 구성됨 (vitest.config.ts, node env) |

신규 의존성 없음. 이 phase는 기존 코드 내부 변경만 포함한다.

### Supporting

없음. `ItemType` ('mcp' | 'plugin')은 이미 `lib/types.ts:19`에 정의되어 있어 import만 하면 된다.

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| early filter (candidates 생성 시) | late filter (결과 배열 생성 후 filter) | early filter가 루프 순회 횟수를 줄임, 코드 가독성 동일 — early 권장 |
| 기존 scoring.test.ts 확장 | 신규 파일 | 기존 파일 확장이 일관성 유지에 유리, 파일 수 최소화 |

---

## Architecture Patterns

### 영향받는 파일 구조

```
lib/
├── types.ts           # ItemType 타입 정의 (변경 없음)
├── scoring.ts         # scorePlugins 시그니처 + ScoringResult + buildComplements + buildReplacements 변경
├── plugins.ts         # PLUGINS 데이터 (변경 없음) — type 필드로 필터링
└── __tests__/
    └── scoring.test.ts  # typeScope 회귀 테스트 추가

components/
└── OptimizerApp.tsx   # handleAnalyze 내 typeScope 결정 로직 추가
```

### Pattern 1: Optional Parameter with Default (하위 호환)

**What:** 기존 함수 시그니처에 선택적 파라미터를 기본값과 함께 추가
**When to use:** 기존 호출자(recommend.ts, 테스트 등)를 수정하지 않고 새 동작 추가
**Example:**

```typescript
// scoring.ts — SCORE-01
export function scorePlugins(
  ids: string[],
  typeScope: ItemType | 'both' = 'both'
): ScoringResult {
  // ...
}
```

기본값 `'both'`로 기존 `scorePlugins(ids)` 호출은 동일 동작 유지.

### Pattern 2: Type-Based Candidate Filter (Early Filter)

**What:** buildComplements/buildReplacements의 candidates 조회 시 typeScope 조건을 즉시 추가
**When to use:** SCORE-02 구현 — MCP 모드에서 Plugin 타입 항목 제외
**Example:**

```typescript
// buildComplements 내부 — Early filter 방식
const candidates = Object.values(PLUGINS).filter(
  (plugin) =>
    plugin.category === category &&
    !installedSet.has(plugin.id) &&
    (typeScope === 'both' || plugin.type === typeScope)  // 추가된 1줄
);
```

```typescript
// buildReplacements 내부 — alternatives 조회 시 동일 패턴
const alternatives = Object.values(PLUGINS).filter(
  (p) =>
    p.id !== id &&
    p.category === plugin.category &&
    p.verificationStatus === "verified" &&
    p.maintenanceStatus !== "stale" &&
    (typeScope === 'both' || p.type === typeScope)  // 추가된 1줄
);
```

### Pattern 3: ScoringResult 타입 확장

**What:** 기존 타입에 필드 추가
**Example:**

```typescript
export type ScoringResult = {
  empty: boolean;
  score: number | null;
  conflicts: ConflictWarning[];
  redundancies: RedundancyGroup[];
  coverage: CoverageResult;
  complements: ComplementSuggestion[];
  replacements: ReplacementSuggestion[];
  typeScope: ItemType | 'both';  // 추가
};
```

empty return 분기도 `typeScope` 필드 포함해야 한다:

```typescript
// empty return 분기
return {
  empty: true,
  score: null,
  conflicts: [],
  redundancies: [],
  coverage: { covered: [], uncovered: [...ALL_CATEGORIES] },
  complements: [],
  replacements: [],
  typeScope,  // 추가
};
```

### Pattern 4: 호출자(OptimizerApp)의 typeScope 결정

**What:** selectedPlugins 배열의 type 분포를 확인하여 typeScope 파생
**Location:** `OptimizerApp.tsx handleAnalyze` 콜백
**Example:**

```typescript
const handleAnalyze = useCallback(() => {
  if (!hasPlugins) return;
  setAnalysisState("analyzing");
  setTimeout(() => {
    const types = new Set(selectedPlugins.map((p) => p.type));
    const typeScope: ItemType | 'both' =
      types.size === 1
        ? (types.values().next().value as ItemType)
        : 'both';
    const scored = scorePlugins(selectedIds, typeScope);
    setResult(scored);
    setAnalysisState("done");
  }, 0);
}, [selectedPlugins]);
```

### Anti-Patterns to Avoid

- **buildCoverage 수정:** CONTEXT.md 결정 — 전체 10개 카테고리 대비 커버리지는 그대로 유지. buildCoverage에 typeScope 필터를 추가하면 SCORE-04 범위를 침범하고 점수 계산이 깨진다.
- **scorePlugins 내부에서 타입 감지:** CONTEXT.md 결정 — scorePlugins는 순수 스코어링만, 타입 감지는 호출자 책임.
- **calculateScore 변경:** 점수 공식은 기존과 동일. 변경하면 기존 MCP 전용 사용자 점수가 바뀌어 SCORE-01 요구사항(회귀 방지)을 위반.
- **import 순환:** `scoring.ts`는 이미 `types.ts`에서 import 중. `ItemType`을 추가 import할 때 순환이 생기지 않도록 확인 (현재 `import type { PluginCategory, Plugin } from "./types"` — `ItemType` 추가만 하면 됨).

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| 타입 필터링 | 별도 유틸 함수 | `plugin.type === typeScope` 인라인 조건 | 로직이 1줄이므로 추상화 불필요 |
| typeScope 결정 로직 | 별도 라이브러리 | `Set(plugins.map(p => p.type)).size === 1` 패턴 | Set 크기로 단일/혼합 판별 충분 |

**Key insight:** 이 phase의 모든 로직은 1-3줄 수준의 조건 추가다. 과도한 추상화가 오히려 가독성을 해친다.

---

## Common Pitfalls

### Pitfall 1: empty return 분기에 typeScope 누락

**What goes wrong:** `scorePlugins`의 early return(`ids.length === 0`)에 `typeScope` 필드를 추가하지 않으면 TypeScript 컴파일 에러 발생
**Why it happens:** `ScoringResult` 타입에 새 필드가 추가되면 모든 return 분기에서 해당 필드가 있어야 함
**How to avoid:** ScoringResult 타입 변경 직후 `pnpm typecheck`로 확인
**Warning signs:** `Property 'typeScope' is missing in type...` 타입 에러

### Pitfall 2: buildReplacements의 typeScope 파라미터 전달 누락

**What goes wrong:** `buildComplements`에만 typeScope 필터를 추가하고 `buildReplacements`를 빠뜨리면 SCORE-02 요구사항 불완전
**Why it happens:** 두 함수가 독립적으로 PLUGINS를 순회하므로 각각에 필터링 필요
**How to avoid:** CONTEXT.md의 "buildComplements만... buildReplacements도..." 구분을 모두 처리
**Warning signs:** Plugin 모드에서 replacements에 MCP 타입이 여전히 포함됨

### Pitfall 3: 기존 테스트 scorePlugins 호출 시그니처 불일치

**What goes wrong:** 기존 `scoring.test.ts`의 `scorePlugins([...])` 호출에 typeScope이 없어도 기본값 `'both'`로 처리되므로 문제없음 — 다만 typeScope 관련 새 테스트가 `ScoringResult.typeScope` 필드를 검증해야 SCORE-01 요구사항 만족
**Why it happens:** 기존 테스트가 새 필드를 검증하지 않으면 CI는 통과하지만 요구사항이 미검증 상태로 남음
**How to avoid:** 새 describe 블록에서 typeScope 파라미터별 동작을 명시적으로 검증

### Pitfall 4: 호출자가 plugin.type을 읽지 못하는 경우

**What goes wrong:** OptimizerApp의 `selectedPlugins`는 `PLUGINS[id]`에서 가져온 `Plugin` 객체이므로 `.type` 필드가 있음 — 단, Phase 9에서 PLUGIN_FIELD_OVERRIDES로 설정된 type 값이 실제 PLUGINS 객체에 병합되었는지 확인 필요
**Why it happens:** plugins.ts의 DEFAULT_PLUGIN_FIELDS에 `type: 'mcp'`가 기본값으로 설정되어 있고, PLUGIN_FIELD_OVERRIDES에서 plugin 항목들이 `type: 'plugin'`으로 override됨 — 이 병합이 빌드 시 정확히 적용되어 있어야 함
**How to avoid:** `pnpm typecheck && pnpm build` 후 실제 PLUGINS 객체에서 plugin 타입 항목 확인

---

## Code Examples

### 완성된 scorePlugins 시그니처 (SCORE-01)

```typescript
// lib/scoring.ts
import type { PluginCategory, Plugin, ItemType } from "./types";  // ItemType 추가

export type ScoringResult = {
  empty: boolean;
  score: number | null;
  conflicts: ConflictWarning[];
  redundancies: RedundancyGroup[];
  coverage: CoverageResult;
  complements: ComplementSuggestion[];
  replacements: ReplacementSuggestion[];
  typeScope: ItemType | 'both';  // 추가
};

export function scorePlugins(
  ids: string[],
  typeScope: ItemType | 'both' = 'both'
): ScoringResult {
  if (ids.length === 0) {
    return {
      empty: true,
      score: null,
      conflicts: [],
      redundancies: [],
      coverage: { covered: [], uncovered: [...ALL_CATEGORIES] },
      complements: [],
      replacements: [],
      typeScope,  // 추가
    };
  }
  // ...
  return {
    empty: false,
    score,
    conflicts,
    redundancies,
    coverage,
    complements,
    replacements,
    typeScope,  // 추가
  };
}
```

### buildComplements 필터링 (SCORE-02)

```typescript
// scoring.ts:buildComplements — typeScope 파라미터 추가
function buildComplements(
  uncovered: PluginCategory[],
  installedIds: string[],
  typeScope: ItemType | 'both'  // 추가
): ComplementSuggestion[] {
  const installedSet = new Set(installedIds);
  const complements: ComplementSuggestion[] = [];

  for (const category of uncovered) {
    const candidates = Object.values(PLUGINS).filter(
      (plugin) =>
        plugin.category === category &&
        !installedSet.has(plugin.id) &&
        (typeScope === 'both' || plugin.type === typeScope)  // 추가
    );
    // ... 나머지 동일
  }
  return complements;
}
```

### buildReplacements 필터링 (SCORE-02)

```typescript
// scoring.ts:buildReplacements — typeScope 파라미터 추가
function buildReplacements(
  ids: string[],
  typeScope: ItemType | 'both'  // 추가
): ReplacementSuggestion[] {
  // ...
  const alternatives = Object.values(PLUGINS).filter(
    (p) =>
      p.id !== id &&
      p.category === plugin.category &&
      p.verificationStatus === "verified" &&
      p.maintenanceStatus !== "stale" &&
      (typeScope === 'both' || p.type === typeScope)  // 추가
  );
  // ...
}
```

### 테스트 패턴 (SCORE-01, SCORE-02, SCORE-03)

```typescript
// lib/__tests__/scoring.test.ts — 기존 파일에 새 describe 블록 추가
describe("typeScope filtering — SCORE-01/02/03", () => {
  it("returns typeScope in result when specified", () => {
    const result = scorePlugins(["context7"], "mcp");
    expect(result.typeScope).toBe("mcp");
  });

  it("defaults typeScope to 'both' when not specified", () => {
    const result = scorePlugins(["context7"]);
    expect(result.typeScope).toBe("both");
  });

  it("mcp typeScope: complements contain only mcp-type plugins", () => {
    const result = scorePlugins(["context7"], "mcp");
    for (const c of result.complements) {
      expect(PLUGINS[c.pluginId]?.type).toBe("mcp");
    }
  });

  it("plugin typeScope: complements contain only plugin-type plugins", () => {
    // omc, bkit 등 plugin 타입으로 입력
    const result = scorePlugins(["omc"], "plugin");
    for (const c of result.complements) {
      expect(PLUGINS[c.pluginId]?.type).toBe("plugin");
    }
  });

  it("both typeScope: complements can include any type", () => {
    const result = scorePlugins(["context7"], "both");
    // 타입 제한 없음 — 기존 동작
    expect(result.complements.length).toBeGreaterThanOrEqual(0);
  });

  it("mcp typeScope: score unchanged from pre-Phase-9 baseline", () => {
    // MCP 전용 입력의 점수가 typeScope 'mcp'일 때와 'both'일 때 동일
    const withMcp = scorePlugins(["context7"], "mcp");
    const withBoth = scorePlugins(["context7"], "both");
    expect(withMcp.score).toBe(withBoth.score);
  });
});
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| scorePlugins(ids) — type 구분 없음 | scorePlugins(ids, typeScope) — MCP/Plugin 분리 | Phase 10 | MCP 전용 분석에 Plugin 보완 추천 안 나옴 |
| PLUGINS: MCP 전용 42개 | PLUGINS: MCP 42개 + Plugin 13개 | Phase 9 | typeScope 없으면 크로스 타입 노이즈 발생 |
| ItemType 없음 | ItemType = 'mcp' \| 'plugin' | Phase 8 | Plugin.type 필드로 필터링 가능 |

---

## Open Questions

1. **SCORE-03 해석: "커버리지 분석이 typeScope 내에서만 계산"**
   - What we know: CONTEXT.md에서 buildCoverage는 전체 10개 카테고리 기준 유지로 명확히 결정됨
   - What's unclear: REQUIREMENTS.md SCORE-03 문구("커버리지 분석이 typeScope 내에서만 계산")가 buildCoverage 변경을 암시하는 것처럼 보임
   - Recommendation: CONTEXT.md 결정을 우선 적용 — buildCoverage 변경 없음, complements/replacements 필터링만으로 SCORE-03 구현. 이미 논의에서 확정된 사항.

2. **혼합 입력(both) 시 UI 라벨**
   - What we know: ScoringResult.typeScope을 반환하여 UI에서 라벨 생성
   - What's unclear: 'both' 케이스의 한국어 라벨("조합 점수" vs "MCP + Plugin 점수")이 STATE.md에 블로커로 기록됨
   - Recommendation: Phase 10에서 typeScope 데이터만 반환하고, 라벨 문구는 동작 프로토타입 확인 후 결정 (Phase 12 i18n에서 정식화)

---

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Vitest (vitest.config.ts 존재) |
| Config file | `vitest.config.ts` (root) |
| Quick run command | `pnpm test -- lib/__tests__/scoring.test.ts` |
| Full suite command | `pnpm test` |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| SCORE-01 | scorePlugins 반환값에 typeScope 필드 포함 | unit | `pnpm test -- lib/__tests__/scoring.test.ts` | ✅ (확장 필요) |
| SCORE-02 | mcp typeScope → complements에 plugin 타입 없음, plugin typeScope → complements에 mcp 타입 없음 | unit | `pnpm test -- lib/__tests__/scoring.test.ts` | ✅ (확장 필요) |
| SCORE-03 | typeScope 변경이 score(calculateScore 결과)에 영향 없음 | unit | `pnpm test -- lib/__tests__/scoring.test.ts` | ✅ (확장 필요) |

### Sampling Rate

- **Per task commit:** `pnpm test -- lib/__tests__/scoring.test.ts`
- **Per wave merge:** `pnpm test`
- **Phase gate:** `pnpm typecheck && pnpm lint && pnpm test` 모두 통과 후 `/gsd:verify-work`

### Wave 0 Gaps

None — 기존 `lib/__tests__/scoring.test.ts`와 vitest 설정이 모두 존재. 기존 파일에 새 describe 블록을 추가하는 방식으로 진행.

---

## Sources

### Primary (HIGH confidence)

- `lib/scoring.ts` — 직접 읽음, 현재 구현 확인
- `lib/types.ts` — `ItemType`, `Plugin.type` 필드 확인
- `lib/plugins.ts` — DEFAULT_PLUGIN_FIELDS, PLUGIN_FIELD_OVERRIDES 구조 확인
- `lib/__tests__/scoring.test.ts` — 기존 테스트 커버리지 확인
- `components/OptimizerApp.tsx` — scorePlugins 유일 호출자 확인
- `.planning/phases/10-scoring-extension/10-CONTEXT.md` — 확정된 구현 결정 확인
- `vitest.config.ts` — 테스트 환경 확인

### Secondary (MEDIUM confidence)

- `.planning/STATE.md` — Phase 9 완료 상태, 블로커 항목 확인
- `.planning/REQUIREMENTS.md` — SCORE-01/02/03 요구사항 원문 확인

### Tertiary (LOW confidence)

없음.

---

## Metadata

**Confidence breakdown:**

- Standard stack: HIGH — 신규 의존성 없음, 기존 파일만 변경
- Architecture: HIGH — 코드를 직접 읽어 변경 위치와 패턴 확인
- Pitfalls: HIGH — TypeScript 타입 시스템 동작 기반, 기존 코드 패턴에서 도출

**Research date:** 2026-03-18
**Valid until:** 안정적 코드베이스 (30일 이상)
