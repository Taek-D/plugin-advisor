import type { Favorite } from "./types";
import { syncedFavorites } from "./sync";

const STORAGE_KEY = "plugin-advisor-favorites";

export function getFavorites(): Favorite[] {
  return syncedFavorites.getAll();
}

export function saveFavorite(name: string, pluginIds: string[]): Favorite {
  return syncedFavorites.save(name, pluginIds);
}

export function deleteFavorite(id: string): void {
  return syncedFavorites.delete(id);
}

export function renameFavorite(id: string, name: string): void {
  if (typeof window === "undefined") return;
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) {
    const existing = JSON.parse(raw) as Favorite[];
    const updated = existing.map((f) => (f.id === id ? { ...f, name } : f));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }
}
