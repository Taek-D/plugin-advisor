# Feature Research

**Domain:** Plugin combination analyzer / optimizer (Claude Code MCP plugin set)
**Researched:** 2026-03-16
**Confidence:** MEDIUM-HIGH — rules-based combo analysis is a well-understood pattern; Claude Code-specific optimizer UX is novel but analogous patterns exist in package managers, WordPress plugin auditors, and the `claude-code-plugin-analyzer` tool found during research.

---

## What Already Exists in This Codebase

Before mapping the feature landscape, the research identified what is already shipped. These must not be re-built.

| Already Built | Location |
|---|---|
| Plugin conflict pair detection | `lib/conflicts.ts` — `CONFLICT_PAIRS`, `getConflicts()` |
| Redundancy group detection | `lib/conflicts.ts` — `REDUNDANCY_GROUPS`, `getRedundancies()` |
| Plugin metadata: `bestFor`, `avoidFor`, `difficulty`, `verificationStatus`, `prerequisites`, `conflicts` | `lib/types.ts`, `lib/plugins.ts` |
| Preset packs (known good combos) | `lib/presets.ts` — 4 packs |
| Trust scoring per plugin | `lib/recommend.ts` — `getTrustScore()` |
| Preflight checks + setup warnings | `lib/setup.ts` |
| `claude mcp list` output is newline-separated `name: transport` pairs | verified via official docs |

The optimizer feature builds **on top of** this infrastructure, not alongside it.

---

## Feature Landscape

### Table Stakes (Users Expect These)

Features a plugin optimizer must have. Missing any of these makes the tool feel like it barely works.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Paste `claude mcp list` output and get results | The stated entry point — users have this text on their clipboard | MEDIUM | Must parse `name: transport` format and fuzzy-match to `PLUGINS` DB; unrecognized names need a fallback path |
| Direct-type plugin names with autocomplete | Users who know their plugins by name will not paste raw CLI output | LOW | shadcn/ui Combobox or Command component; match against `PLUGINS` keys and `plugin.name`; Fuse.js for fuzzy matching |
| Conflict warning display | Already exists in `/advisor`; users will assume optimizer does at least this much | LOW | Reuse `getConflicts()` + `getRedundancies()` — zero new logic needed |
| "What to add" complement suggestions | Core value proposition of an optimizer — "your set is missing X" | MEDIUM | Query plugins not in current set, filter by category coverage gaps and `bestFor` match; rank by trust score |
| "Swap this for that" replacement suggestions | Users expect to be told when a better alternative exists for something they have | MEDIUM | Compare same-category plugins; surface when current plugin is `verificationStatus: unverified` or `maintenanceStatus: stale` and a verified alternative exists |
| Combination score / health indicator | Users want a single signal: "is my current set good?" | MEDIUM | Rule-based scoring: start from baseline, deduct for conflicts/stale/unverified, add for coverage breadth and verified plugins; display as 0-100 or letter grade |
| Copy install script for suggested additions | `/advisor` already does this; users will expect optimizer additions to be installable the same way | LOW | Reuse existing install script generation from `lib/setup.ts` |

### Differentiators (Competitive Advantage)

Features that make this optimizer better than "just showing conflicts."

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Category coverage visualization | Shows which workflow areas (orchestration, testing, docs, data, devops) the current set covers and which are blank | MEDIUM | Map each plugin to its `category` from `Plugin.category`; render a coverage grid or badge strip; visually immediate |
| Score breakdown with per-rule explanation | "You lost 15 points because playwright + puppeteer conflict" is more useful than a number alone | LOW | Annotate each scoring rule with its delta and a short label; users understand what to fix |
| Preset-match indicator | "Your set is 80% similar to the Web App Starter pack" gives users a mental anchor | LOW | Compute Jaccard similarity between current set and each `PRESET_PACKS` entry; show closest match |
| Difficulty / onboarding rating for the whole set | Aggregate difficulty across selected plugins to warn "this combo is advanced-level" | LOW | Weighted aggregate of `Plugin.difficulty` across set; flag if advanced plugins > 50% and no beginner scaffolding plugins present |
| "Recognized / unrecognized" parse feedback | When pasting `claude mcp list`, users need to know which names matched DB entries and which didn't | LOW | Render two groups: matched (linked to plugin detail) and unrecognized (show raw name with a "suggest this plugin" CTA) |

