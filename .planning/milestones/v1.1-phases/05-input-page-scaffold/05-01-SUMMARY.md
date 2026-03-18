---
phase: 05-input-page-scaffold
plan: 01
subsystem: parser
tags: [mcp-parser, normalizer, i18n, vitest, pure-functions]

# Dependency graph
requires: []
provides:
  - parseMcpList function for extracting plugin names from CLI output
  - normalizeToken function for alias/prefix normalization
  - resolvePluginId function for matching tokens to plugin DB
  - filterPlugins function for autocomplete data source
  - OptimizerInputPlugin type for optimizer input state
  - Complete optimizer i18n translations (ko, en)
affects: [05-02-PLAN, phase-6-scoring]

# Tech tracking
tech-stack:
  added: []
  patterns: [pure-function-module, pseudo-plugin-pattern-for-pure-ids]

key-files:
  created:
    - lib/parse-mcp-list.ts
    - lib/__tests__/parse-mcp-list.test.ts
  modified:
    - lib/types.ts
    - lib/i18n/types.ts
    - lib/i18n/ko.ts
    - lib/i18n/en.ts

key-decisions:
  - "Hardcoded alias map (brave->brave-search, github-mcp->github) instead of aliases field on Plugin type — keeps Plugin schema stable"
  - "parseMcpList accepts string[] pluginIds instead of PLUGINS object — pure function, no import dependency on data"
  - "filterPlugins capped at 8 results — appropriate for 42-plugin DB autocomplete UX"

patterns-established:
  - "Pure function module pattern: parse-mcp-list.ts has zero React/DOM dependencies, accepts primitives and plain objects"
  - "Pseudo-plugin construction in parseMcpList to bridge pluginIds string[] to resolvePluginId Plugin[] parameter"

requirements-completed: [INPUT-01, INPUT-03, PAGE-03]

# Metrics
duration: 5min
completed: 2026-03-16
---

# Phase 5 Plan 01: Pure Logic Foundation Summary

**MCP list parser with dual-format support, alias normalization, autocomplete filter, and bilingual optimizer i18n (ko/en)**

## Performance

- **Duration:** 5 min
- **Started:** 2026-03-16T13:50:32Z
- **Completed:** 2026-03-16T13:55:08Z
- **Tasks:** 2 (Task 1 was TDD: RED + GREEN)
- **Files modified:** 6

## Accomplishments
- TDD-driven parse-mcp-list module with 15 unit tests covering both MCP list format variants, edge cases, and alias resolution
- OptimizerInputPlugin type added to shared types
- Complete optimizer i18n namespace (17 keys) in both Korean and English locales
- All 62 tests pass, zero typecheck errors, zero lint errors

## Task Commits

Each task was committed atomically:

1. **Task 1 RED: Failing tests for parse-mcp-list** - `7555528` (test)
2. **Task 1 GREEN: Implement parse-mcp-list module** - `cd93c44` (feat)
3. **Task 2: i18n optimizer translations** - `16a49b4` (feat)

_Note: Task 1 used TDD flow (RED -> GREEN). No refactor commit needed._

## Files Created/Modified
- `lib/parse-mcp-list.ts` - MCP list parser, token normalizer, plugin resolver, autocomplete filter (4 exported pure functions)
- `lib/__tests__/parse-mcp-list.test.ts` - 15 unit tests with mock plugin fixtures
- `lib/types.ts` - Added OptimizerInputPlugin type
- `lib/i18n/types.ts` - Added optimizer section (17 keys) and nav.optimizer to Translations type
- `lib/i18n/ko.ts` - Korean optimizer translations
- `lib/i18n/en.ts` - English optimizer translations

## Decisions Made
- Hardcoded alias map (`brave -> brave-search`, `github-mcp -> github`) instead of adding aliases field to Plugin type -- keeps schema stable, aliases are rare
- `parseMcpList` accepts `pluginIds: string[]` not `PLUGINS` object -- pure function with no data import dependency
- `filterPlugins` capped at 8 results -- sufficient for 42-plugin DB autocomplete
- Strip `(user):` suffix before non-alphanumeric cleanup to avoid regex ordering bug

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed normalizeToken regex ordering**
- **Found during:** Task 1 GREEN (implementation)
- **Issue:** `(user):` suffix regex ran after non-alphanumeric strip, so parentheses were already removed and the pattern never matched -- resulted in "context7user" instead of "context7"
- **Fix:** Moved `(user):` / `(project):` suffix stripping before unicode/special character removal
- **Files modified:** lib/parse-mcp-list.ts
- **Verification:** All 15 tests pass including normalizeToken("Context7 (user):") -> "context7"
- **Committed in:** cd93c44 (Task 1 GREEN commit)

---

**Total deviations:** 1 auto-fixed (1 bug fix)
**Impact on plan:** Regex ordering was a straightforward correctness fix. No scope creep.

## Issues Encountered
None beyond the regex ordering fix documented above.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- All pure functions ready for Plan 02 UI components to consume
- `parseMcpList`, `normalizeToken`, `resolvePluginId`, `filterPlugins` are fully tested
- i18n `optimizer` namespace available for all UI strings
- Plan 02 can import directly from `lib/parse-mcp-list` and use `t.optimizer.*` translations

---
*Phase: 05-input-page-scaffold*
*Completed: 2026-03-16*
