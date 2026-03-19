# Phase 14: Plugin 3개 등록 - Research

**Researched:** 2026-03-19
**Domain:** Static data registration — Plugin 3개 PluginSeed entries in lib/plugins.ts + lib/i18n/plugins-en.ts
**Confidence:** HIGH (install commands verified from official README/docs; one command has two variants needing planner attention)

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| PLG-01 | claude-mem Plugin이 검증된 메타데이터로 DB에 등록되고 type: 'plugin'으로 분류된다 | GitHub repo 확인, install cmd 공식 docs 검증 완료 |
| PLG-02 | superclaude Plugin이 검증된 메타데이터로 DB에 등록되고 type: 'plugin'으로 분류된다 | GitHub repo 확인, install cmd README 직접 fetch 검증 완료 |
| PLG-03 | frontend-design Plugin이 검증된 메타데이터로 DB에 등록되고 type: 'plugin'으로 분류된다 | Anthropic 공식 repo 확인, install cmd 다중 소스 교차 검증 완료 |
</phase_requirements>

---

## Summary

Phase 14는 Phase 13과 동일한 순수 데이터 추가 작업이다. lib/plugins.ts의 CORE_PLUGINS에 3개 PluginSeed를 추가하고, PLUGIN_FIELD_OVERRIDES에 `type: 'plugin' as const`를 선언하며, lib/i18n/plugins-en.ts에 영문 번역을 추가한다. UI/엔진/라우팅 변경은 없다. 완료 후 DB는 48 → 51개가 된다.

MCP 서버와 Plugin의 핵심 차이: Plugin은 반드시 PLUGIN_FIELD_OVERRIDES에 `type: 'plugin' as const`를 선언해야 한다. DEFAULT_PLUGIN_FIELDS의 기본값은 `type: "mcp"`이므로, OVERRIDES 선언을 빠뜨리면 Plugin이 MCP 탭에 잘못 분류된다. 이것이 Phase 14의 가장 중요한 패턴 포인트다.

3개 Plugin의 install 명령은 모두 `/plugin marketplace add` + `/plugin install` 2단계 패턴을 따른다. claude-mem과 frontend-design은 단일 소스로 확정되었고, superclaude는 README와 migration guide 간 plugin ID 불일치(`sc` vs `superclaude`)가 있어 추가 검증이 필요하다. 아래 Verified Install Commands 섹션에서 상세 내용 확인.

**Primary recommendation:** PLUGIN_FIELD_OVERRIDES에 `type: 'plugin' as const` 선언을 절대 빠뜨리지 말고, 각 Plugin의 install 명령을 아래 Verified Install Commands 섹션에서 verbatim 복사한다.

---

## Standard Stack

### Core Files to Edit

| File | Location | What to Add |
|------|----------|-------------|
| `lib/plugins.ts` | `CORE_PLUGINS` Record | 3개 PluginSeed 항목 |
| `lib/plugins.ts` | `PLUGIN_FIELD_OVERRIDES` | `type: 'plugin' as const` + verificationStatus, difficulty, bestFor, avoidFor |
| `lib/i18n/plugins-en.ts` | `pluginDescEn` | 3개 영문 desc + longDesc |

### Type Reference (Phase 13과 동일)

```typescript
// PluginSeed = Plugin without PluginOperationalFields
// 필수 필드:
type PluginSeed = {
  id: string;
  name: string;
  tag: string;           // 2-6자 약어
  color: string;         // hex color
  category: PluginCategory;
  githubRepo: string | null;
  desc: string;          // 한국어 1-2줄
  longDesc: string;      // 한국어 3-5줄
  url: string;
  install: string[];     // 명령 배열
  features: string[];    // 3-4개 기능
  conflicts: string[];   // [] (3개 모두)
  keywords: string[];    // 12-14개
};

// PLUGIN_FIELD_OVERRIDES에서 Plugin 항목에 반드시 설정:
// type: 'plugin' as const   ← MCP와 구분되는 핵심
// verificationStatus: "verified" | "partial" | "unverified"
// difficulty: "beginner" | "intermediate" | "advanced"
// bestFor: string[]
// avoidFor: string[]
// requiredSecrets: string[]  (해당 없으면 [] — DEFAULT가 [] 주입)
// installMode: "safe-copy" | "manual-required" | "external-setup"
```

### PluginCategory (유효한 값)

