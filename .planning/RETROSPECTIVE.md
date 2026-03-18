# Project Retrospective

*A living document updated after each milestone. Lessons feed forward into future planning.*

## Milestone: v1.0 — Plugin Metadata Verification

**Shipped:** 2026-03-16
**Phases:** 4 | **Plans:** 9 | **Sessions:** ~5

### What Was Built
- 42개 플러그인 메타데이터 GitHub README 기반 검증
- 전체 verificationStatus 감사 (35 verified, 5 partial, 2 unverified)
- 42/42 영문 번역 동기화 (pluginDescEn + reasonsEn)
- install 명령어, features, requiredSecrets 대량 수정

### What Worked
- 플러그인을 출처별로 4개 Phase로 묶는 전략이 효과적 — 같은 모노레포 플러그인을 한번에 처리하여 컨텍스트 공유 극대화
- Phase 1-3 패턴 확립 후 Phase 4는 빠르게 완료 (평균 8m/plan vs 전체 평균 11m)
- PLUGIN_FIELD_OVERRIDES 패턴으로 기존 CORE_PLUGINS 수정 없이 오버라이드 가능 — 충돌 최소화
- GitHub API를 통한 README fetch가 안정적으로 동작

### What Was Inefficient
- Phase 4의 ROADMAP.md 체크박스/progress가 executor에 의해 부분적으로만 업데이트됨 — complete-milestone 시점에 수동 정리 필요
- summary-extract의 one_liner 필드가 null 반환 — SUMMARY.md 포맷이 도구 기대와 불일치
- 일부 플러그인의 remote HTTP MCP 이전을 사전에 파악하지 못해 install 명령어 전면 교체 필요

### Patterns Established
- remote HTTP MCP 설치 패턴: `claude mcp add --transport http <name> <url>`
- OAuth 기반 MCP 서버: requiredSecrets [] (API 키 불필요)
- deprecated 서버 표시: maintenanceStatus "stale" + longDesc에 공식 대안 안내
- PLUGIN_FIELD_OVERRIDES에 코드 코멘트로 검증 근거 기록

### Key Lessons
1. MCP 생태계가 빠르게 변화 중 — npm 패키지 → 원격 HTTP 서버, 모노레포 → 독립 repo 이전 등. 주기적 재검증 필요
2. install 명령어가 가장 자주 틀린 필드 — 공식 문서와 실제 패키지명/설치 방식 불일치가 매우 흔함
3. requiredSecrets의 정확한 env var명이 중요 — NOTION_TOKEN vs NOTION_API_KEY 같은 미묘한 차이가 사용자 경험에 직결

### Cost Observations
- Model mix: 0% opus, 100% sonnet, 0% haiku (balanced profile)
- Total execution: ~103m across 9 plans
- Notable: 반복적 검증 패턴이라 sonnet으로 충분, opus 불필요

---

## Milestone: v1.1 — Plugin Optimizer

**Shipped:** 2026-03-17
**Phases:** 3 | **Plans:** 5 | **Sessions:** ~3

### What Was Built
- /optimizer 페이지: `claude mcp list` 파싱 + 자동완성 입력
- TDD 기반 조합 점수 엔진 (100점 감점 모델, 42개 테스트)
- 10개 카테고리 커버리지 분석 + 보완/대체 추천 로직
- Progressive disclosure 결과 UI (SVG 게이지, 접기/펼치기 섹션)
- 한/영 다국어 지원 (38개 i18n 키)

### What Worked
- 3-phase 의존성 순서 (파서 → 엔진 → UI)가 매우 효과적 — 각 phase가 이전 phase 산출물을 깔끔하게 소비
- TDD(RED→GREEN) 접근이 scoring engine 품질 보장 — 42개 테스트로 리팩토링 시 안전망 제공
- 순수 클라이언트사이드 설계로 API route 추가 없이 완성 — 배포/테스트 단순화
- getCategoryIcon 등 공유 유틸리티 추출이 코드 중복 방지에 효과적

### What Was Inefficient
- 06-01-SUMMARY.md의 requirements_completed frontmatter 누락 → 감사 시 수동 확인 필요
- summary-extract의 one_liner 필드가 여전히 null — SUMMARY.md 포맷 문제 미해결 (v1.0에서도 동일)
- OptimizerInputPlugin 타입을 계획 단계에서 설계했으나 실제로 불필요 — 더 단순한 설계가 가능했음

### Patterns Established
- CSS max-height 접기/펼치기 패턴 (외부 라이브러리 없이)
- 100점 감점 모델: 100 - conflicts*20 - redundancies*7 - uncovered*7
- ScrollIntoView + 상태 연동 패턴 (부모 상태 소유 + ref 전달)
- ALIAS_MAP을 별도 상수로 관리 (스키마 변경 없이 alias 추가)

