import type { Plugin } from "./types";

export type ParseResult = {
  matched: string[];
  unmatched: string[];
};

const ALIAS_MAP: Record<string, string> = {
  brave: "brave-search",
  "github-mcp": "github",
  "oh-my-claudecode": "omc",
  "server-github": "github",
  "server-playwright": "playwright",
};

/**
 * Normalize a raw token from MCP list output.
 * Strips scoped prefixes, (user)/(project) suffixes, mcp- prefixes,
 * -mcp suffixes, unicode symbols, and lowercases the result.
 */
export function normalizeToken(raw: string): string {
  let token = raw.trim().toLowerCase();

  // Strip (user): or (project): suffix BEFORE removing special chars
  token = token.replace(/\s*\((?:user|project)\):?\s*$/g, "").trim();

  // Strip unicode symbols (checkmarks, x-marks, etc.)
  token = token.replace(/[^\w\s@/-]/g, "").trim();

  // Strip @source suffix from plugin list format (name@marketplace)
  // Only if @ is not at the start (scoped packages like @scope/pkg start with @)
  if (!token.startsWith("@") && token.includes("@")) {
    token = token.replace(/@.*$/, "");
  }

  // Strip @modelcontextprotocol/server- prefix
  token = token.replace(/^@modelcontextprotocol\/server-/, "");

  // Strip any @scope/ prefix
  token = token.replace(/^@[^/]+\//, "");

  // Strip mcp- prefix
  token = token.replace(/^mcp-/, "");

  // Strip -mcp suffix
  token = token.replace(/-mcp$/, "");

  // Remove any remaining non-alphanumeric chars except hyphen
  token = token.replace(/[^a-z0-9-]/g, "").trim();

  return token;
}

/**
 * Resolve a normalized token to a plugin ID.
 * Tries matching against id, normalized name, and normalized tag.
 * Falls back to alias map if no direct match.
 */
export function resolvePluginId(
  token: string,
  plugins: Plugin[]
): string | null {
  const normalized = normalizeToken(token);

  for (const plugin of plugins) {
    if (plugin.id === normalized) return plugin.id;
    if (normalizeToken(plugin.name) === normalized) return plugin.id;
    if (normalizeToken(plugin.tag) === normalized) return plugin.id;
  }

  // Check alias map
  const aliasId = ALIAS_MAP[normalized];
  if (aliasId) {
    const found = plugins.find((p) => p.id === aliasId);
    if (found) return found.id;
  }

  return null;
}

/**
 * Parse raw `claude mcp list` output into matched plugin IDs and unmatched tokens.
 * Handles two known format variants:
 *   - "name (user): connected"
 *   - "checkmark name Connected"
 */
export function parseMcpList(raw: string, pluginIds: string[]): ParseResult {
  if (!raw || !raw.trim()) {
    return { matched: [], unmatched: [] };
  }

  // Build a minimal Plugin[] from pluginIds for resolvePluginId
  const pseudoPlugins: Plugin[] = pluginIds.map((id) => ({
    id,
    name: id,
    tag: id,
    color: "",
    desc: "",
    longDesc: "",
    url: "",
    githubRepo: null,
    category: "workflow" as const,
    install: [],
    features: [],
    conflicts: [],
    keywords: [],
    officialStatus: "community" as const,
    verificationStatus: "unverified" as const,
    difficulty: "beginner" as const,
    prerequisites: [],
    requiredSecrets: [],
    platformSupport: [],
    installMode: "safe-copy" as const,
    maintenanceStatus: "active" as const,
    bestFor: [],
    avoidFor: [],
    type: "mcp" as const,
  }));

  const lines = raw.split("\n");
  const matchedSet = new Set<string>();
  const unmatchedList: string[] = [];

  // Detect format: claude plugin list vs claude mcp list
  const isPluginList = lines.some((l) => /^\s*❯\s/.test(l));

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Skip header-like lines
    if (/^(Checking MCP|Installed plugins|MCP|Name|Status|Version|Scope|---)/i.test(trimmed)) continue;

    // Strip terminal control chars
    const cleaned = trimmed.replace(/\x1B\[[0-9;]*m/g, "");

    let rawToken: string | null = null;

    if (isPluginList) {
      // claude plugin list: "❯ name@source" → extract name
      const pluginMatch = cleaned.match(/❯\s+([\w-]+)/);
      if (!pluginMatch) continue;
      rawToken = pluginMatch[1];
    } else {
      // claude mcp list formats:
      // 1. "claude.ai X: url - status" → extract X
      const cloudMatch = cleaned.match(/^claude\.ai\s+([\w-]+)\s*:/);
      if (cloudMatch) {
        rawToken = cloudMatch[1];
      }

      // 2. "plugin:name:suffix: command - status" → extract name
      if (!rawToken) {
        const pluginPrefixMatch = cleaned.match(/^plugin:([\w-]+)/);
        if (pluginPrefixMatch) {
          rawToken = pluginPrefixMatch[1];
        }
      }

      // 3. "name: command/url - status" → extract name before colon
      if (!rawToken) {
        const colonMatch = cleaned.match(/^([\w-]+)\s*:/);
        if (colonMatch) {
          rawToken = colonMatch[1];
        }
      }

      // 4. Fallback: old formats ("name (user):", "✓ name Connected")
      if (!rawToken) {
        const withoutSymbols = cleaned.replace(/^[^\w@]+/, "");
        const tokenMatch = withoutSymbols.match(/^([@\w][\w./@-]*)/);
        if (!tokenMatch) continue;
        rawToken = tokenMatch[1];
      }
    }

    if (!rawToken) continue;
    const normalized = normalizeToken(rawToken);
    if (!normalized) continue;

    const resolved = resolvePluginId(rawToken, pseudoPlugins);
    if (resolved) {
      matchedSet.add(resolved);
    } else {
      unmatchedList.push(normalized);
    }
  }

  return {
    matched: Array.from(matchedSet),
    unmatched: unmatchedList,
  };
}

/**
 * Filter plugins by substring match on name, id, or tag.
 * Case-insensitive. Returns max 8 results.
 * Used as autocomplete data source.
 */
export function filterPlugins(query: string, plugins: Plugin[]): Plugin[] {
  if (query.length < 1) return [];

  const q = query.toLowerCase();
  return plugins
    .filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q) ||
        p.tag.toLowerCase().includes(q)
    )
    .slice(0, 8);
}
