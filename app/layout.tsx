import type { Metadata } from "next";
import Link from "next/link";
import { auth } from "@/auth";
import { logout } from "@/app/auth/actions";
import "./globals.css";

export const metadata: Metadata = {
  title: "UpperView",
  description: "Controle financeiro pessoal com visão de caixa, metas e carteira de investimentos",
};

async function UserNav() {
  const session = await auth();

  if (session?.user) {
    return (
      <div className="flex items-center gap-4">
        <Link
          className="text-slate-600 hover:text-blue-600 transition-colors"
          href="/profile"
          aria-label="Perfil"
        >
          Perfil
        </Link>
        <form action={logout}>
          <button
            type="submit"
            className="text-slate-600 hover:text-blue-600 transition-colors"
          >
            Sair
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <Link
        className="text-slate-600 hover:text-blue-600 transition-colors"
        href="/auth/login"
      >
        Entrar
      </Link>
      <Link
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
        href="/auth/register"
      >
        Cadastrar
      </Link>
    </div>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className="min-h-screen antialiased bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-6">
          <header className="flex items-center justify-between pb-6 border-b border-slate-200 bg-white rounded-lg px-6 py-4 shadow-sm">
            <Link href="/" className="text-2xl font-bold tracking-tight text-blue-600 hover:text-blue-700">
              UpperView
            </Link>
            <nav className="flex items-center gap-6 text-sm font-medium">
              <Link className="text-slate-600 hover:text-blue-600 transition-colors" href="/" aria-label="Início">
                Início
              </Link>
              <Link className="text-slate-600 hover:text-blue-600 transition-colors" href="/dashboard" aria-label="Dashboard">
                Dashboard
              </Link>
              <Link className="text-slate-600 hover:text-blue-600 transition-colors" href="/transactions" aria-label="Transações">
                Transações
              </Link>
              <Link className="text-slate-600 hover:text-blue-600 transition-colors" href="/settings" aria-label="Configurações">
                Configurações
              </Link>
              <div className="ml-4 border-l border-slate-300 pl-4">
                <UserNav />
              </div>
            </nav>
          </header>
          <main className="py-8">{children}</main>
          <footer className="pt-8 border-t border-slate-200 text-sm text-slate-500">
            <p>© {new Date().getFullYear()} UpperView — Controle financeiro pessoal</p>
          </footer>
        </div>
      </body>
    </html>
  );
}
