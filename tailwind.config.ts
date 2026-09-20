import type { Config } from "tailwindcss";

/**
 * Brand colors are declared once as CSS variables (app/globals.css) using
 * space-separated RGB channels, so Tailwind opacity modifiers keep working
 * (e.g. `bg-navy/80`). Never hard-code the hex values in components.
 */
const withAlpha = (name: string) => `rgb(var(--${name}) / <alpha-value>)`;

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: withAlpha("navy"), // #1A365D primary / dark
        gold: withAlpha("gold"), // #D4AF37 accent / luxury
        sky: withAlpha("sky"), // #4A90E2 secondary
        surface: withAlpha("surface"), // #F8F9FA background light
        ink: withAlpha("ink"), // #0F172A text primary
        muted: withAlpha("muted"), // #64748B text muted
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgb(15 23 42 / 0.06), 0 12px 32px -12px rgb(26 54 93 / 0.25)",
        lift: "0 2px 4px rgb(15 23 42 / 0.08), 0 24px 48px -16px rgb(26 54 93 / 0.4)",
        glow: "0 0 0 1px rgb(212 175 55 / 0.6), 0 8px 32px rgb(212 175 55 / 0.45)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-14px)" },
        },
        glow: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgb(212 175 55 / 0.55)" },
          "50%": { boxShadow: "0 0 0 14px rgb(212 175 55 / 0)" },
        },
        ripple: {
          "0%": { transform: "scale(0)", opacity: "0.55" },
          "100%": { transform: "scale(1)", opacity: "0" },
        },
        draw: {
          to: { strokeDashoffset: "0" },
        },
      },
      animation: {
        float: "float 7s ease-in-out infinite",
        "float-slow": "float 10s ease-in-out infinite",
        glow: "glow 2.6s ease-out infinite",
        ripple: "ripple 0.7s ease-out forwards",
        draw: "draw 2.4s cubic-bezier(.65,0,.35,1) 0.3s forwards",
      },
    },
  },
  plugins: [],
};

export default config;
