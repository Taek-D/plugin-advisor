# Pitfalls Research

**Domain:** Adding 10-15 new MCP server and Plugin entries to an existing 51-entry verified database
**Researched:** 2026-03-18
**Confidence:** HIGH — all pitfalls derived directly from codebase inspection + multi-milestone retrospective (v1.0, v1.1, v1.2 lessons)

---

## Critical Pitfalls

### Pitfall 1: Install Command Wrong on First Entry — Historically the Most-Broken Field

**What goes wrong:**
The `install` array in `CORE_PLUGINS` is the field most frequently incorrect in every prior milestone. Common failure modes: (a) wrong package name (e.g., `@anthropic-ai/desktop-commander-mcp` vs actual package), (b) wrong install verb (`npx -y` vs `uvx` for Python servers), (c) remote HTTP MCP servers that require `claude mcp add --transport http <name> <url>` written as a `npx` command, (d) npm package listed in the install command that does not exist (e.g., `@vercel/mcp` and `@docker/mcp-server` were both non-existent).

**Why it happens:**
The install command is inferred from training data or guessed from the package name. Package names change, get scoped, or move to a different registry. Remote HTTP MCP servers have no npm package at all. Python servers use `uvx` not `npx`. Without reading the official README `Installation` section, the command is a guess.

**How to avoid:**
For every new entry, fetch the official README via the GitHub API (`/api/github` route or direct GitHub raw URL) and read the exact install command verbatim. Never infer from package name. Check: does a `claude mcp add` example appear in the README? Is `--transport http` used? Is `uvx` used instead of `npx`? Copy the exact command. Record the verification in a `PLUGIN_FIELD_OVERRIDES` comment (see existing pattern: `// perplexity: Package name changed from perplexity-mcp to @perplexity-ai/mcp-server`).

**Warning signs:**
- Install command contains `@anthropic-ai/` prefix for a non-Anthropic server
- Install command uses `npx -y` for a server whose README shows `uvx` (Python servers: `git`, `mcp-server-*`)
- Install command contains an npm package name that returns 404 on npmjs.com
- Server has a `.mcp.` subdomain URL in its README but the install command is written as `npx`

**Phase to address:** Entry research phase — verify install command before any other field is written

---

### Pitfall 2: `requiredSecrets` Env Var Name Off by One Character — Breaks User Setup

**What goes wrong:**
Users copy the install command, set the env var named in `requiredSecrets`, and the server fails to authenticate. The variable name in `requiredSecrets` is slightly wrong: `NOTION_API_KEY` instead of `NOTION_TOKEN`, `BRAVE_SEARCH_API_KEY` instead of `BRAVE_API_KEY`, `SENTRY_TOKEN` instead of `SENTRY_ACCESS_TOKEN`. The correct name is defined in the server's source code or README, not inferable from the service name.

**Why it happens:**
Env var names are guessed from the service name pattern (e.g., "Tavily" → `TAVILY_API_KEY` looks right). But servers often use custom names decided by their authors. The error is undetectable without reading the server code or README.

**How to avoid:**
Read the README `Configuration` or `Environment Variables` section for the exact name. Cross-check with the server's source code if the README is ambiguous. For OAuth-based servers (Vercel, Figma, Cloudflare, Stripe), set `requiredSecrets: []` — OAuth means no API key is configured via env var. Write the full env var name in the `requiredSecrets` array as a string exactly matching the README.

**Warning signs:**
- `requiredSecrets` contains a generic pattern like `<SERVICE>_API_KEY` that was not verified against the README
- OAuth-based server (has `prerequisites` mentioning "OAuth") also has a non-empty `requiredSecrets`
- `requiredSecrets` string includes a description like `"Brave Search API key (BRAVE_API_KEY)"` — this mixes label and variable name; should be just `"BRAVE_API_KEY"` or the actual env var

**Phase to address:** Entry research phase — verify exact var names when fetching README

---

### Pitfall 3: Server Has Migrated from npm/Local to Remote HTTP — Install Pattern Completely Different

