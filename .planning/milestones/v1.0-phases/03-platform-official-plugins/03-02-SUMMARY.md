---
phase: 03-platform-official-plugins
plan: "02"
subsystem: plugin-metadata
tags: [verification, perplexity, sentry, figma, metadata]
dependency_graph:
  requires: [03-01]
  provides: [verified-perplexity, verified-sentry, verified-figma]
  affects: [lib/plugins.ts, lib/i18n/plugins-en.ts]
tech_stack:
  added: []
  patterns: [readme-verification, remote-mcp-http-transport, oauth-remote-mcp]
key_files:
  modified:
    - lib/plugins.ts
    - lib/i18n/plugins-en.ts
decisions:
  - "[03-02]: perplexity package → @perplexity-ai/mcp-server — old perplexity-mcp@latest is wrong package name; scoped package confirmed from README"
  - "[03-02]: perplexity requiredSecrets → PERPLEXITY_API_KEY — exact env var name confirmed from README"
  - "[03-02]: perplexity features → 4 actual tools (search/ask/research/reason) — README documents perplexity_search, perplexity_ask, perplexity_research, perplexity_reason"
  - "[03-02]: sentry install → plugin marketplace (not npx) — README recommends claude plugin marketplace add getsentry/sentry-mcp as primary install method"
  - "[03-02]: sentry requiredSecrets → SENTRY_ACCESS_TOKEN — exact env var name for stdio mode confirmed from README"
  - "[03-02]: sentry features: remove 자동 수정 제안 — Sentry MCP reads/analyzes errors but does NOT auto-fix code; replaced with Seer AI diagnosis feature"
  - "[03-02]: figma githubRepo → figma/mcp-server-guide — figma/figma-mcp returns 404; official guide repo is figma/mcp-server-guide"
  - "[03-02]: figma install → remote HTTP MCP (mcp.figma.com) — official server is hosted remotely by Figma, not self-hosted; figma-developer-mcp is a community package (GLips/Figma-Context-MCP)"
  - "[03-02]: figma requiredSecrets → [] — authentication via OAuth through mcp.figma.com, no API key needed for official server"
  - "[03-02]: figma prerequisites → Dev/Full seat required — free plan users limited to 6 tool calls/month; meaningful use requires paid Figma plan"
  - "[03-02]: figma difficulty advanced confirmed — OAuth setup + paid seat requirement justify advanced difficulty"
metrics:
  duration: 10m
  completed: 2026-03-12
  tasks_completed: 1
  files_modified: 2
---

# Phase 3 Plan 02: Perplexity, Sentry, Figma Verification Summary

**One-liner:** Three standalone official MCP plugins verified against live repos — perplexity package renamed to scoped @perplexity-ai/mcp-server, sentry install corrected to plugin marketplace, figma corrected to official OAuth remote MCP at mcp.figma.com.

## What Was Done

Verified metadata for perplexity, sentry, and figma plugins against their official GitHub repositories and npm registry. All three had significant inaccuracies that were corrected.

## Verification Results

### Perplexity (ppl-ai/modelcontextprotocol)

**VERIFY-01 — Repo:** Confirmed active at https://github.com/ppl-ai/modelcontextprotocol

**VERIFY-02 — Description:** Updated to reflect 4 actual tools and PERPLEXITY_API_KEY requirement.

**VERIFY-03 — Features:** Updated from generic descriptions to actual 4 tools:
- `perplexity_search` (web search with ranked results)
- `perplexity_ask` (conversational AI via sonar-pro)
- `perplexity_research` (deep research via sonar-deep-research)
- `perplexity_reason` (advanced reasoning via sonar-reasoning-pro)

**VERIFY-04 — Keywords:** Added "추론", "reasoning", "심층" to reflect reasoning/research tools.

**VERIFY-05 — Install command:** Major correction — old package `perplexity-mcp@latest` does not match. Correct package is `@perplexity-ai/mcp-server` with `--env PERPLEXITY_API_KEY` flag:
```
claude mcp add perplexity --env PERPLEXITY_API_KEY="your_key_here" -- npx -y @perplexity-ai/mcp-server
```

**VERIFY-06 — Conflicts:** `conflicts: []` confirmed correct.

**requiredSecrets:** Updated from `"Perplexity API key"` → `"PERPLEXITY_API_KEY"` (exact env var name).

