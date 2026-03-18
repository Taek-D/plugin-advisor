# Phase 12: Optimizer UI + i18n - Context

**Gathered:** 2026-03-18
**Status:** Ready for planning

<domain>
## Phase Boundary

/optimizer 페이지의 붙여넣기 힌트/라벨이 MCP + Plugin 두 포맷을 안내하고, 샘플 데이터가 혼합 구성이며, 자동완성 드롭다운과 선택 칩에 타입 뱃지가 표시되고, 변경된 텍스트의 i18n이 한/영 동기화된다.

</domain>

<decisions>
## Implementation Decisions

### 붙여넣기 힌트/라벨 문구
- pasteLabel: "MCP / Plugin 목록" 형태의 통합 라벨 (두 타입을 함께 언급하는 짧은 라벨)
- pasteHint: "터미널에서 claude mcp list 또는 claude plugin list 명령어를 실행한 후 결과를 복사해서 붙여넣으세요" — 두 명령어를 한 문장에 병기
- pastePlaceholder: "MCP / Plugin 목록을 붙여넣으세요..." 형태의 통합 placeholder
- emptyState: "MCP 또는 Plugin 목록을 붙여넣거나 플러그인을 검색하세요" 형태의 통합 문구

### 샘플 데이터 구성
- MCP 3개 + Plugin 2개 혼합: context7, playwright, github (MCP) + superpowers, omc (Plugin)
- 혼합 샘플로 typeScope 'both' 트리거 및 충돌 감지 체험 가능
- Plugin 부분의 포맷(claude plugin list 출력 형식)은 Claude 재량으로 리서치 후 결정

### 타입 뱃지 디자인 (자동완성 드롭다운)
- 위치: 플러그인 이름 오른쪽에 배치 (카테고리는 그대로 유지)
- 스타일: shadcn Badge 컴포넌트, 색상 구분 — MCP는 파란계, Plugin은 보라계
- 크기: 작은 사이즈 (text-[10px] 수준)
- SelectedPluginChips에도 동일한 타입 뱃지 추가

### i18n 처리
- 기존 optimizer 키(pasteLabel, pasteHint, pastePlaceholder, emptyState) 값만 수정 — ko.ts + en.ts 양쪽
- Translations 타입에 새 키 추가하지 않음 — 기존 키 값 변경만으로 충분
- MCP/Plugin 뱃지 텍스트는 proper noun이므로 i18n 키 없이 하드코딩 (Phase 11 결정 연장)

### Claude's Discretion
- 뱃지 정확한 색상 값 (파란계/보라계 내에서 구체적 hex/tailwind class)
- Plugin 샘플 데이터의 정확한 포맷 (claude plugin list 실제 출력 형식 리서치)
- 뱃지의 정확한 padding/border-radius 값

</decisions>

<specifics>
## Specific Ideas

- 뱃지 미리보기에서 보여준 레이아웃: `● context7 [MCP] integration` 형태
- 샘플 데이터 미리보기: MCP 3줄 + 빈줄 + Plugin 2줄 형태로 구성
- superpowers + omc를 샘플 Plugin으로 선택한 이유: 둘 다 orchestration 카테고리라 충돌 감지 체험 가능

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- `Badge` (components/ui/badge.tsx): 타입 뱃지에 직접 사용 가능
- `PluginTypeInput` (components/PluginTypeInput.tsx): 드롭다운에 뱃지 추가 위치 명확 (line 153-159 영역)
- `SelectedPluginChips` (components/SelectedPluginChips.tsx): 칩에 뱃지 추가
- `McpPasteInput` (components/McpPasteInput.tsx): pasteLabel, pasteHint, pastePlaceholder 사용 위치
- `OptimizerApp` (components/OptimizerApp.tsx): handleSampleData, emptyState 사용 위치

### Established Patterns
- i18n 패턴: `t.optimizer.keyName` 형태로 접근, ko.ts/en.ts 동시 수정
- MCP/Plugin proper noun 하드코딩 패턴: Phase 11에서 TabsTrigger에 "MCP"/"Plugin" 직접 작성
- Plugin.type 접근: `plugin.type` ('mcp' | 'plugin') — Phase 8에서 필수 필드로 추가됨

### Integration Points
- `parseMcpList()`: 샘플 데이터 파싱에 사용 — Plugin 포맷도 파싱 가능한지 확인 필요
- `PLUGINS` 객체: 샘플 데이터의 plugin ID가 DB에 존재해야 매칭됨
- `filterPlugins()`: PluginTypeInput의 자동완성 필터링 — 뱃지는 렌더링 레이어만 변경

</code_context>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 12-optimizer-ui-i18n*
*Context gathered: 2026-03-18*
