# Phase 8: Type System Foundation - Research

**Researched:** 2026-03-18
**Domain:** TypeScript type extension, Plugin data model, pseudo-plugin factory pattern
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- UI 표시명: "MCP" / "Plugin"
- 내부 값: `'mcp' | 'plugin'` (타입명 `ItemType` 또는 `PluginType`)
- CLI 용어와 일치: `claude mcp list` → mcp, `claude plugin list` → plugin
- install 명령어 기반 분류:
  - `claude mcp add` / `npx` / `uvx` = `'mcp'`
  - `claude plugin add` / `git clone ~/.claude/` = `'plugin'`
- Phase 8에서는 기존 42개 전부 `'mcp'` 유지 (재분류는 Phase 9)

### Claude's Discretion
- type 필드를 PluginOperationalFields에 추가할지 Plugin에 직접 추가할지
- pseudo-plugin factory 수정 방식 (type 필드 추가 vs factory 제거 후 실제 Plugin[] 전달)
- 타입 유니온 이름 (ItemType, PluginType 등)

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| TYPE-01 | Plugin 타입에 type 필드('mcp' \| 'plugin')가 추가되고, 기존 42개 항목은 자동으로 'mcp'로 분류된다 | DEFAULT_PLUGIN_FIELDS 패턴으로 자동 기본값 주입 가능; PluginOperationalFields에 추가하면 PluginSeed에서 제외되어 seed 데이터 변경 불필요 |
| TYPE-02 | parseMcpList의 pseudo-plugin factory가 실제 Plugin 타입과 일치하도록 수정된다 | parse-mcp-list.ts:93-117의 인라인 객체 생성에 type 필드 추가 필요; 테스트 mockPlugins도 동일하게 업데이트 필요 |
</phase_requirements>

## Summary

Phase 8은 TypeScript 타입 시스템에 `type` 필드를 추가하는 협소하고 명확한 변경이다. 변경 범위는 세 파일에 국한된다: `lib/types.ts` (Plugin 타입 정의), `lib/plugins.ts` (DEFAULT_PLUGIN_FIELDS 기본값), `lib/parse-mcp-list.ts` (pseudo-plugin factory). 기존 42개 Plugin seed 객체(CORE_PLUGINS)는 `PluginSeed = Omit<Plugin, keyof PluginOperationalFields>` 패턴 덕분에 **한 줄도 수정하지 않아도** type 기본값이 자동 주입된다.

핵심 설계 결정은 `type` 필드를 `PluginOperationalFields`에 추가하는 것이다. 이렇게 하면 PluginSeed에서 자동으로 제외되고, DEFAULT_PLUGIN_FIELDS의 `type: 'mcp'` 기본값이 spread 시 모든 42개 항목에 적용된다. PLUGIN_FIELD_OVERRIDES는 Phase 9에서 type 재분류에 재사용할 수 있다.

pseudo-plugin factory(`parseMcpList` 내부의 `pluginIds.map(...)`)는 현재 Plugin 타입의 모든 필드를 수동으로 나열하고 있어, type 필드가 추가되면 TypeScript 컴파일러가 오류를 발생시킨다. 따라서 TYPE-02는 해당 객체 리터럴에 `type: 'mcp' as const`를 추가하는 것으로 해결된다.

**Primary recommendation:** `type` 필드를 `PluginOperationalFields`에 추가하고, `DEFAULT_PLUGIN_FIELDS`에 `type: 'mcp'`를 기본값으로 설정한 뒤, pseudo-plugin factory와 테스트 mockPlugins에 동일한 필드를 추가한다.

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| TypeScript | ~5.x (프로젝트 기존) | 타입 유니온 정의 | 프로젝트 언어; 문자열 리터럴 유니온이 enum 대체 (CLAUDE.md 규칙) |
| Vitest | ~2.x (프로젝트 기존) | 타입 변경 후 회귀 검증 | 기존 104개 테스트 스위트; `pnpm test` = `vitest run` |

### No New Dependencies
이 단계에서 신규 패키지 설치 없음. 순수 TypeScript 타입 시스템 변경이다.

## Architecture Patterns

### Existing Pattern: PluginOperationalFields + DEFAULT_PLUGIN_FIELDS

프로젝트는 이미 운영 필드 분리 패턴을 확립했다:

