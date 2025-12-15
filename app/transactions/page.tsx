import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { getUserId } from '@/lib/user';
import { formatBRL } from '@/lib/format';
import { TransactionType } from '@prisma/client';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import TransactionDialog from './transaction-dialog';
import { z } from 'zod';

export const revalidate = 0;
type RawSearchParams = Record<string, string | string[] | undefined>;

const pickFirst = (value: unknown): string | undefined => {
  if (Array.isArray(value)) {
    const first = value[0];
    return typeof first === 'string' ? first : undefined;
  }

  return typeof value === 'string' ? value : undefined;
};

const searchSchema = z.object({
  type: z
    .preprocess((v) => pickFirst(v) ?? 'all', z.enum(['all', 'INCOME', 'EXPENSE', 'TRANSFER']))
    .default('all'),
  search: z.preprocess((v) => pickFirst(v), z.string().trim().min(1).optional()),
  accountId: z.preprocess((v) => pickFirst(v), z.string().trim().min(1).optional()),
  categoryId: z.preprocess((v) => pickFirst(v), z.string().trim().min(1).optional()),
  startDate: z.preprocess((v) => pickFirst(v), z.string().trim().min(1).optional()),
  endDate: z.preprocess((v) => pickFirst(v), z.string().trim().min(1).optional()),
});

type SearchParams = z.infer<typeof searchSchema>;

const toValidDate = (value?: string) => {
  if (!value) return undefined;
  const dt = new Date(value);
  return Number.isNaN(dt.getTime()) ? undefined : dt;
};

async function getTransactions(userId: string, searchParams: SearchParams) {
  const whereClause: any = { userId };

  if (searchParams.type !== 'all') {
    whereClause.type = searchParams.type as TransactionType;
  }

  if (searchParams.search) {
    whereClause.description = {
      contains: searchParams.search,
      mode: 'insensitive',
    };
  }

  if (searchParams.accountId) {
    whereClause.accountId = searchParams.accountId;
  }

  if (searchParams.categoryId) {
    whereClause.categoryId = searchParams.categoryId;
  }

  const start = toValidDate(searchParams.startDate);
  const end = toValidDate(searchParams.endDate);

  if (start || end) {
    whereClause.occurredAt = {
      ...(start ? { gte: start } : {}),
      ...(end ? { lte: end } : {}),
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
    take: 100,
  });

  return transactions;
}

export default async function TransactionsPage({
  searchParams,
}: {
  searchParams?: Promise<RawSearchParams>;
}) {
  const userId = await getUserId();
  const resolvedSearchParams = (await searchParams) ?? {};
  const params = searchSchema.parse(resolvedSearchParams);
  const transactions = await getTransactions(userId, params);

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
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">Registros</p>
          <h1 className="text-3xl font-bold text-slate-900">Transacoes</h1>
        </div>
        <TransactionDialog accounts={accounts} categories={categories} />
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <form method="get" className="grid gap-4 md:grid-cols-4 md:items-end">
          <div className="md:col-span-2">
            <label htmlFor="search" className="block text-xs font-semibold text-slate-600 mb-1">Buscar</label>
            <input
              type="text"
              id="search"
              name="search"
              placeholder="Descrição"
              defaultValue={params.search}
              className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="type" className="block text-xs font-semibold text-slate-600 mb-1">Tipo</label>
            <select
              id="type"
              name="type"
              defaultValue={params.type || 'all'}
              className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todos</option>
              <option value="INCOME">Receitas</option>
              <option value="EXPENSE">Despesas</option>
              <option value="TRANSFER">Transferencias</option>
            </select>
          </div>
          <div>
            <label htmlFor="accountId" className="block text-xs font-semibold text-slate-600 mb-1">Conta</label>
            <select
              id="accountId"
              name="accountId"
              defaultValue={params.accountId || ''}
              className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todas</option>
              {accounts.map((account) => (
                <option key={account.id} value={account.id}>{account.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="categoryId" className="block text-xs font-semibold text-slate-600 mb-1">Categoria</label>
            <select
              id="categoryId"
              name="categoryId"
              defaultValue={params.categoryId || ''}
              className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todas</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="startDate" className="block text-xs font-semibold text-slate-600 mb-1">Data inicial</label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              defaultValue={params.startDate}
              className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="endDate" className="block text-xs font-semibold text-slate-600 mb-1">Data final</label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              defaultValue={params.endDate}
              className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-3">
            <button
              type="submit"
              className="flex-1 rounded-lg bg-blue-600 px-6 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600"
            >
              Aplicar filtros
            </button>
            <Link
              href="/transactions"
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600"
            >
              Limpar
            </Link>
          </div>
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
