import "server-only";

import type {
  AdminSuggestionPatch,
  PluginSuggestion,
  PluginSuggestionPayload,
} from "./types";
import {
  filterPluginSuggestions,
  normalizeGitHubRepo,
  type PluginSuggestionFilters,
} from "./plugin-suggestions";
import { getSupabaseAdminClient } from "./supabase-admin";

type SuggestionRow = PluginSuggestion;
type SuggestionInsertRow = {
  plugin_name: string | null;
  repository_url: string;
  normalized_repo: string | null;
  reason: string;
  submitter_name: string | null;
  contact: string | null;
  source_page: string | null;
};

type SuggestionUpdateRow = {
  status: PluginSuggestion["status"];
  admin_notes: string | null;
  reviewed_at: string | null;
};

type QueryError = {
  message: string;
} | null;

type SelectSingleResult = Promise<{
  data: SuggestionRow | null;
  error: QueryError;
}>;

type SelectManyResult = Promise<{
  data: SuggestionRow[] | null;
  error: QueryError;
}>;

type SuggestionTable = {
  insert: (values: SuggestionInsertRow) => {
    select: (columns: string) => {
      single: () => SelectSingleResult;
    };
  };
  select: (columns: string) => {
    order: (column: string, options: { ascending: boolean }) => SelectManyResult;
  };
  update: (values: SuggestionUpdateRow) => {
    eq: (column: string, value: string) => {
      select: (columns: string) => {
        single: () => SelectSingleResult;
      };
    };
  };
};

export async function createPluginSuggestion(
  payload: PluginSuggestionPayload
): Promise<PluginSuggestion> {
  const client = getSupabaseAdminClient();
  const table = client.from("plugin_suggestions") as unknown as SuggestionTable;

  const { data, error } = await table
    .insert({
      plugin_name: payload.pluginName ?? null,
      repository_url: payload.repositoryUrl,
      normalized_repo: normalizeGitHubRepo(payload.repositoryUrl),
      reason: payload.reason,
      submitter_name: payload.submitterName ?? null,
      contact: payload.contact ?? null,
      source_page: payload.sourcePage ?? null,
    })
    .select("*")
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? "Failed to store plugin suggestion.");
  }

  return data as SuggestionRow;
}

export async function listPluginSuggestions(
  filters: PluginSuggestionFilters = {}
): Promise<PluginSuggestion[]> {
  const client = getSupabaseAdminClient();
  const table = client.from("plugin_suggestions") as unknown as SuggestionTable;

  const { data, error } = await table
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return filterPluginSuggestions((data ?? []) as SuggestionRow[], filters);
}

export async function updatePluginSuggestion(
  id: string,
  patch: AdminSuggestionPatch
): Promise<PluginSuggestion> {
  const client = getSupabaseAdminClient();
  const table = client.from("plugin_suggestions") as unknown as SuggestionTable;

  const reviewedAt = patch.status === "pending" ? null : new Date().toISOString();

  const { data, error } = await table
    .update({
      status: patch.status,
      admin_notes: patch.adminNotes ?? null,
      reviewed_at: reviewedAt,
    })
    .eq("id", id)
    .select("*")
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? "Failed to update plugin suggestion.");
  }

  return data as SuggestionRow;
}