### Key Lessons
1. 순수 함수 → 컴포넌트 순서가 복잡한 UI 기능을 관리 가능하게 만듦 — 로직과 표현의 완전 분리
2. 42개 규모의 DB에서는 Fuse.js 같은 fuzzy search보다 substring 매칭이 충분 — 의존성 최소화 원칙
3. Progressive disclosure (접기/펼치기)가 정보 과부하 방지에 필수 — 모든 결과를 한번에 보여주면 압도적

### Cost Observations
- Model mix: 0% opus, 100% sonnet, 0% haiku (balanced profile)
- Total execution: ~58m across 5 plans
- Notable: v1.0 대비 plan당 평균 시간 유사 (11.6m vs 11.4m), TDD plan이 가장 빠름 (6m)

---

## Milestone: v1.2 — MCP + Plugin 통합

**Shipped:** 2026-03-18
**Phases:** 5 | **Plans:** 5 | **Sessions:** ~2

### What Was Built
- ItemType = "mcp" | "plugin" 타입 시스템 — 42개 기존 항목 무수정 자동 분류
- 9개 Plugin 항목 DB 재분류 (PLUGIN_FIELD_OVERRIDES 패턴)
- scorePlugins typeScope 파라미터 — MCP/Plugin별 보완/대체 추천 분리
- /plugins 페이지 All/MCP/Plugin 탭 분리 (URL ?type= 상태 유지)
- /optimizer 힌트/샘플 MCP+Plugin 통합, 자동완성/칩 타입 뱃지

### What Worked
- DEFAULT_PLUGIN_FIELDS 스프레드 패턴으로 42개 전체를 코드 수정 없이 마이그레이션 — phase 8이 12분에 완료
- 5개 phase가 모두 하루만에 완료 (총 ~32분) — v1.0/v1.1 대비 plan당 시간 대폭 단축
- typeScope 기본값 'both'로 하위 호환 100% 유지 — 기존 125개 테스트 무수정 통과
- Phase 8→9→10→11→12 의존성 순서가 선형적으로 깔끔 — 각 phase가 이전 산출물을 직접 소비

### What Was Inefficient
- Phase 9 SUMMARY가 13개 plugin 항목을 주장했으나 실제 코드는 9개 — 문서와 코드 불일치가 감사 단계에서야 발견됨
- VERIFICATION.md도 SUMMARY의 잘못된 숫자를 그대로 검증 통과시킴 — verifier가 PLUGIN_FIELD_OVERRIDES를 직접 카운트하지 않음
- Nyquist VALIDATION.md가 5개 phase 모두 draft/미서명 상태 — 실행 속도가 빨라 validation sign-off를 건너뜀

### Patterns Established
- PLUGIN_FIELD_OVERRIDES에서만 type 재분류 (CORE_PLUGINS/PluginSeed에 type 필드 없음)
- typeScope 파라미터 패턴: 기본값 'both', 단일 타입이면 해당 타입으로 자동 감지
- URL searchParams + useEffect 동기화 패턴 (Next.js App Router Suspense 필수)
- 타입 뱃지 색상: MCP = 파란(blue-500), Plugin = 보라(purple-500)

### Key Lessons
1. 문서화된 숫자(13개)와 실제 코드(9개)의 불일치가 감사까지 발견되지 않음 — verifier가 SUMMARY를 신뢰하지 말고 코드를 직접 카운트해야 함
2. plan당 실행 시간이 ~6분으로 급감 — 이전 마일스톤에서 확립된 패턴(PLUGIN_FIELD_OVERRIDES, TDD, i18n)을 재활용한 덕분
3. Nyquist validation은 빠른 phase에서는 오버헤드 대비 가치가 낮음 — 복잡한 phase에서만 적용하는 것이 효율적

### Cost Observations
- Model mix: 0% opus, 100% sonnet, 0% haiku (balanced profile)
- Total execution: ~32m across 5 plans
- Notable: plan당 평균 6.4분 — v1.1의 11.6분 대비 45% 단축. 패턴 재활용 효과.

---

## Cross-Milestone Trends

### Process Evolution

| Milestone | Sessions | Phases | Plans | Avg min/plan | Key Change |
|-----------|----------|--------|-------|--------------|------------|
| v1.0 | ~5 | 4 | 9 | 11.4m | 첫 마일스톤 — GSD 워크플로우 확립 |
| v1.1 | ~3 | 3 | 5 | 11.6m | TDD 도입, 순수 함수 패턴 확립 |
| v1.2 | ~2 | 5 | 5 | 6.4m | 패턴 재활용 효과 — 45% 속도 향상 |

### Top Lessons (Verified Across Milestones)

1. summary-extract one_liner null 문제 반복 — SUMMARY.md 포맷 표준화 필요 (v1.0, v1.1 모두 발생)
2. sonnet 모델만으로 모든 구현/검증 가능 — opus는 계획/아키텍처 단계에서만 필요할 수 있음
3. phase별 의존성 그래프 순서가 실행 효율에 직결 — 로직 → UI 순서가 가장 안정적
4. verifier가 SUMMARY 문서를 그대로 신뢰하면 코드 불일치를 놓침 — 숫자 주장은 코드에서 직접 검증 필요 (v1.2에서 발견)
