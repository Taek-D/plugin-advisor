# Phase 13: MCP 서버 6개 등록 - Context

**Gathered:** 2026-03-19
**Status:** Ready for planning

<domain>
## Phase Boundary

fetch, time, markitdown, magic-mcp, n8n-mcp, shadcn-mcp 6개 MCP 서버를 lib/plugins.ts(CORE_PLUGINS) + lib/i18n/plugins-en.ts(pluginDescEn)에 등록한다. UI/기능 변경 없이 순수 데이터 추가만 수행한다.

</domain>

<decisions>
## Implementation Decisions

### 카테고리 배정
- fetch → `data` (HTTP 데이터 조회 성격, supabase/postgres와 같은 그룹)
- time → `integration` (시스템 유틸리티 성격, todoist/slack과 같은 그룹)
- markitdown → `documentation` (파일→Markdown 변환, repomix/mermaid와 같은 그룹)
- magic-mcp → `ui-ux` (AI UI 컴포넌트 생성, storybook/figma와 같은 그룹)
- shadcn-mcp → `ui-ux` (shadcn/ui 컴포넌트 라이브러리, magic-mcp와 같은 그룹)
- n8n-mcp → `workflow` (워크플로 자동화, taskmaster/gsd와 같은 그룹)

### 키워드 설계
- 기존 플러그인과 키워드 겹침 허용 — 사용자가 여러 추천 결과를 보고 선택
- 한국어 위주 + 영어 보조 (기존 패턴 동일, 한국어 7-8개 + 영어 5-6개)
- fetch: HTTP/API 중심 키워드 ('http요청', 'api호출', 'url', 'fetch', 'REST', '웹페이지', '스크래핑', 'scrape', 'html')
- shadcn vs magic: 역할 구분 — shadcn은 컴포넌트 라이브러리 키워드, magic은 AI UI 생성 키워드
- n8n: '자동화' 키워드 포함 허용 (fireauto, superpowers와 겹침 OK)
- time, markitdown: Claude 재량으로 README 기반 키워드 선정

### 충돌 관계
- 6개 모두 `conflicts: []` — 기존 플러그인과 충돌 없음
- fetch ↔ firecrawl: 충돌 아님 (단순 HTTP vs 전체 사이트 크롤링 — 용도 다름)
- shadcn ↔ magic: 충돌 아님 (기존 라이브러리 접근 vs AI 생성 — 보완 관계)

### bestFor/avoidFor 기준
- 기존 패턴 동일: bestFor 2-3개, avoidFor 0-1개
- avoidFor: requiredSecrets가 있는 서버만 'API 키 없는 환경' 추가, 로컬 서버는 제외
- 유스케이스 중심 작성 — 사용자 유형('프론트엔드 개발자') 대신 사용 상황('UI 컴포넌트 생성')으로

### Claude's Discretion
- 각 서버의 tag(약어), color(헥스 코드) 선정
- features 배열 구성 (README 기반 주요 기능 3-4개)
- 구체적 키워드 목록 최종 결정 (time, markitdown)
- desc/longDesc 한국어 작성 톤 (기존 항목과 일관되게)
- difficulty 설정 (README 기반 판단)

</decisions>

<specifics>
## Specific Ideas

- install 명령은 반드시 공식 GitHub README를 fetch 후 verbatim 복사 (v1.0 결정사항)
- CORE_PLUGINS에 type 필드 없음 — DEFAULT_PLUGIN_FIELDS가 `type: "mcp"` 자동 주입 (v1.2 결정사항)
- PLUGIN_FIELD_OVERRIDES에 verificationStatus, difficulty, bestFor, avoidFor 등 운영 필드 선언

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- `CORE_PLUGINS` (lib/plugins.ts:413): PluginSeed 형식으로 신규 항목 추가 위치
- `PLUGIN_FIELD_OVERRIDES` (lib/plugins.ts:37): verificationStatus, bestFor 등 운영 필드 오버라이드
- `DEFAULT_PLUGIN_FIELDS` (lib/plugins.ts:23): type: "mcp" 자동 주입 — MCP 서버는 오버라이드 불필요
- `pluginDescEn` (lib/i18n/plugins-en.ts): 영문 desc + longDesc 추가 위치

### Established Patterns
- PluginSeed 타입: id, name, tag, color, category, githubRepo, desc, longDesc, url, install, features, conflicts, keywords
- 운영 필드는 PLUGIN_FIELD_OVERRIDES에서만 관리 (CORE_PLUGINS와 분리)
- install은 string[] 배열 (여러 줄 명령 지원)
- 카테고리 섹션 주석으로 구분: `// ─── Category ───`

### Integration Points
- /advisor 추천 엔진: keywords 배열로 자동 매칭 참여
- /optimizer 보완 추천: category 기반 자동 참여
- /plugins 카탈로그: MCP 탭에 자동 표시

</code_context>

<deferred>
## Deferred Ideas

None — 논의가 페이즈 범위 내에서 진행됨.

</deferred>

---

*Phase: 13-mcp-6*
*Context gathered: 2026-03-19*
