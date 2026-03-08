import type { HistoryEntry } from "./types";
import { syncedHistory } from "./sync";

const STORAGE_KEY = "plugin-advisor-history";
const MAX_ENTRIES = 50;

export function getHistory(): HistoryEntry[] {
  return syncedHistory.getAll();
}

export function saveHistory(
  entry: Omit<HistoryEntry, "id" | "date">
): HistoryEntry {
  return syncedHistory.save(entry);
}

export function deleteHistory(id: string): void {
  return syncedHistory.delete(id);
}

export function clearHistory(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}

export function readLocalHistory(): HistoryEntry[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return (JSON.parse(raw) as HistoryEntry[]).slice(0, MAX_ENTRIES);
  } catch {
    return [];
  }
}
