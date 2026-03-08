export type PluginCategory =
  | "orchestration"
  | "workflow"
  | "code-quality"
  | "testing"
  | "documentation"
  | "data"
  | "security"
  | "integration"
  | "ui-ux"
  | "devops";

export type Plugin = {
  id: string;
  name: string;
  tag: string;
  color: string;
  desc: string;
  longDesc: string;
  url: string;
  githubRepo: string | null;
  category: PluginCategory;
  install: string[];
  features: string[];
  conflicts: string[];
  keywords: string[];
};

export type Recommendation = {
  pluginId: string;
  priority: number;
  reason: string;
  matchedKeywords: string[];
};

export type AnalysisResult = {
  summary: string;
  recommendations: Recommendation[];
  warning: string | null;
  inputText: string;
};

export type ConflictWarning = {
  ids: string[];
  msg: string;
};

export type HistoryEntry = {
  id: string;
  date: string;
  inputText: string;
  inputMode: "text" | "file" | "github";
  recommendations: Recommendation[];
  selectedIds: string[];
};

export type Favorite = {
  id: string;
  name: string;
  pluginIds: string[];
  createdAt: string;
};

export type VersionInfo = {
  pluginId: string;
  latestVersion: string | null;
  publishedAt: string | null;
  releaseUrl: string | null;
};
