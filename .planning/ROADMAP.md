# Roadmap: Plugin Advisor

## Milestones

- ✅ **v1.0 Plugin Metadata Verification** — Phases 1-4 (shipped 2026-03-16)
- ✅ **v1.1 Plugin Optimizer** — Phases 5-7 (shipped 2026-03-17)
- 🚧 **v1.2 MCP + Plugin 통합** — Phases 8-12 (in progress)

## Phases

<details>
<summary>✅ v1.0 Plugin Metadata Verification (Phases 1-4) — SHIPPED 2026-03-16</summary>

- [x] Phase 1: Community Orchestration Plugins (1/1 plan) — completed 2026-03-11
- [x] Phase 2: Official MCP Monorepo Plugins (3/3 plans) — completed 2026-03-12
- [x] Phase 3: Platform & Official Plugins (3/3 plans) — completed 2026-03-12
- [x] Phase 4: Remaining Plugins & Sync (2/2 plans) — completed 2026-03-16

</details>

<details>
<summary>✅ v1.1 Plugin Optimizer (Phases 5-7) — SHIPPED 2026-03-17</summary>

- [x] Phase 5: Input & Page Scaffold (2/2 plans) — completed 2026-03-16
- [x] Phase 6: Scoring Engine (1/1 plan) — completed 2026-03-16
- [x] Phase 7: Results UI Assembly (2/2 plans) — completed 2026-03-17

</details>

### 🚧 v1.2 MCP + Plugin 통합 (In Progress)

**Milestone Goal:** MCP 서버와 Plugin을 type 필드로 구분하고, Plugin DB를 구축하며, /plugins 탭 분리와 /optimizer 통합 분석을 완성한다.

- [x] **Phase 8: Type System Foundation** - Plugin 타입에 type 필드 추가 및 파서 수정 (complete 2026-03-18)
- [x] **Phase 9: Plugin DB Population** - Plugin 타입 13개 DB 재분류 및 번역 검증 (complete 2026-03-18)
- [ ] **Phase 10: Scoring Extension** - typeScope 파라미터로 타입별 보완 추천 분리
- [ ] **Phase 11: Catalog Tab UI** - /plugins 페이지 MCP/Plugin 탭 분리 및 URL 상태 유지
- [ ] **Phase 12: Optimizer UI + i18n** - 옵티마이저 힌트 업데이트, 타입 뱃지, i18n 완성

## Phase Details

### Phase 8: Type System Foundation
**Goal**: 모든 Plugin 항목이 'mcp' | 'plugin' 타입을 가지며, 파서가 실제 Plugin 타입과 일치한다
**Depends on**: Phase 7 (v1.1 complete)
**Requirements**: TYPE-01, TYPE-02
**Success Criteria** (what must be TRUE):
  1. 기존 42개 Plugin 항목이 type: 'mcp'로 자동 분류되어 런타임에서 undefined가 없다
  2. pnpm typecheck가 타입 오류 없이 통과한다
  3. parseMcpList의 pseudo-plugin factory가 실제 Plugin 타입과 일치하도록 수정되어 mcp/plugin 목록을 올바르게 구분한다
  4. pnpm test (104개 기존 테스트)가 회귀 없이 통과한다
**Plans**: 1 plan

Plans:
- [x] 08-01-PLAN.md — ItemType 타입 추가, Plugin type 필드 필수화, DEFAULT_PLUGIN_FIELDS 기본값, parseMcpList 팩토리 수정

### Phase 9: Plugin DB Population
**Goal**: 주요 Plugin 10-15개가 검증된 메타데이터와 한/영 번역을 갖추어 DB에 등록된다
**Depends on**: Phase 8
**Requirements**: DATA-01, DATA-02, DATA-03, I18N-02
**Success Criteria** (what must be TRUE):
  1. 10-15개 Plugin 항목이 type: 'plugin'으로 PLUGINS DB에 등록되어 있다
  2. 각 Plugin의 install 명령어, category, keywords, features가 실제 CLI 사용법과 일치한다
  3. 각 Plugin의 한국어 desc/longDesc와 영문 번역이 모두 등록되어 번역 누락이 없다
  4. pnpm typecheck와 pnpm build가 신규 항목 추가 후 오류 없이 통과한다
**Plans**: 1 plan

Plans:
- [x] 09-01-PLAN.md — 기존 13개 항목 type: 'plugin' 재분류 (PLUGIN_FIELD_OVERRIDES override) + 테스트 업데이트

