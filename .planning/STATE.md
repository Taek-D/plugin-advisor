---
gsd_state_version: 1.0
milestone: v1.0
milestone_name: milestone
status: in_progress
stopped_at: Completed 03-02-PLAN.md. Phase 3 complete (2 of 2 plans done) — perplexity, sentry, figma verified.
last_updated: "2026-03-12T05:54:00Z"
last_activity: 2026-03-12 — Completed 03-02-PLAN.md (perplexity, sentry, figma metadata verification)
progress:
  total_phases: 4
  completed_phases: 3
  total_plans: 7
  completed_plans: 6
  percent: 86
---

# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-03-11)

**Core value:** 사용자의 프로젝트에 맞는 검증된 Claude Code 플러그인 조합을 정확하게 추천하는 것.
**Current focus:** Phase 3 — Standalone Official Repos (plan 2 of 2 remaining)

## Current Position

Phase: 3 of 4 complete (Standalone Official Repos)
Plan: 2 of 2 in Phase 3 complete — Phase 3 DONE
Status: Phase 3 complete — proceeding to Phase 4 (remaining plugins + sync)
Last activity: 2026-03-12 — Completed 03-02-PLAN.md (perplexity, sentry, figma metadata verification)

Progress: [████████░░] 86%

## Performance Metrics

**Velocity:**
- Total plans completed: 6
- Average duration: 12m
- Total execution time: 70m

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| 01-community-orchestration-plugins | 1 | 7m | 7m |
| 02-official-mcp-monorepo-plugins | 3 | 47m | 16m |
| 03-platform-official-plugins | 2 | 16m | 8m |

**Recent Trend:**
- Last 5 plans: 02-01 (14m), 02-02 (18m), 02-03 (15m), 03-01 (6m), 03-02 (10m)
- Trend: stable

*Updated after each plan completion*

## Accumulated Context

### Decisions

