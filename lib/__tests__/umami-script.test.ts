import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// Mock next/script so tests don't require Next.js internals
vi.mock("next/script", () => ({
  default: (props: Record<string, unknown>) => ({ type: "Script", props }),
}));

// ------------------------------------------------------------------
// CSP header tests — read next.config.mjs and assert cloud.umami.is
// ------------------------------------------------------------------

describe("next.config.mjs CSP header", () => {
  it("contains cloud.umami.is in script-src directive", async () => {
    const { default: config } = await import("../../next.config.mjs");
    const headers = await config.headers!();
    const cspHeader = headers[0].headers.find(
      (h: { key: string; value: string }) => h.key === "Content-Security-Policy"
    );
    expect(cspHeader).toBeDefined();
    const csp = cspHeader!.value as string;
    const scriptSrcMatch = csp.match(/script-src ([^;]+)/);
    expect(scriptSrcMatch).not.toBeNull();
    expect(scriptSrcMatch![1]).toContain("https://cloud.umami.is");
  });

  it("contains cloud.umami.is in connect-src directive", async () => {
    const { default: config } = await import("../../next.config.mjs");
    const headers = await config.headers!();
    const cspHeader = headers[0].headers.find(
      (h: { key: string; value: string }) => h.key === "Content-Security-Policy"
    );
    expect(cspHeader).toBeDefined();
    const csp = cspHeader!.value as string;
    const connectSrcMatch = csp.match(/connect-src ([^;]+)/);
    expect(connectSrcMatch).not.toBeNull();
    expect(connectSrcMatch![1]).toContain("https://cloud.umami.is");
  });
});

// ------------------------------------------------------------------
// UmamiScript component tests
// ------------------------------------------------------------------

describe("UmamiScript component", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("returns null when NEXT_PUBLIC_UMAMI_WEBSITE_ID is not set", async () => {
    vi.stubEnv("NEXT_PUBLIC_UMAMI_WEBSITE_ID", "");
    const { default: UmamiScript } = await import(
      "../../components/UmamiScript"
    );
    const result = UmamiScript();
    expect(result).toBeNull();
  });

  it("renders a Script element with correct data-website-id when env var is set", async () => {
    vi.stubEnv("NEXT_PUBLIC_UMAMI_WEBSITE_ID", "test-id-123");
    const { default: UmamiScript } = await import(
      "../../components/UmamiScript"
    );
    const result = UmamiScript();
    expect(result).not.toBeNull();
    // result is a React element — check its props
    expect(result).toMatchObject({
      props: expect.objectContaining({
        "data-website-id": "test-id-123",
        src: "https://cloud.umami.is/script.js",
      }),
    });
  });
});
