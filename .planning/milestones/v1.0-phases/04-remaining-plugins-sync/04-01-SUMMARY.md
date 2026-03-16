---
phase: 04-remaining-plugins-sync
plan: "01"
subsystem: database
tags: [todoist, linear, uiux, mcp, plugin-metadata, verification]

# Dependency graph
requires:
  - phase: 01-community-orchestration-plugins
    provides: "Verification pattern (verificationStatus, code comments, requiredSecrets env vars)"
  - phase: 02-official-mcp-monorepo-plugins
    provides: "PLUGIN_FIELD_OVERRIDES pattern with bestFor/avoidFor"
  - phase: 03-platform-official-plugins
    provides: "Remote MCP / deprecated server documentation pattern"
provides:
  - "Verified metadata for todoist (abhiz123/todoist-mcp-server)"
  - "Verified metadata for linear (jerhadf/linear-mcp-server, deprecated)"
  - "Investigated and documented uiux (no MCP server exists)"
affects: [04-remaining-plugins-sync]

# Tech tracking
tech-stack:
  added: []
  patterns: ["deprecated npm package documentation with maintenanceStatus stale"]

key-files:
  created: []
  modified:
    - lib/plugins.ts
    - lib/i18n/plugins-en.ts

key-decisions:
  - "todoist install: scoped npm package @abhiz123/todoist-mcp-server with TODOIST_API_TOKEN env flag"
  - "linear: marked maintenanceStatus stale (deprecated) -- official remote MCP at mcp.linear.app/sse recommended"
  - "uiux: confirmed no MCP server exists -- 87 GitHub repos are PromptX/Codex prompt skills, not MCP servers"
  - "uiux url updated to nextlevelbuilder/ui-ux-pro-max-skill (actual project reference)"

patterns-established:
  - "Deprecated package pattern: maintenanceStatus stale + code comment noting deprecation + longDesc noting official alternative"

requirements-completed: [VERIFY-01, VERIFY-02, VERIFY-03, VERIFY-04, VERIFY-05, VERIFY-06]

# Metrics
duration: 10min
completed: 2026-03-16
---

# Phase 4 Plan 1: Remaining Plugins Sync Summary

**Verified todoist/linear metadata against GitHub READMEs (scoped npm, env vars, deprecation noted); confirmed uiux has no MCP server (prompt skill only)**

## Performance

- **Duration:** 10 min
- **Started:** 2026-03-16T10:59:15Z
- **Completed:** 2026-03-16T11:09:12Z
- **Tasks:** 1
- **Files modified:** 2

## Accomplishments
- todoist: verified against abhiz123/todoist-mcp-server (381 stars, active) -- corrected npm package to scoped @abhiz123/todoist-mcp-server, requiredSecrets to TODOIST_API_TOKEN, features to actual 5 tools
- linear: verified against jerhadf/linear-mcp-server (345 stars, deprecated) -- requiredSecrets to LINEAR_API_KEY, features to actual 5 tools + resources, noted deprecation with official mcp.linear.app/sse alternative
- uiux: conclusively determined no MCP server exists -- "ui-ux-pro-max" repos are PromptX/Codex prompt skills; npm package not found; placeholder URL confirmed; updated url/install/longDesc accordingly

## Task Commits

Each task was committed atomically:

1. **Task 1: Fetch READMEs and verify metadata for todoist, linear, uiux** - `99bd8f1` (feat)

## Files Created/Modified
- `lib/plugins.ts` - Updated CORE_PLUGINS (todoist, linear, uiux entries) and PLUGIN_FIELD_OVERRIDES (verificationStatus, requiredSecrets, maintenanceStatus, bestFor/avoidFor)
- `lib/i18n/plugins-en.ts` - Synced English translations (pluginDescEn and reasonsEn) for all 3 plugins

## Decisions Made
- **todoist install: @abhiz123/todoist-mcp-server (scoped)** -- README and package.json both use scoped package name; unscoped `todoist-mcp-server` on npm (v1.0.7) is a different package
- **todoist requiredSecrets: TODOIST_API_TOKEN** -- README env section shows `TODOIST_API_TOKEN` as the exact env var name
- **linear maintenanceStatus: "stale"** -- README explicitly says "DEPRECATED and no longer being maintained"; TypeScript type only allows active/unclear/stale so "stale" is closest fit
- **linear: official remote MCP at mcp.linear.app/sse documented** -- README recommends official Linear remote MCP; noted in longDesc and code comments
- **linear requiredSecrets: LINEAR_API_KEY** -- README env section shows `LINEAR_API_KEY` as the exact env var name
- **uiux: no MCP server, verificationStatus remains "unverified"** -- GitHub search (87 results for "ui-ux-pro-max") shows only PromptX/Codex prompt skills; npm "ui-ux-pro-max" returns 404; placeholder URL yourusername/ui-ux-pro-max returns 404
- **uiux url updated to nextlevelbuilder/ui-ux-pro-max-skill** -- This is the actual active project (v2.0, 161 reasoning rules, 67 UI styles, uipro-cli npm package)
- **uiux install updated to `npx uipro-cli init`** -- Removed fake marketplace URLs; reflected actual CLI install from nextlevelbuilder project

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed MaintenanceStatus type error for linear**
- **Found during:** Task 1 (verification step)
- **Issue:** Used `maintenanceStatus: "deprecated"` which is not a valid MaintenanceStatus value (type allows "active" | "unclear" | "stale" only)
- **Fix:** Changed to `maintenanceStatus: "stale"` with code comment documenting the deprecation
- **Files modified:** lib/plugins.ts
- **Verification:** pnpm typecheck passes
- **Committed in:** 99bd8f1 (Task 1 commit)

---

**Total deviations:** 1 auto-fixed (1 bug)
**Impact on plan:** Type system constraint required using "stale" instead of "deprecated". Deprecation is fully documented in code comments and longDesc text.

## Issues Encountered
- GitHub API search JSON parsing failed with python3 on Windows/MSYS2 -- used grep-based extraction instead (no impact on results)

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- All 3 target plugins (todoist, linear, uiux) now have explicit verificationStatus in PLUGIN_FIELD_OVERRIDES
- Ready for 04-02-PLAN.md (final sync/validation across all plugins)

---
*Phase: 04-remaining-plugins-sync*
*Completed: 2026-03-16*
