# Phase 13: MCP 서버 6개 등록 - Research

**Researched:** 2026-03-19
**Domain:** Static data registration — PluginSeed entries in lib/plugins.ts + lib/i18n/plugins-en.ts
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**카테고리 배정**
- fetch → `data`
- time → `integration`
- markitdown → `documentation`
- magic-mcp → `ui-ux`
- shadcn-mcp → `ui-ux`
- n8n-mcp → `workflow`

**키워드 설계**
- 기존 플러그인과 키워드 겹침 허용
- 한국어 위주 + 영어 보조 (한국어 7-8개 + 영어 5-6개)
- fetch: HTTP/API 중심 ('http요청', 'api호출', 'url', 'fetch', 'REST', '웹페이지', '스크래핑', 'scrape', 'html')
- shadcn vs magic: 역할 구분 — shadcn은 컴포넌트 라이브러리, magic은 AI UI 생성
- n8n: '자동화' 키워드 포함 허용
- time, markitdown: Claude 재량으로 README 기반 키워드 선정

**충돌 관계**
- 6개 모두 `conflicts: []`
- fetch ↔ firecrawl: 충돌 아님
- shadcn ↔ magic: 충돌 아님 (보완 관계)

**bestFor/avoidFor 기준**
- bestFor 2-3개, avoidFor 0-1개
- avoidFor: requiredSecrets가 있는 서버만 'API 키 없는 환경' 추가
- 유스케이스 중심 작성

**install 명령**
- 반드시 공식 GitHub README를 fetch 후 verbatim 복사 (v1.0 결정사항)

**type 필드**
- CORE_PLUGINS에 type 필드 없음 — DEFAULT_PLUGIN_FIELDS가 `type: "mcp"` 자동 주입

### Claude's Discretion
- 각 서버의 tag(약어), color(헥스 코드) 선정
- features 배열 구성 (README 기반 주요 기능 3-4개)
- 구체적 키워드 목록 최종 결정 (time, markitdown)
- desc/longDesc 한국어 작성 톤 (기존 항목과 일관되게)
- difficulty 설정 (README 기반 판단)

### Deferred Ideas (OUT OF SCOPE)
None — 논의가 페이즈 범위 내에서 진행됨.
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| MCP-01 | fetch MCP 서버가 검증된 메타데이터(install, features, keywords, category)로 DB에 등록된다 | README 확인 완료 — uvx install, 1개 tool(fetch), no API key |
| MCP-02 | time MCP 서버가 검증된 메타데이터로 DB에 등록된다 | README 확인 완료 — uvx install, 2개 tool(get_current_time, convert_time), no API key |
| MCP-03 | markitdown MCP 서버가 검증된 메타데이터로 DB에 등록된다 | README 확인 완료 — pip install, 1개 tool(convert_to_markdown), no API key |
| MCP-04 | magic-mcp 서버가 검증된 메타데이터로 DB에 등록된다 | README 확인 완료 — npx CLI install, TWENTY_FIRST_API_KEY 필요 |
| MCP-05 | n8n-mcp 서버가 검증된 메타데이터로 DB에 등록된다 | README 확인 완료 — claude mcp add 명령 문서 존재, N8N_API_KEY 선택적 |
| MCP-06 | shadcn-mcp 서버가 검증된 메타데이터로 DB에 등록된다 | 공식 shadcn/ui 문서 확인 완료 — pnpm dlx shadcn@latest mcp init |
</phase_requirements>

---

## Summary

Phase 13은 순수 데이터 추가 작업이다. lib/plugins.ts의 CORE_PLUGINS Record에 PluginSeed 형식으로 6개 항목을 추가하고, lib/i18n/plugins-en.ts의 pluginDescEn에 영문 번역을 추가한다. UI, 엔진, 라우팅 변경 없이 데이터만 추가하면 /advisor 추천, /optimizer 보완 추천, /plugins MCP 탭 표시가 자동으로 동작한다.

