import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        main: "#080810",
        card: "#0B0B1C",
        "border-main": "#181830",
        "text-main": "#DDDDF0",
        "text-sub": "#555566",
        accent: "#3030FF",
        success: "#00C896",
        warning: "#FFAA00",
        error: "#FF4444",
      },
      fontFamily: {
        heading: ["var(--font-syne)", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0", transform: "translateY(5px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        blink: {
          "0%, 80%, 100%": { opacity: "0.15" },
          "40%": { opacity: "1" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.3s ease",
        blink: "blink 1.2s infinite",
      },
    },
  },
  plugins: [],
};

export default config;
