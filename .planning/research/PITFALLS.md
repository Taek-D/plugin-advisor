# Pitfalls Research

**Domain:** Plugin combination analyzer / optimizer added to existing recommendation app
**Researched:** 2026-03-16
**Confidence:** HIGH (codebase read directly; MCP output format verified via GitHub issue #8288)

---

## Critical Pitfalls

### Pitfall 1: `claude mcp list` Parser Breaks on Non-Standard Output

**What goes wrong:**
The parser assumes every line follows `<name>: <command> - <status>` but the actual output starts with a header line ("Checking MCP server health...") and may include blank lines, error lines, or scope-scoped variants like `<name> (user):`. A naive `split('\n').map(line => line.split(':')[0])` silently drops plugins or crashes.

**Why it happens:**
The output format is undocumented and subject to change. GitHub issue #8288 (September 2025) shows a proposed `--verbose` flag with scope annotations in parentheses — meaning the format already varies across Claude Code versions. Developers parse what they see in their own terminal without testing edge cases.

**How to avoid:**
- Skip lines that do not match the expected pattern (header, blank, error). Never assume all lines are plugin entries.
- Extract the server name as everything before the first `: ` (colon-space), then strip any trailing scope annotation like ` (user)` or ` (local)` before matching against the plugin DB.
- Normalize: trim whitespace, lowercase, strip the ` - ✓ Connected` / ` - ✗ Failed` status tail before storing.
- Write a dedicated `parseMcpListOutput(raw: string): string[]` function with unit tests covering: empty string, header-only, one entry, multi-entry, scoped entries, failed-status entries.

**Warning signs:**
- Parser returns 0 plugins from non-empty paste input.
- Score shows 0 even when user pastes 5+ plugins.
- A plugin name with a parenthesized scope (`context7 (user)`) doesn't match the DB.

**Phase to address:** Input + Parser phase (first implementation phase)

---

### Pitfall 2: Plugin Name Mismatch Between `claude mcp list` and Internal DB IDs

**What goes wrong:**
The user's installed server name (e.g. `context-7`, `Context7`, `mcp-context7`, `my-context7`) does not match the internal DB key `context7`. The optimizer silently fails to recognize installed plugins and produces incorrect conflict/synergy analysis.

**Why it happens:**
MCP server naming is user-controlled. Common patterns include `mcp-<name>`, `<name>-mcp`, `kebab-case`, `camelCase`, and user-chosen aliases (`github-work`, `github-personal`). The existing DB uses flat IDs like `brave-search`, `bkit-starter` — none of which are enforced at install time. Multiple instances of the same server with different names are explicitly supported by Claude Code.

**How to avoid:**
- Build a `name → pluginId` alias table. Each plugin entry in the DB should carry an `aliases: string[]` field listing common install-time variants (e.g., `["context-7", "mcp-context7", "context7-mcp"]`).
- Normalize before lookup: lowercase, remove `mcp-` prefix, remove `-mcp` suffix, replace underscores with hyphens.
- When no match is found, surface an "unrecognized plugin" list in the UI rather than silently ignoring it.
- The autocomplete/direct-type input path must show the DB display name *and* note the server name the user should have installed.

**Warning signs:**
- Unrecognized plugin list grows large in user testing.
- Users report "it says I have 0 plugins" after pasting valid `claude mcp list` output.
- Fuzzy match produces false positives (e.g. `neon` matching `notion`).

**Phase to address:** Input + Parser phase; revisit during UX polish phase.

---

### Pitfall 3: Conflict Data is One-Directional in the DB but Must Be Queried Bidirectionally

**What goes wrong:**
`CONFLICT_PAIRS` is already defined in `conflicts.ts` — but the existing `Plugin.conflicts` field in `plugins.ts` is populated one-way (e.g. `playwright` lists `["puppeteer"]` but the check at runtime uses `CONFLICT_PAIRS` which is bidirectional). If the optimizer adds a second conflict-lookup path that reads `plugin.conflicts` directly instead of going through `getConflicts()`, it will miss the reverse direction and silently under-report conflicts.

**Why it happens:**
Two sources of truth exist: the `conflicts: string[]` field on each plugin seed AND the `CONFLICT_PAIRS` array in `conflicts.ts`. They should be kept in sync but the redundancy creates drift risk. A developer building the optimizer naturally reaches for `plugin.conflicts` first because it is on the object, without realising `CONFLICT_PAIRS` is the authoritative source.

**How to avoid:**
- Treat `CONFLICT_PAIRS` as the single source of truth. Do not use `plugin.conflicts` for optimizer logic — it exists for display/metadata only.
- The optimizer's conflict detection must call `getConflicts(selectedIds)` from `lib/conflicts.ts`, not walk `plugin.conflicts` fields.
- Add a test asserting that every entry in `plugin.conflicts` has a corresponding symmetric entry in `CONFLICT_PAIRS`.

**Warning signs:**
- Conflict is shown in `/advisor` but not in `/optimizer` for the same pair.
- Adding a new conflict pair to `CONFLICT_PAIRS` doesn't appear in the optimizer.

**Phase to address:** Scoring engine phase.

---

### Pitfall 4: Combination Score Becomes Meaningless Without Normalization

**What goes wrong:**
The score formula (`conflict penalty + synergy bonus + coverage score`) produces raw numbers like `-4`, `7`, `12` with no ceiling or floor. The UI displays "Score: 12" to one user and "Score: 3" to another with no shared reference frame. Users don't know if 12 is good or bad. Worse, a user with 1 plugin gets a higher raw score than a user with 5 plugins (fewer conflicts possible) — inversely rewarding small sets.

**Why it happens:**
Rule-based scoring systems accumulate weights incrementally (the existing `getTrustScore` in `recommend.ts` already shows this — it adds/subtracts arbitrary integers). When the optimizer adds coverage scoring on top, the scale of each component is never reconciled. The first implementation ships without normalization because "we can fix it later."

**How to avoid:**
- Define score components independently: conflict score (0–100), coverage score (0–100), synergy score (0–100). Each maps its own scale.
- Produce a single composite `A–F` grade or 0–100 percentage rather than a raw integer. This is resilient to future weight tuning.
- Coverage score must be relative to the DB size and category spread, not absolute plugin count.
- Document the formula and weight rationale as code comments before shipping, not after.

**Warning signs:**
- QA finds score increases when you add a conflicting plugin (raw synergy overwhelms conflict penalty).
- Users with 1 plugin and users with 10 plugins both show "Score: 7".
- No test validates score bounds (max possible, min possible).

**Phase to address:** Scoring engine phase.

---

### Pitfall 5: Complement Recommendations Recommend Already-Installed Plugins

**What goes wrong:**
The complement/supplement suggestion logic ("you might also add X") surfaces plugins that are already in the user's installed set, because the complement engine is derived from the existing `/advisor` recommendation flow which has no awareness of "what the user already has."

**Why it happens:**
The existing `recommend()` function in `lib/recommend.ts` produces a ranked list from all candidates with no concept of an "already installed" exclusion set. Reusing this function for complement suggestions without filtering will always produce this bug. It is easy to miss because manual testing often uses small plugin sets that don't overlap with recommendations.

**How to avoid:**
- The complement suggestion function must accept `installedIds: string[]` as a parameter and filter its output: `candidates.filter(id => !installedIds.includes(id))`.
- Also filter out plugins that conflict with the installed set — recommending a conflicting complement is worse than recommending nothing.
- Write a test: "complement suggestions for a user who has all plugins in category X returns no plugins from category X."

**Warning signs:**
- "You might also add context7" appears when context7 is already installed.
- A complement recommendation includes a plugin that was just flagged as conflicting.

**Phase to address:** Scoring engine phase (complement logic).

---

### Pitfall 6: "Coming Soon" AI Mode Gets Wired Up Prematurely and Breaks the Page

**What goes wrong:**
The AI mode button is visible in the UI as "Coming Soon." A developer wires up a partial `analyzeCombo()` API call "just to see if it works," which introduces an unhandled Promise rejection that crashes the React error boundary for the entire optimizer page, including the working rule-based mode.

**Why it happens:**
The existing `/advisor` page has a working `AnalysisMode` toggle (`"keyword" | "ai"`). The optimizer page will likely copy this pattern. The temptation to pre-wire the AI path before the UI is complete is strong when the API route already exists at `/api/analyze`.

**How to avoid:**
- The AI mode button must be non-interactive (no `onClick`), not just visually dimmed. Use `disabled` + `aria-disabled` + no handler, not a handler that calls a stub.
- Do not import the AI analysis function into the optimizer page at all until the AI phase begins. Keep the Coming Soon state to pure UI (a badge, no state machine).

**Warning signs:**
- `useAnalysisMode` state is present in the optimizer page component before the AI phase.
- The "Coming Soon" button dispatches any action, even a no-op toast.

**Phase to address:** Initial page scaffold phase.

---

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Copy `getConflicts()` logic inline into optimizer instead of importing | Faster first draft | Two conflict systems drift out of sync; bugs in one don't get fixed in the other | Never |
| Raw integer score with no normalization | Quick to implement | Score is uninterpretable; UX requires redesign later | Never |
| Single `parseInput()` that handles both paste and autocomplete paths | Fewer files | Autocomplete-specific validation silently runs on paste input, producing wrong errors | Never — separate the two input paths |
| Reuse `AnalysisResult` type for optimizer output | Fewer new types | `AnalysisResult` contains `/advisor`-specific fields (`recommendedPackId`, `inputText`) that have no meaning in the optimizer context | Only for an internal prototype sprint |
| Hardcode category weights (e.g. "coverage multiplier = 1.5 for orchestration") | Faster to ship | Changing one weight requires understanding the whole formula; no audit trail | Only if constants are named and documented |

---

## Integration Gotchas

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| `claude mcp list` paste input | Assume all lines are plugin entries | Skip header line "Checking MCP server health...", blank lines, and any line not matching `<name>:` pattern |
| `claude mcp list` scope variants | Ignore `(user)`, `(local)`, `(project)` annotations | Strip scope annotation before name lookup |
| `plugin.conflicts` field | Use it as the authoritative conflict source | Treat as display metadata only; use `CONFLICT_PAIRS` via `getConflicts()` for all logic |
| Existing `/api/analyze` (Anthropic) | Call it from optimizer in Coming Soon state | Do not connect until AI phase is explicitly scoped |
| `lib/plugins.ts` PLUGINS record | Add optimizer-specific fields directly to the plugin seed type | Add optimizer fields to `PLUGIN_FIELD_OVERRIDES` or create a separate optimizer metadata layer |

---

## Performance Traps

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| Running `getConflicts()` + `getRedundancies()` + complement scoring on every keystroke in autocomplete | Input lag on slow devices | Debounce autocomplete analysis at 300ms; only run full scoring on explicit "Analyze" action | With 42 plugins and O(n²) conflict pairs it is cheap now but becomes noticeable if plugin count grows to 200+ |
| Fetching `/api/versions` for all installed plugins on page load | Waterfall of 5+ GitHub API requests; rate limit hit without `GITHUB_TOKEN` | Fetch versions lazily (on expand/hover), not eagerly on mount | First user with 10+ plugins and no `GITHUB_TOKEN` set |
| Re-running full scoring logic on every React re-render | CPU spike on mid-range devices | Memoize score computation with `useMemo` keyed on `installedIds` array identity | Any component that re-renders on scroll or hover |

---

## Security Mistakes

| Mistake | Risk | Prevention |
|---------|------|------------|
| Passing raw `claude mcp list` paste content to the Anthropic API without sanitization when AI mode launches | Prompt injection if paste contains crafted text like "Ignore previous instructions..." | When AI mode is implemented, sanitize input: extract only the server name list before sending; never forward raw paste to the API |
| Storing the full `claude mcp list` output in localStorage history | Leaks local file paths (the command column contains absolute paths like `/home/user/.../dist/index.js`) | Store only the extracted plugin name list, not the raw paste |
| Displaying raw command strings from `claude mcp list` in the UI | Path traversal visuals; confusing to non-technical users | Show only the matched plugin name and display name, not the raw command |

---

## UX Pitfalls

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| Showing conflict warnings + complement recommendations + redundancy warnings + score + alternative suggestions all at once | Alert fatigue; users dismiss everything | Progressive disclosure: show score + conflicts first; fold complement and alternative suggestions behind "Improve this combo" CTA |
| Treating unrecognized plugin names (no DB match) as silent no-ops | User thinks their plugin was analyzed when it wasn't | Show an "unrecognized plugins" section listing names that couldn't be matched, with a "suggest this plugin" link |
| Complement suggestions showing 10+ items | Overwhelm; users don't know where to start | Cap at 3 complement suggestions, ordered by synergy strength |
| Alternative suggestion framing: "Use X instead of Y" without context | Feels confrontational; users invested in Y | Frame as "X covers similar ground and adds Z" — additive framing over replacement framing |
| Score changing when user removes a low-synergy plugin | Unexpected; feels like the tool is penalizing exploration | Show score delta (e.g., "+8 if you remove Puppeteer") rather than recalculating silently |

---

## "Looks Done But Isn't" Checklist

- [ ] **Parser:** Handles `claude mcp list` header line without crashing — verify with raw paste that starts with "Checking MCP server health..."
- [ ] **Parser:** Handles scoped entries (`context7 (user):`) — verify name extraction strips the scope annotation
- [ ] **Conflict detection:** Uses `getConflicts()` from `lib/conflicts.ts`, not `plugin.conflicts` field — verify by grepping for direct `.conflicts` access in optimizer code
- [ ] **Complement suggestions:** Filters out already-installed plugins — verify by testing with a user who has all search plugins installed
- [ ] **Complement suggestions:** Filters out plugins that conflict with the current set — verify by checking output when `omc` is installed
- [ ] **Score:** Has a defined 0–100 or A–F range, not raw integers — verify in the type definition
- [ ] **Coming Soon AI mode:** Has no `onClick` handler and dispatches no actions — verify in rendered DOM
- [ ] **localStorage:** Stores only plugin name list, not raw paste with file paths — verify by inspecting stored history entry

---

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| Parser breaks on new `claude mcp list` format | LOW | Parser is isolated in one function; update regex/split logic and update unit tests |
| Score normalization shipped as raw integers | MEDIUM | Requires UI redesign (score display component) + recalibration of all thresholds in tests |
| Complement logic recommends installed plugins | LOW | Add `installedIds` filter to `getComplements()`, update test suite |
| Two conflict sources diverged | MEDIUM | Audit `plugin.conflicts` fields against `CONFLICT_PAIRS`, write sync test, remove duplicate path |
| Unrecognized plugin names silently dropped | LOW | Add unrecognized-list UI section; no data model changes needed |

---

## Pitfall-to-Phase Mapping

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| `claude mcp list` parser fragility | Phase 1: Input + Parser | Unit tests: parseMcpListOutput() with 5+ edge cases all pass |
| Plugin name mismatch | Phase 1: Input + Parser | Integration test: common alias variants resolve to correct DB IDs |
| Conflict one-directionality | Phase 2: Scoring Engine | Test: optimizer conflict output matches `/advisor` conflict output for identical plugin set |
| Score normalization | Phase 2: Scoring Engine | Test: score always in 0–100 range for any valid input; single plugin scores ≠ 10-plugin scores just because no conflicts |
| Complement recommends installed plugins | Phase 2: Scoring Engine | Test: complement output ∩ installedIds = empty set |
| Coming Soon AI mode wired prematurely | Phase 1: Page Scaffold | Code review: no AI import in optimizer page; Coming Soon button has no onClick |
| Unrecognized plugins silently dropped | Phase 1: Page Scaffold + Phase 3: UX Polish | Manual test: unrecognized name "my-custom-tool" appears in unrecognized list |
| localStorage leaking file paths | Phase 1: Page Scaffold | Inspect localStorage after paste: only name list stored, no absolute paths |
| Alert fatigue from too many sections | Phase 3: UX Polish | User test: can a new user find the score and primary conflict within 10 seconds? |

---

## Sources

- [claude-code GitHub Issue #8288: Add scope information to `claude mcp list` output](https://github.com/anthropics/claude-code/issues/8288) — verified `claude mcp list` output format and parsing edge cases (MEDIUM confidence; issue from Sept 2025)
- [MCP Server Naming Conventions — zazencodes.com](https://zazencodes.com/blog/mcp-server-naming-conventions) — common naming patterns (`mcp-<name>`, `<name>-mcp`) (MEDIUM confidence)
- [Claude Code MCP documentation — code.claude.com](https://code.claude.com/docs/en/mcp) — space-to-underscore normalization, multiple instance support (HIGH confidence)
- [Alert Fatigue in User Interfaces — NN/g](https://www.nngroup.com/videos/alert-fatigue-user-interfaces/) — alert fatigue as UX anti-pattern (HIGH confidence)
- [7 Critical Challenges of Recommendation Engines — Appier](https://www.appier.com/en/blog/7-critical-challenges-of-recommendation-engines) — single-metric optimization and cold-start pitfalls (MEDIUM confidence)
- Direct codebase analysis: `lib/conflicts.ts`, `lib/recommend.ts`, `lib/plugins.ts`, `lib/types.ts`, `lib/setup.ts` — all HIGH confidence (read directly)

---
*Pitfalls research for: Plugin Combination Optimizer (v1.1 milestone) added to Plugin Advisor*
*Researched: 2026-03-16*
