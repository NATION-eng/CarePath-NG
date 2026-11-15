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
        // High-end Petrol Navy / Slate Teal palette from reference design
        petrol: {
          950: "#06151E",
          900: "#0C2B3A", // Hero & deep sections
          850: "#0F3547",
          800: "#134157",
          700: "#1A5572",
          600: "#267297",
          500: "#3690BD",
          200: "#B8DCED",
          100: "#E2F1F8",
          50: "#F1F8FC",
        },
        // Warm Terracotta Peach accent (CTA pill buttons from reference)
        peach: {
          500: "#F3A68F", // Primary CTA button
          600: "#E58B74", // Hover CTA
          700: "#CF6F56",
          200: "#FBD6CB",
          100: "#FDECE7",
          50: "#FFF6F3",
        },
        // Clinical Mint / Seafoam for reassuring badges & checkmarks
        mint: {
          900: "#173B38",
          800: "#225653",
          700: "#2E726E",
          600: "#388C87",
          500: "#48A8A2",
          200: "#C3EBE8",
          100: "#E3F7F5",
          50: "#F2FAF9",
        },
        // Backwards compatibility for existing teal tokens
        teal: {
          950: "#0C2B3A",
          900: "#0F3547",
          800: "#134157",
          700: "#1E5A77",
          600: "#2A789E",
          500: "#3B827E",
          400: "#4CA5A0",
          300: "#8AC4C0",
          200: "#C5E5DB",
          100: "#E5F4EF",
          50: "#F2F9F6",
        },
        cream: {
          50: "#FFFBF7",
          100: "#FAF4EC",
          200: "#F1E8DA",
          300: "#E6D8C2",
          400: "#D3BE9E",
        },
        surface: {
          base: "#F8FAF9",
          card: "#FFFFFF",
          muted: "#EFF4F2",
          border: "#DFE8E5",
          dark: "#0F2624",
        },
        brand: {
          dark: "#0C2B3A",
          accent: "#F3A68F",
          mint: "#3B827E",
          cream: "#F1E8DA",
          canvas: "#F8FAF9",
        }
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
      },
      boxShadow: {
        subtle: "0 1px 3px 0 rgba(12, 43, 58, 0.05), 0 1px 2px -1px rgba(12, 43, 58, 0.05)",
        card: "0 4px 12px -2px rgba(12, 43, 58, 0.06), 0 2px 6px -2px rgba(12, 43, 58, 0.04)",
        float: "0 16px 32px -4px rgba(12, 43, 58, 0.12), 0 6px 12px -2px rgba(12, 43, 58, 0.06)",
        peach: "0 6px 18px -2px rgba(243, 166, 143, 0.45)",
      },
    },
  },
  plugins: [],
};
export default config;
