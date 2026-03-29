export const OG_SIZE = { width: 1200, height: 630 };

export const OG_COLORS = {
  background: "#0f172a",
  text: "#f8fafc",
  muted: "#94a3b8",
  accent: "#6366f1",
};

export const OG_FOOTER_TEXT = "pluginadvisor.cc";

export async function loadSpaceGrotesk() {
  const res = await fetch(
    "https://fonts.gstatic.com/s/spacegrotesk/v16/V8mDoQDjQSkFtoMM3T6r8E7mPbF4Cw.woff"
  );
  const data = await res.arrayBuffer();
  return {
    name: "Space Grotesk",
    data,
    style: "normal" as const,
    weight: 700 as const,
  };
}
