# Roadmap: Plugin Advisor

## Overview

v1.0 마일스톤은 partial/unverified 상태인 26개 플러그인의 메타데이터를 GitHub repo와 공식 문서 기반으로 검증하고, verificationStatus를 업데이트하며, 영문 번역을 동기화하는 작업이다. 플러그인을 출처와 카테고리별로 묶어 4개 페이즈로 나눠 처리한다.

## Phases

- [x] **Phase 1: Community Orchestration Plugins** - omc, agency-agents, ralph 3개 커뮤니티 오케스트레이션 플러그인 검증
- [x] **Phase 2: Official MCP Monorepo Plugins** - modelcontextprotocol/servers 모노레포에서 제공하는 9개 플러그인 일괄 검증 (completed 2026-03-12)
- [x] **Phase 3: Platform & Official Plugins** - 각자 독립 repo를 가진 10개 공식/플랫폼 플러그인 검증 (completed 2026-03-12)
- [ ] **Phase 4: Remaining Plugins & Sync** - todoist, linear, uiux 검증 + 전체 verificationStatus 업데이트 + 영문 번역 동기화

## Phase Details

### Phase 1: Community Orchestration Plugins
**Goal**: omc, agency-agents, ralph 3개 커뮤니티 플러그인의 메타데이터가 실제 GitHub repo와 일치하도록 검증 및 수정된다
**Depends on**: Nothing (first phase)
**Requirements**: VERIFY-01, VERIFY-02, VERIFY-03, VERIFY-04, VERIFY-05, VERIFY-06
**Success Criteria** (what must be TRUE):
  1. omc(Yeachan-Heo/oh-my-claudecode), agency-agents(msitarzewski/agency-agents), ralph(haizelabs/ralph-wiggum) 각 repo가 존재하고 활성 상태임을 확인했다
  2. 3개 플러그인의 desc, longDesc, features가 README 내용과 일치하며 오해를 줄 설명이 수정되었다
  3. install 명령어가 repo의 실제 설치 방법과 일치한다 (특히 omc의 /plugin marketplace 명령 형식 검증)
  4. conflicts 규칙이 실제 호환성과 일치하는지 확인되었다 (omc ↔ superpowers 충돌 포함)
**Plans:** 1 plan

Plans:
- [x] 01-01-PLAN.md — Fetch GitHub READMEs, verify and update all metadata for omc, agency-agents, ralph

### Phase 2: Official MCP Monorepo Plugins
**Goal**: modelcontextprotocol/servers 모노레포에서 제공하는 9개 플러그인(sequential-thinking, brave-search, puppeteer, filesystem, git, postgres, memory, github, slack)의 메타데이터가 공식 문서와 일치한다
**Depends on**: Phase 1
**Requirements**: VERIFY-01, VERIFY-02, VERIFY-03, VERIFY-04, VERIFY-05, VERIFY-06
**Success Criteria** (what must be TRUE):
  1. 9개 플러그인 모두 modelcontextprotocol/servers repo 내 각 서브디렉토리 존재 여부가 확인되었다
  2. install 명령어가 공식 `claude mcp add` 형식과 패키지명(@modelcontextprotocol/server-*)이 정확하게 일치한다
  3. features와 keywords가 각 서버의 실제 제공 기능을 정확히 반영하도록 수정되었다
  4. brave-search, github, slack처럼 API key나 토큰이 필요한 경우 requiredSecrets가 정확히 기재되어 있다
**Plans:** 3/3 plans complete

Plans:
- [x] 02-01-PLAN.md — Verify metadata for sequential-thinking, brave-search, puppeteer
- [x] 02-02-PLAN.md — Verify metadata for filesystem, git, postgres, memory
- [x] 02-03-PLAN.md — Verify metadata for github, slack

### Phase 3: Platform & Official Plugins
**Goal**: 각자 독립 repo를 가진 10개 플러그인(notion, firecrawl, exa, tavily, perplexity, sentry, figma, docker, cloudflare, vercel)의 메타데이터가 공식 문서 기반으로 검증된다
**Depends on**: Phase 2
**Requirements**: VERIFY-01, VERIFY-02, VERIFY-03, VERIFY-04, VERIFY-05, VERIFY-06
**Success Criteria** (what must be TRUE):
  1. 10개 플러그인의 공식 GitHub repo(또는 공식 문서 URL)가 확인되었고, 현재 기재된 githubRepo 필드가 정확하다
  2. install 명령어가 각 플러그인 공식 문서의 Claude Code 설치 방법과 일치한다 (예: `npx -y @notionhq/notion-mcp-server`)
  3. 요구 API key/토큰 목록(requiredSecrets)이 실제 설정에 필요한 항목과 일치한다
  4. figma, cloudflare, docker처럼 advanced difficulty로 표시된 플러그인의 prerequisites가 실제 요구사항을 반영한다
**Plans:** 3/3 plans complete

Plans:
- [x] 03-01-PLAN.md — Verify metadata for notion, firecrawl, exa, tavily
- [x] 03-02-PLAN.md — Verify metadata for perplexity, sentry, figma
- [x] 03-03-PLAN.md — Verify metadata for docker, cloudflare, vercel

### Phase 4: Remaining Plugins & Sync
**Goal**: todoist, linear, uiux 3개 플러그인 검증을 완료하고, 전체 26개 플러그인의 verificationStatus를 업데이트하며, 영문 번역 파일을 동기화한다
**Depends on**: Phase 3
**Requirements**: VERIFY-01, VERIFY-02, VERIFY-03, VERIFY-04, VERIFY-05, VERIFY-06, UPDATE-01, UPDATE-02
**Success Criteria** (what must be TRUE):
  1. todoist(abhiz123/todoist-mcp-server), linear(jerhadf/linear-mcp-server) repo가 확인되고 메타데이터가 검증되었다
  2. uiux 플러그인의 githubRepo가 null임을 확인하거나 실제 repo URL을 발견해서 verificationStatus가 적절히 업데이트되었다
  3. lib/plugins.ts에서 검증된 플러그인의 verificationStatus가 "partial"/"unverified"에서 "verified" 또는 근거 있는 값으로 업데이트되었다
  4. lib/i18n/plugins-en.ts의 영문 번역이 lib/plugins.ts의 수정된 내용과 동기화되어 누락되거나 오래된 번역이 없다
**Plans:** 2 plans

Plans:
- [ ] 04-01-PLAN.md — Verify metadata for todoist, linear, uiux (repo check + README verification)
- [ ] 04-02-PLAN.md — Bulk verificationStatus audit + full i18n English translation sync

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Community Orchestration Plugins | 1/1 | Complete | 2026-03-11 |
| 2. Official MCP Monorepo Plugins | 3/3 | Complete   | 2026-03-12 |
| 3. Platform & Official Plugins | 3/3 | Complete   | 2026-03-12 |
| 4. Remaining Plugins & Sync | 0/2 | Not started | - |
