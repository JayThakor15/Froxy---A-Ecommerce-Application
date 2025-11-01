/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Brand palette: Ram Vatika - navy primary with pink accent
        primary: {
          50: "#f3f6fb",
          100: "#e6eef9",
          200: "#cfe0f5",
          300: "#9fc0ec",
          400: "#6f97db",
          500: "#3560b2",
          600: "#274a8a",
          700: "#1b3158",
          800: "#0f1a2b",
          900: "#071018",
        },
        // Pink accent from logo (used for highlights and CTAs)
        accent: {
          50: "#fff5fb",
          100: "#ffe6f6",
          200: "#ffd2ee",
          300: "#ffaddf",
          400: "#ff7fc0",
          500: "#ff4aa3",
          600: "#e63d92",
          700: "#b72e6f",
          800: "#7f204b",
          900: "#49122a",
        },
        // Neutral dark for surfaces and text
        richBlack: {
          50: "#fafbfd",
          100: "#eef0f2",
          200: "#d9dfe4",
          300: "#bfc9d2",
          400: "#9aa7b6",
          500: "#657887",
          600: "#4b5960",
          700: "#2f373a",
          800: "#151819",
          900: "#0b0b0c",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
