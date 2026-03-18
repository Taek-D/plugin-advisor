# Project Research Summary

**Project:** Plugin Advisor v1.3 — DB Expansion (51 → 60-65 entries)
**Domain:** Static data expansion of a curated MCP server + Claude Code Plugin directory
**Researched:** 2026-03-18
**Confidence:** HIGH

## Executive Summary

Plugin Advisor v1.3 is a data-only milestone: no new npm dependencies, no new UI components, no new API routes. The entire scope is adding 10-15 verified MCP server and Plugin entries to the existing 51-entry database in `lib/plugins.ts` and `lib/i18n/plugins-en.ts`. The product already has a recommendation engine, optimizer, admin panel, and i18n in place. The risk is not architectural — it is data quality. Every prior milestone introduced broken install commands, wrong env var names, or missing English translations that required follow-up correction.

The recommended approach is a strict research-first, verification-gated workflow. Before authoring any entry, fetch and read the official README to extract the verbatim install command, exact env var names, and OAuth vs API key classification. STACK.md identifies a clear Wave A (6 MCP entries: fetch, markitdown, magic-mcp, n8n-mcp, mongodb, time) + Wave B (5 entries: obsidian, shadcn-mcp, redis, claude-mem, superclaude) + Wave C reach (2 Plugin entries: peon-ping, ccpm). FEATURES.md independently surfaces an official Anthropic marketplace track (5 Plugin entries from `anthropics/claude-plugins-official`: feature-dev, pr-review-toolkit, commit-commands, frontend-design, security-guidance) as high-priority P1 additions. These two tracks should be evaluated together to select the final 10-15 entries.

The critical risks are all data-precision failures, not engineering failures. Wrong install commands destroy user trust immediately. Missing English translations are invisible in development but break the English UI. Plugin-type entries silently default to `type: "mcp"` if `PLUGIN_FIELD_OVERRIDES` is not updated. Deprecated or archived servers added as active mislead users. All 10 identified pitfalls have clear prevention steps that must be applied per-entry during authoring — the mitigation is a per-entry checklist, not a code change.

## Key Findings

### Recommended Stack

No stack changes are needed for v1.3. The existing Next.js 14, TypeScript, Tailwind CSS, shadcn/ui, Vitest stack handles all new entries automatically through the three-layer merge pattern in `lib/plugins.ts`. The recommendation engine (`recommend.ts`) and scoring engine (`scoring.ts`) iterate `Object.values(PLUGINS)` dynamically — new entries participate in recommendations, complement suggestions, and replacement scoring without any code changes.

The only "stack decision" is which entries to add. STACK.md recommends 9 MCP servers (fetch, time, markitdown, magic-mcp, shadcn-mcp, n8n-mcp, mongodb, obsidian, redis) and 5 Plugins (claude-mem, superclaude, peon-ping, ccpm; voicemode deferred due to install friction). FEATURES.md recommends the official Anthropic marketplace track (firebase, gitlab, railway, posthog as MCPs; feature-dev, pr-review-toolkit, commit-commands, frontend-design, security-guidance as Plugins). Both tracks are valid; the final selection should prioritize by evidence strength and coverage gap filled.

**Core technologies (unchanged):**
- **Next.js 14 (App Router):** framework — handles all routes and SSR; no changes needed
- **TypeScript:** language — type system enforces data shape via `PluginSeed` and `Plugin` types
- **Vitest:** testing — `plugins.test.ts` sanity count and translation coverage assertions must be updated
- **`lib/plugins.ts`:** data layer — three-layer merge (DEFAULT → OVERRIDES → CORE); sole required file per entry
- **`lib/i18n/plugins-en.ts`:** English translations — co-required for every new entry; not type-enforced (silent failure)

### Expected Features

**Must have (table stakes):**
- Complete, verbatim install command per entry — users copy-paste; wrong command = immediate failure
- Accurate `verificationStatus` field — `"partial"` until README confirmed, not assumed `"verified"`
- `requiredSecrets` with exact env var names — missing or wrong name causes silent setup failure
- English + Korean `desc`/`longDesc` — i18n parity already established at 51 entries; new entries must match
- Correct `type: "mcp" | "plugin"` assignment — drives tab display, optimizer typeScope, and badge labels
- `keywords[]` array (10-20 per entry) — powers the recommendation engine; thin arrays = invisible in /advisor
- `conflicts[]` with valid IDs only — dangling references cause runtime scoring errors

