export type ShareOutcome = "native" | "clipboard" | "error";

export async function shareResult(url: string, title?: string): Promise<ShareOutcome> {
  try {
    if (typeof navigator !== "undefined" && "share" in navigator) {
      await (navigator as Navigator).share({ url, title });
      return "native";
    }
    if (typeof navigator !== "undefined" && "clipboard" in navigator) {
      await (navigator as Navigator).clipboard.writeText(url);
      return "clipboard";
    }
    return "error";
  } catch {
    return "error";
  }
}
