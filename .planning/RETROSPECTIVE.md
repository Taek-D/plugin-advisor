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

## Cross-Milestone Trends

### Process Evolution

| Milestone | Sessions | Phases | Key Change |
|-----------|----------|--------|------------|
| v1.0 | ~5 | 4 | 첫 마일스톤 — GSD 워크플로우 확립 |

### Top Lessons (Verified Across Milestones)

1. (v1.0에서 시작 — 후속 마일스톤에서 검증 예정)
