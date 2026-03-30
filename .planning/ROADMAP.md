# Roadmap: Plugin Advisor

## Milestones

- ✅ **v1.0 Plugin Metadata Verification** — Phases 1-4 (shipped 2026-03-16)
- ✅ **v1.1 Plugin Optimizer** — Phases 5-7 (shipped 2026-03-17)
- ✅ **v1.2 MCP + Plugin 통합** — Phases 8-12 (shipped 2026-03-18)
- ✅ **v1.3 DB 확장** — Phases 13-16 (shipped 2026-03-19)
- 🚧 **v1.4 마케팅 준비** — Phases 17-19 (in progress)

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

<details>
<summary>✅ v1.3 DB 확장 (Phases 13-16) — SHIPPED 2026-03-19</summary>

- [x] Phase 13: MCP 서버 6개 등록 (2/2 plans) — completed 2026-03-19
- [x] Phase 14: Plugin 3개 등록 (1/1 plan) — completed 2026-03-19
- [x] Phase 15: 검증 및 테스트 갱신 (1/1 plan) — completed 2026-03-19
- [x] Phase 16: 추천 이유 문자열 보완 (1/1 plan) — completed 2026-03-19

</details>

### 🚧 v1.4 마케팅 준비 (In Progress)

**Milestone Goal:** 마케팅 런칭 전 기술 준비 — Umami Cloud analytics로 사용자 행동 측정, 페이지별 동적 OG 이미지로 소셜 공유 최적화, 공유/피드백/뉴스레터 인프라 구축

- [x] **Phase 17: Analytics Foundation** — Umami Cloud 통합 + CSP 업데이트 + 이벤트 마이그레이션 + 프록시 라우트 + Supabase 테이블 생성 (completed 2026-03-29)
- [x] **Phase 18: OG Images** — 사이트 기본 + 페이지별 동적 OG 이미지 생성 (next/og) (completed 2026-03-29)
- [x] **Phase 19: Share + Feedback + Newsletter** — 결과 공유 버튼, 피드백 위젯, 뉴스레터 구독 폼 + i18n (gap closure in progress) (completed 2026-03-30)

## Phase Details

### Phase 17: Analytics Foundation
**Goal**: 모든 페이지의 사용자 행동이 Umami Cloud에서 측정되고, 피드백/뉴스레터에 필요한 Supabase 테이블이 준비된다
**Depends on**: Phase 16 (v1.3 complete)
**Requirements**: ANLY-01, ANLY-02, ANLY-03, ANLY-04, FDBK-02 (table only), NEWS-02 (table only)
**Success Criteria** (what must be TRUE):
  1. 사이트의 모든 페이지 방문이 Umami Cloud 대시보드에 페이지뷰로 기록된다
  2. 브라우저 개발자 도구에서 Umami 스크립트가 CSP에 의해 차단되지 않는다 (콘솔에 CSP 에러 없음)
  3. 기존 trackEvent 호출(analysis_start 등)이 Umami 커스텀 이벤트로도 전송되어 대시보드에 표시된다
  4. /api/umami 프록시 경로를 통해 Umami 데이터가 전송되어 광고차단기 사용자의 데이터도 수집된다
  5. Supabase에 feedback, newsletter_subscribers 테이블이 존재하고 RLS 정책이 적용되어 있다
**Plans**: 2 plans

Plans:
- [ ] 17-01: CSP 업데이트 + UmamiScript 컴포넌트 + layout.tsx 통합 + TypeScript 선언
- [ ] 17-02: analytics.ts Umami 포워딩 + 프록시 라우트 + Supabase 마이그레이션 2개

### Phase 18: OG Images
**Goal**: 소셜 미디어에서 사이트 링크 공유 시 페이지별 맞춤 OG 이미지가 표시된다
**Depends on**: Phase 17
**Requirements**: OGIM-01, OGIM-02, OGIM-03
**Success Criteria** (what must be TRUE):
  1. 사이트 메인 URL 공유 시 Plugin Advisor 브랜딩이 포함된 기본 OG 이미지가 소셜 카드에 표시된다
  2. /plugins/[id] URL 공유 시 해당 플러그인의 이름, 카테고리, 태그가 포함된 동적 OG 이미지가 생성된다
  3. /guides/[slug] URL 공유 시 해당 가이드의 제목과 설명이 포함된 동적 OG 이미지가 생성된다
