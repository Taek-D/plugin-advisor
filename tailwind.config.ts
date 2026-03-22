import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // shadcn/ui CSS variable-based colors
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },

        // Legacy custom color tokens (keep for backward compatibility)
        main: "hsl(var(--background))",
        "border-main": "hsl(var(--border))",
        "text-main": "hsl(var(--foreground))",
        "text-sub": "hsl(var(--muted-foreground))",
        "text-muted": "hsl(var(--muted-foreground))",
        "text-dim": "hsl(var(--text-dim))",
        "text-faint": "hsl(var(--text-faint))",
        success: "hsl(var(--primary))",
        warning: "hsl(var(--warning))",
        "ai-accent": {
          DEFAULT: "hsl(var(--ai-accent))",
          strong: "hsl(var(--ai-accent-strong))",
        },
        error: "hsl(var(--destructive))",
        "bg-error-subtle": "hsl(var(--bg-error-subtle))",
        "border-error-subtle": "hsl(var(--border-error-subtle))",
        "bg-warning-subtle": "hsl(var(--bg-warning-subtle))",
        "border-warning-subtle": "hsl(var(--border-warning-subtle))",
        "overlay-subtle": "hsl(var(--overlay-subtle))",
        "overlay-border": "hsl(var(--overlay-border))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["Pretendard Variable", "var(--font-space-grotesk)", "system-ui", "sans-serif"],
        heading: ["var(--font-space-grotesk)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
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
        "float-up": {
          from: { transform: "translateY(10px)", opacity: "0" },
          to: { transform: "translateY(0)", opacity: "1" },
        },
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
        blink: "blink 1.2s infinite",
        "float-up": "float-up 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