핵심 리스크는 install 명령 정확성이다. fetch와 time은 Python 기반(uvx)이고, markitdown도 pip 기반이다. magic-mcp는 API 키가 필수이며, n8n-mcp는 n8n 인스턴스 없이도 문서/검증 모드로 동작한다. shadcn-mcp는 공식 shadcn/ui 팀이 제공하는 서버로 pnpm dlx 명령을 사용한다.

기존 42개 항목에 6개를 추가하면 48개가 된다. plugins.test.ts의 카운트 임계값(현재 ≥42)은 Phase 15(VER-03)에서 ≥48로 업데이트된다 — Phase 13 범위 외.

**Primary recommendation:** 각 서버의 install 명령을 아래 Verified Install Commands 섹션에서 정확히 복사하고, PLUGIN_FIELD_OVERRIDES에서 verificationStatus를 서버별로 적절히 설정한다.

---

## Standard Stack

### Core Files to Edit

| File | Location | What to Add |
|------|----------|-------------|
| `lib/plugins.ts` | `CORE_PLUGINS` (line 413~) | 6개 PluginSeed 항목 |
| `lib/plugins.ts` | `PLUGIN_FIELD_OVERRIDES` (line 37~) | verificationStatus, difficulty, bestFor, avoidFor |
| `lib/i18n/plugins-en.ts` | `pluginDescEn` (line 2~) | 6개 영문 desc + longDesc |

### Type Reference

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
  conflicts: string[];   // [] (6개 모두)
  keywords: string[];    // 12-14개
};

// PluginOperationalFields (PLUGIN_FIELD_OVERRIDES에서 설정):
// verificationStatus: "verified" | "partial" | "unverified"
// difficulty: "beginner" | "intermediate" | "advanced"
// bestFor: string[]
// avoidFor: string[]
// requiredSecrets: string[]
// installMode: "safe-copy" | "manual-required" | "external-setup"
// prerequisites: string[]
```

### PluginCategory (유효한 값)

```typescript
type PluginCategory =
  | "orchestration" | "workflow" | "code-quality" | "testing"
  | "documentation" | "data" | "security" | "integration"
  | "ui-ux" | "devops";
