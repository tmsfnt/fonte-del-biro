import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#1A1416", // nero caldo — testi, bottoni
        granata: {
          DEFAULT: "#6F1725", // rosso granata — brand primary
          deep: "#4A0F19",
          soft: "#9A2F40",
        },
        cream: "#F8F4EC", // accento caldo secondario
        bone: "#FFFFFF", // bianco puro
        canvas: "#F4F2EF", // background sezioni — matcha la carta dei frame
        beige: "#E6DCCB",
        sky: "#BFD3E6", // blu pastello
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "system-ui", "sans-serif"],
        display: ["'Cormorant Garamond'", "Georgia", "'Times New Roman'", "serif"],
      },
      letterSpacing: {
        tightest: "-0.04em",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out forwards",
      },
    },
  },
  plugins: [],
};

export default config;