**Should have (differentiators):**
- `bestFor` / `avoidFor` arrays — opinionated guidance users cannot get from a raw awesome-list
- `installMode` accuracy distinguishing `safe-copy` vs `external-setup` vs `manual-required`
- `difficulty` classification surfacing beginner-safe vs advanced entries
- `maintenanceStatus` warning about stale repos before users invest setup time
- `officialStatus: "official"` for vendor-maintained servers (Microsoft MarkItDown, MongoDB, Redis, shadcn)
- Multiple install variants where both remote HTTP and local stdio exist

**Defer to v1.4+:**
- `serena` MCP — Python/uvx runtime, high friction, `manual-required`; worth adding but needs careful labeling
- `voicemode` Plugin — requires FFmpeg + PortAudio system dependencies; only ~900 stars; too much friction
- `zapier` MCP — enterprise setup, non-trivial Zapier account requirements; medium confidence on usability
- `redis` / `mongodb` — valuable but niche for the typical non-backend audience per FEATURES.md (STACK.md disagrees — treat as Wave B if targeting DB-tier completeness)

### Architecture Approach

The architecture is a three-layer static data merge assembled at module load time. No structural code changes are required for DB expansion. Adding an entry requires: (1) a `CORE_PLUGINS` block in `lib/plugins.ts` (semantic data only), (2) an optional `PLUGIN_FIELD_OVERRIDES` block for non-default operational fields — mandatory when `type: "plugin"` or `installMode` deviates from defaults, and (3) a `pluginDescEn[id]` entry in `lib/i18n/plugins-en.ts`. The test file `lib/__tests__/plugins.test.ts` must also be updated: raise the count floor from 42 to the new target (60+) and add any new Plugin-type IDs to `PLUGIN_TYPE_IDS`.

**Major components (all unchanged except as data targets):**
1. `CORE_PLUGINS` — semantic identity data; `PluginSeed` type enforces exclusion of operational fields here
2. `PLUGIN_FIELD_OVERRIDES` — operational status (type, verificationStatus, installMode, etc.); `type: "plugin" as const` is mandatory here for all Plugin entries
3. `PLUGINS` export — merged view consumed by all pages, scoring, and recommendation engines automatically
4. `lib/i18n/plugins-en.ts` — English overlay; co-required for every entry; no type enforcement (silent failure)
5. `lib/conflicts.ts` — dual conflict mechanism: `conflicts[]` for /advisor, `CONFLICT_PAIRS` for /optimizer warnings; both must be updated symmetrically when a new entry conflicts with an existing one

### Critical Pitfalls

1. **Wrong install command** — Historically the most-broken field across every milestone. Never infer from package name or training data. Fetch the official README verbatim before writing any entry. Check for `--transport http`, `uvx`, or remote HTTP migration signals.

2. **Wrong `requiredSecrets` env var name** — Off by one character breaks user setup silently. Read the README `Configuration` section for exact var names. OAuth servers get `requiredSecrets: []` — do not guess `<SERVICE>_API_KEY`.

3. **Plugin-type entry defaults to `type: "mcp"`** — If `PLUGIN_FIELD_OVERRIDES[id]` does not declare `type: "plugin" as const`, the DEFAULT wins silently. TypeScript will not catch this. The entry appears in the wrong tab and breaks optimizer typeScope filtering.

4. **Missing English translation** — `pluginDescEn` is not type-enforced. A missing entry silently falls back to Korean for English-language users. Add `pluginDescEn[id]` in the same commit as the data entry. Extend the test to cover all IDs, not just Plugin-type IDs.

5. **Count mismatch between documentation and code** — v1.2 retrospective explicitly documents this failure. The verifier must count `Object.keys(PLUGINS).length` from source, not from SUMMARY claims. Update `plugins.test.ts` threshold to the new minimum so missing entries fail the test.

