# Phase 9: Plugin DB Population - Research

**Researched:** 2026-03-18
**Domain:** Static data population — Claude Code Plugin type classification, metadata extraction, i18n translation
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **Plugin 선정 방식**: 기존 재분류 + 신규 추가 병행
- **재분류 방법**: 기존 42개 중 install 명령어가 `claude plugin add` / `git clone ~/.claude/` 패턴인 항목은 PLUGIN_FIELD_OVERRIDES에 `type: 'plugin'` override 추가
- **분류 규칙**: 공식 install 명령어(README 권장 방법) 기준. `claude mcp add` / `npx` / `uvx` = 'mcp', `claude plugin add` / `git clone ~/.claude/` = 'plugin'
- **두 가지 설치 방법**: 공식 권장 방법만 install 필드에 등록, 분류도 그 기준
- **비활성/미검증 항목**: DB 등록하되 `maintenanceStatus: 'unmaintained'` 또는 `verificationStatus: 'unverified'`로 표시
- **메타데이터 검증 수준**: GitHub README 기반 (실제 CLI 테스트는 Out of Scope)
- **Category**: 기존 10개 카테고리 유지 (orchestration, workflow, code-quality, testing, documentation, data, security, integration, ui-ux, devops) — 신규 카테고리 추가 없음
- **Keywords**: 기능 키워드 + 사용자가 검색할 법한 시나리오 용어 조합, 기존 MCP 항목들의 keywords 패턴 따름

### Claude's Discretion
- 신규 Plugin 최종 목록 (리서치 결과에 따라)
- 각 항목의 difficulty, bestFor, avoidFor 세부 내용
- keywords 구체적 선정

### Deferred Ideas (OUT OF SCOPE)
- None — discussion stayed within phase scope
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| DATA-01 | 주요 Plugin 10-15개가 DB에 추가되고, type: 'plugin'으로 분류된다 | 기존 42개 항목 중 plugin install 패턴 항목 식별 완료 (13개). 신규 추가 후 합산 10-15개 범위 충족 |
| DATA-02 | 각 Plugin 항목의 install 명령어, category, keywords, features가 검증된 상태로 등록된다 | 각 항목 install[] 필드 분석 완료. README 기반 검증 대상 목록 확정 |
| DATA-03 | Plugin 항목의 한/영 번역이 동기화된다 | plugins-en.ts 현황 파악. 기존 7개 번역 존재, 신규 항목 영문 추가 필요 |
| I18N-02 | 신규 Plugin 10-15개의 desc/longDesc 영문 번역이 등록된다 | plugins-en.ts 패턴 확립됨. desc + longDesc 영문 추가 방식 확인 |
</phase_requirements>

---

## Summary

Phase 9는 코드 작성이 아닌 **데이터 등록 및 재분류 작업**이다. 핵심 작업은 두 가지다: (1) 기존 42개 항목 중 install 명령어 패턴이 `claude plugin add` / `git clone ~/.claude/` 인 항목에 `type: 'plugin'` override 추가, (2) 신규 Plugin 항목 PluginSeed 작성 + PLUGIN_FIELD_OVERRIDES 등록 + plugins-en.ts 영문 번역 추가.

코드베이스 분석 결과, 기존 42개 항목 중 **최소 13개**가 install 명령어 패턴상 Plugin으로 분류되어야 한다. 이 중 대부분은 이미 `/plugin marketplace add` 또는 `/plugin install` 패턴을 install[] 필드에 갖고 있어 재분류가 자명하다. STATE.md에서 borderline으로 언급된 taskmaster/gsd는 `npx` + `claude mcp add` 패턴이므로 MCP로 유지한다.

**Primary recommendation:** 기존 항목 재분류(PLUGIN_FIELD_OVERRIDES에 `type: 'plugin'` 추가)를 먼저 완료하고, 재분류 후 총 count가 10개 미만이면 신규 Plugin을 소수 추가한다. plugins-en.ts에 누락된 번역을 추가하여 I18N-02도 함께 충족한다.

---

## Standard Stack

### Core Files (변경 대상)

| File | Role | Change Type |
|------|------|-------------|
| `lib/plugins.ts` | PLUGIN_FIELD_OVERRIDES에 `type: 'plugin'` 추가; CORE_PLUGINS에 신규 PluginSeed 추가 | Override 추가 + 신규 항목 추가 |
| `lib/i18n/plugins-en.ts` | `pluginDescEn`에 신규 Plugin 영문 번역 추가 | 번역 항목 추가 |

### Type System (Phase 8 확정, 변경 없음)