- [Roadmap]: partial/unverified만 검증 대상 — verified 10개(superpowers, bkit-starter, bkit, context7, repomix, playwright, security, taskmaster, gsd, fireauto)는 제외
- [Roadmap]: 플러그인을 출처별로 4개 페이즈로 묶음 — Phase 1(커뮤니티 오케스트레이션), Phase 2(MCP 모노레포), Phase 3(독립 공식 repo), Phase 4(나머지 + 동기화)
- [01-01]: ralph verificationStatus → "unverified" — haizelabs/ralph-wiggum repo가 GitHub에서 404 반환 (2026-03-11 기준)
- [01-01]: agency-agents 설치 방법 수정 — Claude Code 권장은 cp -r (not install.sh, which targets Cursor/Aider/Windsurf)
- [01-01]: omc 설치 3단계 수정 — /omc-setup (README 확인), /oh-my-claudecode:omc-setup은 오기
- [01-01]: omc conflicts: [superpowers] 유지 — 추천 시스템 설계 결정, omc README에 명시되지 않았으나 역할 중복으로 유효
- [02-01]: brave-search/puppeteer githubRepo → servers-archived — main 모노레포에서 이동됐지만 npm 패키지는 계속 동작
- [02-01]: sequential-thinking에 officialStatus/verificationStatus 추가 — PLUGIN_FIELD_OVERRIDES에 누락되어 기본값(community/partial)으로 남아 있었음
- [02-01]: brave-search requiredSecrets에 env var명 추가 — (BRAVE_API_KEY) 포함, README에서 확인
- [02-01]: puppeteer features 수정 — PDF/네트워크 인터셉트는 README에 없음, 실제 7개 툴 기반으로 수정
- [02-02]: postgres githubRepo → servers-archived — main 모노레포에서 이동됐지만 npm 패키지는 계속 동작
- [02-02]: git install npx → uvx — Python 기반 서버(mcp-server-git), npm 패키지 아님. uvx mcp-server-git --repository /path/to/repo
- [02-02]: postgres features 수정 — 단일 query 툴(READ ONLY)만 존재, 다중 DB 연결 불가 (단일 연결 문자열)
- [02-02]: memory features 수정 — "자동 엔티티 추출" 제거, 실제 수동 CRUD 툴(create/delete entities/relations, observations) 반영
- [02-02]: filesystem difficulty advanced → intermediate — 허용 디렉토리 지정 방식은 직관적, advanced 과대표현
- [02-03]: github githubRepo → servers-archived — main 모노레포 src/github 없음; 후속 개발은 github/github-mcp-server로 이전
- [02-03]: slack githubRepo → servers-archived — brave-search, puppeteer, postgres와 동일한 이전
- [02-03]: github requiredSecrets → GITHUB_PERSONAL_ACCESS_TOKEN — README에서 정확한 env var명 확인
- [02-03]: slack requiredSecrets → [SLACK_BOT_TOKEN, SLACK_TEAM_ID] — 두 env var 모두 필수 (README 확인)
- [02-03]: github features 확장 — 26개 툴 문서화; 파일 ops/이슈/PR/검색/브랜치/커밋 6개 차원으로 표현
- [02-03]: slack features 수정 — 파일 공유 툴 없음 제거; emoji reaction 툴 추가; 8개 실제 툴 반영
- [03-01]: notion requiredSecrets → NOTION_TOKEN — README에서 권장 env var명 확인 (NOTION_API_KEY 아님)
- [03-01]: firecrawl install 수정 — /plugin marketplace add firecrawl는 완전히 잘못됨; 올바른 패키지는 firecrawl-mcp
- [03-01]: exa install → remote HTTP MCP — exa-labs가 mcp.exa.ai 호스팅 서버로 이전; claude mcp add --transport http 사용
- [03-01]: exa requiredSecrets → [] — 원격 서버 기본 툴(웹/코드/기업 검색)은 API 키 없이 사용 가능
- [03-01]: tavily install → remote HTTP MCP — mcp.tavily.com 원격 서버; TAVILY_API_KEY를 URL 파라미터로 전달
- [03-01]: tavily conflicts: [brave-search] 유지 — 둘 다 웹 검색 API로 동시 추천 시 중복; 설계 결정 유효
- [03-01]: notion features → v2.0 data sources 용어로 업데이트 — v2.0.0에서 database 툴이 data source 툴로 교체됨 (22개 툴)
- [03-01]: firecrawl features 업데이트 — 실제 14개 툴 반영 (scrape/batch/map/crawl/search/extract/agent/browser); 스케줄링은 README에 없음
- [03-02]: perplexity package → @perplexity-ai/mcp-server — 구 perplexity-mcp@latest는 잘못된 패키지명; scoped 패키지로 확인
- [03-02]: perplexity requiredSecrets → PERPLEXITY_API_KEY — README에서 정확한 env var명 확인
- [03-02]: perplexity features → 4개 실제 툴 (search/ask/research/reason) — perplexity_search, perplexity_ask, perplexity_research, perplexity_reason
- [03-02]: sentry install → plugin marketplace — README에서 claude plugin marketplace add getsentry/sentry-mcp 권장
- [03-02]: sentry requiredSecrets → SENTRY_ACCESS_TOKEN — stdio 모드의 정확한 env var명; 원격 모드는 OAuth
- [03-02]: sentry features: 자동 수정 제안 제거 — Sentry MCP는 에러 읽기/분석만; 코드 자동 수정 없음. Seer AI 진단 추가
- [03-02]: figma githubRepo → figma/mcp-server-guide — figma/figma-mcp는 404; 공식 가이드 repo는 figma/mcp-server-guide
- [03-02]: figma install → remote HTTP MCP (mcp.figma.com) — 공식 서버는 Figma가 원격 호스팅; figma-developer-mcp는 커뮤니티 패키지(GLips)
- [03-02]: figma requiredSecrets → [] — mcp.figma.com OAuth 인증 방식; API 키 불필요
- [03-02]: figma prerequisites → Dev/Full seat 필요 — 무료 플랜은 월 6회 제한; 유의미한 사용은 유료 플랜 필요

### Pending Todos

None yet.

### Blockers/Concerns

- uiux 플러그인의 githubRepo가 null이고 officialStatus가 "unknown" — Phase 4에서 실제 repo 유무 확인 필요

## Session Continuity

Last session: 2026-03-12
Stopped at: Completed 03-02-PLAN.md. Phase 3 complete (2/2 plans) — perplexity, sentry, figma verified.
Resume file: None
