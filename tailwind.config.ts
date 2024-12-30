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
        background: {
          DEFAULT: "#f8f9fa",
          dark: "#1a1a1a", // Updated from #101010 to #1a1a1a
        },
        foreground: {
          DEFAULT: "#333333",
          dark: "#eeeeee",
        },
        primary: {
          DEFAULT: "#345FF6",
          foreground: "#FFFFFF",
          dark: "#5a7dfc",
        },
        secondary: {
          DEFAULT: "#E9F2FF",
          foreground: "#333333",
          dark: "#2a2a2a", // Updated to a lighter shade for better contrast
        },
        accent: {
          DEFAULT: "#47C757",
          foreground: "#FFFFFF",
          dark: "#50D161",
        },
        nordic: {
          blue: "#345FF6",
          charcoal: {
            DEFAULT: "#333333",
            dark: "#eeeeee",
          },
          gray: {
            DEFAULT: "#555555",
            dark: "#A0A0A0",
          },
          lightgray: {
            DEFAULT: "#f8f9fa",
            dark: "#1a1a1a", // Updated to match the new dark background
          },
          softblue: {
            DEFAULT: "#E9F2FF",
            dark: "#2a2a2a", // Updated to match the new secondary dark color
          },
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