```

---

## Verified Install Commands

각 서버의 공식 README에서 확인한 verbatim 설치 명령.

### MCP-01: fetch (category: `data`)

**Source:** github.com/modelcontextprotocol/servers/tree/main/src/fetch (verified 2026-03-19)

```
claude mcp add fetch -- uvx mcp-server-fetch
```

- Python 기반 (uvx 사용 — git MCP와 동일 패턴)
- API 키 없음
- prerequisites: ["Python 또는 uvx (uv) 설치"] — git MCP와 동일
- installMode: "safe-copy" (로컬 실행, 외부 계정 불필요)
- verificationStatus: "verified"
- Tools: `fetch` (URL → Markdown 변환)

### MCP-02: time (category: `integration`)

**Source:** github.com/modelcontextprotocol/servers/tree/main/src/time (verified 2026-03-19)

```
claude mcp add time -- uvx mcp-server-time
```

- Python 기반 (uvx 사용)
- API 키 없음
- prerequisites: ["Python 또는 uvx (uv) 설치"]
- installMode: "safe-copy"
- verificationStatus: "verified"
- Tools: `get_current_time`, `convert_time`
- Optional: `--local-timezone=America/New_York` 인자 또는 `LOCAL_TIMEZONE` 환경변수

### MCP-03: markitdown (category: `documentation`)

**Source:** github.com/microsoft/markitdown/tree/main/packages/markitdown-mcp (verified 2026-03-19)

markitdown-mcp는 pip 기반으로 `claude mcp add` 형태의 단일 명령이 공식 README에 없다. 가장 정확한 설치 패턴:

```
pip install markitdown-mcp
markitdown-mcp
```

Claude Code에서 수동 설정이 필요하므로 installMode: "manual-required".

- Python 기반 (pip)
- API 키 없음
- prerequisites: ["Python 설치", "pip 사용 가능 환경"]
- installMode: "manual-required"
- verificationStatus: "verified"
- Tools: `convert_to_markdown(uri)` — http/https/file/data URI 지원

### MCP-04: magic-mcp (category: `ui-ux`)

**Source:** github.com/21st-dev/magic-mcp (verified 2026-03-19)

```
npx @21st-dev/cli@latest install claude --api-key <key>
```

- API 키 필수: 21st.dev Magic Console에서 발급
- installMode: "external-setup"
- requiredSecrets: ["TWENTY_FIRST_API_KEY (21st.dev Magic Console에서 발급)"]
- verificationStatus: "verified"
- Tools: `/ui` 커맨드로 자연어 UI 컴포넌트 생성, 21st.dev 컴포넌트 라이브러리 접근

### MCP-05: n8n-mcp (category: `workflow`)

**Source:** github.com/czlonkowski/n8n-mcp + docs/CLAUDE_CODE_SETUP.md (verified 2026-03-19)

```
claude mcp add n8n-mcp -e MCP_MODE=stdio -e LOG_LEVEL=error -e DISABLE_CONSOLE_OUTPUT=true -- npx n8n-mcp
```

- n8n API 없이도 문서/검증 모드(7개 core tools)로 동작
- n8n 인스턴스 + API Key 있으면 워크플로 관리(13개 추가 tools) 가능
- installMode: "safe-copy" (기본 문서 모드) / "external-setup" (API 연동)
- → 기본 동작이 API 없이도 가능하므로 installMode: "safe-copy"
- requiredSecrets: [] (API 없이 기본 동작)
- verificationStatus: "verified"
- Tools: 20개 (core 7 + n8n management 13, 후자는 API 필요)

### MCP-06: shadcn-mcp (category: `ui-ux`)

**Source:** ui.shadcn.com/docs/mcp (공식 shadcn/ui 팀 제공, verified 2026-03-19)

```
pnpm dlx shadcn@latest mcp init --client claude
```

- 공식 shadcn/ui 팀(vercel/shadcn-ui)이 제공하는 서버
- API 키 없음 (공개 레지스트리 기준)
- githubRepo: "shadcn-ui/ui" (공식 모노레포, mcp init 명령으로 설정)
- installMode: "safe-copy"
- verificationStatus: "verified"
- Tools: 컴포넌트 검색, 설치, 레지스트리 조회

---

## Architecture Patterns

### Insertion Location in CORE_PLUGINS

카테고리 섹션 주석 바로 아래에 삽입. 기존 패턴:

```typescript
// ─────────────────────────────────────────────
// Data
// ─────────────────────────────────────────────
firecrawl: { ... },
"brave-search": { ... },
// → 여기에 fetch 추가
```

각 카테고리별 삽입 위치:
- `data`: postgres 다음 (또는 섹션 끝)
- `integration`: git 다음 (또는 섹션 끝)
- `documentation`: notion 다음 (현재 notion 1개뿐)
- `ui-ux`: 현재 해당 섹션 없음 → 새 섹션 생성
- `workflow`: linear 다음 (또는 섹션 끝)

### PLUGIN_FIELD_OVERRIDES 패턴

```typescript
// 기존 예시 (git - Python/uvx 서버):
git: {
  officialStatus: "official",
  verificationStatus: "verified",
  difficulty: "intermediate",
  installMode: "manual-required",
  prerequisites: ["Git 설치 및 PATH 등록", "Python 또는 uvx (uv) 설치"],
  bestFor: ["로컬 Git 자동화", "커밋/브랜치 관리", "diff 분석"],
  avoidFor: ["GitHub API 기반 협업 (→ GitHub MCP 사용)"],
},
```

fetch/time은 git과 동일한 Python/uvx 패턴. prerequisites 동일하게 설정.

### ui-ux 섹션 신설

현재 plugins.ts에 `ui-ux` 카테고리 섹션이 없다. magic-mcp와 shadcn-mcp 추가 시 새 섹션 헤더 주석 생성:

```typescript
// ─────────────────────────────────────────────
// UI/UX
// ─────────────────────────────────────────────
"magic-mcp": { ... },
"shadcn-mcp": { ... },
```

### pluginDescEn 패턴

```typescript
// lib/i18n/plugins-en.ts
export const pluginDescEn: Record<string, { desc: string; longDesc: string }> = {
  // 기존 항목들...
  fetch: {
    desc: "One-line English description.",
    longDesc: "Multi-sentence English description matching Korean longDesc content.",
  },
  // ...
};
```

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| type 자동 주입 | CORE_PLUGINS에 type 필드 추가 | DEFAULT_PLUGIN_FIELDS | v1.2 결정사항 — type: "mcp" 자동 주입됨 |
| 운영 필드 관리 | CORE_PLUGINS에 verificationStatus 등 직접 추가 | PLUGIN_FIELD_OVERRIDES | 데이터와 운영 필드 분리 원칙 |
| 추천 엔진 연동 | 별도 등록 로직 | keywords 배열만 정확히 작성 | scoring.ts가 keywords 기반으로 자동 매칭 |
| /plugins 탭 노출 | UI 변경 | category 필드 정확히 설정 | MCP 탭 필터는 type: "mcp"로 자동 |

---

## Common Pitfalls

### Pitfall 1: Python 서버에 npx 명령 사용
**What goes wrong:** fetch, time, markitdown은 Python 기반이므로 npx가 아닌 uvx/pip 사용
**Why it happens:** npm 기반 서버와 혼동
**How to avoid:** install 필드에 `uvx mcp-server-fetch`, `uvx mcp-server-time` 사용
**Warning signs:** npm 패키지 검색 시 해당 이름 없음

### Pitfall 2: magic-mcp를 API 키 없는 서버로 등록
**What goes wrong:** TWENTY_FIRST_API_KEY 없이는 동작하지 않음
**Why it happens:** 무료 베타 기간이라 착각
**How to avoid:** requiredSecrets에 명시, avoidFor에 "API 키 없는 환경" 추가, installMode: "external-setup"

### Pitfall 3: n8n-mcp를 n8n 인스턴스 필수로 잘못 설명
**What goes wrong:** n8n 없어도 문서/검증 모드(7개 core tools)로 동작
**How to avoid:** desc/longDesc에 "n8n 없이도 기본 사용 가능" 명시

### Pitfall 4: shadcn-mcp install 명령 오류
**What goes wrong:** npm/yarn/npx 대신 pnpm dlx 사용 필요
**Why it happens:** 공식 shadcn/ui는 pnpm 기반 CLI
**How to avoid:** `pnpm dlx shadcn@latest mcp init --client claude` verbatim 복사

### Pitfall 5: CORE_PLUGINS에 type 필드 추가
**What goes wrong:** PluginSeed 타입에는 type 없음 → TypeScript 오류
**Why it happens:** Plugin 타입과 혼동
**How to avoid:** type은 PLUGIN_FIELD_OVERRIDES에서만 (MCP 서버는 불필요 — DEFAULT가 "mcp" 주입)

### Pitfall 6: ui-ux 섹션 누락
**What goes wrong:** magic-mcp, shadcn-mcp가 카테고리 섹션 없이 삽입됨
**How to avoid:** `// ─── UI/UX ───` 주석 섹션 먼저 생성

