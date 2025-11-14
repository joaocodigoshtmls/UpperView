"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { revalidatePath } from "next/cache";

// Update profile schema
const updateProfileSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  preferredCurrency: z.enum(["BRL", "USD"]),
  preferredLanguage: z.string(),
});

// Change password schema
const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Senha atual é obrigatória"),
  newPassword: z
    .string()
    .min(8, "A senha deve ter pelo menos 8 caracteres")
    .regex(/[A-Z]/, "A senha deve conter pelo menos uma letra maiúscula")
    .regex(/[a-z]/, "A senha deve conter pelo menos uma letra minúscula")
    .regex(/[0-9]/, "A senha deve conter pelo menos um número"),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

export async function updateProfile(formData: FormData) {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      errors: {},
      message: "Não autenticado.",
    };
  }

  const rawData = {
    name: formData.get("name"),
    preferredCurrency: formData.get("preferredCurrency"),
    preferredLanguage: formData.get("preferredLanguage"),
  };

  const validatedFields = updateProfileSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Campos inválidos. Por favor, verifique os dados.",
    };
  }

  const { name, preferredCurrency, preferredLanguage } = validatedFields.data;

  try {
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name,
        preferredCurrency,
        preferredLanguage,
      },
    });

    revalidatePath("/profile");

    return {
      success: true,
      message: "Perfil atualizado com sucesso!",
    };
  } catch (error) {
    console.error("Update profile error:", error);
    return {
      errors: {},
      message: "Erro ao atualizar perfil. Tente novamente.",
    };
  }
}

export async function changePassword(formData: FormData) {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      errors: {},
      message: "Não autenticado.",
    };
  }

  const rawData = {
    currentPassword: formData.get("currentPassword"),
    newPassword: formData.get("newPassword"),
    confirmPassword: formData.get("confirmPassword"),
  };

  const validatedFields = changePasswordSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Campos inválidos. Por favor, verifique os dados.",
    };
  }

  const { currentPassword, newPassword } = validatedFields.data;

  try {
    // Get user with password hash
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { passwordHash: true },
    });

    if (!user || !user.passwordHash) {
      return {
        errors: {},
        message: "Usuário não encontrado ou sem senha definida.",
      };
    }

    // Verify current password
    const passwordsMatch = await bcrypt.compare(currentPassword, user.passwordHash);

    if (!passwordsMatch) {
      return {
        errors: { currentPassword: ["Senha atual incorreta"] },
        message: "Senha atual incorreta.",
      };
    }

    // Hash new password
    const passwordHash = await bcrypt.hash(newPassword, 10);

    // Update password
    await prisma.user.update({
      where: { id: session.user.id },
      data: { passwordHash },
    });

    return {
      success: true,
      message: "Senha alterada com sucesso!",
    };
  } catch (error) {
    console.error("Change password error:", error);
    return {
      errors: {},
      message: "Erro ao alterar senha. Tente novamente.",
    };
  }
}
