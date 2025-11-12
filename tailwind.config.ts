import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        positive: { DEFAULT: "#22c55e" },
        negative: { DEFAULT: "#ef4444" },
        primary: { DEFAULT: "#4f46e5" }
      }
    }
  },
  plugins: []
} satisfies Config;