```typescript
// lib/plugins.ts (현재 구조)
type PluginOperationalFields = Pick<Plugin,
  | "officialStatus"
  | "verificationStatus"
  | "difficulty"
  // ... 기타 운영 필드
>;

type PluginSeed = Omit<Plugin, keyof PluginOperationalFields>;
// → PluginSeed에는 운영 필드가 없음. seed 데이터는 핵심 필드만 포함.

const DEFAULT_PLUGIN_FIELDS: PluginOperationalFields = {
  officialStatus: "community",
  verificationStatus: "partial",
  // ... 기타 기본값
};

// 적용 방식 (buildPlugins 함수에서):
// { ...DEFAULT_PLUGIN_FIELDS, ...PLUGIN_FIELD_OVERRIDES[seed.id], ...seed }
```

type 필드는 이 패턴에 자연스럽게 맞는다:
1. `PluginOperationalFields`에 `type: ItemType` 추가
2. `DEFAULT_PLUGIN_FIELDS`에 `type: 'mcp'` 추가
3. 42개 PluginSeed 객체는 변경 불필요 (PluginSeed에서 제외됨)
4. Phase 9에서 `PLUGIN_FIELD_OVERRIDES`로 개별 재분류 가능

### Existing Pattern: String Literal Union (enum 금지)

CLAUDE.md 규칙: `enum` 사용 금지 → 문자열 리터럴 유니온 사용.

```typescript
// lib/types.ts 패턴 (현재)
export type OfficialStatus = "official" | "community" | "unknown";
export type VerificationStatus = "verified" | "partial" | "unverified";

// Phase 8에서 추가할 패턴 (동일 방식)
export type ItemType = "mcp" | "plugin";
// 또는 export type PluginType = "mcp" | "plugin";
```

### Pattern: Pseudo-Plugin Factory in parseMcpList

`parseMcpList`는 ID 목록에서 최소 Plugin 객체를 생성해 `resolvePluginId`에 전달한다. 현재 구조:

```typescript
// lib/parse-mcp-list.ts:93-117 (현재 - type 필드 없음)
const pseudoPlugins: Plugin[] = pluginIds.map((id) => ({
  id,
  name: id,
  tag: id,
  color: "",
  desc: "",
  // ... 모든 Plugin 필드를 수동 나열
  maintenanceStatus: "active" as const,
  bestFor: [],
  avoidFor: [],
  // type 필드 누락 → TypeScript 오류 발생 예정
}));
```

수정 방식: 객체 리터럴에 `type: 'mcp' as const` 추가. factory 자체는 유지한다. (resolvePluginId가 Plugin[]을 인자로 받는 API는 그대로 유지)

### Pattern: Test mockPlugins

`lib/__tests__/parse-mcp-list.test.ts`의 `mockPlugins` 배열도 Plugin 타입을 직접 구성한다. type 필드 추가 시 이 배열도 업데이트 필요:

```typescript
// lib/__tests__/parse-mcp-list.test.ts (현재 - type 필드 없음)
const mockPlugins: Plugin[] = [
  {
    id: "context7",
    // ... 모든 필드 나열
    avoidFor: [],
    // type 필드 누락 → TypeScript 오류 발생 예정
  },
  // ...4개 mock plugins
];
```

### Anti-Patterns to Avoid
- **Plugin 직접 추가:** `type` 필드를 `Plugin` 타입에 직접 추가하면서 `PluginOperationalFields`에 추가하지 않으면, 42개 seed 객체에 모두 `type: 'mcp'`를 수동 추가해야 한다. (Phase 9 재분류를 PLUGIN_FIELD_OVERRIDES로 할 수 없게 된다)
- **Optional 타입 사용:** `type?: ItemType`으로 optional로 정의하면 런타임 undefined 버그가 해결되지 않는다. 필드는 required여야 한다.
- **enum 사용:** CLAUDE.md 규칙 위반. `type ItemType = "mcp" | "plugin"` 사용.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| 기본값 주입 | 각 seed에 수동 type 추가 | DEFAULT_PLUGIN_FIELDS 패턴 | 기존 패턴 일관성; Phase 9 재분류 지원 |
| 타입 안전성 | 런타임 체크 | TypeScript required 필드 | 컴파일 타임에 모든 누락 감지 |
| 분류 override | 새 분류 시스템 구축 | PLUGIN_FIELD_OVERRIDES (기존) | Phase 9에서 재사용 예정 |

## Common Pitfalls

### Pitfall 1: PluginSeed 타입이 type 필드를 요구하게 됨
**What goes wrong:** `type`을 `Plugin`에 직접 추가하면 `PluginSeed = Omit<Plugin, keyof PluginOperationalFields>`에서 type이 제외되지 않아 42개 CORE_PLUGINS seed 객체에 오류 발생.
**Why it happens:** `PluginSeed`는 `PluginOperationalFields`에 있는 필드만 자동 제외.
**How to avoid:** type 필드를 반드시 `PluginOperationalFields`에 추가한다.
**Warning signs:** `pnpm typecheck`에서 CORE_PLUGINS 객체들에 대한 오류 발생.

