import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// ---------------------------------------------------------------------------
// In-memory localStorage mock
// ---------------------------------------------------------------------------
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; },
  };
})();

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("analytics.ts — Umami forwarding", () => {
  beforeEach(() => {
    vi.resetModules();
    localStorageMock.clear();
    Object.defineProperty(global, "localStorage", {
      value: localStorageMock,
      writable: true,
      configurable: true,
    });
    Object.defineProperty(global, "window", {
      value: {
        localStorage: localStorageMock,
        umami: {
          track: vi.fn(),
          identify: vi.fn(),
        },
      },
      writable: true,
      configurable: true,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("calls window.umami.track with event name and payload", async () => {
    const { trackEvent } = await import("../analytics");
    trackEvent("analysis_start", { mode: "keyword" });
    expect((global.window as Window & typeof globalThis).umami?.track).toHaveBeenCalledWith(
      "analysis_start",
      { mode: "keyword" }
    );
  });

  it("calls window.umami.track with correct event name when no payload provided", async () => {
    const { trackEvent } = await import("../analytics");
    trackEvent("landing_view");
    expect((global.window as Window & typeof globalThis).umami?.track).toHaveBeenCalledWith(
      "landing_view",
      {}
    );
  });

  it("still writes event to localStorage (existing behavior preserved)", async () => {
    const { trackEvent } = await import("../analytics");
    trackEvent("analysis_start", { mode: "keyword" });
    const raw = localStorageMock.getItem("plugin-advisor-events");
    expect(raw).not.toBeNull();
    const events = JSON.parse(raw!);
    expect(events).toHaveLength(1);
    expect(events[0].event).toBe("analysis_start");
    expect(events[0].payload).toEqual({ mode: "keyword" });
  });

  it("does not throw when window.umami is undefined (graceful no-op)", async () => {
    // Remove umami from window
    Object.defineProperty(global, "window", {
      value: {
        localStorage: localStorageMock,
        // umami intentionally omitted
      },
      writable: true,
      configurable: true,
    });
    const { trackEvent } = await import("../analytics");
    expect(() => trackEvent("analysis_start", { mode: "ai" })).not.toThrow();
  });

  it("does not throw when window is undefined (SSR guard)", async () => {
    const windowDescriptor = Object.getOwnPropertyDescriptor(global, "window");
    Object.defineProperty(global, "window", {
      value: undefined,
      writable: true,
      configurable: true,
    });
    const { trackEvent } = await import("../analytics");
    expect(() => trackEvent("landing_view")).not.toThrow();
    // Restore
    if (windowDescriptor) {
      Object.defineProperty(global, "window", windowDescriptor);
    }
  });
});
