import {
  Layers,
  GitBranch,
  Code,
  FlaskConical,
  BookOpen,
  Database,
  Shield,
  Plug,
  Palette,
  Server,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { PluginCategory } from "./types";

const CATEGORY_ICONS: Record<PluginCategory, LucideIcon> = {
  orchestration: Layers,
  workflow: GitBranch,
  "code-quality": Code,
  testing: FlaskConical,
  documentation: BookOpen,
  data: Database,
  security: Shield,
  integration: Plug,
  "ui-ux": Palette,
  devops: Server,
};

export function getCategoryIcon(category: PluginCategory): LucideIcon {
  return CATEGORY_ICONS[category] ?? Plug;
}

export type Grade = "Excellent" | "Good" | "Fair" | "Poor";

export function getGrade(score: number): Grade {
  if (score >= 80) return "Excellent";
  if (score >= 60) return "Good";
  if (score >= 40) return "Fair";
  return "Poor";
}

export const GRADE_COLORS: Record<Grade, string> = {
  Excellent: "#22c55e",
  Good: "#3b82f6",
  Fair: "#eab308",
  Poor: "#ef4444",
};
