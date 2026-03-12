---
phase: 02-official-mcp-monorepo-plugins
verified: 2026-03-12T05:30:00Z
status: passed
score: 9/9 must-haves verified
re_verification: false
---

# Phase 2: Official MCP Monorepo Plugins Verification Report

**Phase Goal:** modelcontextprotocol/servers 모노레포에서 제공하는 9개 플러그인(sequential-thinking, brave-search, puppeteer, filesystem, git, postgres, memory, github, slack)의 메타데이터가 공식 문서와 일치한다
**Verified:** 2026-03-12T05:30:00Z
**Status:** passed
**Re-verification:** No — initial verification

---

## Goal Achievement

### Observable Truths (from ROADMAP.md Success Criteria)

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | 9개 플러그인 모두 모노레포 내 각 서브디렉토리 존재 여부가 확인되었다 | VERIFIED | All 9 plugins have verified githubRepo fields (servers or servers-archived). Comments in PLUGIN_FIELD_OVERRIDES document archived status for brave-search, puppeteer, postgres, github, slack. sequential-thinking, filesystem, git, memory confirmed in main branch. |
| 2 | install 명령어가 공식 `claude mcp add` 형식과 패키지명(@modelcontextprotocol/server-*)이 정확하게 일치한다 | VERIFIED | All 9 install commands use correct format. Notable: git uses `uvx mcp-server-git` (Python-based, not npx). filesystem and postgres include required path/connection-string args. Package names confirmed from package.json in READMEs. |
| 3 | features와 keywords가 각 서버의 실제 제공 기능을 정확히 반영하도록 수정되었다 | VERIFIED | All 9 plugins have features corrected to match documented tools. Key fixes: puppeteer PDF/network-intercept removed; postgres multi-DB claim removed; memory "auto entity extraction" replaced with actual CRUD tool names; github expanded from 4 to 6 items covering 26 tools; slack file-sharing removed, emoji-reaction added. |
| 4 | brave-search, github, slack처럼 API key나 토큰이 필요한 경우 requiredSecrets가 정확히 기재되어 있다 | VERIFIED | brave-search: `["Brave Search API key (BRAVE_API_KEY)"]`. github: `["GITHUB_PERSONAL_ACCESS_TOKEN"]`. slack: `["SLACK_BOT_TOKEN", "SLACK_TEAM_ID"]` (two env vars required). postgres: `["Database connection string (postgresql:// URL)"]`. All use exact env var names from READMEs. |

**Score:** 4/4 phase-level truths verified

### Plan-level Must-Have Truths (from PLAN frontmatter)

#### Plan 02-01 (sequential-thinking, brave-search, puppeteer)

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | 3개 서브디렉토리 모노레포 내 존재 확인 | VERIFIED | sequential-thinking → modelcontextprotocol/servers (main). brave-search, puppeteer → modelcontextprotocol/servers-archived. Comments in PLUGIN_FIELD_OVERRIDES. |
| 2 | install 명령어가 공식 형식 및 패키지명과 일치 | VERIFIED | `claude mcp add sequential-thinking -- npx -y @modelcontextprotocol/server-sequential-thinking`, same pattern for brave-search and puppeteer. |
| 3 | features, keywords가 실제 제공 기능을 정확히 반영 | VERIFIED | sequential-thinking: 4 features matching README Features section. brave-search: web/local search + auto-fallback. puppeteer: 4 features from actual 7 tools (navigate, screenshot, click, hover, fill, select, evaluate). |
| 4 | brave-search의 requiredSecrets가 정확히 기재 | VERIFIED | `["Brave Search API key (BRAVE_API_KEY)"]` — env var name confirmed from README. |
| 5 | puppeteer와 playwright의 conflicts 규칙이 검증 | VERIFIED | `puppeteer.conflicts: ["playwright"]` in CORE_PLUGINS line 753. `playwright.conflicts: ["puppeteer"]` line 726. Symmetric and correct. |

#### Plan 02-02 (filesystem, git, postgres, memory)

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | 4개 서브디렉토리 모노레포 내 존재 확인 | VERIFIED | filesystem, git, memory → main branch. postgres → servers-archived. githubRepo fields set accordingly. |
| 2 | install 명령어가 공식 형식 및 패키지명과 일치 | VERIFIED | filesystem uses path arg, postgres uses connection string arg. git uses `uvx mcp-server-git` (Python). |
| 3 | features, keywords가 실제 제공 기능을 정확히 반영 | VERIFIED | All 4 features arrays corrected to match README tools lists. |
| 4 | postgres의 requiredSecrets(Database connection string)가 정확히 기재 | VERIFIED | `requiredSecrets: ["Database connection string (postgresql:// URL)"]` at line 188. |
| 5 | filesystem의 prerequisites(접근 허용 디렉토리 경로)가 정확히 기재 | VERIFIED | `prerequisites: ["접근 허용 디렉토리 경로 (1개 이상 필수)"]` at line 198. |

