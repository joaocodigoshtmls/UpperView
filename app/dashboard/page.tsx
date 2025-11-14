import { prisma } from '@/lib/prisma';
import { getUserId } from '@/lib/user';
import { startOfMonth, endOfMonth } from '@/lib/date';
import { formatBRL } from '@/lib/format';
import { TransactionType } from '@prisma/client';
import ExpenseChartWrapper from './expense-chart-wrapper';

export const revalidate = 0;

async function getDashboardData(userId: string) {
  const now = new Date();
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);

  // Get transactions for current month
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

  // Calculate income, expenses, result
  const income = transactions
    .filter((t) => t.type === TransactionType.INCOME)
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const expenses = transactions
    .filter((t) => t.type === TransactionType.EXPENSE)
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const result = income - expenses;

  // Group expenses by category
  const expensesByCategory = transactions
    .filter((t) => t.type === TransactionType.EXPENSE && t.category)
    .reduce((acc, t) => {
      const categoryName = t.category?.name || 'Sem categoria';
      if (!acc[categoryName]) {
        acc[categoryName] = 0;
      }
      acc[categoryName] += Number(t.amount);
      return acc;
    }, {} as Record<string, number>);

  // Get top 6 categories
  const topCategories = Object.entries(expensesByCategory)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 6)
    .map(([name, value]) => ({ name, value }));

  // Get accounts
  const accounts = await prisma.financialAccount.findMany({
    where: { userId, archived: false },
    include: {
      institution: true,
    },
    orderBy: { name: 'asc' },
  });

  return {
    income,
    expenses,
    result,
    topCategories,
    accounts,
  };
}

export default async function DashboardPage() {
  const userId = await getUserId();
  const data = await getDashboardData(userId);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-slate-800">Dashboard</h1>

      {/* Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Income Card */}
        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-500">
          <div className="text-sm font-medium text-slate-500 mb-1">Receitas (mês)</div>
          <div className="text-2xl font-bold text-green-600">
            {formatBRL(data.income)}
          </div>
        </div>

        {/* Expenses Card */}
        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-red-500">
          <div className="text-sm font-medium text-slate-500 mb-1">Despesas (mês)</div>
          <div className="text-2xl font-bold text-red-600">
            {formatBRL(data.expenses)}
          </div>
        </div>

        {/* Result Card */}
        <div className={`bg-white rounded-lg shadow-sm p-6 border-l-4 ${data.result >= 0 ? 'border-green-500' : 'border-red-500'}`}>
          <div className="text-sm font-medium text-slate-500 mb-1">Resultado (mês)</div>
          <div className={`text-2xl font-bold ${data.result >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatBRL(data.result)}
          </div>
        </div>
      </div>

      {/* Accounts */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Contas</h2>
        {data.accounts.length === 0 ? (
          <p className="text-slate-500">Nenhuma conta cadastrada. Adicione uma em Configurações.</p>
        ) : (
          <div className="space-y-3">
            {data.accounts.map((account) => (
              <div
                key={account.id}
                className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <div className="flex-1">
                  <div className="font-medium text-slate-800">{account.name}</div>
                  <div className="text-sm text-slate-500">
                    {account.institution?.name || 'Sem instituição'} • {account.type} • {account.currency}
                  </div>
                </div>
                <div className="text-lg font-semibold text-slate-800">
                  {formatBRL(Number(account.balance))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Expense Chart */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Despesas por Categoria</h2>
        {data.topCategories.length === 0 ? (
          <p className="text-slate-500">Nenhuma despesa registrada neste mês.</p>
        ) : (
          <ExpenseChartWrapper data={data.topCategories} />
        )}
      </div>
    </div>
  );
}
