# Milestones

## v1.3 DB 확장 (Shipped: 2026-03-19)

**Phases:** 13-16 | **Plans:** 5 | **Timeline:** 1 day (2026-03-19)
**Files:** 19 changed (+642 / -72)

**Key accomplishments:**
- 6개 MCP 서버 등록 (fetch, time, markitdown, magic-mcp, n8n-mcp, shadcn-mcp) — GitHub README 기반 verbatim install 명령 검증
- 3개 Plugin 등록 (claude-mem, superclaude, frontend-design) — type: 'plugin' 분류, DB 42→51 확장
- 9개 신규 항목 install 명령 + i18n(pluginDescEn) 소스 수준 검증, 테스트 임계값 51로 갱신
- 9개 tailored Korean reason 문자열 추가 — /advisor 추천 카드에 맞춤 이유 표시
- orphaned reasonsEn export 삭제 (zero consumers 확인) — dead code 정리

---

## v1.2 MCP + Plugin 통합 (Shipped: 2026-03-18)

**Phases:** 8-12 | **Plans:** 5 | **Timeline:** 1 day (2026-03-18)
**Files:** 44 changed (+4,580 / -84)

**Key accomplishments:**
- `ItemType = "mcp" | "plugin"` 타입 시스템 추가 — 42개 기존 항목 자동 분류, 무수정 마이그레이션
- 9개 Plugin 항목 DB 재분류 (omc, superpowers, bkit-starter, bkit, taskmaster, gsd, fireauto, agency-agents, ralph)
- scorePlugins에 typeScope 파라미터 추가 — MCP/Plugin별 보완 추천 분리 (하위 호환 유지)
- /plugins 페이지 All/MCP/Plugin 탭 분리 — URL 상태 유지, 브라우저 뒤로가기 보존
- /optimizer 붙여넣기 힌트 + 샘플 데이터 MCP+Plugin 통합 안내, 타입 뱃지 추가

### Known Gaps
- **DATA-01:** Plugin DB 최소 10개 요구에 9개 등록 (1개 부족). 기능적으로는 문제 없음.

**Archive:** `.planning/milestones/v1.2-ROADMAP.md`, `.planning/milestones/v1.2-REQUIREMENTS.md`

---

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

