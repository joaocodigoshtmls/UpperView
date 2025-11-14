import { prisma } from '@/lib/prisma';
import { getUserId } from '@/lib/user';
import { formatBRL } from '@/lib/format';
import { TransactionType } from '@prisma/client';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import TransactionDialog from './transaction-dialog';

export const revalidate = 0;

interface SearchParams {
  type?: string;
  search?: string;
}

async function getTransactions(userId: string, searchParams: SearchParams) {
  const whereClause: any = { userId };

  if (searchParams.type && searchParams.type !== 'all') {
    whereClause.type = searchParams.type as TransactionType;
  }

  if (searchParams.search) {
    whereClause.description = {
      contains: searchParams.search,
      mode: 'insensitive',
    };
  }

  const transactions = await prisma.transaction.findMany({
    where: whereClause,
    include: {
      account: true,
      category: true,
    },
    orderBy: {
      occurredAt: 'desc',
    },
    take: 50,
  });

  return transactions;
}

export default async function TransactionsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const userId = await getUserId();
  const transactions = await getTransactions(userId, searchParams);

  const accounts = await prisma.financialAccount.findMany({
    where: { userId, archived: false },
    orderBy: { name: 'asc' },
  });

  const categories = await prisma.category.findMany({
    where: { userId },
    orderBy: { name: 'asc' },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-800">Transações</h1>
        <TransactionDialog accounts={accounts} categories={categories} />
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <form method="get" className="flex gap-4">
          <div className="flex-1">
            <label htmlFor="search" className="sr-only">Buscar</label>
            <input
              type="text"
              id="search"
              name="search"
              placeholder="Buscar por descrição..."
              defaultValue={searchParams.search}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="type" className="sr-only">Tipo</label>
            <select
              id="type"
              name="type"
              defaultValue={searchParams.type || 'all'}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todos os tipos</option>
              <option value="INCOME">Receitas</option>
              <option value="EXPENSE">Despesas</option>
              <option value="TRANSFER">Transferências</option>
            </select>
          </div>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Filtrar
          </button>
        </form>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {transactions.length === 0 ? (
          <div className="p-8 text-center text-slate-500">
            Nenhuma transação encontrada.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Data
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Conta
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Categoria
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Descrição
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Valor
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {transactions.map((transaction) => {
                  const isExpense = transaction.type === TransactionType.EXPENSE;
                  const amount = Number(transaction.amount);
                  const displayAmount = isExpense ? -amount : amount;

                  return (
                    <tr key={transaction.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                        {format(new Date(transaction.occurredAt), 'dd/MM/yyyy', { locale: ptBR })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800">
                        {transaction.account.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                        {transaction.category?.name || '-'}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-800">
                        {transaction.description || '-'}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm text-right font-semibold ${
                        isExpense ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {formatBRL(displayAmount)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
