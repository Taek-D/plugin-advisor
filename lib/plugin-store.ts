import "server-only";

import type { Plugin } from "./types";
import { getSupabaseAdminClient } from "./supabase-admin";

type CustomPluginRow = {
  id: string;
  action: "added" | "deleted";
  plugin_data: Plugin | null;
  created_at: string;
};

type CustomPluginStore = {
  added: Plugin[];
  deleted: string[];
};

type QueryResult<T> = Promise<{
  data: T | null;
  error: { message: string; code?: string } | null;
}>;

type CustomPluginsTable = {
  select: (columns: string) => QueryResult<CustomPluginRow[]>;
  insert: (values: { id: string; action: string; plugin_data: Plugin | null }) => QueryResult<null>;
  upsert: (values: { id: string; action: string; plugin_data: Plugin | null }) => QueryResult<null>;
  delete: () => {
    eq: (column: string, value: string) => {
      eq: (column: string, value: string) => QueryResult<null>;
    } & QueryResult<null>;
  };
};

function getTable(): CustomPluginsTable {
  const client = getSupabaseAdminClient();
  return client.from("custom_plugins") as unknown as CustomPluginsTable;
}

export async function getCustomPlugins(): Promise<CustomPluginStore> {
  try {
    const table = getTable();
    const { data, error } = await table.select("*");

    if (error || !data) {
      return { added: [], deleted: [] };
    }

    const added: Plugin[] = [];
    const deleted: string[] = [];

    for (const row of data) {
      if (row.action === "added" && row.plugin_data) {
        added.push(row.plugin_data);
      } else if (row.action === "deleted") {
        deleted.push(row.id);
      }
    }

    return { added, deleted };
  } catch {
    return { added: [], deleted: [] };
  }
}

export async function addCustomPlugin(plugin: Plugin): Promise<Plugin> {
  const table = getTable();

  const { error } = await table.insert({
    id: plugin.id,
    action: "added",
    plugin_data: plugin,
  });

  if (error) {
    if (error.code === "23505") {
      throw new Error(`플러그인 ID "${plugin.id}"가 이미 존재합니다.`);
    }
    throw new Error(error.message);
  }

  return plugin;
}

export async function deletePlugin(id: string, isCustom: boolean): Promise<void> {
  const table = getTable();

  if (isCustom) {
    const { error } = await table.delete().eq("id", id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await table.upsert({
      id,
      action: "deleted",
      plugin_data: null,
    });
    if (error) throw new Error(error.message);
  }
}

export async function restorePlugin(id: string): Promise<void> {
  const table = getTable();

  const { error } = await table.delete().eq("id", id).eq("action", "deleted");
  if (error) throw new Error(error.message);
}
