import { describe, expect, it } from "vitest";
import { recommend } from "../recommend";

describe("recommend()", () => {
  it("returns the beginner starter pack for beginner-like input", () => {
    const result = recommend("Claude Code 초보인데 처음 세팅을 도와줘");
    expect(result.recommendedPackId).toBe("beginner-essential");
    expect(result.recommendations.length).toBeGreaterThanOrEqual(2);
    expect(result.recommendations.map((item) => item.pluginId)).toContain("bkit-starter");
  });

  it("returns the webapp starter pack for web app input", () => {
    const result = recommend("React Next.js landing page with browser test and deploy");
    expect(result.recommendedPackId).toBe("webapp-starter");
    expect(result.recommendations.map((item) => item.pluginId)).toContain("playwright");
  });

  it("returns the backend starter pack for backend input", () => {
    const result = recommend("FastAPI backend auth api database");
    expect(result.recommendedPackId).toBe("backend-start");
    expect(result.recommendations.map((item) => item.pluginId)).toContain("security");
  });

  it("returns the data starter pack for crawling input", () => {
    const result = recommend("웹 크롤링 research search data collect");
    expect(result.recommendedPackId).toBe("data-research");
    expect(result.recommendations.map((item) => item.pluginId)).toContain("firecrawl");
  });

  it("includes confidence, preflight checks, and setup warnings", () => {
    const result = recommend("Next.js frontend deploy");
    expect(result.confidenceLevel).toBeDefined();
    expect(result.preflightChecks).toBeDefined();
    expect(result.preflightChecks!.length).toBeGreaterThan(0);
    expect(result.setupWarnings).toBeDefined();
  });

  it("holds back high-risk plugins for beginner setups", () => {
    const result = recommend("초보인데 ui 디자인도 하고 postgres까지 붙이고 싶어");
    const notRecommendedIds = (result.notRecommended ?? []).map((item) => item.pluginId);
    expect(notRecommendedIds).toContain("uiux");
    expect(notRecommendedIds).toContain("postgres");
  });

  it("returns up to 5 core recommendations", () => {
    const result = recommend(
      "react nextjs browser test deploy auth database crawl search beginner"
    );
    expect(result.recommendations.length).toBeLessThanOrEqual(5);
  });

  it("recommends non-preset plugins when keywords match strongly", () => {
    const result = recommend("백엔드 PostgreSQL 결제 시스템 stripe neon database payment");
    const recommendedIds = result.recommendations.map((item) => item.pluginId);
    const hasNonPreset = recommendedIds.some(
      (id) => id === "stripe" || id === "neon"
    );
    expect(hasNonPreset).toBe(true);
  });

  it("keeps manual placeholder-heavy plugins out of beginner recommendations", () => {
    const result = recommend("초보인데 figma filesystem uiux plugin 설치하고 싶어");
    const recommendedIds = result.recommendations.map((item) => item.pluginId);
    expect(recommendedIds).not.toContain("uiux");
    expect(recommendedIds).not.toContain("filesystem");
  });

  it("surfaces fireauto for launch-oriented setup work", () => {
    const result = recommend("서비스 런칭 전에 seo security planner daisyui uiux researcher 흐름을 정리하고 싶어");
    expect(result.recommendations.map((item) => item.pluginId)).toContain("fireauto");
  });

  it("surfaces GSD for spec-driven roadmap workflows", () => {
    const result = recommend("spec driven roadmap requirements phase milestone workflow execute verify");
    expect(result.recommendations.map((item) => item.pluginId)).toContain("gsd");
  });

  it("surfaces agency-agents for specialist team workflows", () => {
    const result = recommend("Need specialist agents for frontend backend marketing and project management team workflow");
    expect(result.recommendations.map((item) => item.pluginId)).toContain("agency-agents");
  });

  it("holds back agency-agents for beginner-first setup", () => {
    const result = recommend("초보인데 specialist agents 로 frontend backend marketing 팀처럼 쓰고 싶어");
    const recommendedIds = result.recommendations.map((item) => item.pluginId);
    const notRecommendedIds = (result.notRecommended ?? []).map((item) => item.pluginId);
    expect(recommendedIds).not.toContain("agency-agents");
    expect(notRecommendedIds).toContain("agency-agents");
  });

  it("does not surface agency-agents for a simple frontend request", () => {
    const result = recommend("React frontend component with browser tests");
    expect(result.recommendations.map((item) => item.pluginId)).not.toContain("agency-agents");
  });

  it("does not surface fireauto for a generic backend security request", () => {
    const result = recommend("backend auth api security and database");
    expect(result.recommendations.map((item) => item.pluginId)).not.toContain("fireauto");
  });

  it("does not surface GSD for a generic CRUD implementation request", () => {
    const result = recommend("build a simple CRUD app with auth and deploy");
    expect(result.recommendations.map((item) => item.pluginId)).not.toContain("gsd");
  });

  it("surfaces agency-agents on explicit agency intent even without many role keywords", () => {
    const result = recommend("I want a dream team of specialist agents for this product");
    expect(result.recommendations.map((item) => item.pluginId)).toContain("agency-agents");
  });
});
