import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#0070F3", // Electric Blue
          dark: "#0051B3",
        },
        background: {
          DEFAULT: "#050505", // Deep Black
          card: "#121212", // Card Black
          hover: "#1a1a1a",
        },
        accent: {
          DEFAULT: "#7928CA", // Purple Neon
          secondary: "#FF0080", // Pink Neon
        },
      },
      backgroundImage: {
        'gradient-premium': 'linear-gradient(135deg, #0070F3 0%, #7928CA 100%)',
        'glass': 'rgba(255, 255, 255, 0.03)',
      },
    },
  },
  plugins: [],
};
export default config;