```typescript
type PluginCategory =
  | "orchestration" | "workflow" | "code-quality" | "testing"
  | "documentation" | "data" | "security" | "integration"
  | "ui-ux" | "devops";
```

**3개 Plugin 카테고리 배정:**
- claude-mem: `orchestration` (세션 메모리 관리, 오케스트레이션 레이어)
- superclaude: `orchestration` (커맨드/에이전트/워크플로 확장)
- frontend-design: `ui-ux` (프론트엔드 디자인 스킬)

---

## Verified Install Commands

각 Plugin의 공식 소스에서 검증한 verbatim 설치 명령. 이 섹션이 Phase 14의 핵심 아웃풋이다.

### PLG-01: claude-mem

**GitHub:** `thedotmack/claude-mem`
**Official docs:** `https://docs.claude-mem.ai/installation` (verified 2026-03-19)
**marketplace.json plugin name:** `claude-mem` (confirmed from `.claude-plugin/marketplace.json`)

```
/plugin marketplace add thedotmack/claude-mem
/plugin install claude-mem
```

**Key details:**
- Plugin ID: `claude-mem`
- Version: 10.6.1 (as of 2026-03-19)
- No API key required
- installMode: `"safe-copy"` (로컬 SQLite + Bun worker, 외부 계정 불필요)
- System requirements: Node.js 18+, Bun (auto-installed), uv (auto-installed)
- WARNING: `npm install -g claude-mem`은 SDK 라이브러리만 설치 — plugin hooks 등록 안 됨. 반드시 `/plugin` 명령 사용

### PLG-02: superclaude

**GitHub:** `SuperClaude-Org/SuperClaude_Plugin`
**Sources:** README (direct fetch, 2026-03-19) + MIGRATION_GUIDE.md
**marketplace.json plugin name:** `sc` (confirmed from `.claude-plugin/marketplace.json`)

```
/plugin marketplace add SuperClaude-Org/SuperClaude_Plugin
/plugin install sc@SuperClaude-Org
```

**IMPORTANT — ID 불일치 이슈:**
- `.claude-plugin/marketplace.json`의 plugin name 필드: `"sc"` → 공식 install ID
- README 명시 명령: `/plugin install sc@SuperClaude-Org`
- MIGRATION_GUIDE.md 명시 명령: `/plugin install superclaude@SuperClaude-Org`
- **결론:** marketplace.json이 최종 권위 소스 → `sc@SuperClaude-Org`가 정확
- Version: 4.4.1 (4.4.0 in marketplace.json, 4.4.1 in README badge)

**Key details:**
- 29 slash commands (`/sc:*`)
- 23 specialized agents, 7 behavioral modes
- AIRIS MCP Gateway 자동 구성 (10 tools)
- installMode: `"safe-copy"` (Python/Node.js 불필요, plugin system 전용)
- No API key required for base installation
- WARNING: pip/pipx/npm/uv 버전과 호환되지 않음. 이전 설치본 제거 필요

### PLG-03: frontend-design

**GitHub:** `anthropics/claude-code` (monorepo, `plugins/frontend-design/` 하위)
**Official page:** `https://claude.com/plugins/frontend-design` (324,000+ installs, Anthropic Verified)
**Sources:** X/@_catwu post + Threads/@boris_cherny post (두 독립 소스 교차 검증, 2026-03-19)

```
/plugin marketplace add anthropics/claude-code
/plugin install frontend-design@claude-code-plugins
```

**Key details:**
- Plugin ID: `frontend-design@claude-code-plugins`
- Marketplace: `anthropics/claude-code` (Anthropic 공식 monorepo)
- officialStatus: `"official"` (Anthropic 직접 제공, Verified 배지)
- installMode: `"safe-copy"` (no API key, no external service)
- Authors: Prithvi Rajasekaran + Alexander Bricken (Anthropic)
- NOTE: `/plugins/frontend-design/` 디렉토리에 별도 marketplace.json 없음 — 상위 monorepo marketplace에 포함

---

## Architecture Patterns

### Plugin vs MCP 등록 패턴 비교

MCP 서버 (Phase 13)와 Plugin (Phase 14)의 유일한 코드 차이:

