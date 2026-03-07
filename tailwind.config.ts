import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "primary": "#f5c518",
        "background-light": "#f8f8f5",
        "background-dark": "#1c1c1c",
        "card-dark": "#2a2a2a",
      },
      fontFamily: {
        "display": ["Space Grotesk", "sans-serif"],
        "headline": ["Bebas Neue", "cursive"]
      },
      borderRadius: {
        "DEFAULT": "1rem",
        "lg": "1.25rem",
        "xl": "1.5rem",
        "full": "9999px"
      },
    },
  },
  plugins: [],
};
export default config;
