import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
const siteName = "UpperView";
const siteTitle = "UpperView — Controle financeiro pessoal";
const siteDescription =
  "Controle financeiro pessoal com visão de caixa, metas e carteira de investimentos.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteTitle,
    template: "%s | UpperView",
  },
  description: siteDescription,
  applicationName: siteName,
  openGraph: {
    title: siteTitle,
    description: siteDescription,
    siteName,
    locale: "pt_BR",
    type: "website",
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        <a href="#main-content" className="skip-link">
          Pular para o conteúdo principal
        </a>

        <div className="mx-auto max-w-6xl px-4 py-6">
          <header className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white px-6 py-4 shadow-sm">
            <Link href="/" className="text-2xl font-bold tracking-tight text-blue-600 hover:text-blue-700">
              UpperView
            </Link>
            <nav className="flex gap-6 text-sm font-medium text-slate-600">
              <Link className="nav-link" href="/" aria-label="Início">
                Início
              </Link>
              <Link className="nav-link" href="/dashboard" aria-label="Dashboard">
                Dashboard
              </Link>
              <Link className="nav-link" href="/transactions" aria-label="Transações">
                Transações
              </Link>
              <Link className="nav-link" href="/settings" aria-label="Configurações">
                Configurações
              </Link>
            </nav>
          </header>

          <main id="main-content" className="py-8">
            {children}
          </main>

          <footer className="pt-8 text-sm text-slate-500">
            <div className="flex items-center justify-between border-t border-slate-200 pt-4">
              <p>© {new Date().getFullYear()} UpperView</p>
              <p className="text-slate-400">Planeje, acompanhe e invista com clareza.</p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
