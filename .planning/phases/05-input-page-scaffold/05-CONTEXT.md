# Phase 5: Input & Page Scaffold - Context

**Gathered:** 2026-03-16
**Status:** Ready for planning

<domain>
## Phase Boundary

/optimizer 페이지를 생성하고, 사용자가 현재 플러그인 조합을 두 가지 방법(붙여넣기, 직접 타이핑)으로 입력할 수 있게 한다. 분석 로직(점수/충돌/추천)은 Phase 6 범위. 이 Phase는 입력 + 페이지 쉘 + 다국어 + Coming Soon AI 표시까지.

</domain>

<decisions>
## Implementation Decisions

### 입력 UI 레이아웃
- 탭 2개로 분리: "붙여넣기" / "직접 입력" — 기존 advisor의 text/file/github 탭 패턴과 일관
- "분석하기" 버튼은 플러그인 1개 이상 선택 시 활성화
- AI 분석 버튼은 Coming Soon 레이블로 비활성 표시

### 자동완성
- 드롭다운 목록 방식: 타이핑하면 필터링된 플러그인 목록 표시, 클릭으로 선택
- 42개 DB 기반 — Fuse.js 불필요, substring 매칭으로 충분할 가능성 높음 (Claude 판단)

### 선택된 플러그인 표시
- 배지/칩 형태로 가로 나열, X 버튼으로 삭제
- 각 칩에 표시: 플러그인 이름 + 카테고리 아이콘 + 1줄 desc
- verificationStatus 배지는 표시하지 않음

### MCP list 파싱 피드백
- 인식 못한 플러그인은 별도 섹션("인식 못한 플러그인")에 이름 나열 — 점수에 미반영
- 붙여넣기 성공 후 피드백: Claude 재량

### 페이지 톤
- 헤더 스타일: Claude 재량 (기존 advisor 스타일 참고)
- 초기 화면(빈 상태): "예: claude mcp list 결과를 붙여넣으세요" 안내 + 샘플 버튼

### Claude's Discretion
- 헤더 디자인 (제목, 아이콘, 설명문)
- 붙여넣기 성공 후 피드백 방식 (즉시 칩 vs 요약+확인)
- 자동완성 라이브러리 선택 (Fuse.js vs substring)
- 에러 상태 핸들링

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `hooks/useAnalysis.ts`: step machine 패턴 (input → analyzing → result) — `useOptimizer` 훅에 동일 패턴 적용
- `components/InputPanel.tsx`: 탭 기반 입력 UI 패턴 — 구조 참고 (코드 복사 아님)
- `lib/conflicts.ts`: `getConflicts()`, `CONFLICT_PAIRS`, `REDUNDANCY_GROUPS` — Phase 6에서 직접 사용
- `components/ConflictWarning.tsx`: 충돌 경고 UI — Phase 6에서 재사용 가능
- shadcn/ui: `Button`, `Input`, `Textarea`, `Badge`, `Tabs` 등 컴포넌트 활용

### Established Patterns
- `useI18n()` 훅으로 다국어 처리 — 동일 패턴 사용
- `lib/i18n/ko.ts`, `lib/i18n/en.ts`에 번역 키 추가
- `cn()` 유틸리티로 조건부 클래스 결합
- 서버 컴포넌트 기본, 클라이언트 필요 시 `'use client'` 명시

### Integration Points
- `components/Nav.tsx`: links 배열에 /optimizer 항목 추가
- `app/optimizer/page.tsx`: Next.js App Router 페이지 생성
- `lib/plugins.ts`: PLUGINS 배열에서 자동완성 데이터 소스
- `lib/types.ts`: OptimizerResult 타입 추가

</code_context>

<specifics>
## Specific Ideas

- 기존 /advisor 페이지의 탭 패턴과 시각적 일관성 유지
- "claude mcp list 결과를 붙여넣으세요" 예시 안내가 초기 화면의 핵심
- 칩에 카테고리 아이콘 포함하여 한눈에 어떤 종류의 플러그인인지 파악 가능

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 05-input-page-scaffold*
*Context gathered: 2026-03-16*
