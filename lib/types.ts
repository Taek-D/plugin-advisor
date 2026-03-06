export type Plugin = {
  id: string;
  name: string;
  tag: string;
  color: string;
  desc: string;
  longDesc: string;
  url: string;
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