---

### Sentry (getsentry/sentry-mcp)

**VERIFY-01 — Repo:** Confirmed active at https://github.com/getsentry/sentry-mcp

**VERIFY-02 — Description:** Updated to reflect issue search, event analysis, release management, and Seer AI diagnosis.

**VERIFY-03 — Features:** Significant correction — "자동 수정 제안" (auto-fix suggestions) removed as overstated. Sentry MCP reads and analyzes errors but does NOT auto-fix code. Actual tools confirmed from repo structure: find-organizations, find-projects, find-teams, find-releases, find-dsns, get-issue-details, get-issue-tag-values, get-event-attachment, get-profile, analyze-issue-with-seer, create-project, create-team, create-dsn. Updated features:
- 이슈 상세 조회 및 검색
- 이벤트·스택 트레이스 분석
- 릴리스·프로젝트·팀 관리
- AI 기반 에러 진단 (Seer)

**VERIFY-04 — Keywords:** Added "이슈", "issue", "릴리스", "release".

**VERIFY-05 — Install command:** Major correction — README recommends the Claude Code plugin method as primary:
```
claude plugin marketplace add getsentry/sentry-mcp
claude plugin install sentry-mcp@sentry-mcp
```
Old `claude mcp add sentry -- npx -y @sentry/mcp-server` is the stdio mode (for self-hosted Sentry), not the primary recommended install.

**VERIFY-06 — Conflicts:** `conflicts: []` confirmed correct.

**requiredSecrets:** Updated from `"Sentry auth token"` → `"SENTRY_ACCESS_TOKEN"` (exact env var name for stdio mode; remote mode uses OAuth).

---

### Figma (figma/mcp-server-guide)

**VERIFY-01 — Repo:** `figma/figma-mcp` returns 404 — repo does not exist. Correct repo is `figma/mcp-server-guide` (guide only; actual server is hosted at mcp.figma.com). Confirmed active.

**VERIFY-02 — Description:** Updated to clarify this is an official remote MCP (not self-hosted), hosted at mcp.figma.com/mcp. Note that `figma-developer-mcp` npm package is a community tool by GLips (Framelink), NOT the official Figma server.

**VERIFY-03 — Features:** Updated from generic descriptions to 5 actual tools documented in mcp-server-guide:
- `get_design_context` (design → React+Tailwind code)
- `get_variable_defs` (color/spacing token extraction)
- `get_metadata` (layer structure)
- `get_screenshot` (visual reference)
- `get_figjam` / `generate_diagram` (FigJam diagrams)

**VERIFY-04 — Keywords:** Added "토큰", "token", "디자인 시스템".

**VERIFY-05 — Install command:** Major correction — official install is:
```
claude plugin install figma@claude-plugins-official   # recommended
claude mcp add --transport http figma https://mcp.figma.com/mcp  # manual
```
Old `claude mcp add figma -- npx -y figma-developer-mcp --figma-api-key=YOUR_KEY` pointed to community package, not official.

**VERIFY-06 — Conflicts:** `conflicts: []` confirmed correct.

**requiredSecrets:** Updated from `["Figma API key"]` → `[]` — official server uses OAuth via mcp.figma.com, no API key needed.

**prerequisites:** Added: `["Figma Dev or Full seat (Professional/Organization/Enterprise plan)", "Figma OAuth authentication via mcp.figma.com"]`.

**difficulty "advanced" confirmed:** Free plan limited to 6 tool calls/month; meaningful use requires paid plan + Dev/Full seat. OAuth flow needed. Justification stands.

**githubRepo:** Updated from `figma/figma-mcp` → `figma/mcp-server-guide`.

---

## Deviations from Plan

None — plan executed exactly as written. All 3 plugins found to have inaccuracies which were auto-corrected per Rule 1 (bugs in metadata) and Rule 2 (missing critical info).

## Auth Gates

None.

## Self-Check

### Files exist:

- lib/plugins.ts — modified (verified via git status)
- lib/i18n/plugins-en.ts — modified (verified via git status)

### Commits exist:

- 8c83818: feat(03-02): verify and update perplexity, sentry, figma plugin metadata

### Build checks:

- pnpm typecheck: PASSED
- pnpm lint: PASSED
- pnpm build: PASSED (65 static pages generated successfully)

## Self-Check: PASSED