---

## Code Examples

### fetch 항목 전체 예시 (PluginSeed)

```typescript
// Source: github.com/modelcontextprotocol/servers/src/fetch README (2026-03-19)
fetch: {
  id: "fetch",
  name: "Fetch MCP",
  tag: "FCH",
  color: "#0EA5E9",
  category: "data",
  githubRepo: "modelcontextprotocol/servers",
  desc: "URL 내용을 Markdown으로 변환 fetch. HTTP 요청, 웹 스크래핑, API 응답 조회.",
  longDesc:
    "Fetch MCP는 지정한 URL의 웹 페이지나 API 응답을 Markdown으로 변환해서 Claude Code에 전달해주는 서버예요. ...",
  url: "https://github.com/modelcontextprotocol/servers/tree/main/src/fetch",
  install: [
    "claude mcp add fetch -- uvx mcp-server-fetch",
  ],
  features: [
    "URL → Markdown 변환",
    "페이지네이션 지원 (start_index)",
    "raw 모드 (Markdown 변환 없이 원본)",
    "로컬/내부 IP 접근 가능",
  ],
  conflicts: [],
  keywords: [
    "http요청", "api호출", "url", "fetch", "REST",
    "웹페이지", "스크래핑", "scrape", "html",
    "get", "request", "웹", "web",
  ],
},
```

