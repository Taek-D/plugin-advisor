import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// ---------------------------------------------------------------------------
// Mock next/server — cannot be resolved in vitest node environment (broken
// node_modules; same constraint as Plan 01 with next/script).
// This mock intercepts both the test file and app/api/umami/route.ts imports.
// ---------------------------------------------------------------------------

vi.mock("next/server", () => {
  class MockNextRequest {
    nextUrl: URL;
    headers: Map<string, string>;
    _body: string;

    constructor(url: string, init?: { method?: string; body?: string; headers?: Record<string, string> }) {
      this.nextUrl = new URL(url);
      this._body = init?.body ?? "";
      this.headers = new Map(Object.entries(init?.headers ?? {}));
    }

    text(): Promise<string> {
      return Promise.resolve(this._body);
    }
  }

  class MockNextResponse {
    status: number;
    headers: Map<string, string>;

    constructor(_body: unknown, init?: { status?: number; headers?: { forEach?: (cb: (v: string, k: string) => void) => void } }) {
      this.status = init?.status ?? 200;
      this.headers = new Map();
      if (init?.headers?.forEach) {
        init.headers.forEach((v: string, k: string) => {
          this.headers.set(k, v);
        });
      }
    }
  }

  return {
    NextRequest: MockNextRequest,
    NextResponse: MockNextResponse,
  };
});

// ---------------------------------------------------------------------------
// Helper to build a mock request
// ---------------------------------------------------------------------------

type MockReq = {
  nextUrl: URL;
  headers: Map<string, string>;
  text: () => Promise<string>;
};

function makeMockReq(url: string, opts?: { method?: string; body?: string; headers?: Record<string, string> }): MockReq {
  const parsed = new URL(url);
  const headerMap = new Map(Object.entries(opts?.headers ?? {}));
  return {
    nextUrl: parsed,
    headers: headerMap,
    text: () => Promise.resolve(opts?.body ?? ""),
  };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("/api/umami proxy route", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("strips /api/umami prefix and forwards GET to cloud.umami.is", async () => {
    const mockFetch = vi.fn().mockResolvedValue(
      new Response("ok", { status: 200 })
    );
    vi.stubGlobal("fetch", mockFetch);

    const { GET } = await import("../../app/api/umami/route");
    const req = makeMockReq("http://localhost:3000/api/umami/script.js");
    await GET(req as never);

    expect(mockFetch).toHaveBeenCalledOnce();
    const calledUrl = mockFetch.mock.calls[0][0] as string;
    expect(calledUrl).toContain("cloud.umami.is");
    expect(calledUrl).toContain("/script.js");
    expect(calledUrl).not.toContain("/api/umami");
  });

  it("forwards POST body to cloud.umami.is", async () => {
    const mockFetch = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ ok: true }), { status: 200 })
    );
    vi.stubGlobal("fetch", mockFetch);

    const { POST } = await import("../../app/api/umami/route");
    const body = JSON.stringify({ type: "event", payload: { name: "pageview" } });
    const req = makeMockReq("http://localhost:3000/api/umami/api/send", {
      method: "POST",
      body,
      headers: { "content-type": "application/json" },
    });
    await POST(req as never);

    expect(mockFetch).toHaveBeenCalledOnce();
    const calledUrl = mockFetch.mock.calls[0][0] as string;
    expect(calledUrl).toContain("cloud.umami.is");
    expect(calledUrl).toContain("/api/send");

    const calledOptions = mockFetch.mock.calls[0][1] as RequestInit;
    expect(calledOptions.method).toBe("POST");
    expect(calledOptions.body).toBe(body);
  });

  it("returns upstream response status to caller", async () => {
    const mockFetch = vi.fn().mockResolvedValue(
      new Response("not found", { status: 404 })
    );
    vi.stubGlobal("fetch", mockFetch);

    const { GET } = await import("../../app/api/umami/route");
    const req = makeMockReq("http://localhost:3000/api/umami/missing");
    const response = await GET(req as never);

    expect(response.status).toBe(404);
  });

  it("sets host header to cloud.umami.is on upstream request", async () => {
    const mockFetch = vi.fn().mockResolvedValue(
      new Response("ok", { status: 200 })
    );
    vi.stubGlobal("fetch", mockFetch);

    const { GET } = await import("../../app/api/umami/route");
    const req = makeMockReq("http://localhost:3000/api/umami/script.js");
    await GET(req as never);

    const calledOptions = mockFetch.mock.calls[0][1] as RequestInit & { headers?: Record<string, string> };
    const headers = calledOptions.headers as Record<string, string>;
    expect(headers?.host ?? headers?.Host).toBe("cloud.umami.is");
  });

  it("preserves query string when forwarding to upstream", async () => {
    const mockFetch = vi.fn().mockResolvedValue(
      new Response("ok", { status: 200 })
    );
    vi.stubGlobal("fetch", mockFetch);

    const { GET } = await import("../../app/api/umami/route");
    const req = makeMockReq("http://localhost:3000/api/umami/script.js?v=2");
    await GET(req as never);

    const calledUrl = mockFetch.mock.calls[0][0] as string;
    expect(calledUrl).toContain("v=2");
  });
});
