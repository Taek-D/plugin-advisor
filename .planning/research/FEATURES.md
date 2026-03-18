# Feature Research

**Domain:** MCP Server / Claude Code Plugin Directory — DB Expansion
**Researched:** 2026-03-18
**Confidence:** HIGH (architecture verified from source; ecosystem from multiple converging sources)

---

## Context: What This Research Covers

This is a **subsequent milestone** research document. The core product already exists (51-entry DB,
/advisor, /optimizer, /plugins, admin panel, i18n). The question is scoped to:

1. What new MCP server / Plugin entries are worth adding?
2. What metadata fields matter most for new entries?
3. What install patterns exist and how do they map to `installMode`?
4. What categories do new entries fall into, and are gaps visible?
5. Table stakes vs differentiators for a comprehensive plugin directory at this scale.

---

## Feature Landscape

### Table Stakes (Users Expect These)

Features a plugin directory is expected to have. Missing these makes the product feel unreliable.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Complete install command(s) per entry | Users copy-paste install; wrong command = immediate failure | LOW | Must match official docs exactly; all transport variants where applicable |
| Accurate `verificationStatus` | Users trust "verified" entries; wrong status misleads | LOW | GitHub README + official page check required per entry |
| `requiredSecrets` list | API-key-required tools need upfront disclosure | LOW | Missing this causes silent setup failure |
| English + Korean desc/longDesc | i18n parity already established at 51 entries | LOW | `pluginDescEn` in `lib/i18n/plugins-en.ts` must be updated in sync |
| `type: "mcp" \| "plugin"` correctly set | /plugins tab split and /optimizer typeScope depend on this | LOW | Most new entries are `mcp`; Plugin entries need intentional selection |
| `category` assignment | /plugins category filter and scoring weights depend on it | LOW | Must map to existing `PluginCategory` enum — no new categories needed |
| `keywords[]` array (10-20 per entry) | Powers keyword-based recommendation engine in /advisor | MEDIUM | Keywords drive score; thin keyword arrays = invisible in recommendations |
| `conflicts[]` array | /optimizer conflict detection depends on this | LOW | Cross-check against existing entries; most new entries have no conflicts |
| `githubRepo` field | Used for version API calls and README verification workflow | LOW | Format: `"owner/repo"` or `null` for remote-only HTTP entries |

### Differentiators (Competitive Advantage)

Features that make this directory more useful than a raw awesome-list or docs page.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| `bestFor` / `avoidFor` arrays | Opinionated guidance users cannot get from README | LOW | 2-4 entries each; Korean language per convention |
| `installMode` accuracy | Distinguishes zero-friction (safe-copy) from API-key-required (external-setup) | LOW | Three values: `safe-copy`, `external-setup`, `manual-required` |
| `difficulty` field | Surfaces beginner-safe entries vs advanced ones | LOW | Most new MCP entries are `beginner` (npx one-liner) |
| `maintenanceStatus` | Warns users about stale repos before they invest setup time | LOW | Check last commit date; flag `stale` if >6 months |
| Multiple install variants in `install[]` | Remote HTTP + stdio npx both shown where available | LOW | Matches pattern established for sentry, github, figma entries |
| `officialStatus: "official"` for vendor-maintained servers | Signals trust level above community entries | LOW | Firebase (Google), Railway, PostHog, GitLab are vendor-official |
| Deprecation notes in `longDesc` | Honest about superseded entries; mirrors linear deprecation pattern | LOW | Example: old npm package → new remote HTTP URL |

