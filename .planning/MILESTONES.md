# Milestones

## v1.1 Plugin Optimizer (Shipped: 2026-03-18)

**Phases:** 5-7 | **Plans:** 5 | **Timeline:** 2 days (2026-03-16 → 2026-03-17)
**Files:** 82 changed (+8,849 / -238)

**Key accomplishments:**
- `claude mcp list` 결과 자동 파싱 + alias 정규화 (2가지 포맷 지원, 15개 유닛 테스트)
- 42개 플러그인 DB 기반 자동완성 입력 (ARIA combobox 패턴, 키보드 네비게이션)
- TDD 기반 조합 점수 엔진 — 100점 감점 모델 (충돌/중복/미커버, 42개 테스트)
- 커버리지 분석 + 보완/대체 추천 로직 (10개 카테고리, deprecated/unverified 대안 제시)
- Progressive disclosure 결과 UI — SVG 스코어 게이지, 접기/펼치기 섹션, 반응형 그리드

**Archive:** `.planning/milestones/v1.1-ROADMAP.md`, `.planning/milestones/v1.1-REQUIREMENTS.md`

---

## v1.0 Plugin Metadata Verification (Shipped: 2026-03-16)

**Phases:** 1-4 | **Plans:** 9 | **Timeline:** 6 days (2026-03-11 → 2026-03-16)
**Files:** 44 changed (+4,272 / -546)

**Key accomplishments:**
- 42개 플러그인 전체 verificationStatus 감사 완료 (35 verified, 5 partial, 2 unverified)
- MCP 모노레포 9개 플러그인 install/features/requiredSecrets 대량 수정
- 10개 플랫폼 공식 플러그인 검증 — remote HTTP MCP, OAuth 패턴 다수 발견
- todoist/linear 검증 완료, uiux는 MCP 서버 아님 확인 (프롬프트 스킬)
- 42/42 영문 번역(pluginDescEn + reasonsEn) 동기화 완료
- ralph repo 404 확인 → unverified, linear deprecated → mcp.linear.app/sse 공식 이전

**Archive:** `.planning/milestones/v1.0-ROADMAP.md`, `.planning/milestones/v1.0-REQUIREMENTS.md`

---

