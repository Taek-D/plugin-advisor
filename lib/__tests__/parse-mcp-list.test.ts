import { describe, it, expect } from "vitest";
import {
  normalizeToken,
  resolvePluginId,
  parseMcpList,
  filterPlugins,
} from "../parse-mcp-list";
import type { Plugin } from "../types";

const mockPlugins: Plugin[] = [
  {
    id: "context7",
    name: "Context7",
    tag: "context7",
    color: "#6366f1",
    desc: "Context provider",
    longDesc: "Context provider for MCP",
    url: "https://example.com",
    githubRepo: null,
    category: "workflow",
    install: [],
    features: [],
    conflicts: [],
    keywords: [],
    officialStatus: "community",
    verificationStatus: "verified",
    difficulty: "beginner",
    prerequisites: [],
    requiredSecrets: [],
    platformSupport: ["windows", "mac", "linux"],
    installMode: "safe-copy",
    maintenanceStatus: "active",
    bestFor: [],
    avoidFor: [],
  },
  {
    id: "brave-search",
    name: "Brave Search",
    tag: "brave-search",
    color: "#fb923c",
    desc: "Web search",
    longDesc: "Web search via Brave",
    url: "https://example.com",
    githubRepo: null,
    category: "data",
    install: [],
    features: [],
    conflicts: [],
    keywords: [],
    officialStatus: "official",
    verificationStatus: "verified",
    difficulty: "beginner",
    prerequisites: [],
    requiredSecrets: [],
    platformSupport: ["windows", "mac", "linux"],
    installMode: "safe-copy",
    maintenanceStatus: "active",
    bestFor: [],
    avoidFor: [],
  },
  {
    id: "github",
    name: "GitHub",
    tag: "github",
    color: "#333",
    desc: "GitHub integration",
    longDesc: "GitHub MCP integration",
    url: "https://example.com",
    githubRepo: null,
    category: "integration",
    install: [],
    features: [],
    conflicts: [],
    keywords: [],
    officialStatus: "official",
    verificationStatus: "verified",
    difficulty: "intermediate",
    prerequisites: [],
    requiredSecrets: [],
    platformSupport: ["windows", "mac", "linux"],
    installMode: "safe-copy",
    maintenanceStatus: "active",
    bestFor: [],
    avoidFor: [],
  },
  {
    id: "playwright",
    name: "Playwright",
    tag: "playwright",
    color: "#2ead33",
    desc: "Browser testing",
    longDesc: "Browser testing via Playwright",
    url: "https://example.com",
    githubRepo: null,
    category: "testing",
    install: [],
    features: [],
    conflicts: [],
    keywords: [],
    officialStatus: "official",
    verificationStatus: "verified",
    difficulty: "intermediate",
    prerequisites: [],
    requiredSecrets: [],
    platformSupport: ["windows", "mac", "linux"],
    installMode: "safe-copy",
    maintenanceStatus: "active",
    bestFor: [],
    avoidFor: [],
  },
];

const pluginIds = mockPlugins.map((p) => p.id);

describe("normalizeToken", () => {
  it("strips (user): suffix", () => {
    expect(normalizeToken("Context7 (user):")).toBe("context7");
  });

  it("strips @modelcontextprotocol/server- prefix", () => {
    expect(normalizeToken("@modelcontextprotocol/server-playwright")).toBe(
      "playwright"
    );
  });

  it("strips mcp- prefix", () => {
    expect(normalizeToken("mcp-context7")).toBe("context7");
  });

  it("strips -mcp suffix", () => {
    expect(normalizeToken("github-mcp")).toBe("github");
  });

  it("strips unicode symbols like checkmarks", () => {
    expect(normalizeToken("\u2713 github")).toBe("github");
  });
});

describe("resolvePluginId", () => {
  it("resolves by exact id match", () => {
    expect(resolvePluginId("context7", mockPlugins)).toBe("context7");
  });

  it("returns null for unknown tokens", () => {
    expect(resolvePluginId("unknown-thing", mockPlugins)).toBeNull();
  });

  it("resolves via alias map (brave -> brave-search)", () => {
    expect(resolvePluginId("brave", mockPlugins)).toBe("brave-search");
  });
});

describe("parseMcpList", () => {
  it("parses variant A: 'name (user):' format", () => {
    const input = `context7 (user): connected
brave-search (user): connected
unknown-plugin (user): connected`;
    const result = parseMcpList(input, pluginIds);
    expect(result.matched).toContain("context7");
    expect(result.matched).toContain("brave-search");
    expect(result.unmatched).toContain("unknown-plugin");
  });

  it("parses variant B: checkmark format", () => {
    const input = `\u2713 context7  Connected
\u2713 github  Connected
\u2713 foobar  Connected`;
    const result = parseMcpList(input, pluginIds);
    expect(result.matched).toContain("context7");
    expect(result.matched).toContain("github");
    expect(result.unmatched).toContain("foobar");
  });

  it("returns empty for empty string", () => {
    const result = parseMcpList("", pluginIds);
    expect(result.matched).toEqual([]);
    expect(result.unmatched).toEqual([]);
  });

  it("returns empty for whitespace-only input", () => {
    const result = parseMcpList("   \n  \n  ", pluginIds);
    expect(result.matched).toEqual([]);
    expect(result.unmatched).toEqual([]);
  });
});

describe("filterPlugins", () => {
  it("returns plugins matching substring in name/id/tag", () => {
    const results = filterPlugins("cont", mockPlugins);
    expect(results.length).toBeGreaterThanOrEqual(1);
    expect(results.some((p) => p.id === "context7")).toBe(true);
  });

  it("returns empty array for empty query", () => {
    expect(filterPlugins("", mockPlugins)).toEqual([]);
  });

  it("is case-insensitive", () => {
    const results = filterPlugins("BRAVE", mockPlugins);
    expect(results.some((p) => p.id === "brave-search")).toBe(true);
  });
});
