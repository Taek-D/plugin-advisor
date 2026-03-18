import { describe, it, expect } from "vitest";
import { PLUGINS } from "../plugins";
import { pluginDescEn } from "../i18n/plugins-en";

const PLUGIN_TYPE_IDS = [
  "omc", "superpowers", "agency-agents", "bkit-starter", "bkit",
  "ralph", "fireauto", "taskmaster", "gsd",
] as const;

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

  it("reclassified entries have type === 'plugin' (Phase 9)", () => {
    for (const id of PLUGIN_TYPE_IDS) {
      expect(PLUGINS[id].type, `Plugin "${id}" should be type 'plugin'`).toBe("plugin");
    }
  });

  it("non-reclassified entries remain type === 'mcp'", () => {
    const pluginSet = new Set<string>(PLUGIN_TYPE_IDS);
    for (const [id, plugin] of Object.entries(PLUGINS)) {
      if (!pluginSet.has(id)) {
        expect(plugin.type, `Plugin "${id}" should remain type 'mcp'`).toBe("mcp");
      }
    }
  });

  it("every plugin-type entry has English translation in pluginDescEn", () => {
    for (const id of PLUGIN_TYPE_IDS) {
      const en = pluginDescEn[id];
      expect(en, `pluginDescEn["${id}"] is missing`).toBeDefined();
      expect(en.desc, `pluginDescEn["${id}"].desc is missing`).toBeDefined();
      expect(en.longDesc, `pluginDescEn["${id}"].longDesc is missing`).toBeDefined();
    }
  });

  it("PLUGINS object has at least 42 entries (sanity check)", () => {
    expect(Object.keys(PLUGINS).length).toBeGreaterThanOrEqual(42);
  });
});
