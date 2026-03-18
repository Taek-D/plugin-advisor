# Phase 11: Catalog Tab UI - Context

**Gathered:** 2026-03-18
**Status:** Ready for planning

<domain>
## Phase Boundary

/plugins 페이지에서 MCP와 Plugin을 탭으로 분리하여 볼 수 있고, 탭 상태가 URL에 유지된다. 카테고리 필터와 타입 탭이 AND 조건으로 복합 필터링 가능.

</domain>

<decisions>
## Implementation Decisions

### 탭 배치 & 레이아웃
- 검색창 아래, 카테고리 pill 버튼 위에 타입 탭 배치
- 탭과 카테고리 사이 간격: mb-5 (시각적 계층 분리)
- 상위→하위 필터링 계층: 검색 → 타입 탭 → 카테고리 pill → 그리드

### 탭 스타일
- 기존 TabsTrigger 컴포넌트 재사용 (OptimizerApp과 동일한 사각형 border + bg 스타일)
- 카테고리 pill(rounded-full)과 시각적으로 구분되어 계층이 명확

### 탭 라벨 & 카운트
- 탭 텍스트는 영문 그대로: All / MCP / Plugin (MCP, Plugin은 고유명사)
- All만 i18n 처리 (한국어: 전체)
- 각 탭에 전체 카운트 배지 표시: All (55) / MCP (42) / Plugin (13)
- 카운트는 카테고리/검색 필터와 무관하게 항상 전체 수 (안정적, 예측 가능)

### 탭↔카테고리 상호작용
- 탭 전환 시 카테고리 필터 유지 (리셋하지 않음)
- AND 조건: 타입 + 카테고리 조합으로 0건이면 기존 empty state(SearchX 아이콘 + 결과 없음) 재사용
- 카테고리 리셋 버튼 등 추가 UI 불필요

### URL 상태 관리
- URL query param에 type만 저장: ?type=plugin, ?type=mcp (all이면 param 생략)
- 카테고리는 세션 상태로만 유지 (URL에 포함하지 않음)
- /plugins/[id]에서 뒤로가기 시 탭 상태 보존

### 페이지 헤더
- 제목 '플러그인 둘러보기' 고정 (탭 전환 시 변경 없음)
- 서브타이틀만 업데이트하여 MCP + Plugin 탭 존재를 반영

### Claude's Discretion
- 서브타이틀 구체적 문구
- empty state 하위 텍스트 (카테고리 리셋 안내 등)
- 검색어와 타입 필터 조합의 세부 UX

</decisions>

<specifics>
## Specific Ideas

- 탭 카운트 형식: `All (55)` — 괄호 안에 숫자, TabsTrigger 텍스트에 포함
- 기존 OptimizerApp의 TabsList + TabsTrigger 패턴을 그대로 따름
- 카테고리 pill과 시각적 차이: 사각형(탭) vs rounded-full(카테고리)로 계층 구분

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- `components/ui/tabs.tsx`: TabsList + TabsTrigger 컴포넌트 — active prop으로 선택 상태 표시
- `components/PluginSearch.tsx`: 카테고리 pill 필터 — onCategory 콜백 패턴
- `components/PluginGrid.tsx`: category 상태 관리 — activeType 상태 추가 필요
- `lib/types.ts`: ItemType = 'mcp' | 'plugin' 이미 정의됨

### Established Patterns
- PluginGrid는 'use client' 컴포넌트로 useState 기반 필터링
- PluginSearch에서 부모로 콜백 패턴 (onSearch, onCategory)
- 카테고리 필터: CATEGORY_KEYS 배열 + cn() 조건부 스타일링
- OptimizerApp: TabsList > TabsTrigger active={activeTab === "paste"} 패턴

### Integration Points
- `app/plugins/page.tsx`: 서버 컴포넌트 — useSearchParams 사용 불가, PluginGrid에서 URL 동기화 처리 필요
- `PLUGINS` 객체: Object.values(PLUGINS)로 전체 목록 접근, p.type으로 MCP/Plugin 필터링

</code_context>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 11-catalog-tab-ui*
*Context gathered: 2026-03-18*