6. **Deprecated/archived server added as active** — High star count does not mean maintained. Check the GitHub "Archived" banner and README deprecation notice for every new entry before writing any field.

## Implications for Roadmap

This milestone maps naturally to a research-gate → batch-authoring → verification structure. The data quality risks identified in PITFALLS.md require per-entry verification before authoring, so inline research during coding is insufficient. The recommended approach batches entries by confidence tier and install pattern similarity.

### Phase 1: Entry Selection and Verification Research

**Rationale:** PITFALLS.md identifies that wrong install commands, wrong env var names, and deprecated server additions all occur when research is skipped during entry authoring. A dedicated verification step per candidate before any code is written is the primary mitigation for 7 of the 10 identified pitfalls. This phase has no code output — it produces a verified candidate list with confirmed install commands, maintenance status, and auth patterns.

**Delivers:** Finalized list of 10-15 entries with: verbatim install commands from official READMEs, confirmed maintenance status (no archived repos), confirmed OAuth vs API key classification, confirmed `requiredSecrets` env var names.

**Addresses:** Table-stakes features (install commands, verificationStatus, requiredSecrets)

**Avoids:** Pitfalls 1 (wrong install), 2 (wrong env var), 3 (remote HTTP migration missed), 7 (deprecated server), 8 (OAuth vs API key misclassified)

**Candidates to evaluate:**
- Wave A MCP (STACK.md Tier 1 — highest confidence): fetch, time, markitdown, magic-mcp, shadcn-mcp, n8n-mcp
- Wave B MCP (STACK.md Tier 2): mongodb, obsidian, redis
- Official Plugin track (FEATURES.md P1): feature-dev, pr-review-toolkit, commit-commands, frontend-design, security-guidance
- Community Plugin track (STACK.md Tier 1-2): claude-mem, superclaude, peon-ping, ccpm
- Existing entry update: `linear` → official `mcp.linear.app/mcp` endpoint (flagged in STACK.md)

### Phase 2: MCP Wave A — High-Confidence Official Entries

**Rationale:** Start with the entries that have the highest confidence (official Anthropic/Microsoft/vendor-maintained) and the simplest install patterns (uvx/npx one-liners, no API key required). These are the safest to author and the most valuable to the typical beginner audience.

**Delivers:** 6 new MCP entries in `lib/plugins.ts` + English translations in `lib/i18n/plugins-en.ts`

**Entries:** fetch, time, markitdown, magic-mcp, shadcn-mcp, n8n-mcp

**Uses:** Three-layer merge pattern — CORE_PLUGINS (semantic) + PLUGIN_FIELD_OVERRIDES (operational) + pluginDescEn (English)

**Avoids:** Pitfall 4 (OVERRIDES missing for non-default installMode), Pitfall 5 (English translation missing), Pitfall 9 (ID collision with existing 51 entries)

### Phase 3: MCP Wave B — Database and Knowledge Tier

**Rationale:** DB-category entries (mongodb, redis) and knowledge-category entries (obsidian) require API keys or external prerequisites, making them `intermediate` difficulty. Group together for consistent installMode and requiredSecrets handling patterns.

**Delivers:** 3 new MCP entries completing the DB tier (postgres + neon + supabase + mongodb + redis) and knowledge tier

**Entries:** mongodb, obsidian, redis

**Avoids:** Pitfall 2 (wrong requiredSecrets), Pitfall 8 (OAuth vs API key), Pitfall 7 (archived check for obsidian which is community-maintained)

### Phase 4: Plugin Track — Official Anthropic Marketplace

**Rationale:** Official Anthropic plugins (`anthropics/claude-plugins-official`) have verified `/plugin install` patterns and are the safest Plugin-type entries to add. These fill the `code-quality` (pr-review-toolkit), `workflow` (feature-dev, commit-commands), `ui-ux` (frontend-design), and `security` (security-guidance) gaps identified in FEATURES.md's category distribution analysis.

**Delivers:** 5 new Plugin entries with `type: "plugin" as const` in PLUGIN_FIELD_OVERRIDES