### Phase 10: Scoring Extension
**Goal**: /optimizer에서 MCP 분석 시 Plugin 보완 추천이 나타나지 않고, Plugin 분석 시 MCP 보완 추천이 나타나지 않는다
**Depends on**: Phase 9
**Requirements**: SCORE-01, SCORE-02, SCORE-03
**Success Criteria** (what must be TRUE):
  1. scorePlugins에 typeScope 파라미터가 추가되어 'mcp' | 'plugin' | 'both' 중 하나를 받는다
  2. MCP 목록만 붙여넣었을 때 보완 추천에 Plugin 타입 항목이 나타나지 않는다
  3. Plugin 목록만 붙여넣었을 때 보완 추천에 MCP 타입 항목이 나타나지 않는다
  4. 기존 MCP 전용 유저의 조합 점수가 Plugin DB 추가 전후로 동일하게 유지된다
  5. typeScope 관련 회귀 테스트가 추가되어 pnpm test가 통과한다
**Plans**: TBD

Plans:
- [ ] 10-01: scorePlugins typeScope 파라미터 추가, buildComplements/buildReplacements 필터링, 회귀 테스트

### Phase 11: Catalog Tab UI
**Goal**: /plugins 페이지에서 MCP와 Plugin을 탭으로 분리하여 볼 수 있고, 탭 상태가 URL에 유지된다
**Depends on**: Phase 9
**Requirements**: UI-01, UI-02
**Success Criteria** (what must be TRUE):
  1. /plugins 페이지에 All / MCP / Plugin 탭이 표시되고 탭별로 해당 타입만 보인다
  2. 카테고리 필터와 타입 탭이 AND 조건으로 동작하여 복합 필터링이 가능하다
  3. ?type=plugin URL 파라미터로 직접 접근 시 Plugin 탭이 선택된 상태로 열린다
  4. /plugins/[id] 페이지에서 뒤로가기 시 이전에 선택한 탭이 보존된다
**Plans**: TBD

Plans:
- [ ] 11-01: PluginGrid.tsx에 activeType 상태, TabsList 행, URL query param 동기화 추가

### Phase 12: Optimizer UI + i18n
**Goal**: /optimizer가 claude plugin list 포맷을 안내하고, 자동완성에 타입 뱃지가 표시되며, 모든 신규 UI 텍스트가 한/영 지원된다
**Depends on**: Phase 10, Phase 11
**Requirements**: UI-03, UI-04, I18N-01, I18N-02
**Success Criteria** (what must be TRUE):
  1. /optimizer 붙여넣기 힌트와 샘플 데이터가 claude mcp list와 claude plugin list 둘 다 안내한다
  2. 자동완성 드롭다운에서 각 항목 옆에 MCP / Plugin 타입 뱃지가 표시된다
  3. 탭 라벨, 타입 뱃지 등 신규 UI 텍스트가 한/영 두 로케일 모두 지원된다
  4. pnpm build가 i18n 타입 오류 없이 통과한다
**Plans**: TBD

Plans:
- [ ] 12-01: i18n 키 추가 (ko.ts + en.ts 동시), OptimizerApp 힌트/샘플 업데이트, PluginTypeInput 타입 뱃지

## Progress

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|----------------|--------|-----------|
| 1. Community Orchestration Plugins | v1.0 | 1/1 | Complete | 2026-03-11 |
| 2. Official MCP Monorepo Plugins | v1.0 | 3/3 | Complete | 2026-03-12 |
| 3. Platform & Official Plugins | v1.0 | 3/3 | Complete | 2026-03-12 |
| 4. Remaining Plugins & Sync | v1.0 | 2/2 | Complete | 2026-03-16 |
| 5. Input & Page Scaffold | v1.1 | 2/2 | Complete | 2026-03-16 |
| 6. Scoring Engine | v1.1 | 1/1 | Complete | 2026-03-16 |
| 7. Results UI Assembly | v1.1 | 2/2 | Complete | 2026-03-17 |
| 8. Type System Foundation | v1.2 | 1/1 | Complete | 2026-03-18 |
| 9. Plugin DB Population | v1.2 | 1/1 | Complete | 2026-03-18 |
| 10. Scoring Extension | v1.2 | 0/1 | Not started | - |
| 11. Catalog Tab UI | v1.2 | 0/1 | Not started | - |
| 12. Optimizer UI + i18n | v1.2 | 0/1 | Not started | - |

---
*Full v1.0 details: `.planning/milestones/v1.0-ROADMAP.md`*
*Full v1.1 details: `.planning/milestones/v1.1-ROADMAP.md`*
