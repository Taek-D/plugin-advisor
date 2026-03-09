import { describe, expect, it } from "vitest";
import {
  buildPreflightChecks,
  buildSetupWarnings,
  getManualSetupPlugins,
  getSafeCopyCommands,
} from "../setup";

describe("setup helpers", () => {
  it("returns only safe-copy commands for batch copy", () => {
    const commands = getSafeCopyCommands(["context7", "uiux", "vercel"]);
    const allText = commands.join("\n");
    expect(allText).toContain("context7");
    expect(allText).not.toContain("yourusername");
    expect(allText).not.toContain("vercel");
  });

  it("separates manual and external setup plugins", () => {
    const manualPlugins = getManualSetupPlugins(["context7", "uiux", "vercel"]);
    const ids = manualPlugins.map((plugin) => plugin.id);
    expect(ids).toContain("uiux");
    expect(ids).toContain("vercel");
    expect(ids).not.toContain("context7");
  });

  it("builds preflight checks from prerequisites and required secrets", () => {
    const checks = buildPreflightChecks(["supabase", "postgres"]);
    const labels = checks.map((item) => item.label).join(" ");
    expect(labels).toContain("Supabase");
    expect(labels).toContain("연결 문자열");
  });

  it("builds warnings for manual and external setup plugins", () => {
    const warnings = buildSetupWarnings(["uiux", "vercel"]);
    const messages = warnings.map((item) => item.message).join(" ");
    expect(messages).toContain("수동");
    expect(messages).toContain("계정");
  });
});
