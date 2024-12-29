import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "#f8f9fa",
        foreground: "#333333",
        primary: {
          DEFAULT: "#345FF6", // Kvantum blue
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#E9F2FF",
          foreground: "#333333",
        },
        accent: {
          DEFAULT: "#47C757", // Success green
          foreground: "#FFFFFF",
        },
        nordic: {
          blue: "#345FF6",
          charcoal: "#333333",
          gray: "#555555",
          lightgray: "#f8f9fa",
          softblue: "#E9F2FF",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      lineHeight: {
        relaxed: "1.6",
      },
      letterSpacing: {
        heading: "0.02em",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;