```typescript
// MCP 서버 (Phase 13): PLUGIN_FIELD_OVERRIDES에 type 불필요
// DEFAULT_PLUGIN_FIELDS가 type: "mcp" 자동 주입

// Plugin (Phase 14): PLUGIN_FIELD_OVERRIDES에 type: 'plugin' as const 필수
"claude-mem": {
  type: "plugin" as const,   // ← 이것이 없으면 MCP 탭으로 잘못 분류
  verificationStatus: "verified",
  difficulty: "intermediate",
  bestFor: ["세션 컨텍스트 유지", "장기 프로젝트 메모리"],
},
```

### 기존 Plugin 항목 패턴 (참조)

```typescript
// 기존 예시 (omc — Phase 9에서 등록됨):
// CORE_PLUGINS:
omc: {
  id: "omc",
  name: "Oh My ClaudeCode",
  tag: "OMC",
  color: "#FF6B35",
  category: "orchestration",
  githubRepo: "calio-code/oh-my-claudecode",
  desc: "...",
  longDesc: "...",
  url: "...",
  install: ["..."],
  features: [...],
  conflicts: [],
  keywords: [...],
},

// PLUGIN_FIELD_OVERRIDES:
omc: {
  difficulty: "advanced",
  verificationStatus: "verified",
  bestFor: [...],
  avoidFor: [...],
  type: "plugin" as const,   // ← Plugin 등록의 핵심
},
```

### CORE_PLUGINS 삽입 위치

Phase 13의 ui-ux 섹션이 이미 생성되어 있다. 삽입 위치:

```typescript
// orchestration 섹션 (omc, superpowers, bkit 등 있는 섹션):
// → claude-mem, superclaude 삽입

// ui-ux 섹션 (Phase 13에서 magic-mcp, shadcn-mcp 추가됨):
// → frontend-design 삽입
```

### pluginDescEn 패턴

```typescript
// lib/i18n/plugins-en.ts
export const pluginDescEn: Record<string, { desc: string; longDesc: string }> = {
  // ... 기존 항목들 ...
  "claude-mem": {
    desc: "One-line English description.",
    longDesc: "Multi-sentence English description matching Korean longDesc content.",
  },
  // ...
};
```

### plugins.test.ts PLUGIN_TYPE_IDS 업데이트 필요

현재 `PLUGIN_TYPE_IDS` 배열:
```typescript
const PLUGIN_TYPE_IDS = [
  "omc", "superpowers", "agency-agents", "bkit-starter", "bkit",
  "ralph", "fireauto", "taskmaster", "gsd",
] as const;
```

Phase 14 완료 후 3개 추가 필요:
```typescript
const PLUGIN_TYPE_IDS = [
  "omc", "superpowers", "agency-agents", "bkit-starter", "bkit",
  "ralph", "fireauto", "taskmaster", "gsd",
  "claude-mem", "superclaude", "frontend-design",  // ← Phase 14 추가
] as const;
```

이 변경이 없으면 `"every plugin-type entry has English translation"` 테스트가 신규 Plugin을 검증하지 않는다.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| type: 'plugin' 주입 | CORE_PLUGINS에 type 필드 직접 추가 | PLUGIN_FIELD_OVERRIDES에 `type: 'plugin' as const` | PluginSeed 타입에 type 필드 없음 — TypeScript 오류 발생 |
| Plugin 탭 노출 | UI 변경 | type: 'plugin' + category 정확히 설정 | /plugins Plugin 탭 필터는 type === 'plugin' 자동 처리 |
| 추천 엔진 연동 | 별도 등록 로직 | keywords 배열만 정확히 작성 | scoring.ts가 keywords 기반으로 자동 매칭 |
| i18n 연동 | 별도 번역 파일 생성 | pluginDescEn에 키 추가 | 기존 i18n 시스템이 id 기반으로 자동 매핑 |

---

## Common Pitfalls

### Pitfall 1: PLUGIN_FIELD_OVERRIDES에 type 누락
**What goes wrong:** CORE_PLUGINS에만 항목 추가하고 PLUGIN_FIELD_OVERRIDES에 `type: 'plugin' as const` 선언 누락 → DEFAULT_PLUGIN_FIELDS의 `type: "mcp"`가 주입되어 Plugin이 MCP 탭에 표시됨
**Why it happens:** MCP 서버(Phase 13)와 코드 구조가 동일해서 차이를 간과함
**How to avoid:** PLUGIN_FIELD_OVERRIDES 항목 작성 시 `type: 'plugin' as const`를 첫 번째 줄에 명시
**Warning signs:** /plugins 탭에서 Plugin 탭이 아닌 MCP 탭에 표시됨