**What goes wrong:**
A server that previously installed via `npx` now runs as a hosted remote server with an HTTP endpoint. Examples from v1.0: `exa`, `tavily`, `figma`, `vercel`, `cloudflare`, `stripe` all migrated to remote HTTP. If the entry is written with the old npm install pattern, users get an outdated local server instead of the current remote one, or the npm package no longer exists.

**Why it happens:**
Training data reflects the npm era. Many popular MCP servers migrated to remote HTTP in late 2024 / early 2025. The migration is not always announced prominently — the README just changes.

**How to avoid:**
When researching any server: check the README for `--transport http`, `mcp.`, or OAuth mention as the first signal of a remote HTTP server. Check whether the npm package still exists and is actively maintained. If the server's primary install path is now remote HTTP, write the `install` array with `claude mcp add --transport http <name> <url>` and set `requiredSecrets: []` (OAuth) or the appropriate env var. Add a comment in `PLUGIN_FIELD_OVERRIDES` explaining the migration.

**Warning signs:**
- Server README mentions `mcp.<domain>.com` or `<product>.mcp.<domain>` but install command is still `npx`
- npm package version is stale (last publish > 12 months ago) but the GitHub repo is active
- README has separate "Remote" and "Local" sections; entry only captures one

**Phase to address:** Entry research phase — migration detection before writing any entry

---

### Pitfall 4: `CORE_PLUGINS` Entry Added Without Corresponding `PLUGIN_FIELD_OVERRIDES` — Merge Order Bug

**What goes wrong:**
The merge order in `plugins.ts` line 1626-1634 is:
```
{ ...DEFAULT_PLUGIN_FIELDS, ...PLUGIN_FIELD_OVERRIDES[id], ...plugin }
```
`PluginSeed` (spread last) wins over everything. If a new entry is a Plugin (not MCP), `type: 'plugin'` must be in `PLUGIN_FIELD_OVERRIDES[id]` — it cannot be in the `PluginSeed` because `PluginSeed` is `Omit<Plugin, keyof PluginOperationalFields>` and `type` is an operational field. Placing `type: 'plugin'` in the `CORE_PLUGINS` entry produces a TypeScript error. Forgetting to add the OVERRIDES entry means the entry silently gets `type: 'mcp'` from `DEFAULT_PLUGIN_FIELDS`.

**Why it happens:**
The two-file structure (`CORE_PLUGINS` for seed data, `PLUGIN_FIELD_OVERRIDES` for operational fields) is not obvious from reading the data. A new contributor adding a Plugin entry puts all fields in `CORE_PLUGINS` and gets a type error, then "fixes" it by adding `type?` to `PluginSeed` — which breaks the invariant.

**How to avoid:**
For every new Plugin-type entry: add `type: "plugin" as const` to `PLUGIN_FIELD_OVERRIDES[id]`. Also add all operational fields (`verificationStatus`, `difficulty`, `installMode`, `requiredSecrets`, etc.) to `PLUGIN_FIELD_OVERRIDES[id]`. `CORE_PLUGINS` entry contains only `PluginSeed` fields: `id`, `name`, `tag`, `color`, `category`, `githubRepo`, `desc`, `longDesc`, `url`, `install`, `features`, `conflicts`, `keywords`. For MCP entries, `PLUGIN_FIELD_OVERRIDES` is optional but recommended for any non-default operational fields.

**Warning signs:**
- New Plugin entry in `CORE_PLUGINS` has `type` field directly on the object (TypeScript error)
- `PLUGIN_FIELD_OVERRIDES` has no entry for the new plugin ID
- New Plugin entry resolves to `type: 'mcp'` at runtime (verify with test or console)

**Phase to address:** Entry authoring phase — enforce the two-file pattern for every new entry

---

### Pitfall 5: `pluginDescEn` Translation Missing for New Entry — English Mode Shows Blank Description

**What goes wrong:**
`lib/i18n/plugins-en.ts` exports `pluginDescEn: Record<string, { desc: string; longDesc: string }>`. It is NOT a typed exhaustive record — missing keys do not cause a TypeScript error. When a user with English locale visits `/plugins` or `/plugins/[id]`, `plugin.desc` falls back silently to the Korean string (the fallback logic) or renders blank if the fallback is missing. The entry appears broken in English.

