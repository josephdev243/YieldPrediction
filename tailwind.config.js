/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    extend: {
      colors: {
        forest: {
          950: "#020617",
          900: "#0b3d2e",
          800: "#14532d",
          700: "#166534",
          600: "#22c55e",
          500: "#4ade80",
          100: "#ecfdf5",
          50: "#f0fdf4",
        },
        slate: {
          900: "#111827",
          700: "#374151",
          500: "#6b7280",
          400: "#9ca3af",
          300: "#d1d5db",
        },
      },
    },
  },
  plugins: [],
};
