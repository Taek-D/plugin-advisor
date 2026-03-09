import { PLUGINS } from "./plugins";
import type { Plugin, PreflightCheck, SetupWarning } from "./types";

const GENERIC_CHECKS: PreflightCheck[] = [
  {
    id: "claude-code-ready",
    label: "Claude Code가 설치되어 있고 다시 시작할 수 있는지 확인하세요.",
    labelEn: "Make sure Claude Code is installed and you can restart it after setup.",
    required: true,
  },
  {
    id: "terminal-ready",
    label: "터미널에서 명령어를 하나씩 실행할 준비를 해두세요.",
    labelEn: "Be ready to run the commands one by one in your terminal.",
    required: true,
  },
];

function toLabelId(prefix: string, value: string) {
  return `${prefix}-${value.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
}

export function getPluginsByIds(pluginIds: string[]): Plugin[] {
  return pluginIds
    .map((id) => PLUGINS[id])
    .filter((plugin): plugin is Plugin => Boolean(plugin));
}

export function getSafeCopyPlugins(pluginIds: string[]): Plugin[] {
  return getPluginsByIds(pluginIds).filter(
    (plugin) => plugin.installMode === "safe-copy"
  );
}

export function getManualSetupPlugins(pluginIds: string[]): Plugin[] {
  return getPluginsByIds(pluginIds).filter(
    (plugin) => plugin.installMode !== "safe-copy"
  );
}

export function getSafeCopyCommands(pluginIds: string[]): string[] {
  return getSafeCopyPlugins(pluginIds).flatMap((plugin) => plugin.install);
}

export function buildPreflightChecks(pluginIds: string[]): PreflightCheck[] {
  const plugins = getPluginsByIds(pluginIds);
  const checks = [...GENERIC_CHECKS];
  const seen = new Set(checks.map((check) => check.id));

  for (const plugin of plugins) {
    for (const prerequisite of plugin.prerequisites) {
      const id = toLabelId("prerequisite", `${plugin.id}-${prerequisite}`);
      if (seen.has(id)) continue;
      checks.push({
        id,
        label: `${plugin.name}: ${prerequisite}`,
        labelEn: `${plugin.name}: ${prerequisite}`,
        required: true,
        pluginId: plugin.id,
      });
      seen.add(id);
    }

    for (const secret of plugin.requiredSecrets) {
      const id = toLabelId("secret", `${plugin.id}-${secret}`);
      if (seen.has(id)) continue;
      checks.push({
        id,
        label: `${plugin.name} 사용 전 ${secret} 준비가 필요해요.`,
        labelEn: `${plugin.name} requires ${secret} before you can use it.`,
        required: true,
        pluginId: plugin.id,
      });
      seen.add(id);
    }

    if (!plugin.platformSupport.includes("windows")) {
      const id = toLabelId("platform", `${plugin.id}-windows`);
      if (!seen.has(id)) {
        checks.push({
          id,
          label: `${plugin.name}는 Windows에서 추가 설정이 필요할 수 있어요.`,
          labelEn: `${plugin.name} may require extra setup on Windows.`,
          required: false,
          pluginId: plugin.id,
        });
        seen.add(id);
      }
    }
  }

  return checks;
}

export function buildSetupWarnings(pluginIds: string[]): SetupWarning[] {
  const warnings: SetupWarning[] = [];
  const seen = new Set<string>();

  for (const plugin of getPluginsByIds(pluginIds)) {
    if (plugin.installMode === "manual-required") {
      const id = `${plugin.id}-manual`;
      if (!seen.has(id)) {
        warnings.push({
          id,
          message: `${plugin.name}는 예시 경로나 수동 치환값이 있어 단계별로 확인하면서 설치해야 해요.`,
          messageEn: `${plugin.name} includes example paths or placeholders, so install it step by step.`,
          level: "warning",
          pluginId: plugin.id,
        });
        seen.add(id);
      }
    }

    if (plugin.installMode === "external-setup") {
      const id = `${plugin.id}-external`;
      if (!seen.has(id)) {
        warnings.push({
          id,
          message: `${plugin.name}는 계정 연결이나 외부 설정이 끝나야 제대로 동작해요.`,
          messageEn: `${plugin.name} needs external account or environment setup before it works properly.`,
          level: "info",
          pluginId: plugin.id,
        });
        seen.add(id);
      }
    }

    if (plugin.verificationStatus === "unverified") {
      const id = `${plugin.id}-verification`;
      if (!seen.has(id)) {
        warnings.push({
          id,
          message: `${plugin.name}는 아직 설치 검증이 충분하지 않아 기본 세트에서 보수적으로 다뤄요.`,
          messageEn: `${plugin.name} is not fully verified yet, so it is treated conservatively in starter flows.`,
          level: "warning",
          pluginId: plugin.id,
        });
        seen.add(id);
      }
    }
  }

  return warnings;
}