**Why it happens:**
The `pluginDescEn` record has no enforced relationship to `PLUGINS` — adding to `PLUGINS` does not require adding to `pluginDescEn`. The developer finishes the Korean entry, considers the work done, and ships without the English translation.

**How to avoid:**
Add `pluginDescEn[id]` entry for every new plugin in the same commit as the `CORE_PLUGINS` entry. The test `lib/__tests__/plugins.test.ts` line 42-49 only asserts English translations for Plugin-type entries — extend this test to assert all PLUGINS IDs have a `pluginDescEn` entry. Run `pnpm test` before marking the entry complete.

**Warning signs:**
- `pnpm test` passes but `pluginDescEn` count is less than `PLUGINS` count
- New entry is in `CORE_PLUGINS` but no corresponding key exists in `plugins-en.ts`
- English locale `/plugins/[id]` page shows Korean text or empty description

**Phase to address:** Entry authoring phase — translation must be in the same commit as the data entry

---

### Pitfall 6: Count Claims in SUMMARY Documentation Differ from Actual Code — Verifier Trusts the Document

**What goes wrong:**
v1.2 retrospective explicitly documents this: "Phase 9 SUMMARY claimed 13 plugin entries but actual code had 9 — verified by the verifier without direct count." The pattern repeats: a developer adds N entries, writes "added N+2 entries" in the summary (miscounting or including entries from a different phase), and the verifier reads the summary without counting `PLUGIN_FIELD_OVERRIDES` keys or `CORE_PLUGINS` entries.

**Why it happens:**
Documentation is written from memory or from a diff summary. Counting is error-prone, especially when entries are added across multiple files or multiple sessions. Verifiers trust document claims instead of counting in source.

**How to avoid:**
The verifier MUST count directly from source code: `Object.keys(PLUGINS).length`, count entries in `PLUGIN_FIELD_OVERRIDES` with `type: 'plugin'`, count `pluginDescEn` keys. Never accept a count from a SUMMARY or phase document without code verification. The `plugins.test.ts` sanity test (`expect(Object.keys(PLUGINS).length).toBeGreaterThanOrEqual(42)`) should be updated to the new target count (e.g., 60) so it fails if entries are missing.

**Warning signs:**
- SUMMARY says "added X entries" but `git diff lib/plugins.ts | grep "^+" | grep "id:" | wc -l` gives a different number
- Verifier sign-off references the SUMMARY count, not a code count
- `plugins.test.ts` sanity threshold is not updated to reflect the new minimum

**Phase to address:** Verification phase — verifier must count from source, not from documentation

---

### Pitfall 7: Deprecated or Archived Server Added as "Active" — Users Install Dead Software

**What goes wrong:**
A server appears popular (high GitHub stars) but the repository has been archived, the maintainer abandoned it, or an official replacement exists. Adding it with `verificationStatus: 'verified'` and `maintenanceStatus: 'active'` causes users to install stale software. Examples from existing DB: `linear` (community npm deprecated, official remote MCP exists), `ralph` (repo returned 404), `brave-search` (moved from official monorepo to archived, npm still functional but origin changed), `puppeteer` (moved to `servers-archived`).

**Why it happens:**
Stars count does not reflect current maintenance status. A repo archived 6 months ago still shows its star count. The GitHub "Archived" banner is missed if the researcher only looks at the README.

**How to avoid:**
Before adding any entry: (1) Check if the GitHub repo has the "Archived" banner. (2) Check if the README has a deprecation notice or "use X instead" message. (3) Check npm package `lastPublish` date — if > 12 months, treat as stale pending deeper investigation. (4) Search for an official replacement from the service vendor (e.g., `mcp.<vendor>.com`). If deprecated, set `maintenanceStatus: 'stale'` and add official alternative info to `longDesc`. Add `avoidFor: ['신규 도입 (공식 X 권장)']`.

