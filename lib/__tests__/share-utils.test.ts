import { describe, expect, it, vi, afterEach } from "vitest";
import { shareResult } from "../share-utils";
import type { ShareOutcome } from "../share-utils";

describe("shareResult", () => {
  const originalNavigator = global.navigator;

  afterEach(() => {
    vi.restoreAllMocks();
    // Restore navigator
    Object.defineProperty(global, "navigator", {
      value: originalNavigator,
      writable: true,
      configurable: true,
    });
  });

  it('returns "native" when navigator.share succeeds', async () => {
    const shareMock = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(global, "navigator", {
      value: { share: shareMock },
      writable: true,
      configurable: true,
    });
    const result: ShareOutcome = await shareResult("https://example.com", "Title");
    expect(result).toBe("native");
    expect(shareMock).toHaveBeenCalledWith({ url: "https://example.com", title: "Title" });
  });

  it('returns "clipboard" when no share API and clipboard succeeds', async () => {
    const writeTextMock = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(global, "navigator", {
      value: { clipboard: { writeText: writeTextMock } },
      writable: true,
      configurable: true,
    });
    const result: ShareOutcome = await shareResult("https://example.com");
    expect(result).toBe("clipboard");
    expect(writeTextMock).toHaveBeenCalledWith("https://example.com");
  });

  it('returns "error" when navigator.share throws (user dismissed)', async () => {
    const shareMock = vi.fn().mockRejectedValue(new DOMException("Abort", "AbortError"));
    Object.defineProperty(global, "navigator", {
      value: { share: shareMock },
      writable: true,
      configurable: true,
    });
    const result: ShareOutcome = await shareResult("https://example.com");
    expect(result).toBe("error");
  });

  it('returns "error" when both share and clipboard fail', async () => {
    Object.defineProperty(global, "navigator", {
      value: {},
      writable: true,
      configurable: true,
    });
    const result: ShareOutcome = await shareResult("https://example.com");
    expect(result).toBe("error");
  });
});
