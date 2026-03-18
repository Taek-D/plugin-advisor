# Phase 6: Scoring Engine - Context

**Gathered:** 2026-03-17
**Status:** Ready for planning

<domain>
## Phase Boundary

입력된 플러그인 조합에 대해 충돌 감지, 조합 점수(0-100), 커버리지 분석, 보완/대체 추천을 계산하는 순수 로직 엔진. UI 표시는 Phase 7 범위. API route 없이 클라이언트사이드 순수 함수로 구현.

</domain>

<decisions>
## Implementation Decisions

### 점수 공식
- 100점 출발 감점 방식 — 문제가 없으면 높은 점수, 문제가 있으면 깎이는 직관적 모델
- 충돌(CONFLICT_PAIRS): 강한 감점 (-15~20점/건)
- 중복(REDUNDANCY_GROUPS): 약한 감점 (-5~8점/건)
- 커버리지: 점수의 핵심 요소 — 미커버 카테고리가 많으면 점수 크게 하락
- 검증상태(verificationStatus): 점수에 영향 없음 — 대체 추천에서만 안내

### 보완 추천 범위
- 미커버 카테고리당 최대 1개 플러그인 제안 (최대 10개, 미커버 카테고리 수만큼)
- 우선순위: 검증상태(verified 우선) + 난이도(beginner 우선) — 기존 getTrustScore() 로직 재활용
- 설치 명령어는 데이터에 포함하지 않음 — Phase 7 UI에서 PLUGINS[id].install 참조

### 대체 추천 기준
- 발동 조건: deprecated, unverified, partial(verificationStatus) 플러그인이 조합에 포함된 경우
- 대안 탐색: 같은 category의 verified 플러그인 중 선택
- 개수: 문제 플러그인당 최선의 대안 1개만 제시
- 데이터 구조: { original: pluginId, reason: 'deprecated'|'unverified'|'partial', replacement: pluginId }
- 대안이 없는 경우 (같은 카테고리에 verified가 없음): replacement를 null로 두되 문제는 안내

### 커버리지 판정
- 단순 유무 방식: 카테고리에 플러그인이 1개라도 있으면 커버됨
- 10개 카테고리 모두 동등한 가중치
- 선형 감점: 미커버 카테고리 1개당 동일한 점수 감점
- 빈 입력 (0개 플러그인): 점수를 계산하지 않고 "플러그인을 추가해주세요" 안내 메시지 반환

### Claude's Discretion
- 점수 공식의 세부 가중치 수치 (커버리지/충돌/중복 간 정확한 점수 배분, 선형 감점의 구체적 수치)
- 보완 추천 결과 데이터 구조 설계
- 대체 추천에서 "최선의 대안" 선택 우선순위 (getTrustScore 재활용 등)
- 함수 시그니처 및 모듈 분리 방식

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `lib/conflicts.ts`: `getConflicts()` (충돌 감지), `getRedundancies()` (중복 감지) — 그대로 재사용
- `lib/recommend.ts`: `getTrustScore()` — 보완 추천 우선순위에 재활용
- `lib/types.ts`: `AnalysisResult.complements`, `AnalysisResult.redundancies` 필드 이미 정의
- `lib/types.ts`: `OptimizerInputPlugin` 타입 — Phase 5에서 정의 완료
- `lib/plugins.ts`: PLUGINS 객체 — 42개 플러그인, category 필드로 커버리지 계산

### Established Patterns
- 순수 함수 패턴 (Phase 5의 parseMcpList, resolvePluginId 등)
- 10개 PluginCategory: orchestration, workflow, code-quality, testing, documentation, data, security, integration, ui-ux, devops
- `useI18n()` 훅으로 다국어 처리

### Integration Points
- Phase 5의 `OptimizerInputPlugin[]` → Phase 6 스코어링 함수 입력
- Phase 6 결과 → Phase 7 UI 컴포넌트에서 소비
- `getConflicts(selectedIds)`, `getRedundancies(selectedIds)` 직접 호출

</code_context>

<specifics>
## Specific Ideas

- 기존 /advisor의 추천 엔진(recommend.ts)과는 별도 모듈 — 목적이 다름 (프로젝트 분석 vs 조합 분석)
- STATE.md 캐리포워드: `getConflicts()` 독점 사용, `plugin.conflicts[]` 직접 참조 금지
- STATE.md 캐리포워드: `buildComplements(installedIds)` 필터링 필수 — 이미 설치된 플러그인 재추천 방지

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 06-scoring-engine*
*Context gathered: 2026-03-17*