**Warning signs:**
- GitHub repo has "This repository has been archived" notice
- README contains "Deprecated", "Use X instead", or a redirect notice
- npm package `lastPublish` is more than 12 months ago
- Official service vendor has released their own MCP server after this community version

**Phase to address:** Entry research phase — check maintenance status before writing any other field

---

### Pitfall 8: OAuth vs API Key Pattern Misidentified — Wrong `installMode` and `requiredSecrets`

**What goes wrong:**
OAuth-based MCP servers (Vercel, Figma, Cloudflare, Stripe) require browser authentication, not an API key in the environment. If they are entered with `installMode: 'external-setup'` and `requiredSecrets: ['<SERVICE>_API_KEY']`, the install script generation outputs an `--env` flag that does not apply. Conversely, API-key-based servers entered with `requiredSecrets: []` leave users wondering why authentication fails.

**Why it happens:**
Both patterns look like "you need an account with this service," so they are conflated. The technical difference — env var injection vs browser OAuth flow — is only visible in the README `Authentication` section.

**How to avoid:**
Read the README `Authentication` section explicitly. OAuth pattern signals: "browser login", "OAuth", "no API key required", URL ending in `/mcp` or `/sse`. API key pattern signals: `--env KEY=value` in the install command, `export KEY=...` in setup instructions. For OAuth: set `requiredSecrets: []` and add `prerequisites: ['<Service> 계정', 'OAuth 인증 (브라우저 로그인)']`. For API key: set `requiredSecrets: ['EXACT_VAR_NAME']` and `installMode: 'external-setup'`.

**Warning signs:**
- README shows OAuth flow but entry has `requiredSecrets: ['<SERVICE>_API_KEY']`
- README shows `--env API_KEY=value` in install but entry has `requiredSecrets: []`
- `prerequisites` mentions "OAuth" but `requiredSecrets` is non-empty

**Phase to address:** Entry research phase — OAuth vs API key classification before writing any field

---

### Pitfall 9: New Entry `id` Collides With or Shadows Existing Entry — Silent Data Overwrite

**What goes wrong:**
`CORE_PLUGINS` and `PLUGIN_FIELD_OVERRIDES` are both `Record<string, ...>` keyed by `id`. If a new entry uses an `id` that already exists in `CORE_PLUGINS`, the second definition silently overwrites the first in JavaScript object literal syntax (or TypeScript reports a duplicate identifier in some configurations). The original entry disappears from `PLUGINS` without any runtime warning.

**Why it happens:**
With 51 existing entries, a new entry author may not scan all existing IDs. Generic names (`git`, `github`, `postgres`, `memory`) could plausibly be chosen for a new entry that is a variant of an existing one.

**How to avoid:**
Before choosing an `id`, run `Object.keys(PLUGINS)` check (or grep the existing IDs in `CORE_PLUGINS`). Use specific, collision-resistant IDs: `mcp-server-neon` rather than just `neon` if `neon` were taken, `openai-mcp` rather than `openai` to avoid future conflicts. The `id` field in `CORE_PLUGINS` should match the `id` property inside the object — these must be identical or the lookup fails.

**Warning signs:**
- New entry's chosen ID already appears in the existing `CORE_PLUGINS` list
- After adding the entry, `Object.keys(PLUGINS).length` does not increase by the expected count
- An existing entry's data changes unexpectedly after the new entry is added

**Phase to address:** Entry authoring phase — ID uniqueness check before the entry is written

---

### Pitfall 10: `conflicts` Array Contains IDs Not Present in `PLUGINS` — Silent Scoring Error

**What goes wrong:**
`scoring.ts` `buildConflictWarnings` (and `conflicts.ts` `CONFLICT_PAIRS`) rely on valid plugin IDs. If a new entry's `conflicts` array references an ID that does not exist in `PLUGINS` (e.g., a plugin that was planned but not yet added, or a misspelled ID), `PLUGINS[conflictId]` returns `undefined`. Downstream code that accesses `.type` or `.name` on `undefined` throws at runtime or silently skips the conflict warning.

