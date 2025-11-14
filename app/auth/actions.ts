"use server";

import { signIn, signOut } from "@/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";

// Simple in-memory rate limiting
const loginAttempts = new Map<string, { count: number; resetAt: number }>();

const MAX_ATTEMPTS = 5;
const LOCKOUT_TIME = 5 * 60 * 1000; // 5 minutes

function checkRateLimit(identifier: string): boolean {
  const now = Date.now();
  const attempts = loginAttempts.get(identifier);

  if (!attempts || attempts.resetAt < now) {
    loginAttempts.set(identifier, { count: 1, resetAt: now + LOCKOUT_TIME });
    return true;
  }

  if (attempts.count >= MAX_ATTEMPTS) {
    return false;
  }

  attempts.count++;
  return true;
}

// Password validation schema
const passwordSchema = z
  .string()
  .min(8, "A senha deve ter pelo menos 8 caracteres")
  .regex(/[A-Z]/, "A senha deve conter pelo menos uma letra maiúscula")
  .regex(/[a-z]/, "A senha deve conter pelo menos uma letra minúscula")
  .regex(/[0-9]/, "A senha deve conter pelo menos um número");

// Register schema
const registerSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  password: passwordSchema,
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

// Login schema
const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(1, "Senha é obrigatória"),
});

// Forgot password schema
const forgotPasswordSchema = z.object({
  email: z.string().email("Email inválido"),
});

// Reset password schema
const resetPasswordSchema = z.object({
  token: z.string(),
  password: passwordSchema,
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

export async function register(formData: FormData) {
  const rawData = {
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  };

  const validatedFields = registerSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Campos inválidos. Por favor, verifique os dados.",
    };
  }

  const { name, email, password } = validatedFields.data;

  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return {
        errors: {},
        message: "Um usuário com este email já existe.",
      };
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
      },
    });

    // Auto-login after registration
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    return { success: true };
  } catch (error) {
    console.error("Registration error:", error);
    return {
      errors: {},
      message: "Erro ao criar conta. Tente novamente.",
    };
  }
}

export async function login(
  prevState: string | undefined,
  formData: FormData
) {
  const rawData = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const validatedFields = loginSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return "Email ou senha inválidos.";
  }

  const { email } = validatedFields.data;

  // Check rate limit
  if (!checkRateLimit(email)) {
    return "Muitas tentativas de login. Tente novamente em alguns minutos.";
  }

  try {
    await signIn("credentials", {
      ...rawData,
      redirectTo: "/dashboard",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Email ou senha inválidos.";
        default:
          return "Erro ao fazer login. Tente novamente.";
      }
    }
    throw error;
  }
}

export async function logout() {
  await signOut({ redirectTo: "/auth/login" });
}

export async function forgotPassword(formData: FormData) {
  const rawData = {
    email: formData.get("email"),
  };

  const validatedFields = forgotPasswordSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Email inválido.",
    };
  }

  const { email } = validatedFields.data;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Don't reveal if user exists
    if (!user) {
      return {
        success: true,
        message: "Se este email existir, enviaremos um link de recuperação.",
      };
    }

    // Generate reset token
    const token = crypto.randomUUID();
    const expires = new Date(Date.now() + 3600 * 1000); // 1 hour

    await prisma.passwordReset.create({
      data: {
        userId: user.id,
        token,
        expires,
      },
    });

    // TODO: Send email with reset link
    // For now, just log it (in production, use a proper email service)
    console.log(`Password reset token for ${email}: ${token}`);
    console.log(`Reset link: ${process.env.NEXTAUTH_URL}/auth/reset-password?token=${token}`);

    return {
      success: true,
      message: "Se este email existir, enviaremos um link de recuperação.",
    };
  } catch (error) {
    console.error("Forgot password error:", error);
    return {
      errors: {},
      message: "Erro ao processar solicitação. Tente novamente.",
    };
  }
}

export async function resetPassword(formData: FormData) {
  const rawData = {
    token: formData.get("token"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  };

  const validatedFields = resetPasswordSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Campos inválidos. Por favor, verifique os dados.",
    };
  }

  const { token, password } = validatedFields.data;

  try {
    // Find valid reset token
    const resetToken = await prisma.passwordReset.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!resetToken || resetToken.used || resetToken.expires < new Date()) {
      return {
        errors: {},
        message: "Token inválido ou expirado.",
      };
    }

    // Hash new password
    const passwordHash = await bcrypt.hash(password, 10);

    // Update user password and mark token as used
    await prisma.$transaction([
      prisma.user.update({
        where: { id: resetToken.userId },
        data: { passwordHash },
      }),
      prisma.passwordReset.update({
        where: { id: resetToken.id },
        data: { used: true },
      }),
    ]);

    return { success: true };
  } catch (error) {
    console.error("Reset password error:", error);
    return {
      errors: {},
      message: "Erro ao redefinir senha. Tente novamente.",
    };
  }
}
