"use client";

import { useState } from "react";
import { updateProfile } from "./actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface ProfileFormProps {
  user: {
    id: string;
    name: string | null;
    email: string | null;
    preferredCurrency: string;
    preferredLanguage: string;
  };
}

export default function ProfileForm({ user }: ProfileFormProps) {
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    setErrors({});
    setMessage("");
    setSuccess(false);

    const result = await updateProfile(formData);

    if (result?.success) {
      setSuccess(true);
      setMessage(result.message || "");
      setTimeout(() => {
        setSuccess(false);
        setMessage("");
      }, 3000);
    } else {
      if (result?.errors) {
        setErrors(result.errors);
      }
      if (result?.message) {
        setMessage(result.message);
      }
    }
    setIsLoading(false);
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nome</Label>
        <Input
          id="name"
          name="name"
          type="text"
          defaultValue={user.name || ""}
          placeholder="Seu nome completo"
          required
        />
        {errors.name && (
          <p className="text-sm text-red-600">{errors.name[0]}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          defaultValue={user.email || ""}
          disabled
          className="bg-slate-50 cursor-not-allowed"
        />
        <p className="text-xs text-slate-500">
          O email não pode ser alterado no momento
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="preferredCurrency">Moeda Padrão</Label>
        <select
          id="preferredCurrency"
          name="preferredCurrency"
          defaultValue={user.preferredCurrency}
          className="flex h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          required
        >
          <option value="BRL">Real (BRL)</option>
          <option value="USD">Dólar (USD)</option>
        </select>
        {errors.preferredCurrency && (
          <p className="text-sm text-red-600">{errors.preferredCurrency[0]}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="preferredLanguage">Idioma</Label>
        <select
          id="preferredLanguage"
          name="preferredLanguage"
          defaultValue={user.preferredLanguage}
          className="flex h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          required
        >
          <option value="pt-BR">Português (Brasil)</option>
          <option value="en-US">English (US)</option>
        </select>
        {errors.preferredLanguage && (
          <p className="text-sm text-red-600">{errors.preferredLanguage[0]}</p>
        )}
      </div>

      {message && (
        <div
          className={`rounded-lg p-3 text-sm ${
            success
              ? "bg-green-50 text-green-800"
              : "bg-red-50 text-red-800"
          }`}
        >
          {message}
        </div>
      )}

      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Salvando..." : "Salvar alterações"}
      </Button>
    </form>
  );
}
