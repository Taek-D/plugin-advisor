# Requirements: Plugin Advisor

**Defined:** 2026-03-16
**Core Value:** 사용자의 프로젝트에 맞는 검증된 Claude Code 플러그인 조합을 정확하게 추천하는 것.

## v1.1 Requirements

Requirements for milestone v1.1 — Plugin Optimizer (플러그인 조합 분석).

### 입력 (Input)

- [x] **INPUT-01**: 사용자가 `claude mcp list` CLI 결과를 붙여넣으면 플러그인 이름이 자동 추출된다
- [x] **INPUT-02**: 사용자가 플러그인 이름을 직접 타이핑하면 42개 DB에서 자동완성 제안된다
- [x] **INPUT-03**: 붙여넣기/타이핑된 플러그인 이름이 alias 정규화로 DB와 매칭된다

### 분석 (Analysis)

- [x] **ANLYS-01**: 입력된 플러그인 조합의 충돌이 감지되고 경고로 표시된다
- [x] **ANLYS-02**: 조합 점수가 0-100 범위로 정규화되어 표시된다
- [x] **ANLYS-03**: 10개 카테고리별 커버리지 현황이 시각화된다

### 추천 (Recommendation)

- [x] **RECOM-01**: 빠진 카테고리/기능의 보완 플러그인이 제안된다 (설치된 것 제외)
- [x] **RECOM-02**: deprecated/unverified 플러그인의 더 나은 대안이 제시된다

### 페이지/UX

- [x] **PAGE-01**: /optimizer 별도 페이지가 존재하고 네비게이션에서 접근 가능하다
- [x] **PAGE-02**: AI 분석 모드가 Coming Soon으로 표시되고 비활성 상태이다
- [x] **PAGE-03**: /optimizer 페이지가 한국어/영어 다국어를 지원한다
- [ ] **PAGE-04**: 분석 결과가 progressive disclosure (접기/펼치기)로 표시된다

## Future Requirements

Deferred to future release.

- **AI-01**: AI 기반 조합 분석 모드 활성화 (Claude API)
- **INPUT-04**: settings.json 업로드로 플러그인 자동 감지
- **ANLYS-04**: 점수 항목별 breakdown (감점/가점 이유 표시)
- **RECOM-03**: 프리셋 매칭 ("초보자 팩 80% 달성" 등)
- **ANLYS-05**: 시너지 감지 (잘 어울리는 조합 가점)

## Out of Scope

| Feature | Reason |
|---------|--------|
| AI 조합 분석 구현 | v1.1은 규칙 기반만, AI는 Coming Soon 표시 |
| settings.json 파싱 | v1.1은 텍스트/직접입력만 |
| 서버사이드 분석 | 순수 클라이언트사이드, API route 불필요 |
| 플러그인 DB 확장 | 기존 42개 DB 활용 |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| INPUT-01 | Phase 5 | Complete (05-01) |
| INPUT-02 | Phase 5 | Complete (05-02) |
| INPUT-03 | Phase 5 | Complete (05-01) |
| PAGE-01 | Phase 5 | Complete (05-02) |
| PAGE-02 | Phase 5 | Complete (05-02) |
| PAGE-03 | Phase 5 | Complete (05-01) |
| ANLYS-01 | Phase 6 | Complete |
| ANLYS-02 | Phase 6 | Complete |
| ANLYS-03 | Phase 6 | Complete |
| RECOM-01 | Phase 6 | Complete |
| RECOM-02 | Phase 6 | Complete |
| PAGE-04 | Phase 7 | Pending |

**Coverage:**
- v1.1 requirements: 12 total
- Mapped to phases: 12
- Unmapped: 0 ✓

---
*Requirements defined: 2026-03-16*
*Last updated: 2026-03-16 — traceability mapped to Phases 5-7*
