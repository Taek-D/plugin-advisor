# Phase 7: Results UI Assembly - Context

**Gathered:** 2026-03-17
**Status:** Ready for planning

<domain>
## Phase Boundary

Phase 6의 ScoringResult를 시각적으로 표시하는 결과 화면 조립. 점수/충돌/커버리지/추천을 한눈에 이해할 수 있는 구조로 화면에 표시하고, 전체 /optimizer 기능이 배포 가능한 상태로 만든다. 새로운 분석 로직은 범위 밖 — UI 조립과 연결만.

</domain>

<decisions>
## Implementation Decisions

### 결과 레이아웃
- 세로 스택 구조: 점수 → 충돌경고 → 커버리지 → 보완추천 → 대체추천 순서로 위에서 아래로 흐름
- 같은 페이지 스크롤: 입력 아래에 결과가 나타남 — 입력 접지 않음
- 애니메이션 전환: Analyze 버튼 클릭 시 분석 중 스피너 후 결과가 페이드인으로 나타남
- 충돌 0건일 때: "충돌 없음 ✔" 긍정 메시지 표시 (섹션 숨기지 않음)
- progressive disclosure: 보완/대체 추천은 접힌 상태로 시작, 사용자가 펼칠 수 있음 (PAGE-04)

### 점수 시각화
- 원형 게이지(circular gauge): 큰 원 안에 점수 숫자 + 등급 텍스트 표시
- 4등급 시스템: 80+ Excellent(녹), 60-79 Good(파랑), 40-59 Fair(노랑), 0-39 Poor(빨강)
- 감점 요인은 원형 게이지 아래에 색상 배지 태그로 표시: "충돌 -20" "중복 -7" "미커버 -14"
- 100점(감점 없음)일 때: 녹색 게이지 + "완벽한 조합!" 긍정 메시지

### 커버리지 표시
- 5x2 아이콘 그리드: 각 카테고리를 getCategoryIcon() 아이콘 + 이름으로 표시
- 커버된 카테고리는 밝게, 미커버는 희미하게(opacity) 표시
- 요약: "7/10 카테고리 커버" 분수 + 작은 프로그레스 바
- 미커버 카테고리 클릭 시 아래 보완 추천 섹션으로 자동 스크롤

### 추천 카드 디자인
- 풀 카드: 플러그인 이름 + 카테고리 아이콘 + 한 줄 설명 + 추천 이유 + 설치 명령 복사 버튼
- 플러그인 이름 클릭 시 /plugins/[id] 상세 페이지로 이동
- 보완 추천과 대체 추천은 별도 접힘 섹션으로 분리, 섹션 아이콘으로 구분
- 대체 추천 카드: "기존 → 대안" 화살표 표시 + 대체 이유 + 대안 설치 명령 복사

### Claude's Discretion
- 애니메이션 구현 방식 (CSS transition vs framer-motion 등)
- 정확한 간격/패딩 수치
- 스피너 디자인
- 컴포넌트 분리 구조
- 원형 게이지 구현 방식 (SVG circle, CSS conic-gradient 등)

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `components/OptimizerApp.tsx`: 입력 UI 완료, Analyze 버튼 미연결 — 여기에 결과 영역 추가
- `components/ConflictWarning.tsx`: 기존 충돌 경고 컴포넌트 — 재사용 가능성 확인 필요
- `lib/scoring.ts`: `scorePlugins(ids[])` → `ScoringResult` 반환
- `lib/plugins.ts`: `PLUGINS[id].install` — 설치 명령어 참조
- `components/ui/`: Card, Badge, Button, Collapsible 등 shadcn 컴포넌트
- `lib/i18n/`: `useI18n()` 훅 + `t.optimizer.*` 번역 키
- `lib/optimizer-utils.ts`: `getCategoryIcon()` — 카테고리별 lucide-react 아이콘

### Established Patterns
- 다크 테마: `surface-panel`, `rounded-[28px]`, `border-white/10`
- `animate-fade-in` CSS 클래스로 페이드 애니메이션
- 200줄 제한 → 컴포넌트 분리 필수

### Integration Points
- OptimizerApp.tsx의 `selectedPlugins` state → `scorePlugins(ids)` 호출
- ScoringResult의 각 필드 → 개별 결과 컴포넌트로 전달
- `PLUGINS[id]` 참조로 설치 명령어, 카테고리 아이콘, 상세 링크 등 표시

</code_context>

<specifics>
## Specific Ideas

- Phase 6 CONTEXT 캐리포워드: 설치 명령어는 Phase 7 UI에서 `PLUGINS[id].install` 참조
- ROADMAP success criteria: 보완/대체 추천은 접힌 상태로 시작하여 사용자가 펼칠 수 있다
- ROADMAP success criteria: 모바일과 데스크톱 양쪽에서 겹침이나 잘림 없이 정상 표시
- ROADMAP success criteria: 빈 조합(0개) 입력 시 에러가 아닌 안내 메시지 표시

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 07-results-ui-assembly*
*Context gathered: 2026-03-17*
