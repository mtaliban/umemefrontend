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
          DEFAULT: '#0B2545',
          50: '#E8EEF5',
          100: '#C5D3E8',
          800: '#0B2545',
          900: '#071A33',
        },
        accent: {
          DEFAULT: "#F59E0B",
          dark: "#D97706",
          light: "#FEF3C7",
        },
        electric: {
          DEFAULT: '#F59E0B',
          light: '#FEF3C7',
          dark: '#78350F',
        },
        water: {
          DEFAULT: '#0EA5E9',
          light: '#E0F2FE',
          dark: '#0C4A6E',
        },
        muted: "#64748B",
        surface: '#F4F7FB',
      },
      fontFamily: {
        heading: ["var(--font-poppins)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
      },
      backgroundImage: {
        "gradient-primary": "linear-gradient(135deg, #071A33 0%, #0B2545 60%, #0D2E55 100%)",
        "gradient-cta": "linear-gradient(135deg, #D97706 0%, #F59E0B 50%, #FBBF24 100%)",
        "gradient-dark": "linear-gradient(180deg, #071A33 0%, #0B2545 100%)",
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
