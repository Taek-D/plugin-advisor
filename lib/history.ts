import type { HistoryEntry } from "./types";

const STORAGE_KEY = "plugin-advisor-history";
const MAX_ENTRIES = 50;

export async function getHistory(): Promise<HistoryEntry[]> {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as HistoryEntry[];
  } catch {
    return [];
  }
}

export async function saveHistory(
  entry: Omit<HistoryEntry, "id" | "date">
): Promise<HistoryEntry> {
  const history = await getHistory();
  const newEntry: HistoryEntry = {
    ...entry,
    id: crypto.randomUUID(),
    date: new Date().toISOString(),
  };
  const updated = [newEntry, ...history].slice(0, MAX_ENTRIES);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return newEntry;
}

export async function deleteHistory(id: string): Promise<void> {
  const history = await getHistory();
  const updated = history.filter((h) => h.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export async function clearHistory(): Promise<void> {
  localStorage.removeItem(STORAGE_KEY);
}
