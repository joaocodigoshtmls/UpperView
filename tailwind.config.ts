import type { Config } from "tailwindcss";
import forms from "@tailwindcss/forms";
import typography from "@tailwindcss/typography";

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
      },
      borderRadius: {
        xl: "1.1rem",
      },
      boxShadow: {
        card: "0 10px 30px -12px rgba(15, 23, 42, 0.25)",
      },
      container: {
        center: true,
        padding: "1rem",
      }
    }
  },
  plugins: [forms, typography]
} satisfies Config;