### Pitfall 2: superclaude install ID 오류
**What goes wrong:** `/plugin install superclaude@SuperClaude-Org`를 사용하면 설치 실패 가능
**Why it happens:** MIGRATION_GUIDE.md와 marketplace.json의 ID가 불일치 (`superclaude` vs `sc`)
**How to avoid:** marketplace.json이 권위 소스 → `sc@SuperClaude-Org` 사용
**Warning signs:** /plugin install 명령 실패 또는 plugin not found 오류

### Pitfall 3: frontend-design marketplace 오류
**What goes wrong:** `/plugin marketplace add anthropics/frontend-design`처럼 잘못된 marketplace URL 사용
**Why it happens:** frontend-design이 claude-code monorepo 하위에 있음을 모름
**How to avoid:** marketplace는 반드시 `anthropics/claude-code` (monorepo 루트)
**Warning signs:** marketplace.json 404 오류

### Pitfall 4: claude-mem을 npm으로 설치 시도
**What goes wrong:** `npm install -g claude-mem` 또는 `npx claude-mem`은 plugin hooks를 등록하지 않음
**Why it happens:** npm 패키지가 존재하나 SDK 라이브러리 전용
**How to avoid:** 반드시 `/plugin marketplace add` + `/plugin install` 경로 사용

### Pitfall 5: plugins.test.ts PLUGIN_TYPE_IDS 미업데이트
**What goes wrong:** 3개 신규 Plugin의 type === 'plugin' 검증이 테스트에서 누락됨
**Why it happens:** test 파일 업데이트를 빠뜨림
**How to avoid:** plugins.test.ts의 `PLUGIN_TYPE_IDS` 배열에 3개 ID 추가

### Pitfall 6: superclaude 이전 버전 충돌
**What goes wrong:** pip/pipx로 설치된 구버전 SuperClaude가 있으면 plugin 버전과 충돌
**Why it happens:** SuperClaude는 v4.2 이전에 pip 배포됨
**How to avoid:** avoidFor 또는 longDesc에 "이전 pip/pipx 버전 제거 필요" 안내 포함

---

## Code Examples

### claude-mem 항목 전체 예시 (PluginSeed)

```typescript
// Source: docs.claude-mem.ai/installation + github.com/thedotmack/claude-mem (verified 2026-03-19)
"claude-mem": {
  id: "claude-mem",
  name: "claude-mem",
  tag: "MEM",
  color: "#6366F1",
  category: "orchestration",
  githubRepo: "thedotmack/claude-mem",
  desc: "세션 간 메모리 영속화. 코딩 세션의 모든 행동을 자동 캡처하고 다음 세션에 컨텍스트를 주입.",
  longDesc:
    "claude-mem은 Claude Code 세션이 끝나도 컨텍스트가 사라지지 않도록 메모리를 영속화하는 플러그인이에요. 세션 중 모든 도구 호출, 파일 편집, 결정을 자동으로 캡처해서 SQLite에 저장하고, AI 압축으로 의미 있는 요약을 생성해요. 다음 세션 시작 시 관련 컨텍스트를 자동으로 주입해서 \"어제 어디까지 했더라?\" 문제를 해결해줘요. 설치 후 별도 설정 없이 자동으로 동작해요.",
  url: "https://github.com/thedotmack/claude-mem",
  install: [
    "/plugin marketplace add thedotmack/claude-mem",
    "/plugin install claude-mem",
  ],
  features: [
    "세션 간 자동 메모리 영속화",
    "AI 기반 컨텍스트 압축 (10x 토큰 효율)",
    "SQLite FTS5 기반 의미 검색",
    "프라이버시 제어 (<private> 태그)",
  ],
  conflicts: [],
  keywords: [
    "메모리", "memory", "컨텍스트", "context", "세션", "session",
    "영속화", "persist", "기억", "히스토리", "history",
    "장기", "연속", "continuity",
  ],
},
```

### claude-mem PLUGIN_FIELD_OVERRIDES 예시

```typescript
"claude-mem": {
  type: "plugin" as const,
  verificationStatus: "verified",
  difficulty: "beginner",
  installMode: "safe-copy",
  bestFor: ["장기 프로젝트 컨텍스트 유지", "멀티 세션 개발", "반복 작업 패턴 기억"],
},
```

