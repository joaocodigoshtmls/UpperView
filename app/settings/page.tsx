import { prisma } from '@/lib/prisma';
import { getUserId } from '@/lib/user';
import { formatBRL } from '@/lib/format';
import AccountForm from './account-form';
import CategoryForm from './category-form';
import { deleteAccount, deleteCategory } from './actions';

export const revalidate = 0;

export default async function SettingsPage() {
  const userId = await getUserId();

  const accounts = await prisma.financialAccount.findMany({
    where: { userId },
    include: { institution: true },
    orderBy: { name: 'asc' },
  });

  const categories = await prisma.category.findMany({
    where: { userId },
    orderBy: { name: 'asc' },
  });

  const institutions = await prisma.institution.findMany({
    orderBy: { name: 'asc' },
  });

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-slate-800">Configurações</h1>

      {/* Accounts Section */}
      <section className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-slate-800">Contas Financeiras</h2>
          <AccountForm institutions={institutions} />
        </div>

        {accounts.length === 0 ? (
          <p className="text-slate-500">Nenhuma conta cadastrada.</p>
        ) : (
          <div className="space-y-3">
            {accounts.map((account) => (
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
                <div className="flex items-center gap-4">
                  <div className="text-lg font-semibold text-slate-800">
                    {formatBRL(Number(account.balance))}
                  </div>
                  <AccountForm account={account} institutions={institutions} />
                  <form action={deleteAccount}>
                    <input type="hidden" name="id" value={account.id} />
                    <button
                      type="submit"
                      className="text-red-600 hover:text-red-700 font-medium text-sm"
                      onClick={(e) => {
                        if (!confirm('Tem certeza que deseja excluir esta conta?')) {
                          e.preventDefault();
                        }
                      }}
                    >
                      Excluir
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Categories Section */}
      <section className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-slate-800">Categorias</h2>
          <CategoryForm />
        </div>

        {categories.length === 0 ? (
          <p className="text-slate-500">Nenhuma categoria cadastrada.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-3">
            {categories.map((category) => (
              <div
                key={category.id}
                className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  {category.icon && <span className="text-xl">{category.icon}</span>}
                  <span className="font-medium text-slate-800">{category.name}</span>
                  {category.isDefault && (
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                      Padrão
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <CategoryForm category={category} />
                  <form action={deleteCategory}>
                    <input type="hidden" name="id" value={category.id} />
                    <button
                      type="submit"
                      className="text-red-600 hover:text-red-700 font-medium text-sm"
                      onClick={(e) => {
                        if (!confirm('Tem certeza que deseja excluir esta categoria?')) {
                          e.preventDefault();
                        }
                      }}
                    >
                      Excluir
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
