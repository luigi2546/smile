/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0B3D3D",
        teal: {
          DEFAULT: "#1C7293",
          deep: "#1A6B5C",
          dark: "#0F5C5C",
          darker: "#0B3D3D",
          panel: "#0F4D4D",
          border: "#1B5C5C",
        },
        gold: {
          DEFAULT: "#D4AF37",
          light: "#E4C766",
        },
        cream: "#F4F8F7",
        muted: "#5B6B6B",
      },
      fontFamily: {
        serif: ["Georgia", "Cambria", "Times New Roman", "serif"],
        sans: ["-apple-system", "Segoe UI", "Inter", "Helvetica", "Arial", "sans-serif"],
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [],
};