### superclaude 항목 전체 예시 (PluginSeed)

```typescript
// Source: github.com/SuperClaude-Org/SuperClaude_Plugin README (verified 2026-03-19)
superclaude: {
  id: "superclaude",
  name: "SuperClaude",
  tag: "SC",
  color: "#8B5CF6",
  category: "orchestration",
  githubRepo: "SuperClaude-Org/SuperClaude_Plugin",
  desc: "29개 /sc: 커맨드, 23개 전문 에이전트, 7가지 행동 모드. Claude Code를 구조화된 개발 플랫폼으로 확장.",
  longDesc:
    "SuperClaude는 Claude Code에 체계적인 개발 워크플로를 주입하는 플러그인이에요. /sc: 네임스페이스로 29개 전문 커맨드(리서치, 구현, 리뷰, 분석 등)와 23개 전문 에이전트, 7가지 인지 행동 모드를 제공해요. AIRIS MCP Gateway가 자동으로 구성되어 10개 통합 도구를 즉시 사용할 수 있어요. pip/pipx/npm 버전과 호환되지 않으므로, 이전 버전이 설치되어 있다면 먼저 제거해야 해요.",
  url: "https://github.com/SuperClaude-Org/SuperClaude_Plugin",
  install: [
    "/plugin marketplace add SuperClaude-Org/SuperClaude_Plugin",
    "/plugin install sc@SuperClaude-Org",
  ],
  features: [
    "29개 /sc: 전문 커맨드",
    "23개 전문 에이전트 + 7가지 행동 모드",
    "AIRIS MCP Gateway 자동 구성 (10 tools)",
    "자동 업데이트 (Claude Code plugin system)",
  ],
  conflicts: [],
  keywords: [
    "커맨드", "command", "에이전트", "agent", "워크플로", "workflow",
    "슬래시", "slash", "생산성", "productivity", "구조화", "structured",
    "개발", "development", "자동화", "automation",
  ],
},
```

### superclaude PLUGIN_FIELD_OVERRIDES 예시

```typescript
superclaude: {
  type: "plugin" as const,
  verificationStatus: "verified",
  difficulty: "intermediate",
  installMode: "safe-copy",
  bestFor: ["체계적 개발 워크플로", "전문 커맨드 활용", "에이전트 기반 개발"],
  avoidFor: ["pip/pipx SuperClaude 구버전 설치 환경 (먼저 제거 필요)"],
},
```

### frontend-design 항목 전체 예시 (PluginSeed)

```typescript
// Source: github.com/anthropics/claude-code/plugins/frontend-design + claude.com/plugins/frontend-design (verified 2026-03-19)
"frontend-design": {
  id: "frontend-design",
  name: "Frontend Design",
  tag: "FED",
  color: "#EC4899",
  category: "ui-ux",
  githubRepo: "anthropics/claude-code",
  desc: "Anthropic 공식 프론트엔드 디자인 스킬. 독창적인 타이포그래피, 색상, 애니메이션으로 AI 슬롭을 탈피.",
  longDesc:
    "Frontend Design는 Anthropic이 직접 제공하는 공식 Claude Code 플러그인이에요. 일반적인 AI 생성 UI의 뻔한 패턴(Inter 폰트, 보라색 그라디언트, 밋밋한 레이아웃)을 피하고, 독창적인 타이포그래피, 대담한 색상 팔레트, 고임팩트 애니메이션, 비대칭 레이아웃을 활용해 프로덕션 품질의 인터페이스를 만들어줘요. /frontend-design, /design, /ui, /layout 커맨드를 지원하며, 프론트엔드 요청 시 자동으로 활성화돼요.",
  url: "https://github.com/anthropics/claude-code/tree/main/plugins/frontend-design",
  install: [
    "/plugin marketplace add anthropics/claude-code",
    "/plugin install frontend-design@claude-code-plugins",
  ],
  features: [
    "독창적 UI 디자인 (AI 슬롭 탈피)",
    "대담한 타이포그래피 + 색상 팔레트",
    "고임팩트 애니메이션 및 인터랙션",
    "/frontend-design, /design, /ui, /layout 커맨드",
  ],
  conflicts: [],
  keywords: [
    "프론트엔드", "frontend", "디자인", "design", "ui", "ux",
    "컴포넌트", "component", "랜딩", "landing", "대시보드", "dashboard",
    "애니메이션", "animation", "타이포그래피", "typography",
  ],
},
```