**Why it happens:**
Conflict relationships are often recorded based on anticipated future entries ("this new tool conflicts with X which we plan to add in phase 2"). By the time phase 2 runs, the ID is different from what was anticipated.

**How to avoid:**
Only add IDs to `conflicts` that currently exist in `PLUGINS`. If a conflict with a not-yet-added entry is known, add a code comment (`// conflicts with 'mcp-x' once added`) but leave the array empty. After all new entries are added, do a single pass to add cross-references. The existing test `lib/__tests__/plugins.test.ts` should be extended with: every ID in `plugin.conflicts` must exist as a key in `PLUGINS`.

**Warning signs:**
- `plugin.conflicts` contains an ID not in `Object.keys(PLUGINS)`
- No test asserts that all conflict IDs are valid
- Scoring test passes because the undefined entry is silently skipped

**Phase to address:** Post-addition verification phase — validate all conflict ID references after all entries are added

---

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Copy install command from a blog post or training data | Fast entry authoring | Wrong command, wrong package name, broken user setup | Never — always read the official README |
| Guess `requiredSecrets` from service name pattern | Skips README read | Env var name wrong; user setup fails silently | Never — always read README config section |
| Set `verificationStatus: 'partial'` without a follow-up plan | Avoids blocking the milestone | Partial entries accumulate; total verified count drifts; users install unvalidated entries | Only if a concrete re-verification phase is scheduled in the same milestone |
| Add entry with `maintenanceStatus: 'active'` without checking GitHub archived status | Optimistic default | Users install abandoned software | Never — check archived status explicitly |
| Write only Korean `desc`/`longDesc` and defer English translation | Ship faster | English locale is broken; no TypeScript error warns you | Never — both locales must ship together |
| Use an approximate count ("added ~10 entries") in SUMMARY | Avoids exact counting | Verifier accepts wrong count; actual DB size unknown | Never — count from code, not from memory |

---

## Integration Gotchas

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| `CORE_PLUGINS` + `PLUGIN_FIELD_OVERRIDES` for Plugin-type entries | Put `type: 'plugin'` in `PluginSeed` object (TypeScript error) or omit it entirely (defaults to `'mcp'`) | Add `type: "plugin" as const` to `PLUGIN_FIELD_OVERRIDES[id]`; never in `CORE_PLUGINS` |
| `pluginDescEn` in `lib/i18n/plugins-en.ts` | Add new `PLUGINS` entry but forget English translation | Add `pluginDescEn[id]` in the same commit; extend the test to cover all IDs |
| `plugins.test.ts` sanity count | Leave `greaterThanOrEqual(42)` threshold after adding 15 new entries | Update threshold to the new expected minimum (e.g., 60) so missing entries fail the test |
| `scoring.ts` `buildComplements` | New MCP entry in a category not currently in `ALL_CATEGORIES` is never suggested | Check whether the new entry's `category` appears in `ALL_CATEGORIES`; add the category if it is a new one used by multiple entries |
| `keywords` array in new entry | Generic keywords that overlap with every existing plugin (e.g., `'ai'`, `'코드'`) | Use specific, discriminating keywords that match real user queries; check overlap with existing entries' keywords |
| `CONFLICT_PAIRS` in `lib/conflicts.ts` (if used) vs `plugin.conflicts` field | Add conflict in one place but not the other | Check which mechanism the scoring engine reads; ensure consistency |

---

## Performance Traps

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| `Object.values(PLUGINS)` called on every scoring invocation with no type filter | At 51 entries: imperceptible. At 65 entries: still fine. At 200+: measurable | Add module-level `const MCP_PLUGINS` and `PLUGIN_PLUGINS` constants if DB grows past 100 | Not a concern for v1.3 (65-entry target) |
| `filterPlugins` autocomplete scanning all 65+ entries on every keypress | Slight input lag at 150+ entries | Already capped at 8 results; current substring scan is O(n) and fine at 65 | At ~150 entries |
| New entries with very long `longDesc` strings increasing initial bundle size | Slightly larger JS bundle | Keep `longDesc` under 400 chars; this is a static import | Negligible at 65 entries |