```typescript
// lib/types.ts
export type ItemType = "mcp" | "plugin";

// lib/plugins.ts
const DEFAULT_PLUGIN_FIELDS: PluginOperationalFields = {
  type: "mcp",  // 기본값 — 신규 Plugin은 PLUGIN_FIELD_OVERRIDES에 type: 'plugin' 명시 필수
  ...
};
```

### Data Structures

```typescript
// PluginSeed — CORE_PLUGINS에 추가할 때 사용 (운영 필드 제외)
type PluginSeed = Omit<Plugin, keyof PluginOperationalFields>;
// 필수 필드: id, name, tag, color, desc, longDesc, url, githubRepo,
//            category, install, features, conflicts, keywords

// PluginOperationalFields — PLUGIN_FIELD_OVERRIDES에 추가
type PluginOperationalFields = Pick<Plugin,
  'officialStatus' | 'verificationStatus' | 'difficulty' | 'prerequisites'
  | 'requiredSecrets' | 'platformSupport' | 'installMode' | 'maintenanceStatus'
  | 'bestFor' | 'avoidFor' | 'type'
>;
```

---

## Architecture Patterns

### Pattern 1: 기존 항목 재분류 (type override)

기존 CORE_PLUGINS 항목의 install 명령어가 Plugin 패턴이면 PLUGIN_FIELD_OVERRIDES에 `type: 'plugin'`만 추가하면 된다.

```typescript
// lib/plugins.ts — PLUGIN_FIELD_OVERRIDES에 추가
const PLUGIN_FIELD_OVERRIDES = {
  // 기존 항목...
  omc: {
    difficulty: "advanced",
    verificationStatus: "verified",
    // ... 기존 필드
    type: "plugin" as const,  // Phase 9: 재분류
  },
  superpowers: {
    verificationStatus: "verified",
    difficulty: "beginner",
    // ... 기존 필드
    type: "plugin" as const,  // Phase 9: 재분류
  },
};
```

### Pattern 2: 신규 Plugin 추가

신규 항목은 CORE_PLUGINS에 PluginSeed 추가 + PLUGIN_FIELD_OVERRIDES에 운영 필드 + type 추가.

```typescript
// CORE_PLUGINS에 추가 (한국어 desc/longDesc)
"new-plugin": {
  id: "new-plugin",
  name: "New Plugin",
  tag: "NP",
  color: "#XXXXXX",
  category: "workflow",           // 기존 10개 카테고리 중 하나
  githubRepo: "owner/repo",
  desc: "한국어 한 줄 설명.",
  longDesc: "한국어 상세 설명...",
  url: "https://github.com/owner/repo",
  install: [
    "claude plugin add new-plugin",  // Plugin 패턴
  ],
  features: ["기능1", "기능2", "기능3"],
  conflicts: [],
  keywords: ["keyword1", "keyword2", ...],
},

// PLUGIN_FIELD_OVERRIDES에 추가
"new-plugin": {
  type: "plugin" as const,
  verificationStatus: "verified",   // README 확인 시
  difficulty: "intermediate",
  bestFor: ["사용 사례1", "사용 사례2"],
  avoidFor: ["비추천 사례"],
},
```

### Pattern 3: 영문 번역 추가

```typescript
// lib/i18n/plugins-en.ts — pluginDescEn에 추가
export const pluginDescEn: Record<string, { desc: string; longDesc: string }> = {
  // 기존 항목들...
  "new-plugin": {
    desc: "English one-line description.",
    longDesc: "English detailed description...",
  },
};
```

### Recommended Project Structure (변경 없음)

```
lib/
├── plugins.ts              # CORE_PLUGINS + PLUGIN_FIELD_OVERRIDES 수정
├── i18n/
│   └── plugins-en.ts       # 영문 번역 추가
└── types.ts                # 변경 없음 (Phase 8에서 확정)
```

### Anti-Patterns to Avoid

- **`PluginCategory`에 'plugin'/'mcp' 추가 금지**: category는 기능 분류용. type과 별개.
- **DEFAULT_PLUGIN_FIELDS 수정 금지**: type 기본값은 'mcp'로 유지. Plugin 항목은 반드시 PLUGIN_FIELD_OVERRIDES에 명시.
- **install[] 필드에 두 가지 패턴 혼용 금지**: 공식 권장 방법 하나만 등록.
- **plugins.ts의 PluginSeed에 type 필드 직접 추가 금지**: type은 PluginOperationalFields에 속함 → PLUGIN_FIELD_OVERRIDES에서 관리.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| type merge 로직 | 별도 merge 유틸리티 | 기존 Object.fromEntries 패턴 | Phase 8에서 이미 구현됨. DEFAULT + OVERRIDES + SEED 순서로 spread |
| 번역 동기화 검사 | 런타임 검증 코드 | pnpm typecheck + 기존 plugins.test.ts | TypeScript 타입과 기존 테스트가 이미 커버 |