#### Plan 02-03 (github, slack)

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | github, slack 서브디렉토리 모노레포 내 존재 확인 | VERIFIED | Both have `githubRepo: "modelcontextprotocol/servers-archived"`. |
| 2 | install 명령어가 공식 형식 및 패키지명과 일치 | VERIFIED | `claude mcp add github -- npx -y @modelcontextprotocol/server-github` and `claude mcp add slack -- npx -y @modelcontextprotocol/server-slack`. |
| 3 | features, keywords가 실제 제공 기능을 정확히 반영 | VERIFIED | github: 6 feature entries covering 26 documented tools. slack: 4 feature entries covering actual 8 tools (emoji-reaction added, file-sharing removed). |
| 4 | github의 requiredSecrets(GitHub token)가 정확히 기재 | VERIFIED | `requiredSecrets: ["GITHUB_PERSONAL_ACCESS_TOKEN"]` — exact env var name from README. |
| 5 | slack의 requiredSecrets(Slack workspace token)가 정확히 기재 | VERIFIED | `requiredSecrets: ["SLACK_BOT_TOKEN", "SLACK_TEAM_ID"]` — two required env vars, correct from README. |
| 6 | Phase 2의 9개 플러그인 모두 verificationStatus가 업데이트 | VERIFIED | All 9 have `verificationStatus: "verified"` in PLUGIN_FIELD_OVERRIDES. See artifact table below. |

---

## Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `lib/plugins.ts` | Verified metadata for all 9 plugins; verificationStatus: "verified" in PLUGIN_FIELD_OVERRIDES | VERIFIED | All 9 confirmed: sequential-thinking (line 244), brave-search (line 113), puppeteer (line 75), filesystem (line 192), git (line 267), postgres (line 181), memory (line 259), github (line 136), slack (line 144). Each has `verificationStatus: "verified"` and `officialStatus: "official"`. |
| `lib/i18n/plugins-en.ts` | Synced English translations for all 9 plugins | VERIFIED | All 9 plugins present in `pluginDescEn` and `reasonsEn`. Entries confirmed at lines: sequential-thinking (39), brave-search (79), puppeteer (67), memory (59), postgres (95), github (107), slack (111), filesystem (115), git (119). |

---

## Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `lib/plugins.ts` CORE_PLUGINS | `lib/i18n/plugins-en.ts` pluginDescEn | Plugin IDs must match | WIRED | All 9 Phase 2 plugin IDs present in both files. |
| `lib/plugins.ts` CORE_PLUGINS | `lib/i18n/plugins-en.ts` reasonsEn | Plugin IDs must match | WIRED | All 9 Phase 2 plugin IDs confirmed in reasonsEn at lines 159, 164, 166, 169, 173, 176, 177, 178, 179. |
| `lib/plugins.ts` PLUGIN_FIELD_OVERRIDES | `lib/plugins.ts` CORE_PLUGINS | IDs must align | WIRED | All 9 overrides correspond to existing CORE_PLUGINS entries. |

---

## Requirements Coverage