### frontend-design PLUGIN_FIELD_OVERRIDES 예시

```typescript
"frontend-design": {
  type: "plugin" as const,
  officialStatus: "official",
  verificationStatus: "verified",
  difficulty: "beginner",
  installMode: "safe-copy",
  bestFor: ["프론트엔드 UI 개발", "랜딩 페이지 디자인", "대시보드 제작"],
},
```

### pluginDescEn 추가 예시

```typescript
// lib/i18n/plugins-en.ts
"claude-mem": {
  desc: "Persistent memory across Claude Code sessions. Auto-captures actions and injects relevant context into future sessions.",
  longDesc: "claude-mem gives Claude Code persistent memory across sessions. Every tool call, file edit, and decision is automatically captured, compressed with AI, and stored in a local SQLite database. When you start a new session, relevant context is injected automatically — no more re-explaining your project from scratch. Install once and it works silently in the background.",
},
superclaude: {
  desc: "29 /sc: commands, 23 specialized agents, 7 behavioral modes. Extends Claude Code into a structured development platform.",
  longDesc: "SuperClaude transforms Claude Code into a structured development platform through 29 slash commands under the /sc: namespace, 23 specialized agents, and 7 cognitive behavioral modes. The AIRIS MCP Gateway is auto-configured with 10 integrated tools. Incompatible with previous pip/pipx/npm SuperClaude versions — remove old installations first. Automatic updates are managed by Claude Code's plugin system.",
},
"frontend-design": {
  desc: "Official Anthropic frontend design skill. Escape AI slop with distinctive typography, color palettes, and animations.",
  longDesc: "Frontend Design is Anthropic's official Claude Code plugin for creating production-grade frontend interfaces. It pushes Claude away from generic AI aesthetics (Inter font, purple gradients, predictable layouts) toward distinctive typography, bold color palettes, high-impact animations, and asymmetric layouts. Supports /frontend-design, /design, /ui, and /layout commands, and activates automatically when you ask Claude to build frontend interfaces.",
},
```

---

## State of the Art

| Plugin | GitHub Repo | Install Method | Status (2026-03) |
|--------|-------------|---------------|-----------------|
| claude-mem | thedotmack/claude-mem | `/plugin install claude-mem` | Active, community, v10.6.1 |
| superclaude | SuperClaude-Org/SuperClaude_Plugin | `/plugin install sc@SuperClaude-Org` | Active, community, v4.4.1 |
| frontend-design | anthropics/claude-code (monorepo) | `/plugin install frontend-design@claude-code-plugins` | Active, Anthropic official, 324k+ installs |

**Deprecated/outdated:**
- SuperClaude pip/pipx/npm 버전: v4.2부터 plugin system으로 이전됨. 공식 NOT COMPATIBLE 선언.
- npm 글로벌 설치 `npm install -g claude-mem`: plugin hooks 미등록 — 라이브러리만 설치됨

---

## Open Questions

1. **superclaude install ID 최종 확인**
   - What we know: marketplace.json의 name 필드 = `"sc"`, README = `sc@SuperClaude-Org`, MIGRATION_GUIDE = `superclaude@SuperClaude-Org`
   - What's unclear: 두 ID 중 어느 것이 실제 Claude Code runtime에서 동작하는지 런타임 테스트 불가
   - Recommendation: marketplace.json을 권위 소스로 채택하여 `sc@SuperClaude-Org` 사용. longDesc에 주의사항 기재. Phase 15 VER-01 수동 검증 시 확인.

2. **frontend-design Plugin ID 정확성**
   - What we know: 두 독립 소스(X/@_catwu, Threads/@boris_cherny)가 `frontend-design@claude-code-plugins` 확인
   - What's unclear: anthropics/claude-plugins-official marketplace.json에는 `frontend-design` (마켓플레이스명 `claude-plugins-official`)으로도 등재됨
   - Recommendation: Anthropic 공식 monorepo(`anthropics/claude-code`) 기반 명령이 가장 직접적 — `frontend-design@claude-code-plugins` 사용.

3. **claude-mem 시스템 요구사항 표기**
   - What we know: Node.js 18+, Bun(auto), uv(auto) 필요
   - What's unclear: prerequisites에 Node.js만 명시할지 vs 자동 설치 안내만 할지
   - Recommendation: prerequisites: ["Node.js 18 이상"] — Bun과 uv는 자동 설치되므로 longDesc에 안내

