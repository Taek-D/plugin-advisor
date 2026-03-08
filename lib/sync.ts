import type { HistoryEntry, Favorite } from "./types";

const MAX_HISTORY = 50;

// --- History ---

function getAllHistory(): HistoryEntry[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem("plugin-advisor-history");
  if (!raw) return [];
  try {
    return JSON.parse(raw) as HistoryEntry[];
  } catch {
    return [];
  }
}

function saveHistory(entry: Omit<HistoryEntry, "id" | "date">): HistoryEntry {
  const newEntry: HistoryEntry = {
    ...entry,
    id: crypto.randomUUID(),
    date: new Date().toISOString(),
  };

  if (typeof window !== "undefined") {
    const raw = localStorage.getItem("plugin-advisor-history");
    const existing: HistoryEntry[] = raw ? (JSON.parse(raw) as HistoryEntry[]) : [];
    const updated = [newEntry, ...existing].slice(0, MAX_HISTORY);
    localStorage.setItem("plugin-advisor-history", JSON.stringify(updated));
  }

  return newEntry;
}

function deleteHistory(id: string): void {
  if (typeof window === "undefined") return;
  const raw = localStorage.getItem("plugin-advisor-history");
  if (raw) {
    const existing = JSON.parse(raw) as HistoryEntry[];
    const updated = existing.filter((h) => h.id !== id);
    localStorage.setItem("plugin-advisor-history", JSON.stringify(updated));
  }
}

// --- Favorites ---

function getAllFavorites(): Favorite[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem("plugin-advisor-favorites");
  if (!raw) return [];
  try {
    return JSON.parse(raw) as Favorite[];
  } catch {
    return [];
  }
}

function saveFavorite(name: string, pluginIds: string[]): Favorite {
  const newFav: Favorite = {
    id: crypto.randomUUID(),
    name,
    pluginIds,
    createdAt: new Date().toISOString(),
  };

  if (typeof window !== "undefined") {
    const raw = localStorage.getItem("plugin-advisor-favorites");
    const existing: Favorite[] = raw ? (JSON.parse(raw) as Favorite[]) : [];
    const updated = [newFav, ...existing];
    localStorage.setItem("plugin-advisor-favorites", JSON.stringify(updated));
  }

  return newFav;
}

function deleteFavorite(id: string): void {
  if (typeof window === "undefined") return;
  const raw = localStorage.getItem("plugin-advisor-favorites");
  if (raw) {
    const existing = JSON.parse(raw) as Favorite[];
    const updated = existing.filter((f) => f.id !== id);
    localStorage.setItem("plugin-advisor-favorites", JSON.stringify(updated));
  }
}

// --- Exported sync objects ---

export const syncedHistory = {
  getAll: getAllHistory,
  save: saveHistory,
  delete: deleteHistory,
};

export const syncedFavorites = {
  getAll: getAllFavorites,
  save: saveFavorite,
  delete: deleteFavorite,
};