**Key insight:** 이 Phase는 새 코드를 작성하는 게 아니라 기존 데이터 패턴을 반복하는 작업이다. 새로운 인프라를 만들 필요가 없다.

---

## Common Pitfalls

### Pitfall 1: type 필드를 CORE_PLUGINS(PluginSeed)에 직접 추가
**What goes wrong:** TypeScript 컴파일 에러. PluginSeed는 PluginOperationalFields를 Omit한 타입이므로 type 필드를 가질 수 없다.
**Why it happens:** type override가 PLUGIN_FIELD_OVERRIDES에 있어야 한다는 설계를 모르고 직접 추가 시도.
**How to avoid:** 항상 PLUGIN_FIELD_OVERRIDES에 `type: "plugin" as const` 추가. `pnpm typecheck`로 즉시 검증.
**Warning signs:** `Object literal may only specify known properties` 타입 에러.

### Pitfall 2: DEFAULT_PLUGIN_FIELDS의 type이 'mcp'임을 망각
**What goes wrong:** PLUGIN_FIELD_OVERRIDES에 type override를 추가하지 않으면 Plugin 항목도 type: 'mcp'로 노출됨.
**Why it happens:** 신규 항목 추가 시 CORE_PLUGINS만 추가하고 PLUGIN_FIELD_OVERRIDES를 빠뜨리는 실수.
**How to avoid:** 신규 Plugin 추가 체크리스트: (1) CORE_PLUGINS PluginSeed, (2) PLUGIN_FIELD_OVERRIDES with type: 'plugin', (3) plugins-en.ts 번역.
**Warning signs:** `pnpm test`에서 `all 42 current entries have type === 'mcp'` 테스트 실패. (이 테스트는 Phase 9 완료 후 수정 필요)

### Pitfall 3: plugins.test.ts의 Phase 8 baseline 테스트 충돌
**What goes wrong:** plugins.test.ts line 21의 `"all 42 current entries have type === 'mcp'"` 테스트가 Phase 9 작업 후 실패함.
**Why it happens:** Phase 8 완료 시점을 baseline으로 잡은 테스트가 Phase 9에서 type 변경 후 깨짐.
**How to avoid:** Phase 9 작업 완료 후 해당 테스트를 업데이트 — `"Plugin 항목은 type === 'plugin', MCP 항목은 type === 'mcp'"` 형태로 변경.
**Warning signs:** `pnpm test` 실패 시 `plugins.test.ts:21` 확인.

### Pitfall 4: PLUGIN_FIELD_OVERRIDES 기존 항목 수정 시 기존 필드 손실
**What goes wrong:** 기존 PLUGIN_FIELD_OVERRIDES 항목(예: omc)에 `type: 'plugin'`을 추가하면서 기존 필드(difficulty, bestFor 등)를 실수로 지우면 runtime에서 DEFAULT_PLUGIN_FIELDS 기본값으로 폴백됨.
**Why it happens:** 코드 편집 실수.
**How to avoid:** 기존 항목에 `type: "plugin" as const` 한 줄만 추가. 나머지 필드는 그대로 유지.

### Pitfall 5: install 패턴 오분류
**What goes wrong:** install 명령어가 두 가지 방법을 제공하는 항목에서 잘못된 방법을 기준으로 분류.
**Why it happens:** 예: sentry는 `claude plugin marketplace add` (Plugin 패턴)와 `npx @sentry/mcp-server` (MCP 패턴) 두 가지를 모두 제공. 공식 권장 방법이 Plugin 패턴이면 Plugin.
**How to avoid:** 각 항목 GitHub README의 "Quick Start" 또는 "Installation" 섹션에서 **첫 번째로 나오는 방법**을 공식 권장으로 판단. 현재 CORE_PLUGINS의 install[] 첫 번째 요소가 기준.

---

## Code Examples

### 재분류 대상 항목 분석 (install 패턴 기준)

기존 42개 항목 중 install[] 배열의 첫 번째 명령어 패턴 분석:

**Plugin 패턴 확인된 항목 (재분류 대상):**

