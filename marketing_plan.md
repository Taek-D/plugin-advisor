# Plugin Advisor Marketing Plan

*Last updated: 2026-03-29*

---

## Phase 1: 기반 다지기 (전략 수립)

> 홍보 전에 "누구에게, 무엇을, 왜" 팔 것인지 명확히 한다.

- [x] `/marketing-skills:product-marketing-context` — 제품 마케팅 컨텍스트 문서 생성 (`.agents/product-marketing-context.md`)
- [x] `/marketing-skills:customer-research` — 고객 조사 완료 (리포트 + 인용 모음 + 페르소나 4종)
- [x] `/fireauto:researcher` — 건너뜀 (customer-research에서 Reddit 리서치 이미 수행)
- [x] `/pm-product-strategy:value-proposition` — 4개 세그먼트별 가치 제안 + 재사용 문구 5종 (`.agents/value-proposition.md`)
- [x] `/pm-market-research:competitor-analysis` — 건너뜀 (customer-research에서 경쟁 환경 이미 분석)
- [x] `/pm-marketing-growth:positioning-ideas` — 5개 포지셔닝 아이디어 + 추천 전략 (`.agents/positioning-ideas.md`)

---

## Phase 2: 출시 전략 (GTM)

> "어떻게 시장에 내놓을 것인가"를 설계한다.

- [x] `/pm-go-to-market:beachhead-segment` — 비치헤드: 한국 Claude Code 사용자 + 90일 획득 계획 (`.agents/beachhead-segment.md`)
- [x] `/pm-go-to-market:gtm-strategy` — 90일 런칭 플랜 + 채널 3tier + KPI (`.agents/gtm-strategy.md`)
- [x] `/marketing-skills:launch-strategy` — ORB 채널 + D-Day 실행 + 에셋 체크리스트 (`.agents/launch-strategy.md`)
- [x] `/pm-go-to-market:growth-loops` — Viral(조합점수 공유) + Usage + UGC 루프 설계 (`.agents/growth-loops.md`)
- [x] `/pm-marketing-growth:north-star-metric` — NSM: 월간 추천 완료 수 + Input 5개 (`.agents/north-star-metric.md`)

---

## Phase 3: 콘텐츠 & SEO

> 검색에서 발견되고, 가치를 전달하는 콘텐츠를 만든다.

- [ ] `/marketing-skills:content-strategy` — 토픽, 채널, 일정 계획
- [x] `/marketing-skills:seo-audit` — robots.ts, sitemap.ts, page metadata 추가 완료
- [ ] `/marketing-skills:ai-seo` — AI 검색 엔진 최적화 (LLM 인용 대비)
- [ ] `/marketing-skills:schema-markup` — 구조화 데이터(JSON-LD) 추가
- [ ] `/marketing-skills:programmatic-seo` — 템플릿 기반 대량 SEO 페이지 생성
- [ ] `/marketing-skills:competitor-alternatives` — "vs" 비교 페이지 / 대안 페이지

---

## Phase 4: 전환 최적화 (CRO)

> 방문자를 사용자로 전환시킨다.

- [ ] `/marketing-skills:site-architecture` — 사이트 구조/네비게이션 최적화
- [ ] `/marketing-skills:copywriting` — 마케팅 카피 작성 (랜딩, 홈 등)
- [ ] `/marketing-skills:page-cro` — 페이지 전환율 최적화
- [ ] `/marketing-skills:signup-flow-cro` — 가입/시작 플로우 최적화
- [ ] `/marketing-skills:popup-cro` — 팝업/모달 전환 최적화

---

## Phase 5: 성장 & 아웃리치

> 적극적으로 사용자를 끌어온다.

- [ ] `/marketing-skills:social-content` — SNS 콘텐츠 제작 (LinkedIn, X 등)
- [ ] `/threads-auto-post` — Threads 자동 포스팅
- [ ] `/marketing-skills:email-sequence` — 이메일 시퀀스/드립 캠페인
- [ ] `/marketing-skills:cold-email` — B2B 콜드 이메일 작성
- [ ] `/marketing-skills:lead-magnets` — 리드 마그넷 기획 (무료 가이드 등)
- [ ] `/marketing-skills:referral-program` — 추천 프로그램 설계
- [ ] `/marketing-skills:free-tool-strategy` — 무료 도구 마케팅 전략

---

## Phase 6: 유료 광고 (선택)

> 예산을 투입하여 유입을 확대한다.

- [ ] `/marketing-skills:ad-creative` — 광고 소재 (헤드라인, 카피) 제작
- [ ] `/marketing-skills:paid-ads` — 유료 광고 캠페인 설계 (Google, Meta 등)

---

## Phase 7: 측정 & 반복

> 데이터 기반으로 개선한다.

- [ ] `/marketing-skills:analytics-tracking` — 분석 추적 설정 (이벤트, 전환)
- [ ] `/marketing-skills:ab-test-setup` — A/B 테스트 설계 및 구현
- [ ] `/marketing-skills:marketing-psychology` — 심리학 원칙 적용

---

## Progress Summary

| Phase | 전체 | 완료 | 상태 |
|-------|------|------|------|
| 1. 기반 다지기 | 6 | 6 | 완료 |
| 2. 출시 전략 | 5 | 5 | 완료 |
| 3. 콘텐츠 & SEO | 6 | 1 | 진행중 |
| 4. 전환 최적화 | 5 | 0 | 대기 |
| 5. 성장 & 아웃리치 | 7 | 0 | 대기 |
| 6. 유료 광고 | 2 | 0 | 대기 |
| 7. 측정 & 반복 | 3 | 0 | 대기 |
| **합계** | **34** | **12** | **35% 완료** |

## Notes

- 각 스킬 실행 후 이 파일의 체크박스를 업데이트할 것
- 산출물은 `.agents/` 폴더에 저장
- Phase 순서대로 진행이 이상적이나, 급하면 Quick Start 5개 먼저 가능:
  1. `/marketing-skills:product-marketing-context` (완료)
  2. `/marketing-skills:seo-audit`
  3. `/marketing-skills:copywriting`
  4. `/marketing-skills:social-content`
  5. `/marketing-skills:content-strategy`
