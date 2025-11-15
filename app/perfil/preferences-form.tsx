"use client";

import { useState } from "react";
import { updatePreferences } from "@/app/auth/actions";
import { useTheme } from "next-themes";
import type { Currency, DefaultHome, ThemePreference } from "@prisma/client";

type Props = {
  user: {
    id: string;
    preferredCurrency: Currency;
    defaultHome: DefaultHome;
    themePreference: ThemePreference;
    emailNotifications: boolean;
  };
};

export function PreferencesForm({ user }: Props) {
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const { setTheme } = useTheme();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const result = await updatePreferences(user.id, formData);

    if (result.error) {
      setMessage({ type: "error", text: result.error });
    } else if (result.success) {
      setMessage({ type: "success", text: result.success });
      
      // Update theme immediately
      const themePreference = formData.get("themePreference") as ThemePreference;
      if (themePreference === "SYSTEM") {
        setTheme("system");
      } else if (themePreference === "LIGHT") {
        setTheme("light");
      } else if (themePreference === "DARK") {
        setTheme("dark");
      }
    }
    setLoading(false);
  }

  return (
    <div className="bg-white dark:bg-slate-800 shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
        Preferências
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="preferredCurrency" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Moeda padrão
          </label>
          <select
            id="preferredCurrency"
            name="preferredCurrency"
            defaultValue={user.preferredCurrency}
            className="mt-1 block w-full rounded-md border border-slate-300 dark:border-slate-600 px-3 py-2 text-slate-900 dark:text-white dark:bg-slate-700 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          >
            <option value="BRL">Real (BRL)</option>
            <option value="USD">Dólar (USD)</option>
          </select>
        </div>

        <div>
          <label htmlFor="defaultHome" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Tela inicial padrão
          </label>
          <select
            id="defaultHome"
            name="defaultHome"
            defaultValue={user.defaultHome}
            className="mt-1 block w-full rounded-md border border-slate-300 dark:border-slate-600 px-3 py-2 text-slate-900 dark:text-white dark:bg-slate-700 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          >
            <option value="DASHBOARD">Dashboard</option>
            <option value="TRANSACTIONS">Transações</option>
            <option value="SETTINGS">Configurações</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Tema
          </label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                name="themePreference"
                value="SYSTEM"
                defaultChecked={user.themePreference === "SYSTEM"}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300"
              />
              <span className="ml-2 text-sm text-slate-700 dark:text-slate-300">
                Seguir sistema
              </span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="themePreference"
                value="LIGHT"
                defaultChecked={user.themePreference === "LIGHT"}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300"
              />
              <span className="ml-2 text-sm text-slate-700 dark:text-slate-300">
                Claro
              </span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="themePreference"
                value="DARK"
                defaultChecked={user.themePreference === "DARK"}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300"
              />
              <span className="ml-2 text-sm text-slate-700 dark:text-slate-300">
                Escuro
              </span>
            </label>
          </div>
        </div>

        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              name="emailNotifications"
              value="true"
              defaultChecked={user.emailNotifications}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
            />
            <span className="ml-2 text-sm text-slate-700 dark:text-slate-300">
              Receber emails sobre metas e alertas importantes
            </span>
          </label>
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
          {loading ? "Salvando..." : "Salvar preferências"}
        </button>
      </form>
    </div>
  );
}