| Requirement | Source Plans | Description | Status | Evidence |
|-------------|-------------|-------------|--------|----------|
| VERIFY-01 | 02-01, 02-02, 02-03 | GitHub repo 존재 여부 및 활성 상태 확인 | SATISFIED | All 9 repos confirmed (main or servers-archived). githubRepo fields updated. Comments document archived status. |
| VERIFY-02 | 02-01, 02-02, 02-03 | README 기반 desc, longDesc 정확성 검토 및 수정 | SATISFIED | All 9 Korean desc/longDesc updated to match README content (documented per plugin in SUMMARY files). English translations synced in plugins-en.ts. |
| VERIFY-03 | 02-01, 02-02, 02-03 | features 목록이 실제 기능과 일치하는지 검토 및 수정 | SATISFIED | All 9 features arrays corrected to match documented tools. Major fixes: puppeteer (removed PDF/network-intercept), postgres (removed multi-DB), memory (replaced auto-extraction with manual CRUD), github (expanded to 6 items), slack (removed file-sharing). |
| VERIFY-04 | 02-01, 02-02, 02-03 | keywords가 실제 용도를 반영하는지 검토 및 수정 | SATISFIED | Keywords updated for sequential-thinking (계획/plan/단계), brave-search (로컬/local/비즈니스/business), puppeteer (javascript/폼/form), git and others confirmed. |
| VERIFY-05 | 02-01, 02-02, 02-03 | install 명령어가 공식 문서와 일치하는지 확인 및 수정 | SATISFIED | All 9 install commands verified. Critical fix: git changed from npx to uvx (Python server). filesystem and postgres include required arguments. |
| VERIFY-06 | 02-01, 02-02, 02-03 | conflicts 규칙이 실제로 유효한지 검토 | SATISFIED | puppeteer↔playwright conflict confirmed (symmetric). brave-search↔tavily retained as valid recommender design decision. sequential-thinking, filesystem, git, postgres, memory, github, slack all confirmed `conflicts: []`. |

**Orphaned requirements check:** REQUIREMENTS.md maps VERIFY-01 through VERIFY-06 to Phase 2. All 6 are claimed by all 3 plans and verified above. No orphaned requirements.

Note: UPDATE-01 and UPDATE-02 are assigned to Phase 4 in REQUIREMENTS.md — not in scope for Phase 2.

---

## Commit Verification

All three task commits referenced in SUMMARY files are confirmed in git log:

| Commit | Plan | Description |
|--------|------|-------------|
| `4e578cf` | 02-01 | feat(02-01): verify and update sequential-thinking, brave-search, puppeteer plugin metadata |
| `6f01e14` | 02-02 | feat(02-02): verify and update filesystem, git, postgres, memory plugin metadata |
| `e9fd885` | 02-03 | feat(02-03): verify and update github, slack plugin metadata |

---

## Anti-Patterns Found

No blockers found. One minor observation:

| File | Pattern | Severity | Notes |
|------|---------|----------|-------|
| `lib/plugins.ts` line 943 | postgres install `postgresql://localhost/mydb` | Info | The connection string uses `localhost/mydb` as a placeholder — this is the correct format from the README example. Not a stub; it correctly documents the required argument pattern. |

No TODO/FIXME/placeholder comments found in Phase 2 modified files. No empty implementations. Build passes cleanly with zero errors.

---

## Build / Type / Lint Status

- **pnpm typecheck:** PASS (confirmed — build output shows all routes compiled successfully)
- **pnpm build:** PASS (confirmed — clean output, no errors or warnings)

---

## Human Verification Required

None. All Phase 2 success criteria are verifiable programmatically through code inspection:
- verificationStatus fields are code values, not UI behavior
- install commands are string literals, fully inspectable
- requiredSecrets are data arrays, fully inspectable
- features arrays are data, fully inspectable

---

## Summary

Phase 2 goal is fully achieved. All 9 MCP monorepo plugins have been verified against official README sources across 3 plans (02-01, 02-02, 02-03):

1. **sequential-thinking** — confirmed in main monorepo, dynamic revision/branching features correct, officialStatus/verificationStatus added (were previously missing from overrides)
2. **brave-search** — moved to servers-archived, BRAVE_API_KEY env var name added, features corrected to include local business search and auto-fallback
3. **puppeteer** — moved to servers-archived, features corrected to actual 7 tools (PDF/network-intercept removed)
4. **filesystem** — in main branch, difficulty changed advanced→intermediate, prerequisites documented
5. **git** — install command corrected from npx to uvx (Python-based server), Python/uvx prerequisites added
6. **postgres** — moved to servers-archived, multi-DB claim removed (single query tool in READ ONLY mode), connection string format documented
7. **memory** — in main branch, "auto entity extraction" replaced with accurate manual CRUD tool names
8. **github** — moved to servers-archived, GITHUB_PERSONAL_ACCESS_TOKEN env var name corrected, features expanded to reflect 26 documented tools
9. **slack** — moved to servers-archived, requiredSecrets corrected to two env vars (SLACK_BOT_TOKEN + SLACK_TEAM_ID), file-sharing feature removed, emoji-reaction added

All 6 requirements (VERIFY-01 through VERIFY-06) are satisfied across all 9 plugins. TypeScript build passes. English translations synced in `lib/i18n/plugins-en.ts` for all 9 plugins.

---

_Verified: 2026-03-12T05:30:00Z_
_Verifier: Claude (gsd-verifier)_
