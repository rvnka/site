/**
 * Tailwind Config
 *
 * Minimized configuration - most theme values moved to globals.css CSS variables.
 * Only keeping dynamic computed values and plugin configurations here.
 */
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
      },
      colors: {
        bg: "var(--bg)",
        card: "var(--card)",
        fg: "var(--fg)",
        muted: "var(--muted)",
        faint: "var(--faint)",
        accent: "var(--accent)",
        accent2: "var(--accent2)",
        border: "var(--border)",
        stone: {
          50: "#fafaf9",
          100: "#f5f5f4",
          200: "#e7e5e4",
          300: "#d6d3d1",
          400: "#a8a29e",
          500: "#78716c",
          600: "#57534e",
          700: "#44403c",
          800: "#292524",
          900: "#1c1917",
          950: "#0c0a09",
        },
        blue: { 400: "#60a5fa", 500: "#3b82f6", 600: "#2563eb" },
      },
      borderRadius: {
        card: "14px",
        btn: "10px",
        toggle: "12px",
        avatar: "50%",
      },
      boxShadow: {
        sm: "0 1px 3px var(--shadow)",
        md: "0 4px 16px var(--shadow)",
        lg: "0 8px 28px var(--shadow-h)",
        xl: "0 12px 32px var(--shadow-h)",
      },
      transitionTimingFunction: {
        ease: "cubic-bezier(.4, 0, .2, 1)",
      },
      typography: () => ({
        DEFAULT: {
          css: {
            "--tw-prose-body": "var(--muted)",
            "--tw-prose-headings": "var(--fg)",
            "--tw-prose-links": "var(--accent)",
            "--tw-prose-bold": "var(--fg)",
            "--tw-prose-counters": "var(--muted)",
            "--tw-prose-bullets": "var(--border)",
            "--tw-prose-hr": "var(--border)",
            "--tw-prose-quotes": "var(--fg)",
            "--tw-prose-quote-borders": "var(--accent)",
            "--tw-prose-captions": "var(--faint)",
            "--tw-prose-code": "var(--fg)",
            "--tw-prose-pre-code": "var(--fg)",
            "--tw-prose-pre-bg": "var(--card)",
            "--tw-prose-th-borders": "var(--border)",
            "--tw-prose-td-borders": "var(--border)",
            "font-family": "var(--font-sans), system-ui, sans-serif",
            "line-height": "1.8",
          },
        },
      }),
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
