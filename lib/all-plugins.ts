import "server-only";

import { PLUGINS } from "./plugins";
import { getCustomPlugins } from "./plugin-store";
import type { Plugin } from "./types";

export async function getAllPlugins(): Promise<Record<string, Plugin>> {
  const { added, deleted } = await getCustomPlugins();
  const base: Record<string, Plugin> = { ...PLUGINS };

  for (const custom of added) {
    base[custom.id] = custom;
  }

  for (const id of deleted) {
    delete base[id];
  }

  return base;
}
