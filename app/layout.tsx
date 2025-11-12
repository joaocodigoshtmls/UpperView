import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Financia",
  description: "Controle financeiro, orçamentos e investimentos",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className="min-h-screen antialiased">
        <div className="mx-auto max-w-6xl px-4 py-6">
          <header className="flex items-center justify-between pb-6 border-b">
            <h1 className="text-2xl font-semibold tracking-tight">Financia</h1>
            <nav className="flex gap-4 text-sm">
              <a className="hover:underline" href="/">Início</a>
              <a className="hover:underline" href="/docs/blueprint">Blueprint</a>
            </nav>
          </header>
          <main className="py-8">{children}</main>
          <footer className="pt-8 border-t text-sm text-gray-500">
            <p>© {new Date().getFullYear()} Financia — MVP setup</p>
          </footer>
        </div>
      </body>
    </html>
  );
}