---

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Vitest |
| Config file | vitest.config.ts |
| Quick run command | `pnpm test -- plugins` |
| Full suite command | `pnpm test` |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| PLG-01 | claude-mem가 PLUGINS에 존재하고 type === 'plugin' | unit | `pnpm test -- plugins` | ✅ lib/__tests__/plugins.test.ts |
| PLG-02 | superclaude가 PLUGINS에 존재하고 type === 'plugin' | unit | `pnpm test -- plugins` | ✅ |
| PLG-03 | frontend-design이 PLUGINS에 존재하고 type === 'plugin' | unit | `pnpm test -- plugins` | ✅ |
| PLG-01~03 | pluginDescEn에 3개 영문 번역 존재 | unit | `pnpm test -- plugins` | ✅ (PLUGIN_TYPE_IDS 업데이트 필요) |
| PLG-01~03 | TypeScript 타입 오류 없음 | type-check | `pnpm typecheck` | ✅ |

**중요:** 현재 plugins.test.ts의 `PLUGIN_TYPE_IDS` 배열은 9개 (omc, superpowers, 등)이다. Phase 14에서 `claude-mem`, `superclaude`, `frontend-design` 3개를 추가해야 `"reclassified entries have type === 'plugin'"` 테스트가 신규 Plugin을 커버한다.

현재 sanity check 임계값: `≥42`. 51개 추가 후에도 통과 (≥42 조건). Phase 15(VER-03)에서 ≥51로 업데이트 예정.

### Sampling Rate

- **Per task commit:** `pnpm typecheck && pnpm test -- plugins`
- **Per wave merge:** `pnpm typecheck && pnpm lint && pnpm test`
- **Phase gate:** `pnpm typecheck && pnpm lint && pnpm build && pnpm test` 모두 통과

### Wave 0 Gaps

None — 기존 test infrastructure(lib/__tests__/plugins.test.ts)가 모든 요구사항을 커버함. `PLUGIN_TYPE_IDS` 배열 업데이트는 구현 태스크 내에서 처리.

---

## Sources

### Primary (HIGH confidence)

- `docs.claude-mem.ai/installation` — claude-mem 공식 docs, `/plugin` 명령 2단계 확인 (fetched 2026-03-19)
- `github.com/thedotmack/claude-mem` `.claude-plugin/marketplace.json` — plugin name = `"claude-mem"` 확인 (fetched 2026-03-19)
- `github.com/SuperClaude-Org/SuperClaude_Plugin` README — `/plugin install sc@SuperClaude-Org` 확인 (fetched 2026-03-19)
- `github.com/SuperClaude-Org/SuperClaude_Plugin` `.claude-plugin/marketplace.json` — plugin name = `"sc"` 확인 (fetched 2026-03-19)
- Threads/@boris_cherny post — `frontend-design@claude-code-plugins` 확인 (2026-03-19 search)
- X/@_catwu tweet — `frontend-design@claude-code-plugins` 동일 확인 (2026-03-19 search)
- `github.com/anthropics/claude-code/tree/main/plugins/frontend-design` README + SKILL.md — officialStatus=official, Anthropic Verified (fetched 2026-03-19)

### Secondary (MEDIUM confidence)

- WebSearch "superclaude claude code plugin github 2026" — SuperClaude-Org/SuperClaude_Plugin 확인
- WebSearch "frontend-design claude code plugin install command 2026" — 두 독립 소스 교차 검증
- `trigidigital.com/blog/claude-mem-plugin-review-2026/` — claude-mem 21,500+ stars, 설치 명령 재확인

### Tertiary (LOW confidence)

- SuperClaude MIGRATION_GUIDE.md의 `superclaude@SuperClaude-Org` ID — marketplace.json의 `sc`와 불일치, LOW로 처리

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — 기존 코드 직접 확인, Phase 13 패턴 동일
- Install commands: HIGH (claude-mem, frontend-design) / MEDIUM (superclaude — ID 불일치 이슈)
- Architecture: HIGH — Phase 13에서 검증된 동일 패턴
- Pitfalls: HIGH — type: 'plugin' as const 누락이 핵심 위험, 코드 분석으로 확인

**Research date:** 2026-03-19
**Valid until:** 2026-04-19 (superclaude ID 불일치는 Phase 15 VER-01에서 수동 확인 권장)
