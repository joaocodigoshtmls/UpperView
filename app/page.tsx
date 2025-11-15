import Link from 'next/link';
import { auth } from '@/auth';

export default async function Page() {
  const session = await auth();

  return (
    <section className="space-y-8">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-8">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-4">
          Bem-vindo ao UpperView 🚀
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-300 mb-6">
          Seu controle financeiro pessoal com visão de caixa, metas e carteira de investimentos.
        </p>
        <div className="flex gap-4">
          {session ? (
            <>
              <Link 
                href="/dashboard" 
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Ir para Dashboard
              </Link>
              <Link 
                href="/transactions" 
                className="px-6 py-3 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors font-medium"
              >
                Ver Transações
              </Link>
            </>
          ) : (
            <>
              <Link 
                href="/login" 
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Entrar
              </Link>
              <Link 
                href="/cadastro" 
                className="px-6 py-3 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors font-medium"
              >
                Criar conta
              </Link>
            </>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6">
          <div className="text-3xl mb-3">📊</div>
          <h3 className="font-semibold text-slate-800 dark:text-white mb-2">Dashboard Completo</h3>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Visualize suas receitas, despesas e resultado mensal em um só lugar.
          </p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6">
          <div className="text-3xl mb-3">💰</div>
          <h3 className="font-semibold text-slate-800 dark:text-white mb-2">Transações</h3>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Gerencie todas suas transações com filtros e criação rápida.
          </p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6">
          <div className="text-3xl mb-3">⚙️</div>
          <h3 className="font-semibold text-slate-800 dark:text-white mb-2">Configurações</h3>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Gerencie suas contas financeiras e categorias personalizadas.
          </p>
        </div>
      </div>
    </section>
  );
}
