"use server";

import { signIn, signOut } from "@/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { AuthError } from "next-auth";
import { getDefaultHomePath } from "@/lib/routes";

const signupSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
});

const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(1, "Senha é obrigatória"),
});

const passwordChangeSchema = z.object({
  currentPassword: z.string().min(1, "Senha atual é obrigatória"),
  newPassword: z.string().min(6, "Nova senha deve ter pelo menos 6 caracteres"),
  confirmPassword: z.string().min(1, "Confirmação de senha é obrigatória"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

const profileUpdateSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
});

const preferencesSchema = z.object({
  preferredCurrency: z.enum(["BRL", "USD"]),
  defaultHome: z.enum(["DASHBOARD", "TRANSACTIONS", "SETTINGS"]),
  themePreference: z.enum(["SYSTEM", "LIGHT", "DARK"]),
  emailNotifications: z.boolean(),
});

export async function signup(formData: FormData) {
  try {
    const validatedData = signupSchema.parse({
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
    });

    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      return { error: "Este email já está cadastrado" };
    }

    const hashedPassword = await bcrypt.hash(validatedData.password, 10);

    const user = await prisma.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        password: hashedPassword,
      },
    });

    await signIn("credentials", {
      email: validatedData.email,
      password: validatedData.password,
      redirect: false,
    });

    return { 
      success: true, 
      redirectTo: getDefaultHomePath(user.defaultHome) 
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message };
    }
    return { error: "Ops, algo deu errado. Tente novamente." };
  }
}

export async function login(formData: FormData) {
  try {
    const validatedData = loginSchema.parse({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    const user = await prisma.user.findUnique({
      where: { email: validatedData.email },
      select: { defaultHome: true },
    });

    await signIn("credentials", {
      email: validatedData.email,
      password: validatedData.password,
      redirect: false,
    });

    return { 
      success: true,
      redirectTo: getDefaultHomePath(user?.defaultHome)
    };
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Email ou senha inválidos" };
    }
    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message };
    }
    return { error: "Ops, algo deu errado. Tente novamente." };
  }
}

export async function logout() {
  await signOut({ redirectTo: "/login" });
}

export async function updateProfile(userId: string, formData: FormData) {
  try {
    const validatedData = profileUpdateSchema.parse({
      name: formData.get("name"),
      email: formData.get("email"),
    });

    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser && existingUser.id !== userId) {
      return { error: "Este email já está em uso" };
    }

    await prisma.user.update({
      where: { id: userId },
      data: validatedData,
    });

    return { success: "Perfil atualizado com sucesso" };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message };
    }
    return { error: "Ops, algo deu errado. Tente novamente." };
  }
}

export async function changePassword(userId: string, formData: FormData) {
  try {
    const validatedData = passwordChangeSchema.parse({
      currentPassword: formData.get("currentPassword"),
      newPassword: formData.get("newPassword"),
      confirmPassword: formData.get("confirmPassword"),
    });

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.password) {
      return { error: "Usuário não encontrado" };
    }

    const isPasswordValid = await bcrypt.compare(
      validatedData.currentPassword,
      user.password
    );

    if (!isPasswordValid) {
      return { error: "Senha atual incorreta" };
    }

    const hashedPassword = await bcrypt.hash(validatedData.newPassword, 10);

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return { success: "Senha alterada com sucesso" };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message };
    }
    return { error: "Ops, algo deu errado. Tente novamente." };
  }
}

export async function updatePreferences(userId: string, formData: FormData) {
  try {
    const validatedData = preferencesSchema.parse({
      preferredCurrency: formData.get("preferredCurrency"),
      defaultHome: formData.get("defaultHome"),
      themePreference: formData.get("themePreference"),
      emailNotifications: formData.get("emailNotifications") === "true",
    });

    await prisma.user.update({
      where: { id: userId },
      data: validatedData,
    });

    return { success: "Preferências atualizadas com sucesso" };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message };
    }
    return { error: "Ops, algo deu errado. Tente novamente." };
  }
}
