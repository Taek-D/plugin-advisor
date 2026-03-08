import { describe, it, expect } from "vitest";
import { getConflicts, getRedundancies, CONFLICT_PAIRS, REDUNDANCY_GROUPS } from "../conflicts";

describe("getConflicts()", () => {
  it("returns empty array when no plugins selected", () => {
    const result = getConflicts([]);
    expect(result).toEqual([]);
  });

  it("returns empty array when no conflicting pair is selected", () => {
    const result = getConflicts(["context7", "repomix", "playwright"]);
    expect(result).toEqual([]);
  });

  it("returns empty array when only one of a conflict pair is selected", () => {
    expect(getConflicts(["omc"])).toEqual([]);
    expect(getConflicts(["superpowers"])).toEqual([]);
    expect(getConflicts(["playwright"])).toEqual([]);
    expect(getConflicts(["puppeteer"])).toEqual([]);
  });

  it("detects omc + superpowers conflict", () => {
    const result = getConflicts(["omc", "superpowers"]);
    expect(result.length).toBe(1);
    expect(result[0].ids).toContain("omc");
    expect(result[0].ids).toContain("superpowers");
    expect(typeof result[0].msg).toBe("string");
    expect(result[0].msg.length).toBeGreaterThan(0);
  });

  it("detects playwright + puppeteer conflict", () => {
    const result = getConflicts(["playwright", "puppeteer"]);
    expect(result.length).toBe(1);
    expect(result[0].ids).toContain("playwright");
    expect(result[0].ids).toContain("puppeteer");
  });

  it("detects brave-search + tavily conflict", () => {
    const result = getConflicts(["brave-search", "tavily"]);
    expect(result.length).toBe(1);
    expect(result[0].ids).toContain("brave-search");
    expect(result[0].ids).toContain("tavily");
  });

  it("detects multiple conflicts at once", () => {
    const result = getConflicts(["omc", "superpowers", "playwright", "puppeteer"]);
    expect(result.length).toBe(2);
  });

  it("conflict result ids match the CONFLICT_PAIRS definition", () => {
    for (const pair of CONFLICT_PAIRS) {
      const [a, b] = pair.ids;
      const result = getConflicts([a, b]);
      expect(result.length).toBe(1);
      expect(result[0].ids).toContain(a);
      expect(result[0].ids).toContain(b);
    }
  });
});

describe("getRedundancies()", () => {
  it("returns empty array when no plugins selected", () => {
    expect(getRedundancies([])).toEqual([]);
  });

  it("returns empty array when only one plugin from a redundancy group is selected", () => {
    expect(getRedundancies(["brave-search"])).toEqual([]);
    expect(getRedundancies(["taskmaster"])).toEqual([]);
    expect(getRedundancies(["bkit"])).toEqual([]);
  });

  it("detects redundancy when two search plugins are selected", () => {
    const result = getRedundancies(["brave-search", "tavily"]);
    expect(result.length).toBe(1);
    expect(result[0].ids).toContain("brave-search");
    expect(result[0].ids).toContain("tavily");
  });

  it("detects redundancy for task management tools", () => {
    const result = getRedundancies(["taskmaster", "todoist"]);
    expect(result.length).toBe(1);
    expect(result[0].ids).toContain("taskmaster");
    expect(result[0].ids).toContain("todoist");
  });

  it("detects bkit + bkit-starter redundancy", () => {
    const result = getRedundancies(["bkit", "bkit-starter"]);
    expect(result.length).toBe(1);
    expect(result[0].ids).toContain("bkit");
    expect(result[0].ids).toContain("bkit-starter");
  });

  it("returns the group message", () => {
    const result = getRedundancies(["brave-search", "tavily"]);
    expect(typeof result[0].msg).toBe("string");
    expect(result[0].msg.length).toBeGreaterThan(0);
  });

  it("does not flag groups with only one matching plugin", () => {
    // exa alone should not trigger the search redundancy group
    const result = getRedundancies(["exa", "context7", "playwright"]);
    expect(result).toEqual([]);
  });

  it("detects redundancy for three plugins in same group", () => {
    const result = getRedundancies(["brave-search", "exa", "tavily"]);
    expect(result.length).toBeGreaterThan(0);
    expect(result[0].ids).toContain("brave-search");
  });

  it("redundancy group count matches REDUNDANCY_GROUPS when all members selected", () => {
    for (const group of REDUNDANCY_GROUPS) {
      const result = getRedundancies(group.ids);
      expect(result.some((r) => r.ids === group.ids)).toBe(true);
    }
  });
});
