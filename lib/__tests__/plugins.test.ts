import { describe, it, expect } from "vitest";
import { PLUGINS } from "../plugins";

describe("PLUGINS type field", () => {
  it("every entry has a defined type field (not undefined)", () => {
    for (const [id, plugin] of Object.entries(PLUGINS)) {
      expect(plugin.type, `Plugin "${id}" is missing type field`).toBeDefined();
    }
  });

  it("every entry's type value is either 'mcp' or 'plugin'", () => {
    const validTypes = new Set(["mcp", "plugin"]);
    for (const [id, plugin] of Object.entries(PLUGINS)) {
      expect(
        validTypes.has(plugin.type),
        `Plugin "${id}" has invalid type: ${plugin.type}`
      ).toBe(true);
    }
  });

  it("all 42 current entries have type === 'mcp' (Phase 8 baseline)", () => {
    for (const [id, plugin] of Object.entries(PLUGINS)) {
      expect(plugin.type, `Plugin "${id}" should be type 'mcp'`).toBe("mcp");
    }
  });

  it("PLUGINS object has at least 42 entries (sanity check)", () => {
    expect(Object.keys(PLUGINS).length).toBeGreaterThanOrEqual(42);
  });
});
