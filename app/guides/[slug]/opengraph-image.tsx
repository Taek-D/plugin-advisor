import { ImageResponse } from "next/og";
import { STARTER_GUIDES } from "@/lib/guides";
import { OG_SIZE, OG_COLORS, OG_FOOTER_TEXT, loadSpaceGrotesk } from "@/lib/og-utils";

export const runtime = "edge";
export const alt = "Plugin Advisor — Guide";
export const size = OG_SIZE;
export const contentType = "image/png";

export function generateStaticParams() {
  return STARTER_GUIDES.map((guide) => ({ slug: guide.slug }));
}

export default async function Image({ params }: { params: { slug: string } }) {
  const guide = STARTER_GUIDES.find((g) => g.slug === params.slug);
  const font = await loadSpaceGrotesk();

  const title = guide?.titleEn ?? "Starter Guides";
  const rawSummary = guide?.summaryEn ?? "Practical guides for Claude Code plugin setup.";
  const summary = rawSummary.length > 120 ? rawSummary.slice(0, 120) + "..." : rawSummary;

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
            padding: "0 80px",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 40,
              fontWeight: 700,
              color: OG_COLORS.text,
              fontFamily: "Space Grotesk",
              textAlign: "center",
              maxWidth: 900,
            }}
          >
            {title}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 20,
              color: OG_COLORS.muted,
              fontFamily: "Space Grotesk",
              marginTop: 16,
              textAlign: "center",
              maxWidth: 900,
            }}
          >
            {summary}
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