---

## Security Mistakes

| Mistake | Risk | Prevention |
|---------|------|------------|
| Listing `requiredSecrets` with an insecure default value (e.g., `"ANTHROPIC_API_KEY=sk-..."`) | Secrets exposed in source code | `requiredSecrets` values are env var names only — never values |
| Pointing `githubRepo` to a repo controlled by an unknown actor with a malicious install script | User installs malware via `claude plugin install` | Only add repos from verified vendors or with substantial community reputation (500+ stars, active issues, known maintainer) |
| Adding a server whose `install` command fetches from an unverified registry URL | Supply chain risk | Prefer `npx -y @scoped/package` over arbitrary `npx <unscoped-name>`; flag unscoped packages for review |

---

## UX Pitfalls

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| New entry has `verificationStatus: 'partial'` but no explanation in `longDesc` | User sees "partial" badge and does not know what is unverified | Add a sentence to `longDesc` explaining what is not yet verified (e.g., "install command not tested on Windows") |
| `bestFor` and `avoidFor` arrays left empty | Optimizer complement suggestions have no context; user cannot decide | Fill both arrays with at least 2 specific use cases; `avoidFor` is especially important for advanced/expensive servers |
| `difficulty: 'advanced'` set without explaining why in `avoidFor` | User installs a complex server and gets stuck | Add entry to `avoidFor` explaining the specific barrier (e.g., "Figma Dev seat required") |
| New MCP with `conflicts` referencing an existing entry — but the existing entry's `conflicts` is not updated reciprocally | Conflict warning only fires one direction | When adding a conflict relationship, update both entries' `conflicts` arrays |

---

## "Looks Done But Isn't" Checklist

- [ ] **Install command verified:** Every new entry's `install` array was read verbatim from the official README — not inferred from the package name or training data
- [ ] **requiredSecrets exact match:** Every env var name in `requiredSecrets` was read from the README config/env section — not guessed from the service name
- [ ] **OAuth vs API key classified correctly:** OAuth servers have `requiredSecrets: []` and an `prerequisites` entry; API key servers have the exact var name in `requiredSecrets`
- [ ] **Maintenance status checked:** Every new entry's GitHub repo was checked for the "Archived" banner and a deprecation notice in the README
- [ ] **English translation present:** `pluginDescEn[id]` exists for every new entry — verify `Object.keys(pluginDescEn).length` vs `Object.keys(PLUGINS).length`
- [ ] **Plugin-type entries in OVERRIDES:** Every new Plugin-type entry has `type: "plugin" as const` in `PLUGIN_FIELD_OVERRIDES`, not in `CORE_PLUGINS`
- [ ] **Conflict IDs valid:** Every ID in every `plugin.conflicts` array exists as a key in `PLUGINS`
- [ ] **ID uniqueness confirmed:** No new entry ID collides with an existing entry
- [ ] **Count verified from code:** `Object.keys(PLUGINS).length` matches the claimed new total — not taken from SUMMARY documentation
- [ ] **Test threshold updated:** `plugins.test.ts` sanity count threshold updated to the new minimum (e.g., 60 if target is 60-65)
- [ ] **`pnpm typecheck` passes:** Run after all entries are added; `pnpm dev` alone is insufficient
- [ ] **`pnpm test` passes:** All 125+ tests pass including any new assertions added for the new entries

