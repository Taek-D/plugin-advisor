import type { Favorite } from "./types";

const STORAGE_KEY = "plugin-advisor-favorites";

export async function getFavorites(): Promise<Favorite[]> {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as Favorite[];
  } catch {
    return [];
  }
}

export async function saveFavorite(
  name: string,
  pluginIds: string[]
): Promise<Favorite> {
  const favorites = await getFavorites();
  const newFav: Favorite = {
    id: crypto.randomUUID(),
    name,
    pluginIds,
    createdAt: new Date().toISOString(),
  };
  const updated = [newFav, ...favorites];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return newFav;
}

export async function deleteFavorite(id: string): Promise<void> {
  const favorites = await getFavorites();
  const updated = favorites.filter((f) => f.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export async function renameFavorite(
  id: string,
  name: string
): Promise<void> {
  const favorites = await getFavorites();
  const updated = favorites.map((f) => (f.id === id ? { ...f, name } : f));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}
