import Link from 'next/link';
import { TransactionType } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { getUserId } from '@/lib/user';
import { startOfMonth, endOfMonth } from '@/lib/date';
import { formatBRL } from '@/lib/format';
import ExpenseChart from './expense-chart';

export const revalidate = 0;

async function getDashboardData(userId: string) {
  try {
    const now = new Date();
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);

    const transactions = await prisma.transaction.findMany({
      where: {
        userId,
        occurredAt: {
          gte: monthStart,
          lte: monthEnd,
        },
      },
      include: {
        category: true,
      },
    });

    const income = transactions
      .filter((t) => t.type === TransactionType.INCOME)
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const expenses = transactions
      .filter((t) => t.type === TransactionType.EXPENSE)
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const result = income - expenses;

    const expensesByCategory = transactions
      .filter((t) => t.type === TransactionType.EXPENSE && t.category)
      .reduce((acc, t) => {
        const categoryName = t.category?.name || 'Sem categoria';
        acc[categoryName] = (acc[categoryName] || 0) + Number(t.amount);
        return acc;
      }, {} as Record<string, number>);

    const topCategories = Object.entries(expensesByCategory)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 6)
      .map(([name, value]) => ({ name, value }));

    const accounts = await prisma.financialAccount.findMany({
      where: { userId, archived: false },
      include: { institution: true },
      orderBy: { name: 'asc' },
    });

    return {
      income,
      expenses,
      result,
      topCategories,
      accounts,
      hasTransactions: transactions.length > 0,
    };
  } catch (err) {
    console.error('Erro ao buscar dados do dashboard', err);
    return {
      income: 0,
      expenses: 0,
      result: 0,
      topCategories: [],
      accounts: [],
      hasTransactions: false,
    };
  }
}

export default async function DashboardPage() {
  const userId = await getUserId();

  const data = await getDashboardData(userId).catch((err) => {
    console.error('Erro ao carregar dashboard', err);
    return null;
  });

  if (!data) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-800">
        <h1 className="text-xl font-semibold">Nao foi possivel carregar o dashboard</h1>
        <p className="text-sm text-red-700">Tente recarregar a pagina ou revisar o seed do banco.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">Visao mensal</p>
          <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-sm text-slate-600">Receitas, despesas e distribuicao por categoria do mes atual.</p>
        </div>
        {!data.hasTransactions && (
          <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800">Sem transacoes no mes</span>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-green-100 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Receitas (mes)</p>
          <p className="mt-2 text-3xl font-bold text-emerald-600">{formatBRL(data.income)}</p>
          <p className="text-xs text-slate-500">Inclui salarios, freelas e entradas recorrentes.</p>
        </div>
        <div className="rounded-xl border border-rose-100 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Despesas (mes)</p>
          <p className="mt-2 text-3xl font-bold text-rose-600">{formatBRL(data.expenses)}</p>
          <p className="text-xs text-slate-500">Gastos categorizados e transferencias marcadas como saida.</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Resultado (mes)</p>
          <p className={`mt-2 text-3xl font-bold ${data.result >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>{formatBRL(data.result)}</p>
          <p className="text-xs text-slate-500">Saldo entre entradas e saidas. Use para ajustar metas.</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-900">Contas</h2>
            <Link href="/settings" className="text-sm font-semibold text-blue-700 underline-offset-4 hover:underline">
              Gerenciar contas
            </Link>
          </div>
          {data.accounts.length === 0 ? (
            <p className="mt-3 rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600">
              Nenhuma conta cadastrada. Cadastre uma conta em Configuracoes para iniciar o controle de saldos.
            </p>
          ) : (
            <div className="mt-4 space-y-3">
              {data.accounts.map((account) => (
                <div
                  key={account.id}
                  className="flex items-center justify-between rounded-lg border border-slate-200 p-4 transition hover:bg-slate-50"
                >
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900">{account.name}</p>
                    <p className="text-sm text-slate-500">
                      {account.institution?.name || 'Sem instituicao'} • {account.type} • {account.currency}
                    </p>
                  </div>
                  <p className="text-lg font-semibold text-slate-900">{formatBRL(Number(account.balance))}</p>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-900">Despesas por categoria</h2>
            {!data.hasTransactions && (
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">Aguardando lancamentos</span>
            )}
          </div>
          {data.topCategories.length === 0 ? (
            <div className="mt-3 rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600">
              Nenhuma despesa registrada neste mes. Registre transacoes para visualizar o grafico.
            </div>
          ) : (
            <ExpenseChart data={data.topCategories} />
          )}
        </section>
      </div>
    </div>
  );
}
