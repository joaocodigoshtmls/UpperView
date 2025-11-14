"use client";

import { useState } from "react";
import { changePassword } from "./actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function PasswordForm() {
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    setIsLoading(true);
    setErrors({});
    setMessage("");
    setSuccess(false);

    const result = await changePassword(formData);

    if (result?.success) {
      setSuccess(true);
      setMessage(result.message || "");
      e.currentTarget.reset();
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
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="currentPassword">Senha Atual</Label>
        <Input
          id="currentPassword"
          name="currentPassword"
          type="password"
          placeholder="••••••••"
          required
        />
        {errors.currentPassword && (
          <p className="text-sm text-red-600">{errors.currentPassword[0]}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="newPassword">Nova Senha</Label>
        <Input
          id="newPassword"
          name="newPassword"
          type="password"
          placeholder="••••••••"
          required
        />
        {errors.newPassword && (
          <p className="text-sm text-red-600">{errors.newPassword[0]}</p>
        )}
        <p className="text-xs text-slate-500">
          Mínimo 8 caracteres, 1 maiúscula, 1 minúscula e 1 número
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          placeholder="••••••••"
          required
        />
        {errors.confirmPassword && (
          <p className="text-sm text-red-600">{errors.confirmPassword[0]}</p>
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
        {isLoading ? "Alterando..." : "Alterar senha"}
      </Button>
    </form>
  );
}
