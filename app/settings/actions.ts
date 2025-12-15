'use server';

import { prisma } from '@/lib/prisma';
import { getUserId } from '@/lib/user';
import { AccountType, Currency } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

// Account actions
const accountSchema = z.object({
  name: z.string().trim().min(1, 'Nome é obrigatório').max(80),
  type: z.nativeEnum(AccountType),
  currency: z.nativeEnum(Currency),
  balance: z.preprocess((value) => Number(value), z.number({ invalid_type_error: 'Saldo inválido' })),
  institutionId: z.string().optional(),
});

export async function createAccount(formData: FormData) {
  const userId = await getUserId();

  const data = {
    name: (formData.get('name') as string) || '',
    type: formData.get('type') as AccountType,
    currency: formData.get('currency') as Currency,
    balance: formData.get('balance'),
    institutionId: (formData.get('institutionId') as string) || null,
  };

  const validated = accountSchema.safeParse({
    ...data,
    institutionId: data.institutionId || undefined,
  });

  if (!validated.success) {
    throw new Error(validated.error.errors[0]?.message || 'Dados de conta inválidos');
  }

  await prisma.financialAccount.create({
    data: {
      userId,
      name: validated.data.name,
      type: validated.data.type,
      currency: validated.data.currency,
      balance: validated.data.balance,
      institutionId: validated.data.institutionId || null,
    },
  });

  revalidatePath('/settings');
  revalidatePath('/dashboard');
}

export async function updateAccount(formData: FormData) {
  const userId = await getUserId();
  const id = formData.get('id') as string;

  const data = {
    name: (formData.get('name') as string) || '',
    type: formData.get('type') as AccountType,
    currency: formData.get('currency') as Currency,
    balance: formData.get('balance'),
    institutionId: (formData.get('institutionId') as string) || null,
  };

  const validated = accountSchema.safeParse({
    ...data,
    institutionId: data.institutionId || undefined,
  });

  if (!validated.success) {
    throw new Error(validated.error.errors[0]?.message || 'Dados de conta inválidos');
  }

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
      name: validated.data.name,
      type: validated.data.type,
      currency: validated.data.currency,
      balance: validated.data.balance,
      institutionId: validated.data.institutionId || null,
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
  name: z.string().trim().min(1, 'Nome é obrigatório').max(60),
  icon: z.string().trim().max(2).optional(),
});

export async function createCategory(formData: FormData) {
  const userId = await getUserId();

  const data = {
    name: (formData.get('name') as string) || '',
    icon: (formData.get('icon') as string) || null,
  };

  const validated = categorySchema.safeParse({
    ...data,
    icon: data.icon || undefined,
  });

  if (!validated.success) {
    throw new Error(validated.error.errors[0]?.message || 'Dados de categoria inválidos');
  }

  await prisma.category.create({
    data: {
      userId,
      name: validated.data.name,
      icon: validated.data.icon || null,
      isDefault: false,
    },
  });

  revalidatePath('/settings');
}

export async function updateCategory(formData: FormData) {
  const userId = await getUserId();
  const id = formData.get('id') as string;

  const data = {
    name: (formData.get('name') as string) || '',
    icon: (formData.get('icon') as string) || null,
  };

  const validated = categorySchema.safeParse({
    ...data,
    icon: data.icon || undefined,
  });

  if (!validated.success) {
    throw new Error(validated.error.errors[0]?.message || 'Dados de categoria inválidos');
  }

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
      name: validated.data.name,
      icon: validated.data.icon || null,
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