---

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| Wrong install command shipped | LOW | Update `CORE_PLUGINS[id].install`, add verification comment to `PLUGIN_FIELD_OVERRIDES[id]`, bump `verificationStatus` to `'partial'` if only partially verified |
| Wrong `requiredSecrets` name | LOW | Update string in `PLUGIN_FIELD_OVERRIDES[id]`, add README reference comment |
| Plugin-type entry resolved as `type: 'mcp'` | LOW | Add `type: "plugin" as const` to `PLUGIN_FIELD_OVERRIDES[id]`; run `pnpm test` to confirm |
| Deprecated server added as active | MEDIUM | Set `maintenanceStatus: 'stale'`, add official alternative to `longDesc`, add `avoidFor` warning, update `verificationStatus` to `'partial'` |
| English translation missing | LOW | Add `pluginDescEn[id]` entry, run `pnpm test` to verify coverage |
| Count mismatch between docs and code | LOW | Recount from `Object.keys(PLUGINS).length`, update SUMMARY, update `plugins.test.ts` threshold |
| Conflict ID references non-existent entry | LOW | Remove dangling ID from `conflicts` array, add code comment for future reference |
| ID collision (existing entry overwritten) | HIGH | Rename new entry's ID throughout all files (`CORE_PLUGINS`, `PLUGIN_FIELD_OVERRIDES`, `pluginDescEn`, `reasonsEn`, `conflicts` arrays of other entries), verify `PLUGINS` count recovers |

---

## Pitfall-to-Phase Mapping

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| Wrong install command | Entry research — README fetch before authoring | Reviewer reads install command against fetched README text |
| Wrong `requiredSecrets` name | Entry research — README config section read | Reviewer confirms var name against README |
| OAuth vs API key misclassified | Entry research — README auth section read | `requiredSecrets` empty IFF `prerequisites` mentions OAuth |
| Remote HTTP migration missed | Entry research — check for `--transport http` / `mcp.` URL | Install command pattern matches server's current README |
| Deprecated/archived server added as active | Entry research — GitHub archived check | GitHub repo shows no archived banner; README has no deprecation notice |
| Plugin-type entry missing from `PLUGIN_FIELD_OVERRIDES` | Entry authoring — two-file pattern | `pnpm typecheck` passes; runtime `PLUGINS[id].type === 'plugin'` confirmed |
| `pluginDescEn` translation missing | Entry authoring — same commit as data | `pnpm test` plugin translation test passes |
| Count mismatch in documentation | Verification phase | Verifier counts `Object.keys(PLUGINS).length` from source, not SUMMARY |
| Conflict ID references missing entry | Post-addition verification | Test asserting all conflict IDs exist in `PLUGINS` passes |
| ID collision | Entry authoring — uniqueness check | `Object.keys(PLUGINS).length` increases by exactly the number of new entries added |
| `plugins.test.ts` threshold stale | Verification phase | `pnpm test` sanity count uses new minimum threshold |

---

## Sources

- Direct inspection: `lib/plugins.ts` — `CORE_PLUGINS`, `PLUGIN_FIELD_OVERRIDES`, `DEFAULT_PLUGIN_FIELDS`, merge pattern lines 1626-1634 (HIGH confidence)
- Direct inspection: `lib/types.ts` — `Plugin`, `PluginSeed`, `PluginOperationalFields`, `ItemType` (HIGH confidence)
- Direct inspection: `lib/i18n/plugins-en.ts` — untyped `pluginDescEn` record, translation coverage gap (HIGH confidence)
- Direct inspection: `lib/__tests__/plugins.test.ts` — existing sanity tests, translation coverage gap for non-Plugin entries (HIGH confidence)
- Direct inspection: `lib/scoring.ts` — `ALL_CATEGORIES`, `buildComplements`, `buildReplacements` type filter dependency (HIGH confidence)
- Project retrospective: `.planning/RETROSPECTIVE.md` v1.0 lessons — install command error rate, env var name precision requirement (HIGH confidence)
- Project retrospective: `.planning/RETROSPECTIVE.md` v1.2 lessons — SUMMARY count mismatch, verifier trusting documentation over code (HIGH confidence)
- In-code evidence: `PLUGIN_FIELD_OVERRIDES` comments documenting past corrections (perplexity package rename, vercel no-npm-package, figma no-github-repo, docker non-npx install, linear deprecated, ralph 404) (HIGH confidence)
- Project context: `.planning/PROJECT.md` — v1.3 milestone scope, existing 51-entry DB target, 60-65 target range (HIGH confidence)

---
*Pitfalls research for: Adding 10-15 new MCP server and Plugin entries to existing 51-entry verified database (v1.3 milestone)*
*Researched: 2026-03-18*