**Plans**: 2 plans

Plans:
- [ ] 18-01-PLAN.md — Shared OG utilities + default brand OG/Twitter image + static OG for /advisor, /plugins, /guides + root metadata
- [ ] 18-02-PLAN.md — Dynamic OG images for /plugins/[id] and /guides/[slug] with generateStaticParams

### Phase 19: Share + Feedback + Newsletter
**Goal**: 사용자가 추천/분석 결과를 SNS로 공유하고, 사이트에서 피드백을 제출하고, 뉴스레터를 구독할 수 있다
**Depends on**: Phase 17 (Supabase tables), Phase 18 (OG images enhance shared links)
**Requirements**: SHAR-01, SHAR-02, SHAR-03, FDBK-01, FDBK-02 (API route), FDBK-03, NEWS-01, NEWS-02 (API route)
**Success Criteria** (what must be TRUE):
  1. Optimizer 결과 화면에서 공유 버튼을 누르면 X, LinkedIn으로 조합 점수/요약이 공유된다
  2. Advisor 결과 화면에서 공유 버튼을 누르면 추천 결과 요약이 공유된다
  3. 모바일에서 Web Share API가 동작하고, 데스크톱에서는 클립보드 복사 + 소셜 링크 폴백이 동작한다
  4. 사이트 하단 우측의 피드백 위젯에서 별점 + 메시지를 제출하면 Supabase에 저장되고, 관리자가 확인할 수 있다
  5. 랜딩 페이지와 /guides에서 이메일 구독 폼으로 뉴스레터를 구독하면 Supabase에 저장되고 중복이 처리된다
**Plans**: 5 plans

Plans:
- [x] 19-01-PLAN.md — i18n 확장 (share, feedback, newsletter 번역 키) + analytics 이벤트 타입 추가 + share-utils 유틸리티 + 테스트
- [x] 19-02-PLAN.md — ShareResultButton 컴포넌트 + OptimizerApp/PluginAdvisorApp 통합
- [x] 19-03-PLAN.md — FeedbackWidget + /api/feedback + NewsletterForm + /api/newsletter + 관리자 피드백 페이지 + 페이지 통합
- [ ] 19-04-PLAN.md — [Gap closure] X/LinkedIn 소셜 공유 링크 + /guides 페이지 NewsletterForm 통합
- [ ] 19-05-PLAN.md — [Gap closure] Supabase 수동 타입 정의 + 별점 UI + @ts-expect-error 제거

## Progress

**Execution Order:**
Phases execute in numeric order: 17 → 18 → 19

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
| 13. MCP 서버 6개 등록 | v1.3 | 2/2 | Complete | 2026-03-19 |
| 14. Plugin 3개 등록 | v1.3 | 1/1 | Complete | 2026-03-19 |
| 15. 검증 및 테스트 갱신 | v1.3 | 1/1 | Complete | 2026-03-19 |
| 16. 추천 이유 문자열 보완 | v1.3 | 1/1 | Complete | 2026-03-19 |
| 17. Analytics Foundation | v1.4 | 2/2 | Complete | 2026-03-29 |
| 18. OG Images | v1.4 | 2/2 | Complete | 2026-03-29 |
| 19. Share + Feedback + Newsletter | 5/5 | Complete   | 2026-03-30 | - |

---
*Full v1.0 details: `.planning/milestones/v1.0-ROADMAP.md`*
*Full v1.1 details: `.planning/milestones/v1.1-ROADMAP.md`*
*Full v1.2 details: `.planning/milestones/v1.2-ROADMAP.md`*
*Full v1.3 details: `.planning/milestones/v1.3-ROADMAP.md`*
