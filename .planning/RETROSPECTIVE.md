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

## Milestone: v1.3 — DB 확장

**Shipped:** 2026-03-19
**Phases:** 4 | **Plans:** 5 | **Sessions:** ~2

### What Was Built
- 6개 MCP 서버 등록 (fetch, time, markitdown, magic-mcp, n8n-mcp, shadcn-mcp)
- 3개 Plugin 등록 (claude-mem, superclaude, frontend-design) — DB 42→51
- 전체 install 명령 + i18n 소스 수준 검증, 테스트 임계값 51로 갱신
- 9개 tailored Korean reason 문자열 추가 (REASONS 객체)
- orphaned reasonsEn export 삭제 (dead code 정리)

### What Worked
- 초기 감사(audit)에서 INT-01/FLOW-01 gap을 발견하여 Phase 16을 추가 — 감사 기반 gap closure 패턴이 효과적
- v1.0에서 확립한 GitHub README 기반 검증 + PLUGIN_FIELD_OVERRIDES 패턴을 그대로 재활용 — Phase 13/14가 매우 빠르게 완료
- Phase 15(검증 전용)가 데이터 정합성 최종 확인 역할 — install 명령 verbatim 비교로 오류 방지
- reasonsEn 삭제 전 grep으로 zero consumers 확인 — 안전한 dead code 제거 패턴

### What Was Inefficient
- 첫 감사에서 Phase 16 없이 tech_debt 상태로 완료 → Phase 16 추가 후 재감사 필요 — gap closure phase를 로드맵 단계에서 미리 계획했으면 감사 1회로 충분
- summary-extract one_liner 여전히 null — 4번째 마일스톤에서도 미해결
- Nyquist VALIDATION.md가 4개 phase 모두 draft/미서명 — 빠른 데이터 phase에서는 sign-off 누락 반복

### Patterns Established
- REASONS 객체 스타일: Korean, 1-2문장, 요. 종결, signal + benefit 구조
- hyphenated ID는 quoted string key 필수 ("magic-mcp", "claude-mem" 등)
- dead export 삭제 전 grep 확인 패턴 (zero consumers → 삭제 안전)
- 감사 기반 gap closure: audit → gap 발견 → phase 추가 → 재감사

### Key Lessons
1. 데이터 전용 마일스톤은 감사 단계에서 cross-phase wiring gap이 발견되기 쉬움 — REASONS 같은 파생 데이터는 원본 데이터와 동시에 추가해야 함
2. Plugin 설치 명령이 MCP와 완전히 다른 체계 (/plugin marketplace add + /plugin install) — 향후 Plugin 추가 시 반드시 별도 패턴으로 처리
3. reasonsEn처럼 한 번도 사용되지 않는 export가 3개 마일스톤 동안 존재 — 새 export 추가 시 즉시 consumer 연결 또는 추가하지 않는 원칙 필요

### Cost Observations
- Model mix: 0% opus, 100% sonnet, 0% haiku (balanced profile)
- Total execution: ~25m across 5 plans (estimated)
- Notable: plan당 평균 ~5분 — v1.2의 6.4분 대비 추가 단축. 순수 데이터 추가라 빠름.

---

## Milestone: v1.4 — 마케팅 준비

**Shipped:** 2026-03-30
**Phases:** 3 | **Plans:** 9 | **Sessions:** ~4

### What Was Built
- Umami Cloud analytics 전 페이지 통합 (CSP + 이벤트 마이그레이션 + rewrite 프록시)
- next/og Edge Runtime 동적 OG 이미지 (사이트 기본 + 51 플러그인 + 6 가이드)
- ShareResultButton (Web Share API + 클립보드 + X/LinkedIn 소셜 링크)
- FeedbackWidget (글로벌 플로팅 버튼 + 드로어 + 별점 + Supabase)
- NewsletterForm (랜딩 + /guides 이메일 구독 + Supabase upsert)
- Supabase 수동 타입 정의 (lib/supabase-types.ts)

### What Worked
- zero new npm packages 원칙 — Umami 외부 스크립트, next/og 빌트인, Web Share API 네이티브, Supabase 기존 클라이언트로 전체 마일스톤 완성
- Phase 17→18→19 의존성 순서가 매우 자연스러움 — 17의 Supabase 테이블이 19의 API route에, 18의 OG 이미지가 19의 공유에 활용
- Gap closure 패턴 (19-04, 19-05)으로 감사에서 발견된 문제를 체계적으로 해결 — audit → gap plan → fix → verify
- TDD 패턴 유지 (share-utils, API routes) — 13개 이상 신규 테스트 추가

