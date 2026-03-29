import { ImageResponse } from "next/og";
import { PLUGINS } from "@/lib/plugins";
import { OG_SIZE, OG_COLORS, OG_FOOTER_TEXT, loadSpaceGrotesk } from "@/lib/og-utils";

export const runtime = "edge";
export const alt = "Plugin Advisor";
export const size = OG_SIZE;
export const contentType = "image/png";

export function generateStaticParams() {
  return Object.keys(PLUGINS).map((id) => ({ id }));
}

export default async function Image({ params }: { params: { id: string } }) {
  const plugin = PLUGINS[params.id];
  const font = await loadSpaceGrotesk();

  const name = plugin?.name ?? "Plugin Advisor";
  const tag = plugin?.tag ?? "Claude Code plugins and MCP servers";
  const typeBadge = plugin?.type === "mcp" ? "MCP Server" : "Plugin";
  const categoryBadge = plugin?.category ?? "";
  const accentColor = plugin?.color ?? OG_COLORS.accent;

  const badgeStyle = {
    display: "flex",
    borderRadius: 9999,
    border: `1px solid ${OG_COLORS.muted}`,
    padding: "6px 16px",
    fontSize: 14,
    color: OG_COLORS.muted,
    fontFamily: "Space Grotesk",
  };

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
        <div style={{ display: "flex", width: "100%", height: 6, backgroundColor: accentColor }} />

        {/* Center content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            flex: 1,
            padding: "0 80px",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 44,
              fontWeight: 700,
              color: OG_COLORS.text,
              fontFamily: "Space Grotesk",
              textAlign: "center",
            }}
          >
            {name}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 22,
              color: OG_COLORS.muted,
              fontFamily: "Space Grotesk",
              marginTop: 12,
              textAlign: "center",
            }}
          >
            {tag}
          </div>
          {plugin && (
            <div style={{ display: "flex", flexDirection: "row", gap: 12, marginTop: 24 }}>
              <div style={badgeStyle}>{typeBadge}</div>
              {categoryBadge && <div style={badgeStyle}>{categoryBadge}</div>}
            </div>
          )}
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
        <div style={{ display: "flex", width: "100%", height: 6, backgroundColor: accentColor }} />
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [font],
    }
  );
}
