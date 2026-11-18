import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        apus: {
          DEFAULT: "#49CEE1",
          dark: "#2FB4C8",
          deep: "#0E7E92",
          pale: "#E6F9FC",
        },
        ink: "#0A0A0A",
        coal: "#141414",
        mist: "#EDEDED",
        smoke: "#F5F5F4",
        line: "#E2E2E2",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "var(--font-inter)", "system-ui", "sans-serif"],
      },
      maxWidth: { shell: "1280px" },
    },
  },
  plugins: [],
};
export default config;