### What Was Inefficient
- Phase 19가 5개 plan으로 분할됨 (원래 3개 → gap closure 2개 추가) — 초기 계획에서 소셜 공유 링크와 /guides 뉴스레터 통합을 빠뜨림
- Supabase 타입 문제 (@ts-expect-error 4개)가 19-03에서 발생하여 19-05에서 별도 gap closure — 타입 정의를 19-01 foundation에서 선행했으면 @ts-expect-error 없이 진행 가능
- summary-extract one_liner 여전히 null — 5번째 마일스톤에서도 미해결 (SUMMARY frontmatter 포맷 문제)
- SUMMARY frontmatter requirements_completed가 19-03/04/05에서 비어있음 — 감사에서 documentation gap으로 발견

### Patterns Established
- next.config.mjs rewrite 기반 프록시 (API route 대신) — 서버리스 함수 비용 제로
- OG 이미지 패턴: lib/og-utils.ts 공유 유틸 + route별 opengraph-image.tsx + twitter-image.tsx convention files
- Web Share API feature detection: 'share' in navigator (typeof 대신 in 연산자)
- Supabase 수동 Database 타입: Relationships: [] 필수 (postgrest-js@2.98.0 GenericTable 계약)
- FeedbackWidget I18nProvider 내부 배치 필수 — 전역 컴포넌트에서도 i18n 컨텍스트 필요

### Key Lessons
1. 마케팅 인프라 마일스톤은 기능 간 연결이 밀접 — analytics/OG/share/feedback가 서로 의존하므로 하나의 마일스톤으로 묶는 것이 정확했음
2. Supabase 타입 정의를 테이블 생성 시점에 함께 추가해야 함 — 나중에 gap closure로 추가하면 중간 plan들에서 @ts-expect-error 오염
3. Gap closure plan은 불가피하지만, 감사 전에 스스로 누락을 발견할 수 있는 체크리스트가 있으면 더 효율적
4. Edge Runtime OG 이미지에서 한국어 폰트는 아직 미해결 — titleEn/summaryEn 우회가 현실적 대안

### Cost Observations
- Model mix: 0% opus, 100% sonnet, 0% haiku (balanced profile)
- Total execution: ~2 days, 9 plans
- Notable: Phase 17이 가장 복잡 (프록시 API route → rewrite 리팩토링), Phase 18-19는 패턴 재활용으로 빠르게 진행

---

## Cross-Milestone Trends

### Process Evolution

| Milestone | Sessions | Phases | Plans | Avg min/plan | Key Change |
|-----------|----------|--------|-------|--------------|------------|
| v1.0 | ~5 | 4 | 9 | 11.4m | 첫 마일스톤 — GSD 워크플로우 확립 |
| v1.1 | ~3 | 3 | 5 | 11.6m | TDD 도입, 순수 함수 패턴 확립 |
| v1.2 | ~2 | 5 | 5 | 6.4m | 패턴 재활용 효과 — 45% 속도 향상 |
| v1.3 | ~2 | 4 | 5 | ~5m | 순수 데이터 마일스톤 — 최단 plan 시간 |
| v1.4 | ~4 | 3 | 9 | — | 마케팅 인프라 — zero new npm, gap closure 패턴 |

### Top Lessons (Verified Across Milestones)

1. summary-extract one_liner null 문제 반복 — SUMMARY.md 포맷 표준화 필요 (v1.0~v1.4 모두 발생)
2. sonnet 모델만으로 모든 구현/검증 가능 — opus는 계획/아키텍처 단계에서만 필요할 수 있음
3. phase별 의존성 그래프 순서가 실행 효율에 직결 — 로직 → UI 순서가 가장 안정적
4. verifier가 SUMMARY 문서를 그대로 신뢰하면 코드 불일치를 놓침 — 숫자 주장은 코드에서 직접 검증 필요 (v1.2에서 발견)
5. 타입 정의/인프라를 foundation phase에서 선행해야 중간 plan에서 workaround(@ts-expect-error) 없이 진행 가능 (v1.4에서 발견)
