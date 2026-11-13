import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        teal: {
          950: "#0b2622",
          900: "#103833",
          800: "#174C45", // Primary brand deep teal
          700: "#23635a",
          600: "#327d72",
          500: "#4C9A83", // Soft green / sage
          400: "#6eb29e",
          300: "#99ccbd",
          200: "#c5e5db",
          100: "#e5f4ef",
          50: "#f2f9f6",
        },
        cream: {
          50: "#FDFCF9",
          100: "#FAF7F2",
          200: "#F1E8DA", // Warm cream reassurance
          300: "#E6D8C2",
          400: "#D3BE9E",
        },
        surface: {
          base: "#F7F8F6", // Off-white clean canvas
          card: "#FFFFFF",
          muted: "#EFF2EE",
          border: "#E2E7E2",
          dark: "#141F1D",
        },
        brand: {
          dark: "#174C45",
          accent: "#4C9A83",
          cream: "#F1E8DA",
          canvas: "#F7F8F6",
        }
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
      },
      boxShadow: {
        subtle: "0 1px 3px 0 rgba(23, 76, 69, 0.05), 0 1px 2px -1px rgba(23, 76, 69, 0.05)",
        card: "0 4px 6px -1px rgba(23, 76, 69, 0.06), 0 2px 4px -2px rgba(23, 76, 69, 0.04)",
        float: "0 12px 24px -4px rgba(23, 76, 69, 0.12), 0 4px 8px -2px rgba(23, 76, 69, 0.06)",
        tactile: "0 2px 0 0 rgba(23, 76, 69, 0.2)",
      },
    },
  },
  plugins: [],
};
export default config;
