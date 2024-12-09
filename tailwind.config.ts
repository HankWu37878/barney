import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
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
        brand: "#1e9bf0",
        column1: "#3c392f",
        column2: "#5b3e31",
        column3: '#a9bbab',
      },
      fontFamily: {
        sans: ["var(--noto-sans)", ...defaultTheme.fontFamily.sans],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 1s ease-out",
        "accordion-up": "accordion-up 1s ease-out",
        'pulse-short': 'pulse 1s ease-in 1'
      },
      backgroundImage: {
        "homepage": "url('/Homepage.png')",
        "reservationpage": "url('/Reservationpage.png')",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
