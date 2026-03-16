---
phase: 02-official-mcp-monorepo-plugins
plan: "02"
subsystem: plugin-database
tags: [mcp, filesystem, git, postgres, memory, metadata, verification]

# Dependency graph
requires:
  - phase: 02-official-mcp-monorepo-plugins
    plan: "01"
    provides: "Verified sequential-thinking, brave-search, puppeteer; established verification pattern for PLUGIN_FIELD_OVERRIDES"
provides:
  - "Verified metadata for filesystem, git, postgres, memory plugins (officialStatus, verificationStatus, install commands, features, descriptions)"
  - "Fixed postgres install command (correct package name, connection string format)"
  - "Fixed git install command (uvx mcp-server-git instead of npx, Python-based server)"
  - "Corrected features arrays to match actual README-documented tools"
  - "English translations synced in plugins-en.ts"
affects: [phase-03-standalone-official-repos, phase-04-remaining-sync]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "PLUGIN_FIELD_OVERRIDES: set officialStatus+verificationStatus+prerequisites+requiredSecrets for monorepo plugins"
    - "CORE_PLUGINS: desc/longDesc/features/install updated to match README tools list"
    - "plugins-en.ts: desc/longDesc synced to match Korean counterparts"

key-files:
  created: []
  modified:
    - lib/plugins.ts
    - lib/i18n/plugins-en.ts

key-decisions:
  - "postgres githubRepo updated to servers-archived — README confirmed it moved from main monorepo"
  - "postgres features corrected — only one tool (query) in READ ONLY mode; multi-DB connection removed (single connection string per instance)"
  - "git install command changed from npx to uvx — server is Python-based (mcp-server-git), not an npm package"
  - "filesystem difficulty changed from advanced to intermediate — sandboxed directory model is straightforward once paths are configured"
  - "memory features corrected — replaced 'auto entity extraction' with actual manual CRUD tools (create/delete entities, relations, observations)"

patterns-established:
  - "README-based feature verification: each feature entry must map to a documented tool or capability in the official README"
  - "archived repo tracking: githubRepo field reflects actual current repo (servers-archived vs servers)"

requirements-completed: [VERIFY-01, VERIFY-02, VERIFY-03, VERIFY-04, VERIFY-05, VERIFY-06]

# Metrics
duration: 18min
completed: 2026-03-12
---

# Phase 2 Plan 02: Official MCP Monorepo Plugins (filesystem, git, postgres, memory) Summary

**Verified 4 MCP monorepo plugins against README source: corrected git install to uvx, postgres to read-only single-tool, memory features to manual CRUD, filesystem difficulty to intermediate**

## Performance

- **Duration:** 18 min
- **Started:** 2026-03-12T04:35:00Z
- **Completed:** 2026-03-12T04:53:00Z
- **Tasks:** 1
- **Files modified:** 2

## Accomplishments

- All 4 plugins (filesystem, git, postgres, memory) verified against official monorepo READMEs
- verificationStatus set to "verified" and officialStatus set to "official" for all 4
- git install command fixed from incorrect npx to correct uvx (Python-based server)
- postgres corrected to read-only model with single query tool + schema resources (removed multi-DB feature)
- memory features corrected from inaccurate "auto entity extraction" to actual manual CRUD tools
- English translations in plugins-en.ts synced for all 4 plugins

## Task Commits

Each task was committed atomically:

1. **Task 1: Fetch READMEs and verify metadata for filesystem, git, postgres, memory** - `6f01e14` (feat)

## Files Created/Modified

- `lib/plugins.ts` - Updated PLUGIN_FIELD_OVERRIDES (officialStatus, verificationStatus, prerequisites, requiredSecrets, bestFor, avoidFor for all 4) and CORE_PLUGINS (desc, longDesc, features, install, githubRepo for all 4)
- `lib/i18n/plugins-en.ts` - Updated English desc and longDesc for filesystem, git, postgres, memory

## Decisions Made

- **postgres githubRepo → servers-archived**: README confirmed postgres moved from modelcontextprotocol/servers main to servers-archived. npm package still functional.
- **postgres features corrected**: README shows only one tool (`query`) running in READ ONLY transaction. "다중 DB 연결" was inaccurate (single connection string per instance). Updated to reflect actual tools: query execution, schema resource exposure, READ ONLY guarantee.
- **git install: npx → uvx**: The git server is Python-based (`mcp-server-git`), not an npm package. Correct install is `uvx mcp-server-git --repository /path/to/repo`. Added prerequisites for Python/uvx.
- **filesystem difficulty: advanced → intermediate**: The sandboxed directory model (pass allowed dirs as args) is straightforward. "advanced" was overstated.
- **memory features corrected**: Replaced "자동 엔티티 추출" (auto entity extraction) with actual manual tools from README: create_entities, delete_entities, create_relations, delete_relations, add_observations, delete_observations, read_graph, search_nodes, open_nodes.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed incorrect git install command (npx → uvx)**
- **Found during:** Task 1 (README verification)
- **Issue:** Existing install was `claude mcp add git -- npx -y @modelcontextprotocol/server-git` but git MCP is Python-based with package name `mcp-server-git`, using uvx not npx
- **Fix:** Changed to `claude mcp add git -- uvx mcp-server-git --repository /path/to/repo`, added Python/uvx prerequisites
- **Files modified:** lib/plugins.ts, lib/i18n/plugins-en.ts
- **Verification:** README confirms Python implementation; pnpm typecheck/lint/build pass
- **Committed in:** 6f01e14 (Task 1 commit)

**2. [Rule 1 - Bug] Fixed inaccurate postgres features (multi-DB claim)**
- **Found during:** Task 1 (README verification)
- **Issue:** "다중 DB 연결" (multi-DB connection) feature not supported — postgres MCP takes a single connection string argument per instance
- **Fix:** Replaced with accurate features: read-only SQL execution, schema resource exposure, READ ONLY transaction guarantee
- **Files modified:** lib/plugins.ts
- **Verification:** README confirms single query tool only; pnpm build passes
- **Committed in:** 6f01e14 (Task 1 commit)

**3. [Rule 1 - Bug] Fixed inaccurate memory feature "자동 엔티티 추출"**
- **Found during:** Task 1 (README verification)
- **Issue:** "자동 엔티티 추출" implies automatic extraction, but memory MCP requires explicit manual calls to create_entities, create_relations, etc.
- **Fix:** Replaced with actual tool names from README
- **Files modified:** lib/plugins.ts
- **Verification:** README lists all tools explicitly; pnpm build passes
- **Committed in:** 6f01e14 (Task 1 commit)

---

**Total deviations:** 3 auto-fixed (all Rule 1 - Bug: incorrect metadata)
**Impact on plan:** All fixes necessary for accuracy. No scope creep — these are metadata corrections, not new features.

## Issues Encountered

- postgres README returned 404 on modelcontextprotocol/servers main branch — fetched from servers-archived instead and updated githubRepo accordingly.
- Previous execution attempt left partial changes in lib/plugins.ts (PLUGIN_FIELD_OVERRIDES + filesystem/git CORE_PLUGINS) — resumed from that state and completed postgres/memory CORE_PLUGINS + all English translations.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Phase 2 complete: all 7 targeted plugins verified (sequential-thinking, brave-search, puppeteer in plan 01; filesystem, git, postgres, memory in plan 02)
- Phase 3 (standalone official repos) can proceed
- Deferred: remaining plugins in Phase 4 (community plugins not yet verified)

---
*Phase: 02-official-mcp-monorepo-plugins*
*Completed: 2026-03-12*