### Pitfall 2: pseudo-plugin factory와 test mockPlugins 업데이트 누락
**What goes wrong:** `lib/types.ts`만 수정하면 `parse-mcp-list.ts` 내 factory 객체와 test 파일의 mockPlugins 배열이 타입 불일치.
**Why it happens:** 이 두 위치는 Plugin 타입을 직접 구성하므로 새 필드가 required이면 오류 발생.
**How to avoid:** 3개 파일 동시 수정: types.ts + plugins.ts + parse-mcp-list.ts. 4번째 파일: __tests__/parse-mcp-list.test.ts.
**Warning signs:** `pnpm typecheck` 오류, 또는 test 파일에서 타입 오류.

### Pitfall 3: `as const` 누락
**What goes wrong:** `type: 'mcp'` 없이 `type: 'mcp' as const`를 쓰지 않으면 타입 추론이 `string`으로 넓어질 수 있다.
**Why it happens:** TypeScript는 객체 리터럴에서 `'mcp'`를 `string`으로 추론할 수 있음.
**How to avoid:** `type: 'mcp' as const` 또는 명시적 타입 어노테이션.
**Warning signs:** `Type 'string' is not assignable to type 'ItemType'` 오류.

## Code Examples

### TYPE-01: lib/types.ts 변경

```typescript
// Source: 프로젝트 기존 패턴 (lib/types.ts)

// 새 타입 유니온 추가 (enum 금지 — CLAUDE.md)
export type ItemType = "mcp" | "plugin";

// Plugin 타입에 type 필드 추가
export type Plugin = {
  id: string;
  name: string;
  // ... 기존 필드 유지 ...
  type: ItemType;  // 추가 — required, not optional
};
```

### TYPE-01: lib/plugins.ts 변경

```typescript
// Source: 프로젝트 기존 패턴 (lib/plugins.ts)
import type { Plugin, ItemType } from "./types";

type PluginOperationalFields = Pick<Plugin,
  | "officialStatus"
  | "verificationStatus"
  | "difficulty"
  | "prerequisites"
  | "requiredSecrets"
  | "platformSupport"
  | "installMode"
  | "maintenanceStatus"
  | "bestFor"
  | "avoidFor"
  | "type"  // 추가
>;

// PluginSeed는 자동으로 type 필드 제외됨 — 42개 seed 변경 불필요
type PluginSeed = Omit<Plugin, keyof PluginOperationalFields>;

const DEFAULT_PLUGIN_FIELDS: PluginOperationalFields = {
  officialStatus: "community",
  verificationStatus: "partial",
  difficulty: "intermediate",
  prerequisites: [],
  requiredSecrets: [],
  platformSupport: ["windows", "mac", "linux"],
  installMode: "safe-copy",
  maintenanceStatus: "active",
  bestFor: [],
  avoidFor: [],
  type: "mcp",  // 추가 — Phase 8: 모든 항목 기본값
};
```

### TYPE-02: lib/parse-mcp-list.ts 변경

```typescript
// Source: lib/parse-mcp-list.ts:93-117 (현재 구조 기반)
const pseudoPlugins: Plugin[] = pluginIds.map((id) => ({
  id,
  name: id,
  tag: id,
  color: "",
  desc: "",
  longDesc: "",
  url: "",
  githubRepo: null,
  category: "workflow" as const,
  install: [],
  features: [],
  conflicts: [],
  keywords: [],
  officialStatus: "community" as const,
  verificationStatus: "unverified" as const,
  difficulty: "beginner" as const,
  prerequisites: [],
  requiredSecrets: [],
  platformSupport: [],
  installMode: "safe-copy" as const,
  maintenanceStatus: "active" as const,
  bestFor: [],
  avoidFor: [],
  type: "mcp" as const,  // 추가
}));
```

### Test mockPlugins 변경

```typescript
// Source: lib/__tests__/parse-mcp-list.test.ts (4개 mock 객체 모두 동일하게)
const mockPlugins: Plugin[] = [
  {
    id: "context7",
    // ... 기존 필드 유지 ...
    avoidFor: [],
    type: "mcp",  // 추가 (4개 객체 모두)
  },
  // ...
];
```

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest (vitest.config.ts 확인됨) |
| Config file | vitest.config.ts |
| Quick run command | `pnpm test -- lib/__tests__/parse-mcp-list.test.ts` |
| Full suite command | `pnpm test` |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| TYPE-01 | Plugin 타입에 type 필드 존재, 42개 항목에 undefined 없음 | unit (typecheck) | `pnpm typecheck` | ✅ (타입체크로 커버) |
| TYPE-01 | getPlugins() 반환값에 type: 'mcp' 존재 | unit | `pnpm test -- lib/__tests__/` (신규 테스트 Wave 0) | ❌ Wave 0 |
| TYPE-02 | parseMcpList pseudo-plugin factory가 Plugin 타입 만족 | unit (typecheck) | `pnpm typecheck` | ✅ (타입체크로 커버) |
| TYPE-02 | parseMcpList 기존 파싱 동작 회귀 없음 | unit | `pnpm test -- lib/__tests__/parse-mcp-list.test.ts` | ✅ |