**Entries:** feature-dev, pr-review-toolkit, commit-commands, frontend-design, security-guidance

**Avoids:** Pitfall 4 (Plugin-type defaulting to MCP due to missing OVERRIDES entry), Pitfall 3 (install pattern confusion between `/plugin install` and `claude mcp add`)

**Note:** Update `PLUGIN_TYPE_IDS` in `plugins.test.ts` alongside each Plugin entry addition.

### Phase 5: Community Plugin Track — High-Star Entries

**Rationale:** claude-mem (37.7k stars) and superclaude (21.6k stars) are the highest-impact community Plugins by star count and fill the `memory` and `workflow` categories. peon-ping and ccpm are reach entries if the count target allows. These require more careful `installMode` and `difficulty` handling because install patterns are non-standard.

**Delivers:** 2-4 community Plugin entries; superclaude requires a `pipx` install note (not yet in `/plugin install` system as of v5 BETA)

**Entries:** claude-mem (P1), superclaude (P1), peon-ping (P2), ccpm (P2 if count target allows)

**Avoids:** Pitfall 7 (superclaude v5 migration status must be confirmed before writing install command), Pitfall 3 (non-standard install documentation for superclaude)

### Phase 6: Test Updates, Count Verification, and Final Validation

**Rationale:** PITFALLS.md Pitfall 6 and the "Looks Done But Isn't" checklist both identify test threshold staleness and documentation count mismatch as a recurring failure mode in this codebase. A dedicated final verification phase with source-code counting (not SUMMARY claims) is the required mitigation.

**Delivers:** Updated `plugins.test.ts` count floor (42 → 60+), confirmed `Object.keys(PLUGINS).length` matches target, confirmed all `pluginDescEn` keys present, `pnpm typecheck && pnpm lint && pnpm build && pnpm test` passing

**Avoids:** Pitfall 5 (English translation coverage gap), Pitfall 6 (count mismatch verified from code not docs), Pitfall 10 (dangling conflict ID references)

**Verification checklist (from PITFALLS.md):**
- `Object.keys(PLUGINS).length` >= 60
- `Object.keys(pluginDescEn).length` == `Object.keys(PLUGINS).length`
- All `plugin.conflicts` IDs exist as PLUGINS keys
- All Plugin-type IDs present in `PLUGIN_TYPE_IDS` test list
- `pnpm test` passes with updated count threshold

### Phase Ordering Rationale

- **Verification before authoring** prevents the top historical failure (wrong install commands) from entering the codebase at all rather than being corrected post-commit
- **Official entries before community entries** because official Anthropic/vendor server READMEs have more reliable install documentation
- **MCP entries before Plugin entries** because MCP entries have simpler type handling (default `type: "mcp"` requires no OVERRIDES); Plugin entries introduce the additional `PLUGIN_FIELD_OVERRIDES` type override requirement
- **Dedicated final verification phase** because PITFALLS.md specifically identifies that count verification done within authoring phases leads to trusting documentation over code counting — a recurring codebase failure

### Research Flags

Phases needing deeper research during planning:

- **Phase 1 (Candidate Selection):** STACK.md and FEATURES.md partially overlap but with different priority rankings. STACK.md uses GitHub star counts; FEATURES.md uses coverage-gap analysis. The roadmapper must decide the final 10-15 entry list. Also confirm superclaude v5 `/plugin install` migration status before Phase 5 planning.
- **Phase 5 (Community Plugins):** superclaude v5 migration is in BETA as of March 2026 — verify whether `/plugin install superclaude` works or if `pipx` is still required. peon-ping has Windows/WSL-only support via curl; document clearly for the Korean-primary audience.

Phases with standard, well-documented patterns (research-phase not needed):