### Anti-Features (Commonly Requested, Often Problematic)

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| Adding every MCP server that exists | "More is better" — 10,000+ servers exist | Unverified entries pollute recommendations; users lose trust when installs fail | Add only entries with GitHub-verifiable README and active maintenance |
| New `PluginCategory` values | Some new entries feel like they don't fit existing categories | 10 categories already cover all real groupings; adding more fractures the filter UI | Map creatively to existing categories (e.g., firebase → `devops`, posthog → `data`) |
| Automatic star-count display field | Shows popularity signals | Requires live API calls; rate limits; staleness within hours | Keep `verificationStatus` as proxy for trust; star count is a research input, not a display field |
| AI-generated metadata without verification | Fast to produce | Wrong install commands, wrong requiredSecrets = user trust destroyed | GitHub README + official docs verification per entry, same workflow as v1.0 |
| Adding Plugin entries without verified `plugin.json` | Fills the Plugin tab | MCP servers installed via `claude mcp add` are NOT plugins; mixing confuses users | Only mark `type: "plugin"` for entries with a verified `/plugin install` install pattern |
| Runtime/execution testing of new entries | Proves the install actually works | Out of scope per PROJECT.md constraints | Metadata verification only; flag status honestly |

---

## Category Distribution Analysis

Current 51 entries by category (from source):

| Category | Current Count | Example Entries |
|----------|--------------|-----------------|
| `orchestration` | 3 | omc, superpowers, agency-agents |
| `workflow` | 10 | bkit-starter, bkit, ralph, taskmaster, gsd, fireauto, sequential-thinking, todoist, linear, atlassian |
| `code-quality` | 3 | repomix, context7, memory |
| `testing` | 3 | playwright, puppeteer, browserbase |
| `documentation` | 1 | notion |
| `data` | 7 | firecrawl, brave-search, exa, tavily, perplexity, postgres, neon |
| `security` | 2 | security, sentry |
| `integration` | 6 | github, slack, filesystem, git, supabase, figma, stripe |
| `ui-ux` | 1 | uiux |
| `devops` | 5 | docker, vercel, aws, desktop-commander, cloudflare |

**Underrepresented categories that new entries can fill:**

- `documentation` (1 entry): firebase docs access, mintlify are candidates
- `code-quality` (3): serena is a strong candidate for semantic code operations
- `ui-ux` (1): frontend-design plugin fills this gap
- `devops` (5): firebase, railway are additional candidates

**No new category is needed.** All viable new entries map naturally to existing ones.

---

## Install Pattern Taxonomy

Four real-world patterns in the ecosystem map to the existing `InstallMode` type.

### Pattern 1: `safe-copy` — Plugin install (no external dependencies)

Used by Claude Code Plugins (`type: "plugin"`). Install is via `/plugin` commands. No API key, no
external account, no config file needed.

```bash
# Marketplace install
/plugin marketplace add https://github.com/owner/repo
/plugin install plugin-name

# Official Anthropic marketplace
/plugin install plugin-name@claude-plugins-official
```

**DB entries using this:** omc, superpowers, bkit, bkit-starter, agency-agents, gsd, fireauto, ralph

### Pattern 2: `external-setup` — Remote HTTP MCP (OAuth or header auth)

The modern recommended transport (2025+). Many official vendor servers have migrated here.
SSE transport is deprecated per official docs; use HTTP where available.

```bash
# Basic HTTP (OAuth via /mcp in Claude Code)
claude mcp add --transport http sentry https://mcp.sentry.dev/mcp

# With Bearer token header
claude mcp add --transport http airtable https://mcp.airtable.com/mcp \
  --header "Authorization: Bearer YOUR_TOKEN"
```

**DB entries using this:** firecrawl, exa, tavily, perplexity, brave-search, vercel, supabase, figma, github, sentry, stripe

### Pattern 3: `external-setup` — Local stdio via npx (API key as env var)

Most common for community-published npm packages. Spawns a local Node.js process.

```bash
claude mcp add --transport stdio --env API_KEY=YOUR_KEY <name> \
  -- npx -y @package/name
```

**DB entries using this:** postgres, neon, docker (some patterns)

### Pattern 4: `manual-required` — Non-standard setup

Used when a server requires Docker, Python/uvx runtime, or manual JSON editing.

```bash
# uvx (Python-based, e.g. serena)
uvx --from serena-code serena-mcp-server

# Firebase CLI (Node.js tool, not a standalone npm package)
npx -y firebase-tools@latest mcp
```

