import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Warm parchment / ancient wood — primary palette per PRD §10.
        parchment: {
          50: "#fbf6ec",
          100: "#f5ead0",
          200: "#ebd5a4",
          300: "#dcb976",
          400: "#cb9b51",
          500: "#a87a3a",
          600: "#83602e",
          700: "#5e4524",
          800: "#3d2c17",
          900: "#23190d",
        },
        // Slate — for player message bubbles.
        slate2: {
          50: "#f4f5f7",
          100: "#e4e6ea",
          200: "#c7ccd3",
          300: "#a3aab5",
          400: "#7c8593",
          500: "#5c6573",
          600: "#454c57",
          700: "#33383f",
          800: "#22262b",
          900: "#15171a",
        },
        // Single accent color — used for primary buttons and active rule chips.
        accent: {
          50: "#fff3eb",
          100: "#ffe1c7",
          200: "#ffc18a",
          300: "#ff9a4d",
          400: "#fb7a26",
          500: "#e65d10",
          600: "#bd470c",
          700: "#92370b",
          800: "#69280a",
          900: "#411906",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "PingFang SC",
          "Source Han Sans CN",
          "Microsoft YaHei",
          "system-ui",
          "sans-serif",
        ],
      },
      typography: {
        DEFAULT: {
          css: {
            lineHeight: "1.6",
          },
        },
      },
    },
  },
  plugins: [],
};

export default config;
