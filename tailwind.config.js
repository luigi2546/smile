/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        surface: "#F8FBFB",
        surface2: "#FFFFFF",
        "surface-strong": "#F1F5F8",
        surfaceStrong: "#F1F5F8",
        ink: "#000b47",
        teal: {
          DEFAULT: "#0012A3",
          light: "#4e61ff",
          dark: "#000e7d",
          darker: "#000a54",
          deeper: "#00073d",
          panel: "#eef2ff",
          border: "#c7d2fe",
        },
        gold: {
          DEFAULT: "#D4AF37",
          light: "#F3D48B",
          dark: "#9B7F29",
        },
        cream: "#F7F9F9",
        muted: "#64707A",
        neutral: {
          100: "#F7F9FB",
          200: "#E8EFF3",
          300: "#C8D4DE",
          400: "#9CAABB",
          500: "#6E8191",
        },
      },
      fontFamily: {
        serif: ["Playfair Display", "Georgia", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 18px 60px rgba(13, 47, 65, 0.11)",
      },
      borderRadius: {
        xl2: "1.5rem",
        '3xl': '2rem',
      },
    },
  },
  plugins: [],
};