**DB entries using this:** atlassian, desktop-commander, cloudflare

### Pattern 5 (emerging): Plugin-bundled MCP

Plugins can include `.mcp.json` or inline `mcpServers` in `plugin.json`. When the plugin is
installed via `/plugin install`, its MCP server starts automatically. This is how official
marketplace plugins like `firebase`, `serena`, `playwright` work when sourced from
`anthropics/claude-plugins-official`.

Maps to `safe-copy` installMode when the primary install is `/plugin install`; `external-setup`
if an API key is still required after plugin install.

---

## Candidate New Entries Analysis

### High-Priority MCP Server Candidates

Ordered by evidence strength (GitHub stars, official status, coverage gap filled).

| id | Category | installMode | requiredSecrets | officialStatus | Confidence |
|----|----------|-------------|-----------------|----------------|------------|
| `firebase` | `devops` | `external-setup` | Firebase project config or OAuth | official (Google) | HIGH |
| `gitlab` | `integration` | `external-setup` | GITLAB_TOKEN | official | HIGH |
| `railway` | `devops` | `external-setup` | RAILWAY_TOKEN | official | HIGH |
| `posthog` | `data` | `external-setup` | POSTHOG_API_KEY | official | HIGH |
| `redis` | `data` | `external-setup` | REDIS_URL | official (redis.io) | HIGH |
| `terraform` | `devops` | `external-setup` | none | official (HashiCorp) | MEDIUM |
| `sourcegraph` | `code-quality` | `external-setup` | SOURCEGRAPH_TOKEN | official | MEDIUM |
| `serena` | `code-quality` | `manual-required` | none | community | MEDIUM |
| `markitdown` | `documentation` | `external-setup` | none | community wrapper | LOW |
| `zapier` | `integration` | `external-setup` | Zapier account | official | MEDIUM |

### High-Priority Plugin Candidates

| id | Category | installMode | Source | Install Pattern | Confidence |
|----|----------|-------------|--------|-----------------|------------|
| `feature-dev` | `workflow` | `safe-copy` | anthropics/claude-plugins-official | `/plugin install feature-dev@claude-plugins-official` | HIGH |
| `pr-review-toolkit` | `code-quality` | `safe-copy` | anthropics/claude-plugins-official | `/plugin install pr-review-toolkit@claude-plugins-official` | HIGH |
| `commit-commands` | `workflow` | `safe-copy` | anthropics/claude-plugins-official | `/plugin install commit-commands@claude-plugins-official` | HIGH |
| `frontend-design` | `ui-ux` | `safe-copy` | anthropics/claude-plugins-official | `/plugin install frontend-design@claude-plugins-official` | HIGH |
| `security-guidance` | `security` | `safe-copy` | anthropics/claude-plugins-official | `/plugin install security-guidance@claude-plugins-official` | MEDIUM |

---

## Metadata Fields — Completeness Checklist per New Entry

### Required (no defaults acceptable)

- `id` — kebab-case, unique across all 51+ entries
- `name` — display name
- `tag` — short uppercase abbreviation (2-6 chars)
- `color` — hex color, distinct from existing palette
- `category` — one of 10 existing `PluginCategory` values
- `githubRepo` — `"owner/repo"` format, or `null` for remote-only HTTP entries
- `desc` — Korean, 1 sentence, ≤80 chars
- `longDesc` — Korean, 3-5 sentences with tool count and use case
- `url` — primary docs/GitHub URL
- `install[]` — at minimum 1 verified command; prefer 2 (remote HTTP + stdio) where both exist
- `features[]` — 3-5 Korean bullet points
- `keywords[]` — 10-20 terms (mix Korean/English)
- `conflicts[]` — explicit `[]` if none; cross-check against all existing entries
- `type` — `"mcp"` or `"plugin"`

### Operational overrides (set in PLUGIN_FIELD_OVERRIDES, not PluginSeed)

