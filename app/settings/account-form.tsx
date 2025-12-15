'use client';

import { useState } from 'react';
import { createAccount, updateAccount } from './actions';
import { AccountType, Currency } from '@prisma/client';

interface Institution {
  id: string;
  name: string;
}

interface Account {
  id: string;
  name: string;
  type: AccountType;
  currency: Currency;
  balance: any;
  institutionId: string | null;
}

interface AccountFormProps {
  account?: Account;
  institutions: Institution[];
}

export default function AccountForm({ account, institutions }: AccountFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const closeDialog = () => {
    setIsOpen(false);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    const formData = new FormData(e.currentTarget);

    try {
      if (account) {
        await updateAccount(formData);
      } else {
        await createAccount(formData);
      }
      closeDialog();
      (e.target as HTMLFormElement).reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar conta');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        aria-label={account ? 'Editar Conta' : 'Nova Conta'}
      >
        {account ? 'Editar' : '+ Nova Conta'}
      </button>
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="account-dialog-title"
    >
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full" role="document">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-start justify-between gap-3">
            <h2 id="account-dialog-title" className="text-xl font-semibold text-slate-800">
              {account ? 'Editar Conta' : 'Nova Conta'}
            </h2>
            <button
              type="button"
              onClick={closeDialog}
              className="rounded-md p-1 text-slate-500 hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600"
              aria-label="Fechar"
            >
              ✕
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm" role="alert" aria-live="assertive">
              {error}
            </div>
          )}

          {account && <input type="hidden" name="id" value={account.id} />}

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">
              Nome *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              defaultValue={account?.name}
              placeholder="Ex: Conta Corrente"
              maxLength={80}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="type" className="block text-sm font-medium text-slate-700 mb-1">
              Tipo *
            </label>
            <select
              id="type"
              name="type"
              required
              defaultValue={account?.type}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="CHECKING">Conta Corrente</option>
              <option value="SAVINGS">Poupança</option>
              <option value="CREDIT_CARD">Cartão de Crédito</option>
              <option value="CASH">Dinheiro</option>
              <option value="PAYMENT_APP">App de Pagamento</option>
              <option value="INVESTMENT">Investimentos</option>
            </select>
          </div>

          <div>
            <label htmlFor="institutionId" className="block text-sm font-medium text-slate-700 mb-1">
              Instituição
            </label>
            <select
              id="institutionId"
              name="institutionId"
              defaultValue={account?.institutionId || ''}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Nenhuma</option>
              {institutions.map((inst) => (
                <option key={inst.id} value={inst.id}>
                  {inst.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="currency" className="block text-sm font-medium text-slate-700 mb-1">
              Moeda *
            </label>
            <select
              id="currency"
              name="currency"
              required
              defaultValue={account?.currency || 'BRL'}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="BRL">BRL (Real)</option>
              <option value="USD">USD (Dólar)</option>
            </select>
          </div>

          <div>
            <label htmlFor="balance" className="block text-sm font-medium text-slate-700 mb-1">
              Saldo *
            </label>
            <input
              type="number"
              id="balance"
              name="balance"
              step="0.01"
              required
              defaultValue={account ? Number(account.balance) : 0}
              placeholder="0.00"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={closeDialog}
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
            >
              {isSubmitting ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