### Anti-Features (Commonly Requested, Often Problematic)

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| Upload `.claude/settings.json` or `mcp.json` for parsing | Feels like a power-user feature | Exposes sensitive file structure; users may accidentally paste API keys embedded in config JSON; significantly more complex parser; out of scope per PROJECT.md | Keep input to plain-text `claude mcp list` output and manual name entry — both are safe |
| AI analysis of current combo (active, not Coming Soon) | Users trust AI judgment over rules | Requires Anthropic API key on every analysis call; adds latency; cost scales with usage; can produce inconsistent explanations — rules are auditable and deterministic | Ship rules-based scoring now with explainable per-rule deltas; mark AI mode as Coming Soon per PROJECT.md |
| Real-time conflict checking as user types each plugin | Feels responsive and interactive | Causes layout instability and distraction during input; users are still building their list | Run full analysis only on explicit "Analyze" action; show a stable results panel below |
| Per-plugin version checking in optimizer | Users want to know if their installed version is outdated | Requires GitHub API call per plugin, adds latency, can hit rate limits; version API already exists in `/api/versions` but is separate | Keep version info in plugin detail page (`/plugins/[id]`); link from optimizer results to detail page |
| Save/export optimizer results as PDF or image | Requested by power users who want to document their setup | Extremely high complexity for marginal value; no data persistence needed at this stage | The install script copy is sufficient artifact; users can screenshot if needed |

---

## Feature Dependencies

```
[paste claude mcp list] ─────────────────────────────┐
                                                       ▼
[direct type + autocomplete] ──────────────> [current plugin set (resolved IDs)]
                                                       │
                              ┌────────────────────────┼────────────────────────┐
                              ▼                        ▼                        ▼
                   [conflict detection]     [combination score]     [coverage analysis]
                   (reuse conflicts.ts)     (new: score.ts)         (new: categories)
                              │                        │                        │
                              └────────────────────────┴────────────────────────┘
                                                       │
                              ┌────────────────────────┼────────────────────────┐
                              ▼                        ▼                        ▼
                   [complement suggestions]  [replacement suggestions]  [preset match]
                   (coverage gaps → add)     (stale/unverified → swap)  (Jaccard vs presets)
                              │
                              ▼
                   [install script for suggested additions]
                   (reuse setup.ts getSafeCopyCommands)
```

### Dependency Notes

- **Input parsing requires plugin ID resolution first:** The `claude mcp list` parser must map raw server names to `PLUGINS` DB keys before any analysis can run. This is the riskiest step — many MCP server names do not match plugin IDs exactly (e.g., `context7` vs `@upstash/context7-mcp`).
- **Combination score requires conflict detection:** Score deductions for conflicts depend on `getConflicts()` running first.
- **Complement suggestions require coverage analysis:** The "what to add" logic is gap-filling — it needs the coverage grid to know what categories are uncovered.
- **Replacement suggestions are independent:** Can run in parallel with complement suggestions; only needs the current resolved set and `verificationStatus`/`maintenanceStatus` metadata.
- **Install script requires complement suggestion output:** Script can only be generated after additions are determined.
- **Preset match is fully independent:** Only needs the resolved ID set; no dependency on other analysis steps.

---

## MVP Definition

### Launch With (v1.1 — current milestone)

These are the features described in PROJECT.md Active requirements.

- [ ] `claude mcp list` paste parser + fuzzy name resolution to plugin IDs — *without this, zero analysis is possible*
- [ ] Direct-type input with autocomplete (shadcn/ui Command) — *primary input for users who know their plugins*
- [ ] Recognized vs. unrecognized parse feedback — *without this, silent failures look like a broken tool*
- [ ] Conflict warning display (reuse `getConflicts()` + `getRedundancies()`) — *table stakes; already built, just wire up*
- [ ] Combination score with breakdown (rule-based: conflict deductions, trust bonuses, coverage bonuses) — *the core "is my set good?" answer*
- [ ] Complement suggestions — "add these" based on coverage gaps — *core optimizer value*
- [ ] Replacement suggestions — "swap these" for unverified/stale plugins — *core optimizer value*
- [ ] AI mode as Coming Soon — *per PROJECT.md explicit decision*

### Add After Validation (v1.x)