- `officialStatus` — `"official"` if vendor-maintained; `"community"` if not
- `verificationStatus` — start as `"partial"`, promote to `"verified"` after README + docs check
- `difficulty` — `"beginner"` for npx one-liners; `"intermediate"` for API key required; `"advanced"` for Docker/Python runtime
- `installMode` — never leave as `"safe-copy"` default for API-key MCP servers
- `requiredSecrets[]` — enumerate all env vars by exact name
- `bestFor[]` — 2-4 Korean phrases
- `avoidFor[]` — 1-3 Korean phrases
- `maintenanceStatus` — check last commit date; `stale` if >6 months inactive

### i18n (must be added in sync with Korean entry)

- `pluginDescEn[id].desc` — English desc
- `pluginDescEn[id].longDesc` — English longDesc
- `reasonsEn` not needed for new entries unless they appear in preset packs

---

## Feature Dependencies

```
New DB entry (any)
    └──requires──> PluginSeed (Korean desc + longDesc, install[], keywords[], etc.)
    └──requires──> PLUGIN_FIELD_OVERRIDES (installMode, verificationStatus, requiredSecrets, type)
    └──requires──> pluginDescEn entry (English translation, plugins-en.ts)

type: "plugin" entries
    └──requires──> /plugin install pattern verified (not claude mcp add)
    └──conflict──> type: "mcp" install pattern (these are mutually exclusive)

keywords[] quality
    └──enhances──> /advisor recommendation accuracy
    └──enhances──> score-based ranking in recommend.ts

conflicts[] accuracy
    └──enhances──> /optimizer conflict detection
    └──requires──> cross-check against ALL 51+ existing entries

Remote HTTP installMode entries
    └──requires──> requiredSecrets[] OR explicit note about OAuth flow
    └──note──> SSE transport deprecated per official docs; prefer HTTP transport
```

### Dependency Notes

- **English translation requires Korean first.** `pluginDescEn` references the same `id`; Korean PluginSeed is the source of truth. Do not write English before Korean.
- **installMode is not inherited from type.** `type: "plugin"` entries use `/plugin install` (maps to `safe-copy`), but `type: "mcp"` entries almost always need `external-setup` or `manual-required`. The DEFAULT_PLUGIN_FIELDS default of `safe-copy` is wrong for most new MCP entries — must override.
- **verificationStatus requires actual README lookup.** Do not mark `verified` without confirming install command from official source. Ship as `partial` first.
- **Plugin entries must not use `claude mcp add` install pattern.** MCP servers and Plugins have different install mechanisms. Mixing them in `install[]` misleads users.

---

## MVP Definition for v1.3

### Add in v1.3 (current milestone)

- [ ] 5-10 new MCP server entries from HIGH-confidence candidates above
- [ ] 5-10 new Plugin entries from official Anthropic marketplace
- [ ] All new entries: complete Korean + English desc/longDesc
- [ ] All new entries: `verificationStatus` set honestly (`partial` until README confirmed)
- [ ] All new entries: correct `type`, `installMode`, `requiredSecrets`
- [ ] Target: total DB 51 → 60-65 entries

### Defer to v1.4+

- [ ] `serena` — Python/uvx runtime; `manual-required`; higher friction for typical audience. Worth adding but needs careful `avoidFor` and difficulty labeling.
- [ ] `markitdown` — Community-built npx wrapper around Microsoft's Python tool, not an official MCP. Needs verification that wrapper is actively maintained.
- [ ] `redis` / `mongodb` — Valuable but niche; adds noise for the typical non-backend audience.
- [ ] `zapier` — Remote MCP with 8,000+ apps is powerful but setup is non-trivial (Zapier account + zap creation per action). Medium confidence on usability without additional explanation.

---

## Feature Prioritization Matrix