### PLUGIN_FIELD_OVERRIDES fetch 예시

```typescript
fetch: {
  officialStatus: "official",
  verificationStatus: "verified",
  difficulty: "beginner",
  installMode: "safe-copy",
  prerequisites: ["Python 또는 uvx (uv) 설치"],
  bestFor: ["단순 HTTP 데이터 조회", "웹 페이지 요약", "API 응답 파싱"],
},
```

### pluginDescEn fetch 예시

```typescript
fetch: {
  desc: "Fetches URLs and converts content to Markdown. Essential for HTTP requests, web scraping, and API response inspection.",
  longDesc: "Fetch MCP is an official MCP server that retrieves web pages and API responses, converting them to Markdown for Claude Code. ...",
},
```

### n8n-mcp install 명령 (multi-line 배열)

```typescript
// Source: github.com/czlonkowski/n8n-mcp/blob/main/docs/CLAUDE_CODE_SETUP.md (2026-03-19)
install: [
  "claude mcp add n8n-mcp -e MCP_MODE=stdio -e LOG_LEVEL=error -e DISABLE_CONSOLE_OUTPUT=true -- npx n8n-mcp",
],
```

---

## State of the Art

| Server | GitHub Repo | Status (2026-03) | Key Detail |
|--------|------------|-----------------|------------|
| fetch | modelcontextprotocol/servers (main) | Active, official | Python, uvx |
| time | modelcontextprotocol/servers (main) | Active, official | Python, uvx |
| markitdown-mcp | microsoft/markitdown | Active, official | pip install, Microsoft |
| magic-mcp | 21st-dev/magic-mcp | Active, community, Beta | Requires API key |
| n8n-mcp | czlonkowski/n8n-mcp | Active, community | Works without n8n instance |
| shadcn/ui MCP | shadcn-ui/ui (monorepo) | Active, official | pnpm dlx |

---

## Open Questions

1. **markitdown install 명령 형식**
   - What we know: `pip install markitdown-mcp` + `markitdown-mcp` 실행 — claude mcp add 단일 명령 없음
   - What's unclear: `claude mcp add markitdown -- python -m markitdown_mcp` 패턴 가능 여부 미확인
   - Recommendation: install 배열을 2줄로 작성 (`pip install markitdown-mcp`, `markitdown-mcp`). installMode: "manual-required"로 설정하고 longDesc에 수동 설정 필요 안내 포함

2. **magic-mcp officialStatus**
   - What we know: 21st.dev 회사가 개발, Beta 상태, API 키 필요
   - What's unclear: "official"(Anthropic 공식) vs "community" 분류
   - Recommendation: `officialStatus: "community"` — Anthropic 공식이 아닌 써드파티