| ID | Install 첫 번째 명령어 | Plugin 패턴 |
|----|----------------------|-------------|
| `omc` | `/plugin marketplace add https://github.com/Yeachan-Heo/oh-my-claudecode` | `/plugin marketplace add` |
| `superpowers` | `/plugin marketplace add https://github.com/superpoweredai/superpowers` | `/plugin marketplace add` |
| `agency-agents` | `git clone https://github.com/msitarzewski/agency-agents.git` | `git clone` + `cp -r ~/.claude/agents/` |
| `bkit-starter` | `/plugin marketplace add popup-studio-ai/bkit-claude-code` | `/plugin marketplace add` |
| `bkit` | `/plugin marketplace add popup-studio-ai/bkit-claude-code` | `/plugin marketplace add` |
| `ralph` | `/plugin marketplace add https://github.com/haizelabs/ralph-wiggum` | `/plugin marketplace add` |
| `fireauto` | `/plugin marketplace add imgompanda/fireauto` | `/plugin marketplace add` |
| `repomix` | `/plugin marketplace add repomix` | `/plugin marketplace add` |
| `context7` | `/plugin marketplace add https://mcp.context7.com/mcp` | `/plugin marketplace add` |
| `security` | `/plugin install security-guidance@claude-plugin-directory` | `/plugin install` |
| `sentry` | `claude plugin marketplace add getsentry/sentry-mcp` | `claude plugin marketplace add` |
| `figma` | `claude plugin install figma@claude-plugins-official` | `claude plugin install` |
| `playwright` | `/plugin marketplace add https://github.com/microsoft/playwright-mcp` | `/plugin marketplace add` |

**총 13개 Plugin 재분류 대상** — DATA-01의 10-15개 요건을 단독 충족.

**MCP 유지 확인 항목 (borderline 포함):**

| ID | Install 첫 번째 명령어 | 판단 |
|----|----------------------|------|
| `taskmaster` | `npx task-master-ai init` | MCP (npx 패턴) |
| `gsd` | `npx get-shit-done-cc@latest` | MCP (npx 패턴) |
| `uiux` | `npx uipro-cli init` | MCP (npx 패턴) |

### plugins-en.ts 현황 (2026-03-18 기준)

기존 번역 완료 항목 (`pluginDescEn` 기준):

Plugin 재분류 대상 중 번역 **존재** (7개):
- `omc`, `superpowers`, `agency-agents`, `bkit-starter`, `bkit`, `ralph`
- 추가: `gsd`, `fireauto` (MCP이지만 번역 존재)

Plugin 재분류 대상 중 번역 **없음** (I18N-02 필요):
- `repomix` — 없음
- `context7` — 없음
- `security` — 없음
- `sentry` — 없음
- `figma` — 없음
- `playwright` — 없음
- `taskmaster` — 번역 존재 (MCP이므로 불필요)

> **참고:** `pluginDescEn`에는 MCP 항목 번역도 다수 포함되어 있다 (todoist, linear, repomix, context7, memory, playwright, etc.). 이 중 Plugin 재분류 대상에 해당하는 항목의 번역 여부를 확인해야 한다.

실제로 `plugins-en.ts` 전체 확인 결과:
- `sequential-thinking`, `todoist`, `linear`, `repomix`, `context7`, `memory`, `playwright`, `puppeteer`, `notion`, `firecrawl`, `brave-search`, `exa`, `tavily`, `perplexity`, `postgres`, `security`, `sentry`, `github`, `slack`, `filesystem`, `git`, `supabase`, `figma`, `uiux`, `docker`, `vercel`, `cloudflare`, `aws`, `atlassian`, `browserbase`, `stripe`, `neon`, `desktop-commander` — 모두 번역 존재

따라서 **13개 Plugin 재분류 대상 전체에 이미 영문 번역이 존재**한다. I18N-02는 신규 항목 추가 시에만 번역 작성이 필요하다.

### 신규 Plugin 후보 (Claude's Discretion)

기존 13개 재분류만으로 DATA-01 요건(10-15개)을 충족하므로 신규 추가는 선택적이다. 단, Phase 10 이후 타입 필터링 기능 완성도를 높이기 위해 1-2개 신규 추가를 권장한다.

**후보군 (GitHub README 기반 검증 후 결정):**
- `code-interpreter` 류 (claude plugin add 패턴 사용하는 공식 플러그인)
- `claude-plugins-official` 계열 추가 항목 (anthropics/claude-plugins-official)

