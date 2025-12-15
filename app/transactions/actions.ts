'use server';

import { prisma } from '@/lib/prisma';
import { getUserId } from '@/lib/user';
import { TransactionType, Currency } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const transactionSchema = z.object({
  type: z.nativeEnum(TransactionType, { required_error: 'Tipo é obrigatório' }),
  accountId: z.string().min(1, 'Conta é obrigatória'),
  categoryId: z.string().optional(),
  amount: z.preprocess((value) => Number(value), z.number().positive('Valor deve ser positivo')), 
  occurredAt: z.preprocess((value) => new Date(String(value)), z.date({ invalid_type_error: 'Data inválida' })),
  description: z.string().max(120).optional(),
});

export async function createTransaction(formData: FormData) {
  const userId = await getUserId();

  const data = {
    type: formData.get('type') as TransactionType,
    accountId: formData.get('accountId') as string,
    categoryId: (formData.get('categoryId') as string) || null,
    amount: formData.get('amount'),
    occurredAt: formData.get('occurredAt'),
    description: (formData.get('description') as string)?.trim() || null,
  };

  let validated;
  try {
    validated = transactionSchema.parse({
      ...data,
      categoryId: data.categoryId || undefined,
      description: data.description || undefined,
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      throw new Error(err.errors[0]?.message || 'Dados inválidos');
    }
    throw err;
  }

  // Create transaction
  await prisma.transaction.create({
    data: {
      userId,
      type: validated.type,
      accountId: validated.accountId,
      categoryId: validated.categoryId || null,
      amount: validated.amount,
      occurredAt: validated.occurredAt,
      description: validated.description || null,
      currency: Currency.BRL,
      cleared: true,
    },
  });

  // Revalidate pages
  revalidatePath('/transactions');
  revalidatePath('/dashboard');
}
