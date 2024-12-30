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
          DEFAULT: "var(--background)",
          dark: "var(--background-dark)",
        },
        foreground: {
          DEFAULT: "var(--foreground)",
          dark: "var(--foreground-dark)",
        },
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
          dark: "var(--primary-dark)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
          dark: "var(--secondary-dark)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
          dark: "var(--accent-dark)",
        },
        nordic: {
          blue: "var(--nordic-blue)",
          charcoal: {
            DEFAULT: "var(--nordic-charcoal)",
            dark: "var(--nordic-charcoal-dark)",
          },
          gray: {
            DEFAULT: "var(--nordic-gray)",
            dark: "var(--nordic-gray-dark)",
          },
          lightgray: {
            DEFAULT: "var(--nordic-lightgray)",
            dark: "var(--nordic-lightgray-dark)",
          },
          softblue: {
            DEFAULT: "var(--nordic-softblue)",
            dark: "var(--nordic-softblue-dark)",
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