# Roadmap: Plugin Advisor

## Milestones

- ✅ **v1.0 Plugin Metadata Verification** — Phases 1-4 (shipped 2026-03-16)
- [ ] **v1.1 Plugin Optimizer** — Phases 5-7 (active)

## Phases

<details>
<summary>✅ v1.0 Plugin Metadata Verification (Phases 1-4) — SHIPPED 2026-03-16</summary>

- [x] Phase 1: Community Orchestration Plugins (1/1 plan) — completed 2026-03-11
- [x] Phase 2: Official MCP Monorepo Plugins (3/3 plans) — completed 2026-03-12
- [x] Phase 3: Platform & Official Plugins (3/3 plans) — completed 2026-03-12
- [x] Phase 4: Remaining Plugins & Sync (2/2 plans) — completed 2026-03-16

</details>

### v1.1 Plugin Optimizer

- [x] **Phase 5: Input & Page Scaffold** — /optimizer 페이지 생성, 붙여넣기/자동완성 입력, 다국어 지원, Coming Soon AI 모드
- [x] **Phase 6: Scoring Engine** — 규칙 기반 조합 점수, 충돌 감지, 커버리지 분석, 보완/대체 추천 로직 (completed 2026-03-16)
- [ ] **Phase 7: Results UI Assembly** — 결과 화면 조립, progressive disclosure, 네비게이션 링크, 배포

## Phase Details

### Phase 5: Input & Page Scaffold
**Goal**: 사용자가 /optimizer 페이지에 접근하여 현재 플러그인 조합을 두 가지 방법(붙여넣기, 직접 타이핑)으로 입력할 수 있다
**Depends on**: Nothing (v1.0 codebase is the foundation)
**Requirements**: INPUT-01, INPUT-02, INPUT-03, PAGE-01, PAGE-02, PAGE-03
**Success Criteria** (what must be TRUE):
  1. 사용자가 상단 네비게이션에서 /optimizer 링크를 클릭하여 페이지에 도달할 수 있다
  2. 사용자가 `claude mcp list` 결과를 붙여넣으면 인식된 플러그인과 인식되지 않은 플러그인이 구분되어 표시된다
  3. 사용자가 플러그인 이름을 타이핑하면 42개 DB 기반 자동완성 제안이 나타난다
  4. AI 분석 버튼이 Coming Soon 레이블로 표시되고 클릭해도 아무 동작도 하지 않는다
  5. 페이지가 한국어/영어 언어 전환 시 올바르게 번역되어 표시된다
**Plans:** 2 plans
Plans:
- [x] 05-01-PLAN.md — Pure logic foundation: MCP list parser, normalizer, resolver, i18n translations
- [x] 05-02-PLAN.md — Page shell, input components (paste + autocomplete), plugin chips, nav link

### Phase 6: Scoring Engine
**Goal**: 입력된 플러그인 조합에 대해 충돌 감지, 조합 점수, 커버리지 분석, 보완/대체 추천이 모두 계산되어 정확한 결과를 반환한다
**Depends on**: Phase 5
**Requirements**: ANLYS-01, ANLYS-02, ANLYS-03, RECOM-01, RECOM-02
**Success Criteria** (what must be TRUE):
  1. 충돌하는 플러그인 쌍이 있을 때 경고 메시지가 해당 플러그인 이름과 함께 표시된다
  2. 조합 점수가 0-100 범위의 숫자로 표시되며, 플러그인을 추가하거나 제거하면 점수가 변한다
  3. 10개 카테고리 중 현재 조합이 커버하는 카테고리와 미커버 카테고리가 시각적으로 구분된다
  4. 현재 조합에 없는 보완 플러그인이 이미 설치된 플러그인 없이 제안된다
  5. deprecated 또는 unverified 플러그인이 포함된 경우 더 나은 대안 플러그인이 제시된다
**Plans:** 1/1 plans complete
Plans:
- [ ] 06-01-PLAN.md — TDD scoring engine: conflict/redundancy detection, 0-100 deduction score, coverage analysis, complement and replacement suggestions

### Phase 7: Results UI Assembly
**Goal**: 분석 결과가 사용자가 한눈에 이해할 수 있는 구조로 화면에 표시되고, 전체 /optimizer 기능이 배포 가능한 상태가 된다
**Depends on**: Phase 6
**Requirements**: PAGE-04
**Success Criteria** (what must be TRUE):
  1. 분석 결과 화면에서 점수와 충돌 경고가 먼저 표시되고, 보완/대체 추천은 접힌 상태로 시작하여 사용자가 펼칠 수 있다
  2. 모바일과 데스크톱 양쪽에서 결과 화면이 겹침이나 잘림 없이 정상 표시된다
  3. 빈 조합(플러그인 0개) 입력 시 에러가 아닌 안내 메시지가 표시된다
**Plans**: TBD

## Progress

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|----------------|--------|-----------|
| 1. Community Orchestration Plugins | v1.0 | 1/1 | Complete | 2026-03-11 |
| 2. Official MCP Monorepo Plugins | v1.0 | 3/3 | Complete | 2026-03-12 |
| 3. Platform & Official Plugins | v1.0 | 3/3 | Complete | 2026-03-12 |
| 4. Remaining Plugins & Sync | v1.0 | 2/2 | Complete | 2026-03-16 |
| 5. Input & Page Scaffold | v1.1 | 2/2 | Complete | 2026-03-16 |
| 6. Scoring Engine | 1/1 | Complete   | 2026-03-16 | - |
| 7. Results UI Assembly | v1.1 | 0/TBD | Not started | - |

---
*Full v1.0 details: `.planning/milestones/v1.0-ROADMAP.md`*
*v1.1 roadmap defined: 2026-03-16*