### Sampling Rate
- **Per task commit:** `pnpm typecheck && pnpm test -- lib/__tests__/parse-mcp-list.test.ts`
- **Per wave merge:** `pnpm typecheck && pnpm test`
- **Phase gate:** `pnpm typecheck && pnpm test` 전체 통과 (104개 기존 + 신규)

### Wave 0 Gaps
- [ ] `lib/__tests__/plugins.test.ts` — TYPE-01: getPlugins() 반환값에 type 필드 존재 및 'mcp' 값 검증
  - 기존 plugins 테스트 파일 없음; 최소 2개 assertions 필요:
    1. `plugins[0].type` 이 `'mcp'` 또는 `'plugin'`
    2. `plugins.every(p => p.type !== undefined)` → true

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| type 필드 없음 (MCP만 존재) | type: 'mcp' \| 'plugin' required 필드 | Phase 8 (v1.2) | 런타임 undefined 제거; Phase 9-12 기반 제공 |

**현재 상태 (Phase 8 전):**
- Plugin 타입에 type 필드 없음 → 모든 항목이 암묵적으로 MCP
- pseudo-plugin factory가 Plugin 타입의 모든 필드를 수동 나열 (type 빠짐)
- parseMcpList는 `claude mcp list`와 `claude plugin list` 둘 다 파싱하지만 구분하지 않음

## Open Questions

1. **타입 유니온 이름: `ItemType` vs `PluginType`**
   - What we know: CONTEXT.md에서 둘 다 언급됨 (Claude's Discretion)
   - What's unclear: 향후 코드베이스에서 어떤 이름이 더 명확한가
   - Recommendation: `ItemType` 선호 — Plugin 타입 자체와 혼동되지 않음. "Plugin의 type 필드"를 `PluginType`으로 부르면 Plugin 타입 자체와 이름 충돌 가능성.

2. **buildPlugins 함수 존재 여부 확인**
   - What we know: CORE_PLUGINS seed가 Plugin[]으로 변환되는 로직이 plugins.ts에 있음
   - What's unclear: spread 적용 방식의 정확한 코드 (plugins.ts 후반부 미확인)
   - Recommendation: 플래너가 plugins.ts의 export 함수(getPlugins 등)를 확인하고 DEFAULT_PLUGIN_FIELDS spread 위치를 파악 후 진행. 패턴 자체는 명확히 파악됨.

## Sources

### Primary (HIGH confidence)
- `lib/types.ts` 직접 확인 — Plugin 타입, 기존 string literal union 패턴
- `lib/plugins.ts` 직접 확인 — PluginOperationalFields, DEFAULT_PLUGIN_FIELDS, PLUGIN_FIELD_OVERRIDES, PluginSeed 패턴; 42개 id 필드 확인
- `lib/parse-mcp-list.ts` 직접 확인 — pseudo-plugin factory (line 93-117)
- `lib/__tests__/parse-mcp-list.test.ts` 직접 확인 — mockPlugins 구조, 기존 테스트 커버리지
- `vitest.config.ts` 직접 확인 — 테스트 프레임워크 설정
- `CLAUDE.md` 직접 확인 — enum 금지, type 선호, pnpm 사용 등 코딩 컨벤션

### Secondary (MEDIUM confidence)
- `.planning/phases/08-type-system-foundation/08-CONTEXT.md` — 사용자 결정 및 설계 지침
- `.planning/REQUIREMENTS.md` — TYPE-01, TYPE-02 요구사항

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — 신규 의존성 없음; 기존 TypeScript 패턴 확인됨
- Architecture: HIGH — PluginOperationalFields 패턴 직접 확인; DEFAULT_PLUGIN_FIELDS 구조 명확
- Pitfalls: HIGH — 코드 직접 분석 기반; 타입 시스템 동작 확정적
- Test coverage gaps: HIGH — 기존 테스트 파일 구조 직접 확인

**Research date:** 2026-03-18
**Valid until:** 2026-04-18 (안정적 도메인 — 30일)