3. **n8n-mcp installMode**
   - What we know: 기본 모드(API 없음)는 npx로 즉시 실행 가능
   - What's unclear: n8n API 연동 필요 시 "external-setup"이 더 정확
   - Recommendation: `installMode: "safe-copy"` (기본 문서 모드 기준). longDesc에 API 연동 옵션 별도 안내

---

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Vitest (vitest.config.ts) |
| Config file | vitest.config.ts |
| Quick run command | `pnpm test -- plugins` |
| Full suite command | `pnpm test` |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| MCP-01 | fetch가 PLUGINS에 존재하고 type === 'mcp' | unit | `pnpm test -- plugins` | ✅ lib/__tests__/plugins.test.ts |
| MCP-02 | time이 PLUGINS에 존재하고 type === 'mcp' | unit | `pnpm test -- plugins` | ✅ |
| MCP-03 | markitdown이 PLUGINS에 존재하고 type === 'mcp' | unit | `pnpm test -- plugins` | ✅ |
| MCP-04 | magic-mcp가 PLUGINS에 존재하고 type === 'mcp' | unit | `pnpm test -- plugins` | ✅ |
| MCP-05 | n8n-mcp가 PLUGINS에 존재하고 type === 'mcp' | unit | `pnpm test -- plugins` | ✅ |
| MCP-06 | shadcn-mcp가 PLUGINS에 존재하고 type === 'mcp' | unit | `pnpm test -- plugins` | ✅ |
| MCP-01~06 | 6개 모두 category/keywords 정확히 설정 | unit (수동 검증) | `pnpm typecheck` | ✅ |

**Note:** 현재 plugins.test.ts의 카운트 임계값은 ≥42. 6개 추가 후 48개가 되므로 테스트는 자동 통과 (≥42 조건 충족). Phase 15(VER-03)에서 ≥48로 업데이트 예정 — Phase 13 범위 외.

### Sampling Rate
- **Per task commit:** `pnpm typecheck && pnpm test -- plugins`
- **Per wave merge:** `pnpm typecheck && pnpm lint && pnpm test`
- **Phase gate:** `pnpm typecheck && pnpm lint && pnpm build && pnpm test` 모두 통과

### Wave 0 Gaps
None — 기존 test infrastructure가 모든 phase 요구사항을 커버함.

---

## Sources

### Primary (HIGH confidence)
- `modelcontextprotocol/servers` src/fetch README — install cmd, tools, no API key (fetched 2026-03-19)
- `modelcontextprotocol/servers` src/time README — install cmd, tools, LOCAL_TIMEZONE (fetched 2026-03-19)
- `microsoft/markitdown` packages/markitdown-mcp README — pip install, convert_to_markdown tool (fetched 2026-03-19)
- `21st-dev/magic-mcp` README + llms-install.md — CLI install, TWENTY_FIRST_API_KEY (fetched 2026-03-19)
- `czlonkowski/n8n-mcp` docs/CLAUDE_CODE_SETUP.md — verbatim claude mcp add cmd (fetched 2026-03-19)
- `ui.shadcn.com/docs/mcp` 공식 shadcn/ui 문서 — pnpm dlx install cmd (fetched 2026-03-19)

### Secondary (MEDIUM confidence)
- WebSearch "n8n-mcp MCP server GitHub install command claude 2025" — claude mcp add 명령 패턴 확인
- WebSearch "shadcn-mcp MCP server GitHub install command claude 2025" — 복수 구현체 중 공식 확인

### Tertiary (LOW confidence)
- None

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — 기존 코드 직접 확인, 타입 구조 검증
- Install commands: HIGH — 공식 README 6개 모두 직접 fetch 확인
- Architecture: HIGH — 기존 42개 항목 패턴 분석 완료
- Pitfalls: HIGH — Python vs npm 구분, type 주입 방식 코드 확인

**Research date:** 2026-03-19
**Valid until:** 2026-04-19 (stable repos; magic-mcp beta status 변경 가능)
