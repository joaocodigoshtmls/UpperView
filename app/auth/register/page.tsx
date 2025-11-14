"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { register } from "../actions";
import {
  AuthCard,
  AuthCardHeader,
  AuthCardTitle,
  AuthCardDescription,
  AuthCardContent,
  AuthCardFooter,
} from "@/components/auth/auth-card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function RegisterPage() {
  const router = useRouter();
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    setErrors({});
    setMessage("");

    const result = await register(formData);

    if (result?.success) {
      router.push("/dashboard");
      return;
    }

    if (result?.errors) {
      setErrors(result.errors);
    }
    if (result?.message) {
      setMessage(result.message);
    }
    setIsLoading(false);
  }

  return (
    <AuthCard>
      <AuthCardHeader>
        <AuthCardTitle>Crie sua conta</AuthCardTitle>
        <AuthCardDescription>
          Comece a organizar sua vida financeira hoje
        </AuthCardDescription>
      </AuthCardHeader>

      <AuthCardContent>
        <form action={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              name="name"
              type="text"
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
              placeholder="seu@email.com"
              required
            />
            {errors.email && (
              <p className="text-sm text-red-600">{errors.email[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              required
            />
            {errors.password && (
              <p className="text-sm text-red-600">{errors.password[0]}</p>
            )}
            <p className="text-xs text-slate-500">
              Mínimo 8 caracteres, 1 maiúscula, 1 minúscula e 1 número
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar Senha</Label>
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
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-800">
              {message}
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Criando conta..." : "Criar conta"}
          </Button>
        </form>
      </AuthCardContent>

      <AuthCardFooter>
        Já tem conta?{" "}
        <Link href="/auth/login" className="font-medium text-blue-600 hover:underline">
          Entrar
        </Link>
      </AuthCardFooter>
    </AuthCard>
  );
}
