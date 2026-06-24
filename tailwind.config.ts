import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // ── Tiefenebenen (Ergonomic Mission Control) ──────────────────
        surface: {
          0: "#050f0b", // Seitenhintergrund, fast schwarz-grün
          1: "#081a13", // Sektionsfläche
          panel: "#0b2218", // Panel
          raised: "#0f2c20", // erhöht / Hover
        },
        ink: {
          DEFAULT: "#eaf4ef", // primärer Text
          muted: "#9db5ac", // sekundär
          faint: "#5e7a70", // Labels / faint
        },
        // ── Primärakzent: Mint ────────────────────────────────────────
        brand: {
          50: "#e7faf2",
          100: "#c7f2e0",
          300: "#5fe3b0",
          400: "#43d39a",
          500: "#34d399",
          600: "#1fae7c",
          700: "#15805d",
        },
        // ── Sekundär: gedämpftes Teal/Blau (neutrale Daten) ───────────
        steel: "#6ea8c4",
        // ── Risiko (sparsam) ──────────────────────────────────────────
        success: "#4cc38a",
        warning: "#e2b23c",
        danger: "#e0596a",
        slate: {
          925: "#0a2419",
          950: "#061e15",
        },
      },
      fontFamily: {
        serif: [
          "Iowan Old Style",
          "Palatino Linotype",
          "Palatino",
          "Georgia",
          "Times New Roman",
          "serif",
        ],
        sans: ["Segoe UI", "Inter", "Arial", "Helvetica", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "JetBrains Mono", "Menlo", "monospace"],
      },
      boxShadow: {
        panel: "0 40px 90px rgba(0, 0, 0, 0.45)",
        soft: "0 18px 40px rgba(0, 0, 0, 0.35)",
        glow: "0 0 0 1px rgba(95, 227, 176, 0.30), 0 0 50px rgba(52, 211, 153, 0.28)",
        mint: "0 10px 30px rgba(52, 211, 153, 0.25)",
      },
      backgroundImage: {
        grid: "linear-gradient(rgba(148, 163, 184, 0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(148, 163, 184, 0.08) 1px, transparent 1px)",
        "grid-dark":
          "linear-gradient(rgba(95, 227, 176, 0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(95, 227, 176, 0.07) 1px, transparent 1px)",
        scanlines:
          "repeating-linear-gradient(0deg, rgba(95, 227, 176, 0.05) 0px, rgba(95, 227, 176, 0.05) 1px, transparent 1px, transparent 4px)",
        "glow-tr":
          "radial-gradient(60% 50% at 85% 0%, rgba(52, 211, 153, 0.14), transparent 60%)",
      },
      keyframes: {
        "radar-sweep": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "load-pulse": {
          "0%, 100%": { opacity: "0.55", transform: "scale(0.9)" },
          "50%": { opacity: "1", transform: "scale(1.12)" },
        },
        "reveal-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "scan-down": {
          "0%": { transform: "translateY(-100%)", opacity: "0" },
          "30%": { opacity: "0.6" },
          "100%": { transform: "translateY(220%)", opacity: "0" },
        },
        "ping-soft": {
          "0%": { transform: "scale(0.8)", opacity: "0.6" },
          "80%, 100%": { transform: "scale(2.2)", opacity: "0" },
        },
        "halo": {
          "0%, 100%": { opacity: "0.18", transform: "scale(1)" },
          "50%": { opacity: "0.34", transform: "scale(1.18)" },
        },
      },
      animation: {
        "radar-sweep": "radar-sweep 4s linear infinite",
        "load-pulse": "load-pulse 2.4s ease-in-out infinite",
        "reveal-up": "reveal-up 0.5s ease-out both",
        "scan-down": "scan-down 3.5s ease-in-out infinite",
        "ping-soft": "ping-soft 2.6s ease-out infinite",
        "halo": "halo 2.8s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