- [ ] Category coverage visualization (badge grid) — add if user testing shows score alone is insufficient; likely yes but deprioritized for speed
- [ ] Preset-match indicator — add once the core analysis loop is validated; very low effort
- [ ] Difficulty / onboarding aggregate — add when user feedback indicates confusion about set complexity

### Future Consideration (v2+)

- [ ] AI combo analysis (active, not Coming Soon) — requires Anthropic API integration with optimizer-specific prompt; meaningful cost/latency tradeoff to evaluate
- [ ] Persistent saved setups — requires user accounts or localStorage saved state; no auth in current stack
- [ ] Team-level combo sharing — share an optimizer result URL; requires serialized state in URL params or Supabase storage

---

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| `claude mcp list` parser | HIGH | MEDIUM | P1 |
| Direct-type + autocomplete | HIGH | LOW | P1 |
| Conflict detection (reuse) | HIGH | LOW | P1 |
| Combination score + breakdown | HIGH | MEDIUM | P1 |
| Complement suggestions | HIGH | MEDIUM | P1 |
| Replacement suggestions | HIGH | MEDIUM | P1 |
| Recognized/unrecognized feedback | MEDIUM | LOW | P1 |
| AI mode Coming Soon | MEDIUM | LOW | P1 |
| Category coverage visualization | HIGH | LOW | P2 |
| Preset-match indicator | MEDIUM | LOW | P2 |
| Difficulty aggregate | MEDIUM | LOW | P2 |
| settings.json upload | LOW | HIGH | P3 (anti-feature) |
| Real-time per-keystroke analysis | LOW | MEDIUM | P3 (anti-feature) |

**Priority key:**
- P1: Must have for v1.1 launch
- P2: Add in v1.1.x or when user feedback confirms need
- P3: Do not build

---

## Comparable Tool Analysis

These are the closest analogues to the optimizer feature — used to validate table stakes assumptions:

| Feature | `claude-code-plugin-analyzer` (GitHub) | MCP Server Selector TUI | WordPress plugin auditor | Our Approach |
|---------|----------------------------------------|-------------------------|--------------------------|--------------|
| Input method | Scans installed plugins automatically | Reads config files | Installed plugin list | Paste text + manual entry (no file access needed) |
| Conflict detection | Form-based comparison (skill vs skill only) | Context window token cost | Identifies function overlap | Direct conflict pairs + redundancy groups (already built) |
| Scoring | Quality × context × utility × completeness | Token usage per server | Performance impact | Trust + coverage + conflict deductions (rule-based, transparent) |
| Replacement suggestion | Auto-generates CLAUDE.md overrides | Toggle enable/disable | Manual audit | Explicit "swap X for Y" cards with reason |
| Gap analysis | Category winners by capability type | None | None | Category coverage grid showing uncovered workflow areas |
| Output | Registry files (plugins.json, capabilities.md) | TUI toggles | Manual notes | Score card + add/swap recommendation cards + install script |

---

## Sources

- `lib/conflicts.ts`, `lib/plugins.ts`, `lib/types.ts`, `lib/recommend.ts`, `lib/presets.ts`, `lib/setup.ts` — existing codebase (HIGH confidence)
- `.planning/PROJECT.md` — milestone scope and explicit out-of-scope decisions (HIGH confidence)
- [claude-code-plugin-analyzer (GitHub)](https://github.com/thrivikram52/claude-code-plugin-analyzer) — scoring methodology reference (MEDIUM confidence — community tool, not official)
- [Claude Code MCP Server Selector (GitHub)](https://github.com/henkisdabro/Claude-Code-MCP-Server-Selector) — context-window optimization UX patterns (MEDIUM confidence)
- [Claude Code MCP docs](https://code.claude.com/docs/en/mcp) — `claude mcp list` output format (HIGH confidence — official docs)
- [WordPress plugin conflict diagnosis](https://wisdmlabs.com/blog/how-to-diagnose-hidden-wordpress-plugin-conflicts/) — conflict detection UX patterns from analogous domain (LOW confidence — different domain)
- [Autocomplete UX patterns](https://smart-interface-design-patterns.com/articles/autocomplete-ux/) — input design reference (MEDIUM confidence)

---

*Feature research for: Plugin combination optimizer / analyzer (Claude Code MCP plugins)*
*Researched: 2026-03-16*
