"use client";

import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // TODO: Implement password reset email logic
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 px-4">
        <div className="max-w-md w-full space-y-8 text-center">
          <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg">
            <h2 className="text-2xl font-bold text-green-800 dark:text-green-300 mb-2">
              Email enviado!
            </h2>
            <p className="text-green-700 dark:text-green-400">
              Se existe uma conta com o email informado, você receberá instruções para redefinir sua senha.
            </p>
          </div>
          <Link
            href="/login"
            className="inline-block text-blue-600 hover:text-blue-500 dark:text-blue-400 font-medium"
          >
            Voltar para o login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 px-4">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Esqueceu sua senha?
          </h2>
          <p className="mt-2 text-center text-sm text-slate-600 dark:text-slate-400">
            Não se preocupe, vamos te ajudar a recuperar o acesso.
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Email cadastrado
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-md border border-slate-300 dark:border-slate-600 px-3 py-2 text-slate-900 dark:text-white dark:bg-slate-800 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              placeholder="seu@email.com"
            />
          </div>

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Enviar instruções
            </button>
          </div>

          <div className="text-center text-sm">
            <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400">
              Voltar para o login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
