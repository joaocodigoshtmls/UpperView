"use client";

import { useState } from "react";
import Link from "next/link";
import { forgotPassword } from "../actions";
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

export default function ForgotPasswordPage() {
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    setErrors({});
    setMessage("");
    setSuccess(false);

    const result = await forgotPassword(formData);

    if (result?.success) {
      setSuccess(true);
      setMessage(result.message || "");
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
    <AuthCard>
      <AuthCardHeader>
        <AuthCardTitle>Esqueceu sua senha?</AuthCardTitle>
        <AuthCardDescription>
          Digite seu email e enviaremos instruções para recuperá-la
        </AuthCardDescription>
      </AuthCardHeader>

      <AuthCardContent>
        {success ? (
          <div className="space-y-4">
            <div className="rounded-lg bg-green-50 p-4 text-sm text-green-800">
              {message}
            </div>
            <Link href="/auth/login">
              <Button variant="outline" className="w-full">
                Voltar para login
              </Button>
            </Link>
          </div>
        ) : (
          <form action={handleSubmit} className="space-y-4">
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

            {message && !success && (
              <div className="rounded-lg bg-red-50 p-3 text-sm text-red-800">
                {message}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Enviando..." : "Enviar link de recuperação"}
            </Button>
          </form>
        )}
      </AuthCardContent>

      <AuthCardFooter>
        Lembrou sua senha?{" "}
        <Link href="/auth/login" className="font-medium text-blue-600 hover:underline">
          Voltar para login
        </Link>
      </AuthCardFooter>
    </AuthCard>
  );
}
