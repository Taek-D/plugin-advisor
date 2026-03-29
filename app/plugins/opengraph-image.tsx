import { ImageResponse } from "next/og";
import { OG_SIZE, OG_COLORS, OG_FOOTER_TEXT, loadSpaceGrotesk } from "@/lib/og-utils";

export const runtime = "edge";
export const alt = "Plugin Advisor — Plugin Catalog";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image() {
  const font = await loadSpaceGrotesk();

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          backgroundColor: OG_COLORS.background,
        }}
      >
        {/* Top accent bar */}
        <div style={{ display: "flex", width: "100%", height: 6, backgroundColor: OG_COLORS.accent }} />

        {/* Center content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            flex: 1,
            gap: 16,
          }}
        >
          <div style={{ display: "flex", fontSize: 40, fontWeight: 700, color: OG_COLORS.text, fontFamily: "Space Grotesk" }}>
            Plugin Catalog
          </div>
          <div style={{ display: "flex", fontSize: 22, color: OG_COLORS.muted, fontFamily: "Space Grotesk" }}>
            Browse all verified Claude Code plugins and MCP servers
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            paddingBottom: 12,
          }}
        >
          <span style={{ fontSize: 16, color: OG_COLORS.muted, fontFamily: "Space Grotesk" }}>
            {OG_FOOTER_TEXT}
          </span>
        </div>

        {/* Bottom accent bar */}
        <div style={{ display: "flex", width: "100%", height: 6, backgroundColor: OG_COLORS.accent }} />
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [font],
    }
  );
}
