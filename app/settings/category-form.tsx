'use client';

import { useState } from 'react';
import { createCategory, updateCategory } from './actions';

interface Category {
  id: string;
  name: string;
  icon: string | null;
}

interface CategoryFormProps {
  category?: Category;
}

export default function CategoryForm({ category }: CategoryFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    const formData = new FormData(e.currentTarget);

    try {
      if (category) {
        await updateCategory(formData);
      } else {
        await createCategory(formData);
      }
      setIsOpen(false);
      (e.target as HTMLFormElement).reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar categoria');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        aria-label={category ? 'Editar Categoria' : 'Nova Categoria'}
      >
        {category ? 'Editar' : '+ Nova Categoria'}
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-xl font-semibold text-slate-800">
            {category ? 'Editar Categoria' : 'Nova Categoria'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          {category && <input type="hidden" name="id" value={category.id} />}

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">
              Nome *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              defaultValue={category?.name}
              placeholder="Ex: Alimentação"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="icon" className="block text-sm font-medium text-slate-700 mb-1">
              Ícone (emoji)
            </label>
            <input
              type="text"
              id="icon"
              name="icon"
              defaultValue={category?.icon || ''}
              placeholder="🍔"
              maxLength={2}
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
