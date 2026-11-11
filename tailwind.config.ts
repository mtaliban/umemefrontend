import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#EA580C",
          dark: "#C2410C",
          light: "#F97316",
        },
        accent: {
          DEFAULT: "#F97316",
          dark: "#EA580C",
          light: "#FB923C",
        },
        muted: "#6B7280",
        surface: "#F8FAFC",
        navy: "#7C2D12",
        electricity: "#F59E0B",
        water: "#0EA5E9",
      },
      fontFamily: {
        heading: ["var(--font-poppins)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
      },
      backgroundImage: {
        "gradient-primary": "linear-gradient(135deg, #C2410C 0%, #EA580C 60%, #F97316 100%)",
        "gradient-cta": "linear-gradient(135deg, #C2410C 0%, #EA580C 50%, #F97316 100%)",
        "gradient-dark": "linear-gradient(180deg, #7C2D12 0%, #9A3412 100%)",
      },
      boxShadow: {
        "card": "0 2px 8px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
        "card-hover": "0 12px 32px rgba(0,0,0,0.12), 0 4px 8px rgba(0,0,0,0.06)",
        "section": "0 4px 24px rgba(234, 88, 12, 0.08)",
      },
    },
  },
  plugins: [],
};

export default config;