| Entry / Feature | User Value | Implementation Cost | Priority |
|-----------------|------------|---------------------|----------|
| `firebase` MCP | HIGH — Google-official, massive user base | LOW — official plugin, one-liner | P1 |
| `feature-dev` Plugin | HIGH — most-installed plugin in ecosystem | LOW — official marketplace | P1 |
| `pr-review-toolkit` Plugin | HIGH — fills code-quality gap | LOW — official marketplace | P1 |
| `commit-commands` Plugin | HIGH — completes git workflow trio | LOW — official marketplace | P1 |
| `gitlab` MCP | HIGH — GitHub alternative for enterprise | LOW — official, external-setup | P1 |
| `railway` MCP | HIGH — rising deployment platform | LOW — official, npx pattern | P1 |
| `posthog` MCP | HIGH — analytics gap in current DB | LOW — official, external-setup | P1 |
| `frontend-design` Plugin | MEDIUM — fills ui-ux gap (1 entry now) | LOW — official marketplace | P2 |
| `terraform` MCP | MEDIUM — infra users only | LOW — official HashiCorp | P2 |
| `sourcegraph` MCP | MEDIUM — advanced code search | MEDIUM — token required | P2 |
| `security-guidance` Plugin | MEDIUM — security tab enhancement | LOW — official marketplace | P2 |
| `serena` MCP | MEDIUM — powerful but high friction | MEDIUM — Python/uvx runtime | P3 |
| `markitdown` MCP | LOW — community wrapper, not official | MEDIUM — stability uncertain | P3 |
| `redis` / `mongodb` | LOW for typical audience | LOW | P3 |

---

## Ecosystem Context: Directory Comparison

| Feature | awesome-mcp-servers (list) | mcpcat.io (directory) | This Product |
|---------|---------------------------|----------------------|--------------|
| Curated vs exhaustive | Exhaustive (thousands) | Exhaustive | Curated (quality over quantity) |
| Install commands | Sometimes present | Sometimes present | Always verified, copy-paste ready |
| Category filter | Tags only | Categories | 10 categories + type tabs |
| Conflict detection | None | None | /optimizer conflict + score |
| Recommendation engine | None | None | /advisor keyword + AI mode |
| Korean language | None | None | Native ko + en i18n |
| Verification status | None | Community ratings | `verified/partial/unverified` per entry |
| Plugin vs MCP distinction | Mixed | Mixed | Explicit type tabs + badges |

**Core differentiation:** Not a raw list — a recommendation engine with verified metadata. More entries only improve value if they are verified. Quality gate matters more than count.

---

## Sources

- [Official Claude Code MCP Docs](https://code.claude.com/docs/en/mcp) — transport types, install patterns, scopes (HIGH confidence)
- [anthropics/claude-plugins-official marketplace.json](https://github.com/anthropics/claude-plugins-official) — official plugin catalog, 83 entries (HIGH confidence)
- [Awesome Claude AI — Top MCP Servers by GitHub Stars](https://awesomeclaude.ai/top-mcp-servers) — star ranking data (MEDIUM confidence)
- [ComposioHQ/awesome-claude-plugins](https://github.com/ComposioHQ/awesome-claude-plugins) — plugin landscape overview (MEDIUM confidence)
- [wshobson/agents](https://github.com/wshobson/agents) — plugin ecosystem scale (MEDIUM confidence)
- [oraios/serena GitHub](https://github.com/oraios/serena) — serena MCP details (HIGH confidence)
- [Firebase MCP Server Docs](https://firebase.google.com/docs/ai-assistance/mcp-server) — official Firebase MCP (HIGH confidence)
- [railwayapp/railway-mcp-server](https://github.com/railwayapp/railway-mcp-server) — Railway MCP (HIGH confidence)
- [PostHog/mcp](https://github.com/PostHog/mcp) — PostHog MCP (HIGH confidence)
- [redis/mcp-redis](https://github.com/redis/mcp-redis) — Redis MCP (HIGH confidence)
- WebSearch roundups: builder.io, mcpcat.io, firecrawl.dev, fastmcp.me 2025-2026 (MEDIUM confidence)

---

*Feature research for: MCP Server / Plugin DB Expansion (Plugin Advisor v1.3)*
*Researched: 2026-03-18*
