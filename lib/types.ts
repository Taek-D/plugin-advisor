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
  analysisMode?: AnalysisMode;
  summary?: string;
  warning?: string | null;
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

export type AnalysisMode = "keyword" | "ai";

// P2-2: Reviews
export type Review = {
  id: string;
  plugin_id: string;
  user_id: string;
  user_name: string;
  user_avatar: string | null;
  rating: number;
  comment: string;
  created_at: string;
  updated_at: string;
};

export type ReviewStats = {
  avgRating: number;
  totalCount: number;
};
