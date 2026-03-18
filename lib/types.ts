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

export type OfficialStatus = "official" | "community" | "unknown";
export type VerificationStatus = "verified" | "partial" | "unverified";
export type PluginDifficulty = "beginner" | "intermediate" | "advanced";
export type PlatformSupport = "windows" | "mac" | "linux";
export type InstallMode = "safe-copy" | "manual-required" | "external-setup";
export type MaintenanceStatus = "active" | "unclear" | "stale";
export type ItemType = "mcp" | "plugin";

export type PreflightCheck = {
  id: string;
  label: string;
  labelEn: string;
  required: boolean;
  pluginId?: string;
};

export type SetupWarning = {
  id: string;
  message: string;
  messageEn: string;
  level: "info" | "warning";
  pluginId?: string;
};

export type NotRecommendedPlugin = {
  pluginId: string;
  reason: string;
  reasonEn: string;
};

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
  officialStatus: OfficialStatus;
  verificationStatus: VerificationStatus;
  difficulty: PluginDifficulty;
  prerequisites: string[];
  requiredSecrets: string[];
  platformSupport: PlatformSupport[];
  installMode: InstallMode;
  maintenanceStatus: MaintenanceStatus;
  bestFor: string[];
  avoidFor: string[];
  type: ItemType;
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
  recommendedPackId?: string;
  confidenceLevel?: "high" | "medium" | "low";
  preflightChecks?: PreflightCheck[];
  setupWarnings?: SetupWarning[];
  notRecommended?: NotRecommendedPlugin[];
  complements?: Array<{ pluginId: string; reason: string }>;
  redundancies?: Array<{ ids: string[]; msg: string }>;
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
  recommendedPackId?: string;
  confidenceLevel?: "high" | "medium" | "low";
  preflightChecks?: PreflightCheck[];
  setupWarnings?: SetupWarning[];
  notRecommended?: NotRecommendedPlugin[];
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

export type LeadRequest = {
  name: string;
  contact: string;
  useCase: string;
  currentProblem: string;
  desiredPackage:
    | "personal-setup"
    | "project-package"
    | "team-package";
};

export type PluginSuggestionStatus =
  | "pending"
  | "hold"
  | "approved"
  | "rejected";

export type PluginSuggestion = {
  id: string;
  created_at: string;
  status: PluginSuggestionStatus;
  plugin_name: string | null;
  repository_url: string;
  normalized_repo: string | null;
  reason: string;
  submitter_name: string | null;
  contact: string | null;
  source_page: string | null;
  admin_notes: string | null;
  reviewed_at: string | null;
};

export type PluginSuggestionPayload = {
  repositoryUrl: string;
  reason: string;
  pluginName?: string;
  submitterName?: string;
  contact?: string;
  sourcePage?: string;
};

export type AdminSuggestionPatch = {
  status: PluginSuggestionStatus;
  adminNotes?: string;
};

