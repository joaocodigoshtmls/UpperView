import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { auth } from "@/auth";

export const metadata: Metadata = {
  title: "UpperView",
  description: "Controle financeiro pessoal com visão de caixa, metas e carteira de investimentos",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const pref = session?.user?.themePreference ?? "SYSTEM";

  const forcedTheme =
    pref === "LIGHT" ? "light" : pref === "DARK" ? "dark" : undefined;

  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className="min-h-screen antialiased bg-slate-50 dark:bg-slate-900">
        <ThemeProvider forcedTheme={forcedTheme}>
          <div className="mx-auto max-w-6xl px-4 py-6">
            <header className="flex items-center justify-between pb-6 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg px-6 py-4 shadow-sm">
              <Link href="/" className="text-2xl font-bold tracking-tight text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                UpperView
              </Link>
              <nav className="flex gap-6 text-sm font-medium">
                <Link className="text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 transition-colors" href="/" aria-label="Início">
                  Início
                </Link>
                <Link className="text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 transition-colors" href="/dashboard" aria-label="Dashboard">
                  Dashboard
                </Link>
                <Link className="text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 transition-colors" href="/transactions" aria-label="Transações">
                  Transações
                </Link>
                <Link className="text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 transition-colors" href="/settings" aria-label="Configurações">
                  Configurações
                </Link>
                {session && (
                  <Link className="text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 transition-colors" href="/perfil" aria-label="Perfil">
                    Perfil
                  </Link>
                )}
              </nav>
            </header>
            <main className="py-8">{children}</main>
            <footer className="pt-8 border-t border-slate-200 dark:border-slate-700 text-sm text-slate-500 dark:text-slate-400">
              <p>© {new Date().getFullYear()} UpperView — Controle financeiro pessoal</p>
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
