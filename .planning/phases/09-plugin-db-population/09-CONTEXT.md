# Phase 9: Plugin DB Population - Context

**Gathered:** 2026-03-18
**Status:** Ready for planning

<domain>
## Phase Boundary

주요 Plugin 10-15개를 검증된 메타데이터(install, category, keywords, features)와 한/영 번역(desc/longDesc)을 갖추어 DB에 등록한다. 기존 42개 MCP 항목 중 실제 Plugin인 것들을 재분류하고, 신규 Plugin도 추가한다.

</domain>

<decisions>
## Implementation Decisions

### Plugin 선정 방식
- 기존 재분류 + 신규 추가 병행
- 기존 42개 중 install 명령어가 `claude plugin add` / `git clone ~/.claude/` 패턴인 항목은 Plugin으로 재분류
- 재분류는 PLUGIN_FIELD_OVERRIDES에 `type: 'plugin'` 추가로 처리
- 신규 Plugin은 연구 단계에서 GitHub 리서치를 통해 발굴

### 분류 규칙
- 공식 install 명령어(README 권장 방법) 기준으로 분류
- 두 가지 설치 방법을 제공하는 항목은 공식 권장 방법만 install 필드에 등록, 분류도 그 기준
- Phase 8에서 확정된 규칙 유지: `claude mcp add` / `npx` / `uvx` = 'mcp', `claude plugin add` / `git clone ~/.claude/` = 'plugin'

### 비활성/미검증 항목 처리
- GitHub 레포 확인 불가 등 미검증 항목도 DB에 등록
- maintenanceStatus: 'unmaintained' 또는 verificationStatus: 'unverified'로 표시하여 사용자에게 투명하게 안내

### 메타데이터 검증 수준
- GitHub README 기반 검증 (실제 CLI 테스트는 Out of Scope)
- install 명령어, features, 설명을 README에서 추출

### Category 분류
- 기존 10개 카테고리 유지 (orchestration, workflow, code-quality, testing, documentation, data, security, integration, ui-ux, devops)
- 신규 카테고리 추가 없음

### Keywords 선정
- 기능 키워드 + 사용자가 검색할 법한 시나리오 용어 조합
- 기존 MCP 항목들의 keywords 패턴 따름

### Claude's Discretion
- 신규 Plugin 최종 목록 (리서치 결과에 따라)
- 각 항목의 difficulty, bestFor, avoidFor 세부 내용
- keywords 구체적 선정

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `PLUGIN_FIELD_OVERRIDES`: 기존 항목의 type 재분류에 사용. `type: 'plugin'` override 추가만으로 재분류 완료
- `DEFAULT_PLUGIN_FIELDS`: type 기본값 'mcp' — 신규 Plugin은 반드시 PLUGIN_FIELD_OVERRIDES에 type: 'plugin' 명시 필요
- `plugins-en.ts`: desc/longDesc 영문 번역 패턴 확립됨. 이미 omc, superpowers, agency-agents, bkit-starter, bkit, ralph, taskmaster 7개 번역 존재

### Established Patterns
- `PluginSeed`: 핵심 필드만 포함 (id, name, tag, color, desc, longDesc, url, githubRepo, category, install, features, conflicts, keywords)
- `PluginOperationalFields`: 운영 필드 (officialStatus, verificationStatus, difficulty, prerequisites, requiredSecrets, platformSupport, installMode, maintenanceStatus, bestFor, avoidFor, type)
- 번역: plugins.ts에 한국어 desc/longDesc 기본 → plugins-en.ts에 영문 desc/longDesc만 등록

### Integration Points
- `lib/plugins.ts`: CORE_PLUGINS에 신규 PluginSeed 추가, PLUGIN_FIELD_OVERRIDES에 운영 필드 + type override
- `lib/i18n/plugins-en.ts`: 신규 항목 영문 번역 추가
- `lib/scoring.ts`: Phase 10에서 typeScope 파라미터 추가 시 새 Plugin 항목들이 필터링 대상

</code_context>

<specifics>
## Specific Ideas

No specific requirements — standard data population following existing patterns.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 09-plugin-db-population*
*Context gathered: 2026-03-18*
