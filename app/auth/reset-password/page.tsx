"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { resetPassword } from "../actions";
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

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      setMessage("Token de recuperação não encontrado.");
    }
  }, [token]);

  async function handleSubmit(formData: FormData) {
    if (!token) return;

    formData.append("token", token);

    setIsLoading(true);
    setErrors({});
    setMessage("");
    setSuccess(false);

    const result = await resetPassword(formData);

    if (result?.success) {
      setSuccess(true);
      setTimeout(() => {
        router.push("/auth/login");
      }, 2000);
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

  if (!token) {
    return (
      <AuthCard>
        <AuthCardHeader>
          <AuthCardTitle>Link inválido</AuthCardTitle>
          <AuthCardDescription>
            Token de recuperação não encontrado
          </AuthCardDescription>
        </AuthCardHeader>
        <AuthCardContent>
          <Link href="/auth/forgot-password">
            <Button variant="outline" className="w-full">
              Solicitar novo link
            </Button>
          </Link>
        </AuthCardContent>
      </AuthCard>
    );
  }

  return (
    <AuthCard>
      <AuthCardHeader>
        <AuthCardTitle>Redefinir senha</AuthCardTitle>
        <AuthCardDescription>
          Digite sua nova senha abaixo
        </AuthCardDescription>
      </AuthCardHeader>

      <AuthCardContent>
        {success ? (
          <div className="space-y-4">
            <div className="rounded-lg bg-green-50 p-4 text-sm text-green-800">
              Senha redefinida com sucesso! Redirecionando para login...
            </div>
          </div>
        ) : (
          <form action={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Nova Senha</Label>
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
              <div className="rounded-lg bg-red-50 p-3 text-sm text-red-800">
                {message}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Redefinindo..." : "Redefinir senha"}
            </Button>
          </form>
        )}
      </AuthCardContent>

      <AuthCardFooter>
        <Link href="/auth/login" className="font-medium text-blue-600 hover:underline">
          Voltar para login
        </Link>
      </AuthCardFooter>
    </AuthCard>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <AuthCard>
        <AuthCardHeader>
          <AuthCardTitle>Carregando...</AuthCardTitle>
        </AuthCardHeader>
      </AuthCard>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}
