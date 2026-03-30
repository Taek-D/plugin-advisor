export type ShareOutcome = "native" | "clipboard" | "error";

export async function shareResult(url: string, title?: string): Promise<ShareOutcome> {
  try {
    if (typeof navigator !== "undefined" && "share" in navigator) {
      await navigator.share({ url, title });
      return "native";
    }
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(url);
      return "clipboard";
    }
    return "error";
  } catch {
    return "error";
  }
}
