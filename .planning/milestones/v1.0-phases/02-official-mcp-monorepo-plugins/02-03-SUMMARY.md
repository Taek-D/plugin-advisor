---
phase: 02-official-mcp-monorepo-plugins
plan: "03"
subsystem: plugin-database
tags: [mcp, github, slack, metadata, verification, requiredSecrets]

# Dependency graph
requires:
  - phase: 02-official-mcp-monorepo-plugins
    plan: "02"
    provides: "Verified filesystem, git, postgres, memory; established PLUGIN_FIELD_OVERRIDES verification pattern"
provides:
  - "Verified metadata for github, slack plugins (officialStatus, verificationStatus, install commands, features, descriptions)"
  - "Fixed requiredSecrets for github (GITHUB_PERSONAL_ACCESS_TOKEN) and slack (SLACK_BOT_TOKEN, SLACK_TEAM_ID)"
  - "Updated githubRepo to modelcontextprotocol/servers-archived for both plugins"
  - "Expanded github features to reflect actual 26 tools across file ops, issues, PRs, search, branches"
  - "Corrected slack features to match actual 8 tools (removed file sharing, added emoji reaction)"
  - "English translations synced in plugins-en.ts"
  - "All 9 Phase 2 plugins now have verificationStatus: verified"
affects: [phase-03-standalone-official-repos, phase-04-remaining-sync]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "PLUGIN_FIELD_OVERRIDES: requiredSecrets uses exact env var names from README (e.g. GITHUB_PERSONAL_ACCESS_TOKEN, not 'GitHub token')"
    - "githubRepo field updated to servers-archived for plugins that migrated from main monorepo"
    - "CORE_PLUGINS: features array reflects actual documented tools, not use-case descriptions"

key-files:
  created: []
  modified:
    - lib/plugins.ts
    - lib/i18n/plugins-en.ts

# Decisions made
decisions:
  - "[02-03]: github githubRepo updated to servers-archived — main monorepo src/github no longer exists; README confirms move to github/github-mcp-server"
  - "[02-03]: slack githubRepo updated to servers-archived — same migration as github, brave-search, puppeteer, postgres"
  - "[02-03]: github requiredSecrets updated to GITHUB_PERSONAL_ACCESS_TOKEN — README explicitly names this env var"
  - "[02-03]: slack requiredSecrets updated to [SLACK_BOT_TOKEN, SLACK_TEAM_ID] — README requires both env vars (SLACK_CHANNEL_IDS optional)"
  - "[02-03]: github features expanded from 4 to 6 items — README documents 26 tools; features now cover file ops, issue, PR, search, branch, commit dimensions"
  - "[02-03]: slack features corrected — removed 'file sharing' (no upload tool in README); added 'emoji reaction' (slack_add_reaction exists); 'deploy notification automation' is a use case not a tool"

# Metrics
metrics:
  duration: 15m
  completed_date: "2026-03-12"
  tasks_completed: 1
  tasks_total: 1
  files_modified: 2
---

# Phase 2 Plan 3: GitHub & Slack Plugin Metadata Verification Summary

**One-liner:** GitHub requiredSecrets corrected to GITHUB_PERSONAL_ACCESS_TOKEN; slack requiredSecrets to [SLACK_BOT_TOKEN, SLACK_TEAM_ID]; both githubRepo fields updated to servers-archived; features arrays corrected to match actual documented tools; all 9 Phase 2 plugins verified.

## Tasks Completed

| Task | Description | Commit | Status |
|------|-------------|--------|--------|
| 1 | Fetch READMEs and verify metadata for github, slack | e9fd885 | Done |

## What Was Built

Verified and updated metadata for the final 2 plugins in Phase 2 (github, slack) against the modelcontextprotocol/servers-archived READMEs. Both plugins have been set to `verificationStatus: "verified"` completing all 9 Phase 2 MCP monorepo plugin verifications.

### Key findings from README verification:

**GitHub MCP (servers-archived/src/github):**
- Confirmed subdirectory exists in `servers-archived` (migrated from main monorepo; active dev moved to `github/github-mcp-server`)
- 26 tools documented: file create/update/read, repo create/fork, issue CRUD + comments, PR create/review/merge/files/status, branch management, search (code/issues/users/repos), commit log
- Env var: `GITHUB_PERSONAL_ACCESS_TOKEN` (was stored as generic "GitHub token")
- Install command `npx -y @modelcontextprotocol/server-github` confirmed correct

**Slack MCP (servers-archived/src/slack):**
- Confirmed subdirectory exists in `servers-archived`
- 8 tools: `slack_list_channels`, `slack_post_message`, `slack_reply_to_thread`, `slack_add_reaction`, `slack_get_channel_history`, `slack_get_thread_replies`, `slack_get_users`, `slack_get_user_profile`
- Requires TWO env vars: `SLACK_BOT_TOKEN` (xoxb- prefix) + `SLACK_TEAM_ID` — was stored as single "Slack workspace token"
- No file upload/sharing tool exists — removed from features
- Install command `npx -y @modelcontextprotocol/server-slack` confirmed correct

## Files Modified

- `lib/plugins.ts` — github/slack CORE_PLUGINS (desc, longDesc, features, url, githubRepo) and PLUGIN_FIELD_OVERRIDES (verificationStatus, requiredSecrets, bestFor, avoidFor)
- `lib/i18n/plugins-en.ts` — github/slack desc, longDesc, reasonsEn synced

## Deviations from Plan

### Auto-fixed Issues

None — plan executed exactly as written. All 6 verification steps (VERIFY-01 through VERIFY-06) completed for both plugins.

**Additional findings documented but not requiring code changes:**
- GitHub MCP development migrated to `github/github-mcp-server` — noted in longDesc
- Both plugins confirmed `conflicts: []` is correct (no logical conflicts with other plugins)

## Verification

- pnpm typecheck: PASS
- pnpm lint: PASS (no ESLint warnings or errors)
- pnpm build: PASS (all routes compiled successfully)

## Phase 2 Completion Summary

All 9 Phase 2 MCP monorepo plugins are now verified:

| Plugin | Plan | verificationStatus | Key Fix |
|--------|------|-------------------|---------|
| sequential-thinking | 02-01 | verified | Added missing officialStatus/verificationStatus to PLUGIN_FIELD_OVERRIDES |
| brave-search | 02-01 | verified | requiredSecrets: BRAVE_API_KEY; githubRepo: servers-archived |
| puppeteer | 02-01 | verified | features corrected to actual 7 tools; githubRepo: servers-archived |
| filesystem | 02-02 | verified | difficulty: intermediate (was advanced) |
| git | 02-02 | verified | install: uvx mcp-server-git (Python, not npx) |
| postgres | 02-02 | verified | features: READ ONLY single query tool; githubRepo: servers-archived |
| memory | 02-02 | verified | features: manual CRUD tools (removed "auto entity extraction") |
| github | 02-03 | verified | requiredSecrets: GITHUB_PERSONAL_ACCESS_TOKEN; 26 tools documented |
| slack | 02-03 | verified | requiredSecrets: [SLACK_BOT_TOKEN, SLACK_TEAM_ID]; 8 actual tools |

## Self-Check: PASSED
