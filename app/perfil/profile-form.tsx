"use client";

import { useState } from "react";
import { updateProfile } from "@/app/auth/actions";

type Props = {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
  };
};

export function ProfileForm({ user }: Props) {
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const result = await updateProfile(user.id, formData);

    if (result.error) {
      setMessage({ type: "error", text: result.error });
    } else if (result.success) {
      setMessage({ type: "success", text: result.success });
    }
    setLoading(false);
  }

  return (
    <div className="bg-white dark:bg-slate-800 shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
        Dados Pessoais
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Nome completo
          </label>
          <input
            id="name"
            name="name"
            type="text"
            defaultValue={user.name || ""}
            required
            className="mt-1 block w-full rounded-md border border-slate-300 dark:border-slate-600 px-3 py-2 text-slate-900 dark:text-white dark:bg-slate-700 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            defaultValue={user.email || ""}
            required
            className="mt-1 block w-full rounded-md border border-slate-300 dark:border-slate-600 px-3 py-2 text-slate-900 dark:text-white dark:bg-slate-700 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          />
        </div>

        {message && (
          <div
            className={`rounded-md p-4 ${
              message.type === "success"
                ? "bg-green-50 dark:bg-green-900/20"
                : "bg-red-50 dark:bg-red-900/20"
            }`}
          >
            <p
              className={`text-sm ${
                message.type === "success"
                  ? "text-green-800 dark:text-green-300"
                  : "text-red-800 dark:text-red-300"
              }`}
            >
              {message.text}
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Salvando..." : "Salvar alterações"}
        </button>
      </form>
    </div>
  );
}
