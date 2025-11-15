"use client";

import { useState } from "react";
import Link from "next/link";
import { forgotPassword } from "@/app/auth/actions";

export default function EsqueciSenhaPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setToken("");
    setLoading(true);

    try {
      const result = await forgotPassword({ email });

      if (result.success) {
        if ("message" in result) {
          setMessage(result.message);
        }
        if ("token" in result && result.token) {
          setToken(result.token);
        }
      } else {
        setError(result.error || "Erro ao processar solicitação");
      }
    } catch (err) {
      setError("Erro ao processar solicitação. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-blue-600 mb-2">UpperView</h1>
            <p className="text-slate-600">Esqueceu sua senha?</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          {message && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
              {message}
            </div>
          )}

          {token && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg text-sm">
              <p className="font-medium mb-2">Token de desenvolvimento:</p>
              <Link
                href={`/redefinir-senha/${token}`}
                className="text-blue-600 hover:text-blue-700 underline break-all"
              >
                Clique aqui para redefinir sua senha
              </Link>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="seu@email.com"
              />
              <p className="mt-1 text-xs text-slate-500">
                Enviaremos instruções para redefinir sua senha
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Enviando..." : "Enviar instruções"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-600">
            Lembrou sua senha?{" "}
            <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
              Voltar para login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
