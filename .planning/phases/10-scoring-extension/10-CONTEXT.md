# Phase 10: Scoring Extension - Context

**Gathered:** 2026-03-18
**Status:** Ready for planning

<domain>
## Phase Boundary

scorePlugins 함수에 typeScope 파라미터를 추가하여 MCP/Plugin별 보완 추천과 대체 추천을 분리한다. 커버리지 계산은 전체 카테고리 기준을 유지하되, complements와 replacements만 typeScope으로 필터링한다. 기존 MCP 전용 사용자의 점수는 동일하게 유지된다.

</domain>

<decisions>
## Implementation Decisions

### typeScope 파라미터
- 타입: `ItemType | 'both'` ('mcp' | 'plugin' | 'both')
- 기본값: `'both'` — 하위 호환성 유지, 기존 코드가 typeScope 없이 호출해도 동일 동작
- ScoringResult에 typeScope 필드 추가하여 반환 — UI에서 타입명 포함 라벨 생성에 사용

### 혼합 입력 처리
- 타입 감지 로직은 scorePlugins 외부(호출자 = 옵티마이저/recommend.ts)에서 처리
- 호출자가 입력 ID들의 type을 확인하여 MCP만이면 'mcp', Plugin만이면 'plugin', 섞여있으면 'both'로 typeScope 결정 후 전달
- scorePlugins는 순수 스코어링만 담당, 타입 감지 책임 없음

### 커버리지 계산 범위
- buildCoverage는 전체 10개 카테고리 대비 커버리지 유지 (변경 없음)
- 점수 계산(calculateScore)도 기존과 동일 (변경 없음)
- buildComplements만 typeScope에 맞는 항목으로 필터링
- buildReplacements도 typeScope에 맞는 항목으로 필터링
- 결과: MCP 모드에서 Plugin 보완/대체 추천 안 나옴, Plugin 모드에서 MCP 보완/대체 추천 안 나옴

### 점수 라벨
- ScoringResult에 typeScope 필드 포함하여 반환
- UI에서 typeScope 값으로 라벨 생성: 'mcp' → 'MCP 조합 점수', 'plugin' → 'Plugin 조합 점수', 'both' → '조합 점수'
- 라벨 생성 책임은 UI 컴포넌트에 있음 (scoring.ts는 데이터만 반환)

### Claude's Discretion
- buildComplements/buildReplacements 내부의 필터링 구현 방식 (early filter vs late filter)
- 타입 감지 유틸리티 함수의 위치와 이름
- 테스트 구조 (기존 scoring.test.ts 확장 vs 신규 파일)

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `scorePlugins(ids: string[]): ScoringResult` — 현재 시그니처. typeScope 파라미터 추가 위치
- `buildComplements(uncovered, ids)` — 보완 추천 생성. typeScope 필터링 추가 위치
- `buildReplacements(ids)` — 대체 추천 생성. typeScope 필터링 추가 위치
- `PLUGINS` export — 각 항목의 `.type` 필드로 필터링 가능

### Established Patterns
- scoring.ts는 순수 함수 (side effect 없음)
- ScoringResult 타입에 score, conflicts, redundancies, coverage, complements, replacements 필드
- 모든 Plugin 데이터는 `PLUGINS` 객체에서 조회

### Integration Points
- `lib/scoring.ts:189` — scorePlugins 시그니처 변경
- `lib/scoring.ts:113` — buildComplements 필터링 추가
- `lib/scoring.ts:140` — buildReplacements 필터링 추가
- 호출자: 옵티마이저 UI / recommend.ts — typeScope 결정 후 전달

</code_context>

<specifics>
## Specific Ideas

- 기존 MCP 전용 사용자의 조합 점수가 Phase 9 이전과 동일해야 함 (회귀 방지)
- SCORE-04 (크로스 타입 충돌 감지)는 Future Requirements로 이미 정의됨 — Phase 10 범위 밖

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 10-scoring-extension*
*Context gathered: 2026-03-18*
