"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

type Props = {
  children: React.ReactNode;
  forcedTheme?: "light" | "dark";
};

export function ThemeProvider({ children, forcedTheme }: Props) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      forcedTheme={forcedTheme}
    >
      {children}
    </NextThemesProvider>
  );
}
