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
        background: "#f4f7fb",
        foreground: "#2A2A2A",
        primary: {
          DEFAULT: "#2563eb",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#F3F4F6",
          foreground: "#2A2A2A",
        },
        nordic: {
          blue: "#33C3F0",
          charcoal: "#403E43",
          gray: "#8A898C",
          lightgray: "#F6F6F7",
          softblue: "#D3E4FD",
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
      animation: {
        aurora: "aurora 60s linear infinite",
      },
      keyframes: {
        aurora: {
          "0%": { backgroundPosition: "50% 50%, 50% 50%" },
          "50%": { backgroundPosition: "0% 50%, 0% 50%" },
          "100%": { backgroundPosition: "50% 50%, 50% 50%" },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;