'use client';

import { useState } from 'react';
import { createTransaction } from './actions';

interface Account {
  id: string;
  name: string;
}

interface Category {
  id: string;
  name: string;
}

interface TransactionDialogProps {
  accounts: Account[];
  categories: Category[];
}

export default function TransactionDialog({ accounts, categories }: TransactionDialogProps) {
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
      await createTransaction(formData);
      closeDialog();
      (e.target as HTMLFormElement).reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar transação');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600"
        aria-label="Nova Transação"
      >
        + Nova Transação
      </button>
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="new-transaction-title"
    >
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full" role="document">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-start justify-between gap-3">
            <h2 id="new-transaction-title" className="text-xl font-semibold text-slate-800">
              Nova Transação
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

          <div>
            <label htmlFor="type" className="block text-sm font-medium text-slate-700 mb-1">
              Tipo *
            </label>
            <select
              id="type"
              name="type"
              required
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="INCOME">Receita</option>
              <option value="EXPENSE">Despesa</option>
              <option value="TRANSFER">Transferência</option>
            </select>
          </div>

          <div>
            <label htmlFor="accountId" className="block text-sm font-medium text-slate-700 mb-1">
              Conta *
            </label>
            <select
              id="accountId"
              name="accountId"
              required
              autoFocus
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Selecione uma conta</option>
              {accounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="categoryId" className="block text-sm font-medium text-slate-700 mb-1">
              Categoria
            </label>
            <select
              id="categoryId"
              name="categoryId"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Nenhuma</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-slate-700 mb-1">
              Valor (R$) *
            </label>
            <input
              type="number"
              id="amount"
              name="amount"
              step="0.01"
              min="0.01"
              required
              placeholder="0.00"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="occurredAt" className="block text-sm font-medium text-slate-700 mb-1">
              Data *
            </label>
            <input
              type="date"
              id="occurredAt"
              name="occurredAt"
              required
              defaultValue={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-1">
              Descrição
            </label>
            <input
              type="text"
              id="description"
              name="description"
              placeholder="Ex: Compra no supermercado"
              maxLength={120}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
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
