"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { signIn } from "@/auth";
import crypto from "crypto";

// Validation schemas
const registerSchema = z.object({
  name: z.string().min(2, "Nome deve ter no mínimo 2 caracteres"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
});

const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(1, "Senha é obrigatória"),
});

const forgotPasswordSchema = z.object({
  email: z.string().email("Email inválido"),
});

const resetPasswordSchema = z.object({
  token: z.string(),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
});

const updateProfileSchema = z.object({
  name: z.string().min(2, "Nome deve ter no mínimo 2 caracteres"),
  email: z.string().email("Email inválido"),
});

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Senha atual é obrigatória"),
  newPassword: z.string().min(6, "Nova senha deve ter no mínimo 6 caracteres"),
});

// Register action
export async function register(data: unknown) {
  try {
    const validated = registerSchema.parse(data);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validated.email },
    });

    if (existingUser) {
      return {
        success: false,
        error: "Email já está em uso",
      };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(validated.password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        name: validated.name,
        email: validated.email,
        password: hashedPassword,
      },
    });

    return {
      success: true,
      message: "Cadastro realizado com sucesso! Faça login para continuar.",
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.errors[0].message,
      };
    }
    return {
      success: false,
      error: "Erro ao criar conta. Tente novamente.",
    };
  }
}

// Login action
export async function login(data: unknown) {
  try {
    const validated = loginSchema.parse(data);

    const result = await signIn("credentials", {
      email: validated.email,
      password: validated.password,
      redirect: false,
    });

    return {
      success: true,
      message: "Login realizado com sucesso!",
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.errors[0].message,
      };
    }
    return {
      success: false,
      error: "Email ou senha inválidos",
    };
  }
}

// Forgot password action
export async function forgotPassword(data: unknown) {
  try {
    const validated = forgotPasswordSchema.parse(data);

    const user = await prisma.user.findUnique({
      where: { email: validated.email },
    });

    if (!user) {
      // Don't reveal if user exists for security
      return {
        success: true,
        message: "Se o email existir, você receberá instruções para redefinir sua senha.",
      };
    }

    // Generate reset token
    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 3600000); // 1 hour

    // Delete any existing tokens for this user
    await prisma.passwordResetToken.deleteMany({
      where: { userId: user.id },
    });

    // Create new token
    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        token,
        expires,
      },
    });

    // In production, send email here
    // For now, log the token (REMOVE IN PRODUCTION)
    console.log(`Password reset token for ${user.email}: ${token}`);

    return {
      success: true,
      message: "Se o email existir, você receberá instruções para redefinir sua senha.",
      // In development, return token for testing (REMOVE IN PRODUCTION)
      ...(process.env.NODE_ENV === "development" && { token }),
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.errors[0].message,
      };
    }
    return {
      success: false,
      error: "Erro ao processar solicitação. Tente novamente.",
    };
  }
}

// Reset password action
export async function resetPassword(data: unknown) {
  try {
    const validated = resetPasswordSchema.parse(data);

    // Find valid token
    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token: validated.token },
      include: { user: true },
    });

    if (!resetToken || resetToken.expires < new Date()) {
      return {
        success: false,
        error: "Token inválido ou expirado",
      };
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(validated.password, 10);

    // Update password
    await prisma.user.update({
      where: { id: resetToken.userId },
      data: { password: hashedPassword },
    });

    // Delete used token
    await prisma.passwordResetToken.delete({
      where: { id: resetToken.id },
    });

    return {
      success: true,
      message: "Senha redefinida com sucesso! Faça login com sua nova senha.",
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.errors[0].message,
      };
    }
    return {
      success: false,
      error: "Erro ao redefinir senha. Tente novamente.",
    };
  }
}

// Update profile action
export async function updateProfile(userId: string, data: unknown) {
  try {
    const validated = updateProfileSchema.parse(data);

    // Check if email is already in use by another user
    const existingUser = await prisma.user.findUnique({
      where: { email: validated.email },
    });

    if (existingUser && existingUser.id !== userId) {
      return {
        success: false,
        error: "Email já está em uso",
      };
    }

    // Update user
    await prisma.user.update({
      where: { id: userId },
      data: {
        name: validated.name,
        email: validated.email,
      },
    });

    return {
      success: true,
      message: "Perfil atualizado com sucesso!",
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.errors[0].message,
      };
    }
    return {
      success: false,
      error: "Erro ao atualizar perfil. Tente novamente.",
    };
  }
}

// Change password action
export async function changePassword(userId: string, data: unknown) {
  try {
    const validated = changePasswordSchema.parse(data);

    // Get user
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.password) {
      return {
        success: false,
        error: "Usuário não encontrado",
      };
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(
      validated.currentPassword,
      user.password
    );

    if (!isPasswordValid) {
      return {
        success: false,
        error: "Senha atual incorreta",
      };
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(validated.newPassword, 10);

    // Update password
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return {
      success: true,
      message: "Senha alterada com sucesso!",
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.errors[0].message,
      };
    }
    return {
      success: false,
      error: "Erro ao alterar senha. Tente novamente.",
    };
  }
}
