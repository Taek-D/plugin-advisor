# Roadmap: Plugin Advisor

## Milestones

- ✅ **v1.0 Plugin Metadata Verification** — Phases 1-4 (shipped 2026-03-16)
- ✅ **v1.1 Plugin Optimizer** — Phases 5-7 (shipped 2026-03-17)
- ✅ **v1.2 MCP + Plugin 통합** — Phases 8-12 (shipped 2026-03-18)
- 🚧 **v1.3 DB 확장** — Phases 13-15 (in progress)

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

<details>
<summary>✅ v1.2 MCP + Plugin 통합 (Phases 8-12) — SHIPPED 2026-03-18</summary>

- [x] Phase 8: Type System Foundation (1/1 plan) — completed 2026-03-18
- [x] Phase 9: Plugin DB Population (1/1 plan) — completed 2026-03-18
- [x] Phase 10: Scoring Extension (1/1 plan) — completed 2026-03-18
- [x] Phase 11: Catalog Tab UI (1/1 plan) — completed 2026-03-18
- [x] Phase 12: Optimizer UI + i18n (1/1 plan) — completed 2026-03-18

</details>

### 🚧 v1.3 DB 확장 (In Progress)

**Milestone Goal:** GitHub 스타 기준 인기 MCP 서버 6개 + Plugin 3개를 추가하여 DB를 51개 → 60개로 확장한다. 모든 항목은 공식 GitHub README 기반으로 install 명령, requiredSecrets, features가 검증된다.

- [x] **Phase 13: MCP 서버 6개 등록** — fetch, time, markitdown, magic-mcp, n8n-mcp, shadcn-mcp를 lib/plugins.ts + lib/i18n/plugins-en.ts에 등록 (completed 2026-03-19)
- [x] **Phase 14: Plugin 3개 등록** — claude-mem, superclaude, frontend-design을 type: 'plugin'으로 등록 (completed 2026-03-19)
- [ ] **Phase 15: 검증 및 테스트 갱신** — install 명령 최종 확인, i18n 동기화, plugins.test.ts 카운트 갱신, CI 통과

## Phase Details

### Phase 13: MCP 서버 6개 등록
**Goal**: 검증된 6개 MCP 서버(fetch, time, markitdown, magic-mcp, n8n-mcp, shadcn-mcp)가 DB에 등록되어 /advisor와 /optimizer에서 추천에 참여한다
**Depends on**: Phase 12 (type system in place)
**Requirements**: MCP-01, MCP-02, MCP-03, MCP-04, MCP-05, MCP-06
**Success Criteria** (what must be TRUE):
  1. /plugins MCP 탭에서 fetch, time, markitdown, magic-mcp, n8n-mcp, shadcn-mcp 6개 항목이 표시된다
  2. 각 항목의 install 명령이 공식 GitHub README에서 확인된 verbatim 명령과 일치한다
  3. /advisor에서 해당 키워드를 입력하면 신규 MCP 서버 중 적합한 항목이 추천 결과에 나타난다
  4. 각 항목의 verificationStatus가 실제 README 확인 여부에 맞게 설정된다 (unverified로 추가하지 않는다)
**Plans:** 2/2 plans complete
Plans:
- [x] 13-01-PLAN.md — fetch, time, markitdown 등록 (Python/pip 기반 공식 서버 3개)
- [x] 13-02-PLAN.md — magic-mcp, n8n-mcp, shadcn-mcp 등록 (API키/환경변수 필요 서버 3개)

### Phase 14: Plugin 3개 등록
**Goal**: claude-mem, superclaude, frontend-design 3개 Plugin이 type: 'plugin'으로 DB에 등록되어 /plugins Plugin 탭과 /optimizer Plugin 보완 추천에서 노출된다
**Depends on**: Phase 13
**Requirements**: PLG-01, PLG-02, PLG-03
**Success Criteria** (what must be TRUE):
  1. /plugins Plugin 탭에서 claude-mem, superclaude, frontend-design 3개 항목이 표시된다 (MCP 탭에는 없다)
  2. /optimizer에서 Plugin 보완 추천 시 신규 Plugin이 후보로 나타난다
  3. 각 Plugin의 install 명령이 공식 GitHub README에서 확인된 명령과 일치한다
  4. PLUGIN_FIELD_OVERRIDES에 type: 'plugin' as const가 선언되어 타입 분류가 정확하다
**Plans:** 1/1 plans complete
Plans:
- [ ] 14-01-PLAN.md — claude-mem, superclaude, frontend-design 등록 + i18n + 테스트 업데이트

### Phase 15: 검증 및 테스트 갱신
**Goal**: 신규 9개 항목의 데이터 정확성이 소스 코드 수준에서 확인되고, plugins.test.ts가 60개 기준으로 갱신되며, pnpm typecheck/lint/build/test가 모두 통과한다
**Depends on**: Phase 14
**Requirements**: VER-01, VER-02, VER-03, VER-04
**Success Criteria** (what must be TRUE):
  1. Object.keys(PLUGINS).length가 60 이상이다 (소스 코드에서 직접 확인)
  2. 모든 신규 항목의 pluginDescEn 키가 lib/i18n/plugins-en.ts에 존재한다 (번역 누락 없음)
  3. plugins.test.ts의 카운트 임계값이 60으로 업데이트되고 pnpm test가 통과한다
  4. pnpm typecheck, pnpm lint, pnpm build가 모두 에러 없이 통과한다
**Plans**: TBD

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
| 10. Scoring Extension | v1.2 | 1/1 | Complete | 2026-03-18 |
| 11. Catalog Tab UI | v1.2 | 1/1 | Complete | 2026-03-18 |
| 12. Optimizer UI + i18n | v1.2 | 1/1 | Complete | 2026-03-18 |
| 13. MCP 서버 6개 등록 | v1.3 | Complete    | 2026-03-19 | 2026-03-19 |
| 14. Plugin 3개 등록 | 1/1 | Complete    | 2026-03-19 | - |
| 15. 검증 및 테스트 갱신 | v1.3 | 0/? | Not started | - |

---
*Full v1.0 details: `.planning/milestones/v1.0-ROADMAP.md`*
*Full v1.1 details: `.planning/milestones/v1.1-ROADMAP.md`*
*Full v1.2 details: `.planning/milestones/v1.2-ROADMAP.md`*