- **Phase 2 (Wave A MCP):** All entries are official Anthropic/Microsoft/vendor servers with clear READMEs and npx/uvx one-liner install patterns
- **Phase 4 (Official Anthropic Plugins):** All entries from `anthropics/claude-plugins-official` with verified `/plugin install` pattern
- **Phase 6 (Verification):** Build order and test commands are fully defined in ARCHITECTURE.md with no ambiguity

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Data-only milestone; no new dependencies; entry candidates verified from official GitHub repos with star counts confirmed |
| Features | HIGH | Architecture verified from direct source inspection; feature requirements derived from existing codebase structure and prior milestone retrospectives |
| Architecture | HIGH | All integration surfaces read directly from source code; merge pattern, type constraints, and test assertions confirmed from actual file contents |
| Pitfalls | HIGH | All 10 pitfalls derived from direct codebase inspection + multi-milestone retrospective (v1.0, v1.1, v1.2 lessons documented in RETROSPECTIVE.md) |

**Overall confidence:** HIGH

### Gaps to Address

- **STACK.md vs FEATURES.md entry track conflict:** STACK.md focuses on GitHub-star-ranked community entries (claude-mem, superclaude, n8n-mcp, magic-mcp). FEATURES.md focuses on official Anthropic marketplace plugins (feature-dev, pr-review-toolkit, commit-commands). Both tracks have merit. Recommendation: take STACK.md Wave A (6 MCP) as fixed baseline, then select 4-9 more from FEATURES.md P1 Plugins and STACK.md Wave B to reach the 60-65 target.

- **redis and mongodb priority disagreement:** STACK.md rates mongodb (Wave A) and redis (Wave B) as must-adds for DB tier completeness. FEATURES.md rates them as P3 — niche for the typical audience. Resolve by confirming target audience composition. If primarily developers with DB backends, include; if primarily solo devs and beginners, defer.

- **SuperClaude install method uncertainty:** v5 plugin system migration is in BETA as of March 2026. The classic `pipx install superclaude && superclaude install` pattern works but is not `/plugin install`. If v5 ships before this milestone executes, update to the new pattern. If not, document `pipx` install clearly and set `difficulty: "intermediate"` with a note in `longDesc`.

- **linear entry update is not a new entry:** The existing `linear` entry points to a deprecated SSE endpoint. This fix must be included in the milestone to avoid shipping a broken install command, but it is an update to an existing entry — not counted toward the 10-15 new entry target.

## Sources

### Primary (HIGH confidence)

- Direct source inspection: `lib/plugins.ts` (1,637 lines, 51 entries, all three data structures)
- Direct source inspection: `lib/types.ts` (Plugin type, PluginCategory union — 10 members, ItemType)
- Direct source inspection: `lib/scoring.ts`, `lib/conflicts.ts`, `lib/i18n/plugins-en.ts`, `lib/__tests__/plugins.test.ts`
- Project retrospective: `.planning/RETROSPECTIVE.md` — v1.0, v1.1, v1.2 lessons (install error rate, env var precision, SUMMARY count mismatch)
- `github.com/thedotmack/claude-mem` — 37.7k stars verified (March 2026)
- `github.com/SuperClaude-Org/SuperClaude_Framework` — 21.6k stars verified
- `github.com/czlonkowski/n8n-mcp` — 15.4k stars verified
- `github.com/21st-dev/magic-mcp` — 4.5k stars verified
- `github.com/mongodb-js/mongodb-mcp-server` — official MongoDB org
- `github.com/redis/mcp-redis` — official Redis org (~454 stars)
- `microsoft/markitdown` packages/markitdown-mcp — 90.9k parent repo stars
- `modelcontextprotocol/servers` (fetch, time) — official Anthropic reference implementations
- `ui.shadcn.com/docs/mcp` — official shadcn/ui MCP docs
- `anthropics/claude-plugins-official` — official plugin marketplace, 83 entries

### Secondary (MEDIUM confidence)

- `awesomeclaude.ai/top-mcp-servers` — star ranking data
- `github.com/hesreallyhim/awesome-claude-code` — Claude Code plugin ecosystem survey
- `github.com/PeonPing/peon-ping` — ~4k stars, ~100k users claimed
- `github.com/automazeio/ccpm` — 6k stars, manual symlink install
- WebSearch: fastmcp.me, mcpmarket.com, composio.dev — supplementary discovery

---
*Research completed: 2026-03-18*
*Ready for roadmap: yes*
