'use server';

import { prisma } from '@/lib/prisma';
import { getUserId } from '@/lib/user';
import { TransactionType, Currency } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const transactionSchema = z.object({
  type: z.nativeEnum(TransactionType),
  accountId: z.string().min(1, 'Conta é obrigatória'),
  categoryId: z.string().optional(),
  amount: z.number().positive('Valor deve ser positivo'),
  occurredAt: z.date(),
  description: z.string().optional(),
});

export async function createTransaction(formData: FormData) {
  const userId = await getUserId();

  const data = {
    type: formData.get('type') as TransactionType,
    accountId: formData.get('accountId') as string,
    categoryId: (formData.get('categoryId') as string) || null,
    amount: parseFloat(formData.get('amount') as string),
    occurredAt: new Date(formData.get('occurredAt') as string),
    description: (formData.get('description') as string) || null,
  };

  // Validate
  const validated = transactionSchema.parse({
    ...data,
    categoryId: data.categoryId || undefined,
    description: data.description || undefined,
  });

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
