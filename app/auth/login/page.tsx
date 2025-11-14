"use client";

import { useFormState, useFormStatus } from "react-dom";
import Link from "next/link";
import { login } from "../actions";
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

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? "Entrando..." : "Entrar"}
    </Button>
  );
}

export default function LoginPage() {
  const [errorMessage, dispatch] = useFormState(login, undefined);

  return (
    <AuthCard>
      <AuthCardHeader>
        <AuthCardTitle>Entre na sua conta</AuthCardTitle>
        <AuthCardDescription>
          Acesse sua conta UpperView para continuar
        </AuthCardDescription>
      </AuthCardHeader>

      <AuthCardContent>
        <form action={dispatch} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="seu@email.com"
              required
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Senha</Label>
              <Link
                href="/auth/forgot-password"
                className="text-sm text-blue-600 hover:underline"
              >
                Esqueceu a senha?
              </Link>
            </div>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              required
            />
          </div>

          {errorMessage && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-800">
              {errorMessage}
            </div>
          )}

          <SubmitButton />
        </form>
      </AuthCardContent>

      <AuthCardFooter>
        Não tem conta?{" "}
        <Link href="/auth/register" className="font-medium text-blue-600 hover:underline">
          Cadastre-se
        </Link>
      </AuthCardFooter>
    </AuthCard>
  );
}
