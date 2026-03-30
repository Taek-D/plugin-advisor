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
  checkRateLimit: vi.fn(() => ({ allowed: true, remaining: 2 })),
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
import { POST } from "@/app/api/newsletter/route";
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
describe("POST /api/newsletter", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(checkRateLimit).mockReturnValue({ allowed: true, remaining: 2 });
  });

  it("201 — valid email upserts to Supabase", async () => {
    const upsertMock = vi.fn().mockResolvedValue({ error: null });
    vi.mocked(getSupabaseAdminClient).mockReturnValue({
      from: vi.fn().mockReturnValue({ upsert: upsertMock }),
    } as never);

    const res = await POST(makeReq({ email: "user@example.com" }));
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body).toEqual({ ok: true });
    expect(upsertMock).toHaveBeenCalledWith(
      { email: "user@example.com", source: "landing", confirmed: false },
      { onConflict: "email", ignoreDuplicates: true }
    );
  });

  it("201 — email normalized to lowercase before upsert", async () => {
    const upsertMock = vi.fn().mockResolvedValue({ error: null });
    vi.mocked(getSupabaseAdminClient).mockReturnValue({
      from: vi.fn().mockReturnValue({ upsert: upsertMock }),
    } as never);

    const res = await POST(makeReq({ email: "User@Example.COM" }));
    expect(res.status).toBe(201);
    expect(upsertMock).toHaveBeenCalledWith(
      expect.objectContaining({ email: "user@example.com" }),
      expect.anything()
    );
  });

  it("400 — empty email", async () => {
    vi.mocked(getSupabaseAdminClient).mockReturnValue({
      from: vi.fn().mockReturnValue({ upsert: vi.fn() }),
    } as never);

    const res = await POST(makeReq({ email: "" }));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toMatch(/이메일/);
  });

  it("400 — invalid email format", async () => {
    vi.mocked(getSupabaseAdminClient).mockReturnValue({
      from: vi.fn().mockReturnValue({ upsert: vi.fn() }),
    } as never);

    const res = await POST(makeReq({ email: "not-an-email" }));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toMatch(/이메일/);
  });

  it("201 — duplicate email still returns success (upsert ignoreDuplicates)", async () => {
    // Supabase upsert with ignoreDuplicates returns no error even for duplicates
    const upsertMock = vi.fn().mockResolvedValue({ error: null });
    vi.mocked(getSupabaseAdminClient).mockReturnValue({
      from: vi.fn().mockReturnValue({ upsert: upsertMock }),
    } as never);

    // First subscription
    await POST(makeReq({ email: "dup@example.com" }));
    // Second subscription with same email
    const res = await POST(makeReq({ email: "dup@example.com" }));
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body).toEqual({ ok: true });
  });

  it("429 — rate limit exceeded", async () => {
    vi.mocked(checkRateLimit).mockReturnValue({ allowed: false, remaining: 0 });
    vi.mocked(getSupabaseAdminClient).mockReturnValue({
      from: vi.fn().mockReturnValue({ upsert: vi.fn() }),
    } as never);

    const res = await POST(makeReq({ email: "user@example.com" }));
    expect(res.status).toBe(429);
    const body = await res.json();
    expect(body.error).toBeTruthy();
  });

  it("503 — Supabase not configured", async () => {
    vi.mocked(getSupabaseAdminClient).mockImplementation(() => {
      throw new SupabaseNotConfiguredError();
    });

    const res = await POST(makeReq({ email: "user@example.com" }));
    expect(res.status).toBe(503);
    const body = await res.json();
    expect(body.error).toBeTruthy();
  });
});
