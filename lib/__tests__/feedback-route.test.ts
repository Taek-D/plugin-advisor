import { describe, it, expect, vi, beforeEach } from "vitest";

// ---------------------------------------------------------------------------
// Mock next/server — broken node_modules workaround (established pattern)
// ---------------------------------------------------------------------------
vi.mock("next/server", () => {
  class MockNextResponse {
    status: number;
    _body: unknown;

    constructor(body: unknown, init?: { status?: number }) {
      this._body = body;
      this.status = init?.status ?? 200;
    }

    async json() {
      return this._body;
    }

    static json(body: unknown, init?: { status?: number }) {
      return new MockNextResponse(body, init);
    }
  }

  class MockNextRequest {
    _body: unknown;
    headers: Map<string, string>;

    constructor(body: unknown, headers: Record<string, string> = {}) {
      this._body = body;
      this.headers = new Map(Object.entries(headers));
    }

    async json() {
      return this._body;
    }
  }

  return { NextRequest: MockNextRequest, NextResponse: MockNextResponse };
});

// ---------------------------------------------------------------------------
// Mock dependencies
// ---------------------------------------------------------------------------
vi.mock("@/lib/rate-limit", () => ({
  checkRateLimit: vi.fn(() => ({ allowed: true, remaining: 4 })),
  cleanupExpiredEntries: vi.fn(),
}));

vi.mock("@/lib/supabase-admin", () => {
  class SupabaseNotConfiguredError extends Error {
    constructor() {
      super("Supabase is not configured.");
      this.name = "SupabaseNotConfiguredError";
    }
  }

  return {
    SupabaseNotConfiguredError,
    getSupabaseAdminClient: vi.fn(),
  };
});

// ---------------------------------------------------------------------------
// Import after mocks
// ---------------------------------------------------------------------------
import { POST } from "@/app/api/feedback/route";
import { checkRateLimit } from "@/lib/rate-limit";
import { getSupabaseAdminClient, SupabaseNotConfiguredError } from "@/lib/supabase-admin";

// Helper to build a mock NextRequest-compatible object
function makeReq(body: unknown) {
  return {
    json: async () => body,
    headers: new Map(Object.entries({ "x-real-ip": "1.2.3.4" })),
  } as unknown as import("next/server").NextRequest;
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------
describe("POST /api/feedback", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(checkRateLimit).mockReturnValue({ allowed: true, remaining: 4 });
  });

  it("201 — valid body inserts to Supabase", async () => {
    const insertMock = vi.fn().mockResolvedValue({ error: null });
    vi.mocked(getSupabaseAdminClient).mockReturnValue({
      from: vi.fn().mockReturnValue({ insert: insertMock }),
    } as never);

    const res = await POST(makeReq({ type: "bug", message: "Something broke", page: "/" }));
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body).toEqual({ ok: true });
    expect(insertMock).toHaveBeenCalledWith({
      page: "/",
      message: "Something broke",
      type: "bug",
      rating: null,
    });
  });

  it("400 — empty message returns error about length", async () => {
    vi.mocked(getSupabaseAdminClient).mockReturnValue({
      from: vi.fn().mockReturnValue({ insert: vi.fn() }),
    } as never);

    const res = await POST(makeReq({ type: "bug", message: "", page: "/" }));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toMatch(/1~500/);
  });

  it("400 — message exceeding 500 chars", async () => {
    vi.mocked(getSupabaseAdminClient).mockReturnValue({
      from: vi.fn().mockReturnValue({ insert: vi.fn() }),
    } as never);

    const res = await POST(makeReq({ type: "bug", message: "x".repeat(501), page: "/" }));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toMatch(/1~500/);
  });

  it("400 — invalid type", async () => {
    vi.mocked(getSupabaseAdminClient).mockReturnValue({
      from: vi.fn().mockReturnValue({ insert: vi.fn() }),
    } as never);

    const res = await POST(makeReq({ type: "invalid", message: "Valid message", page: "/" }));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toMatch(/유형/);
  });

  it("429 — rate limit exceeded", async () => {
    vi.mocked(checkRateLimit).mockReturnValue({ allowed: false, remaining: 0 });
    vi.mocked(getSupabaseAdminClient).mockReturnValue({
      from: vi.fn().mockReturnValue({ insert: vi.fn() }),
    } as never);

    const res = await POST(makeReq({ type: "feature", message: "Add feature", page: "/" }));
    expect(res.status).toBe(429);
    const body = await res.json();
    expect(body.error).toBeTruthy();
  });

  it("503 — Supabase not configured", async () => {
    vi.mocked(getSupabaseAdminClient).mockImplementation(() => {
      throw new SupabaseNotConfiguredError();
    });

    const res = await POST(makeReq({ type: "other", message: "Some feedback", page: "/" }));
    expect(res.status).toBe(503);
    const body = await res.json();
    expect(body.error).toBeTruthy();
  });
});
