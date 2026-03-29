# Requirements: Plugin Advisor

**Defined:** 2026-03-29
**Core Value:** 사용자의 프로젝트에 맞는 검증된 Claude Code 플러그인 조합을 정확하게 추천하는 것.

## v1.4 Requirements

Requirements for marketing prep milestone. Each maps to roadmap phases.

### Analytics

- [x] **ANLY-01**: Umami Cloud 스크립트가 모든 페이지에서 로드되어 페이지뷰를 자동 추적한다
- [x] **ANLY-02**: CSP 헤더가 Umami 도메인을 허용하여 스크립트가 차단되지 않는다
- [x] **ANLY-03**: 기존 16개 localStorage 이벤트가 Umami 커스텀 이벤트로 마이그레이션된다
- [x] **ANLY-04**: /api/umami proxy 라우트가 광고차단기를 우회하여 데이터 손실을 최소화한다

### OG Images

- [x] **OGIM-01**: 사이트 기본 OG 이미지가 소셜 공유 시 표시된다
- [x] **OGIM-02**: /plugins/[id] 페이지가 플러그인별 동적 OG 이미지를 생성한다
- [x] **OGIM-03**: /guides/[slug] 페이지가 가이드별 동적 OG 이미지를 생성한다

### Share

- [ ] **SHAR-01**: Optimizer 결과 화면에서 조합 점수/요약을 X, LinkedIn으로 공유할 수 있다
- [ ] **SHAR-02**: Advisor 결과 화면에서 추천 결과를 공유할 수 있다
- [ ] **SHAR-03**: 모바일에서 Web Share API, 데스크톱에서 클립보드 복사 폴백이 동작한다

### Feedback

- [ ] **FDBK-01**: 사이트에서 피드백 위젯을 통해 의견을 제출할 수 있다
- [x] **FDBK-02**: 피드백이 Supabase에 저장되고 rate limit이 적용된다
- [ ] **FDBK-03**: 관리자가 피드백을 확인할 수 있다

### Newsletter

- [ ] **NEWS-01**: 사용자가 이메일 구독 폼으로 뉴스레터를 구독할 수 있다
- [x] **NEWS-02**: 구독 정보가 Supabase에 저장되고 중복/rate limit이 적용된다

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Analytics

- **ANLY-05**: Umami 대시보드를 사이트 내 관리자 페이지에 임베드
- **ANLY-06**: A/B 테스트 프레임워크 통합

### Newsletter

- **NEWS-03**: Double opt-in 이메일 인증 (이메일 전송 인프라 필요)
- **NEWS-04**: 뉴스레터 발송 기능 (Resend 등 연동)

### OG Images

- **OGIM-04**: /advisor, /optimizer 결과에 대한 동적 OG 이미지 (URL 파라미터 기반)

## Out of Scope

| Feature | Reason |
|---------|--------|
| Google Analytics 통합 | 개발자 대상 광고차단기 50-70% 데이터 손실, 쿠키 동의 UX 저하 |
| 이메일 전송 인프라 (Resend 등) | v1.4는 수집만, 발송은 v2에서 |
| 한국어 OG 이미지 폰트 | Edge Runtime 한국어 폰트 크기 제한, 영문/시스템 폰트로 우선 구현 |
| 실시간 알림 (피드백/구독) | 관리자가 Supabase 대시보드에서 직접 확인 |
| 쿠키 동의 배너 | Umami는 쿠키리스라 불필요 |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| ANLY-01 | Phase 17 | Complete |
| ANLY-02 | Phase 17 | Complete |
| ANLY-03 | Phase 17 | Complete |
| ANLY-04 | Phase 17 | Complete |
| OGIM-01 | Phase 18 | Complete |
| OGIM-02 | Phase 18 | Complete |
| OGIM-03 | Phase 18 | Complete |
| SHAR-01 | Phase 19 | Pending |
| SHAR-02 | Phase 19 | Pending |
| SHAR-03 | Phase 19 | Pending |
| FDBK-01 | Phase 19 | Pending |
| FDBK-02 | Phase 17 + 19 | Complete |
| FDBK-03 | Phase 19 | Pending |
| NEWS-01 | Phase 19 | Pending |
| NEWS-02 | Phase 17 + 19 | Complete |

**Coverage:**
- v1.4 requirements: 15 total
- Mapped to phases: 15/15
- Unmapped: 0

**Note:** FDBK-02 and NEWS-02 span two phases: Supabase table creation (Phase 17) and API route + rate limiting (Phase 19). The table is a prerequisite that must exist before the API route can function.

---
*Requirements defined: 2026-03-29*
*Last updated: 2026-03-29 after roadmap creation*
