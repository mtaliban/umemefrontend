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
          DEFAULT: '#111111',
          50: '#F9FAFB',
          100: '#F3F4F6',
          800: '#1F2937',
          900: '#111111',
        },
        accent: {
          DEFAULT: '#F5B700',
          dark: '#D97706',
          light: '#FEF9E7',
        },
        electric: {
          DEFAULT: '#F5B700',
          light: '#FEF9E7',
          dark: '#D97706',
        },
        water: {
          DEFAULT: '#0EA5E9',
          light: '#E0F2FE',
          dark: '#0369A1',
        },
        muted: '#4B5563',
        surface: '#F9FAFB',
      },
      fontFamily: {
        heading: ["var(--font-poppins)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
      },
      backgroundImage: {
        "gradient-primary": "linear-gradient(135deg, #111111 0%, #1F2937 100%)",
        "gradient-cta": "linear-gradient(135deg, #D97706 0%, #F5B700 100%)",
        "gradient-dark": "linear-gradient(180deg, #111111 0%, #1F2937 100%)",
      },
      boxShadow: {
        "card": "0 2px 8px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
        "card-hover": "0 12px 32px rgba(0,0,0,0.12), 0 4px 8px rgba(0,0,0,0.06)",
        "section": "0 4px 24px rgba(0,0,0,0.06)",
      },
    },
  },
  plugins: [],
};

export default config;
