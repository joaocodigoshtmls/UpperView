'use server';

import { prisma } from '@/lib/prisma';
import { getUserId } from '@/lib/user';
import { AccountType, Currency } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

// Account actions
const accountSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  type: z.nativeEnum(AccountType),
  currency: z.nativeEnum(Currency),
  balance: z.number(),
  institutionId: z.string().optional(),
});

export async function createAccount(formData: FormData) {
  const userId = await getUserId();

  const data = {
    name: formData.get('name') as string,
    type: formData.get('type') as AccountType,
    currency: formData.get('currency') as Currency,
    balance: parseFloat(formData.get('balance') as string),
    institutionId: (formData.get('institutionId') as string) || null,
  };

  const validated = accountSchema.parse({
    ...data,
    institutionId: data.institutionId || undefined,
  });

  await prisma.financialAccount.create({
    data: {
      userId,
      name: validated.name,
      type: validated.type,
      currency: validated.currency,
      balance: validated.balance,
      institutionId: validated.institutionId || null,
    },
  });

  revalidatePath('/settings');
  revalidatePath('/dashboard');
}

export async function updateAccount(formData: FormData) {
  const userId = await getUserId();
  const id = formData.get('id') as string;

  const data = {
    name: formData.get('name') as string,
    type: formData.get('type') as AccountType,
    currency: formData.get('currency') as Currency,
    balance: parseFloat(formData.get('balance') as string),
    institutionId: (formData.get('institutionId') as string) || null,
  };

  const validated = accountSchema.parse({
    ...data,
    institutionId: data.institutionId || undefined,
  });

  // Check ownership
  const account = await prisma.financialAccount.findFirst({
    where: { id, userId },
  });

  if (!account) {
    throw new Error('Conta não encontrada');
  }

  await prisma.financialAccount.update({
    where: { id },
    data: {
      name: validated.name,
      type: validated.type,
      currency: validated.currency,
      balance: validated.balance,
      institutionId: validated.institutionId || null,
    },
  });

  revalidatePath('/settings');
  revalidatePath('/dashboard');
}

export async function deleteAccount(formData: FormData) {
  const userId = await getUserId();
  const id = formData.get('id') as string;

  // Check ownership
  const account = await prisma.financialAccount.findFirst({
    where: { id, userId },
  });

  if (!account) {
    throw new Error('Conta não encontrada');
  }

  await prisma.financialAccount.delete({
    where: { id },
  });

  revalidatePath('/settings');
  revalidatePath('/dashboard');
}

// Category actions
const categorySchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  icon: z.string().optional(),
});

export async function createCategory(formData: FormData) {
  const userId = await getUserId();

  const data = {
    name: formData.get('name') as string,
    icon: (formData.get('icon') as string) || null,
  };

  const validated = categorySchema.parse({
    ...data,
    icon: data.icon || undefined,
  });

  await prisma.category.create({
    data: {
      userId,
      name: validated.name,
      icon: validated.icon || null,
      isDefault: false,
    },
  });

  revalidatePath('/settings');
}

export async function updateCategory(formData: FormData) {
  const userId = await getUserId();
  const id = formData.get('id') as string;

  const data = {
    name: formData.get('name') as string,
    icon: (formData.get('icon') as string) || null,
  };

  const validated = categorySchema.parse({
    ...data,
    icon: data.icon || undefined,
  });

  // Check ownership
  const category = await prisma.category.findFirst({
    where: { id, userId },
  });

  if (!category) {
    throw new Error('Categoria não encontrada');
  }

  await prisma.category.update({
    where: { id },
    data: {
      name: validated.name,
      icon: validated.icon || null,
    },
  });

  revalidatePath('/settings');
}

export async function deleteCategory(formData: FormData) {
  const userId = await getUserId();
  const id = formData.get('id') as string;

  // Check ownership
  const category = await prisma.category.findFirst({
    where: { id, userId },
  });

  if (!category) {
    throw new Error('Categoria não encontrada');
  }

  await prisma.category.delete({
    where: { id },
  });

  revalidatePath('/settings');
}