> **Note:** 신규 항목은 GitHub README 기반 검증 후 확정해야 한다. 현재 단계에서는 기존 13개 재분류로 최소 요건을 충족하는 것이 안전한 경로다.

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| 모든 42개 항목 type: 'mcp' (DEFAULT) | type: 'plugin'인 항목 명시적 override | Phase 9 | Plugin 카탈로그 분리 가능 |
| plugins-en.ts에 Plugin/MCP 구분 없음 | 동일 파일에 혼재 (구분 불필요) | 현재 | 번역 파일 구조 변경 없음 |

---

## Open Questions

1. **신규 Plugin 추가 여부**
   - What we know: 기존 13개 재분류로 DATA-01 최소 요건(10개) 충족
   - What's unclear: 15개 상한선에 맞추기 위해 2개 신규 추가가 필요한지 여부
   - Recommendation: 재분류 13개 완료 후 count 확인. 필요 시 anthropics/claude-plugins-official에서 1-2개 추가. 신규 추가 없이도 요건 충족 가능.

2. **plugins.test.ts baseline 테스트 업데이트 방식**
   - What we know: Line 21 `"all 42 current entries have type === 'mcp'"` 테스트는 Phase 9 완료 후 실패함
   - What's unclear: 새 테스트를 추가하는지, 기존 테스트를 수정하는지
   - Recommendation: 기존 테스트를 Phase 9 완료 기준으로 업데이트. 새 assertions: "Plugin 재분류 항목들은 type === 'plugin'", "MCP 항목들은 type === 'mcp'", "총 항목 수 >= 42".

---

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Vitest |
| Config file | `vitest.config.ts` (프로젝트 루트) |
| Quick run command | `pnpm test -- lib/__tests__/plugins.test.ts` |
| Full suite command | `pnpm test` |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| DATA-01 | Plugin 항목이 10개 이상 type: 'plugin'으로 등록됨 | unit | `pnpm test -- lib/__tests__/plugins.test.ts` | Wave 0 update |
| DATA-02 | 각 Plugin 항목의 install[], category, keywords, features 필드 존재 | unit | `pnpm typecheck` | ✅ |
| DATA-03 | Plugin 항목 한국어 desc/longDesc 존재 | unit | `pnpm typecheck` | ✅ |
| I18N-02 | plugins-en.ts에 Plugin 항목 영문 번역 존재 | unit | `pnpm test -- lib/__tests__/plugins.test.ts` | Wave 0 update |

### Sampling Rate
- **Per task commit:** `pnpm typecheck && pnpm test -- lib/__tests__/plugins.test.ts`
- **Per wave merge:** `pnpm typecheck && pnpm lint && pnpm test`
- **Phase gate:** `pnpm build` 포함 full suite green before `/gsd:verify-work`

### Wave 0 Gaps

- [ ] `lib/__tests__/plugins.test.ts` — Phase 8 baseline 테스트(`"all 42 current entries have type === 'mcp'"`) 수정 필요. Phase 9 완료 기준으로 업데이트:
  - Plugin 재분류 항목들(13개 이상)이 `type === 'plugin'`임을 검증
  - MCP 항목들이 `type === 'mcp'`임을 검증
  - `pluginDescEn`에 모든 Plugin 항목 영문 번역이 존재함을 검증

---

## Sources

### Primary (HIGH confidence)
- `lib/plugins.ts` — CORE_PLUGINS 42개 항목의 install[] 패턴 직접 분석
- `lib/types.ts` — PluginSeed, PluginOperationalFields, ItemType 타입 구조 확인
- `lib/i18n/plugins-en.ts` — 기존 영문 번역 현황 전체 확인
- `lib/__tests__/plugins.test.ts` — 기존 테스트 항목 및 Phase 8 baseline 확인
- `.planning/phases/09-plugin-db-population/09-CONTEXT.md` — 분류 규칙 및 구현 결정 사항

### Secondary (MEDIUM confidence)
- `.planning/STATE.md` — borderline 항목(superpowers, taskmaster, bkit-starter) 확인
- `.planning/REQUIREMENTS.md` — DATA-01, DATA-02, DATA-03, I18N-02 요건 확인

---

## Metadata

**Confidence breakdown:**
- Plugin 재분류 목록: HIGH — install[] 필드를 직접 읽어 패턴 분류
- 신규 Plugin 후보: LOW — GitHub README 검증 전 확정 불가
- Test update 방향: HIGH — 기존 테스트 코드 직접 확인
- i18n 번역 현황: HIGH — plugins-en.ts 전체 읽어 누락 항목 확인

**Research date:** 2026-03-18
**Valid until:** 2026-04-18 (데이터 파일 기반, 4주 유효)
