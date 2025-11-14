import { PrismaClient, AccountType, TransactionType, Currency } from '@prisma/client'
import { startOfMonth, endOfMonth } from 'date-fns'

const prisma = new PrismaClient()

async function main() {
  // Create demo user
  const user = await prisma.user.upsert({
    where: { email: 'demo@local' },
    update: {},
    create: { email: 'demo@local', name: 'Demo User' },
  })
  console.log('✅ User created/found:', user.email)

  // Create institutions
  const institutions = [
    { name: 'Mercado Pago', slug: 'mercado-pago', website: 'https://mercadopago.com.br' },
    { name: 'Sicredi', slug: 'sicredi', website: 'https://sicredi.com.br' },
    { name: 'BTG Pactual', slug: 'btg-pactual', website: 'https://btgpactual.com' },
    { name: 'C6 Bank', slug: 'c6-bank', website: 'https://c6bank.com.br' },
  ]
  for (const inst of institutions) {
    await prisma.institution.upsert({
      where: { slug: inst.slug },
      update: inst,
      create: inst,
    })
  }
  console.log('✅ Institutions created/updated:', institutions.length)

  // Create default categories
  const defaultCats = [
    { name: 'Alimentação', icon: '🍔' },
    { name: 'Transporte', icon: '🚗' },
    { name: 'Moradia', icon: '🏠' },
    { name: 'Educação', icon: '📚' },
    { name: 'Saúde', icon: '🏥' },
    { name: 'Lazer', icon: '🎮' },
    { name: 'Assinaturas', icon: '📱' },
    { name: 'Impostos', icon: '📄' },
    { name: 'Investimentos', icon: '📈' },
    { name: 'Transferências', icon: '💸' },
  ]
  for (const cat of defaultCats) {
    await prisma.category.upsert({
      where: { userId_name: { userId: user.id, name: cat.name } },
      update: { icon: cat.icon },
      create: { userId: user.id, name: cat.name, icon: cat.icon, isDefault: true },
    })
  }
  console.log('✅ Categories created/updated:', defaultCats.length)

  // Get institution IDs
  const mercadoPago = await prisma.institution.findUnique({ where: { slug: 'mercado-pago' } })
  const sicredi = await prisma.institution.findUnique({ where: { slug: 'sicredi' } })
  const btg = await prisma.institution.findUnique({ where: { slug: 'btg-pactual' } })

  // Create financial accounts (idempotent by checking existing)
  const accountsData = [
    {
      name: 'Conta Mercado Pago',
      type: AccountType.PAYMENT_APP,
      institutionId: mercadoPago?.id,
      balance: 1500.50,
      currency: Currency.BRL,
    },
    {
      name: 'Conta Corrente Sicredi',
      type: AccountType.CHECKING,
      institutionId: sicredi?.id,
      balance: 3200.00,
      currency: Currency.BRL,
    },
    {
      name: 'Investimentos BTG',
      type: AccountType.INVESTMENT,
      institutionId: btg?.id,
      balance: 15000.00,
      currency: Currency.BRL,
    },
  ]

  const accounts = []
  for (const accData of accountsData) {
    const existing = await prisma.financialAccount.findFirst({
      where: { userId: user.id, name: accData.name },
    })
    if (existing) {
      accounts.push(existing)
    } else {
      const acc = await prisma.financialAccount.create({
        data: {
          ...accData,
          userId: user.id,
        },
      })
      accounts.push(acc)
    }
  }
  console.log('✅ Financial accounts created/found:', accounts.length)

  // Get categories for transactions
  const alimentacao = await prisma.category.findFirst({
    where: { userId: user.id, name: 'Alimentação' },
  })
  const transporte = await prisma.category.findFirst({
    where: { userId: user.id, name: 'Transporte' },
  })
  const moradia = await prisma.category.findFirst({
    where: { userId: user.id, name: 'Moradia' },
  })
  const lazer = await prisma.category.findFirst({
    where: { userId: user.id, name: 'Lazer' },
  })
  const assinaturas = await prisma.category.findFirst({
    where: { userId: user.id, name: 'Assinaturas' },
  })

  // Create transactions for current month (idempotent by checking date/description)
  const now = new Date()
  const monthStart = startOfMonth(now)
  const monthEnd = endOfMonth(now)

  const transactionsData = [
    // Income
    {
      type: TransactionType.INCOME,
      accountId: accounts[1].id, // Checking
      categoryId: null,
      amount: 5000.00,
      description: 'Salário',
      occurredAt: new Date(now.getFullYear(), now.getMonth(), 5),
    },
    {
      type: TransactionType.INCOME,
      accountId: accounts[0].id, // Mercado Pago
      categoryId: null,
      amount: 500.00,
      description: 'Freelance',
      occurredAt: new Date(now.getFullYear(), now.getMonth(), 15),
    },
    // Expenses
    {
      type: TransactionType.EXPENSE,
      accountId: accounts[1].id,
      categoryId: moradia?.id,
      amount: 1200.00,
      description: 'Aluguel',
      occurredAt: new Date(now.getFullYear(), now.getMonth(), 1),
    },
    {
      type: TransactionType.EXPENSE,
      accountId: accounts[0].id,
      categoryId: alimentacao?.id,
      amount: 85.50,
      description: 'Supermercado',
      occurredAt: new Date(now.getFullYear(), now.getMonth(), 3),
    },
    {
      type: TransactionType.EXPENSE,
      accountId: accounts[0].id,
      categoryId: alimentacao?.id,
      amount: 45.00,
      description: 'Restaurante',
      occurredAt: new Date(now.getFullYear(), now.getMonth(), 8),
    },
    {
      type: TransactionType.EXPENSE,
      accountId: accounts[1].id,
      categoryId: transporte?.id,
      amount: 150.00,
      description: 'Uber',
      occurredAt: new Date(now.getFullYear(), now.getMonth(), 10),
    },
    {
      type: TransactionType.EXPENSE,
      accountId: accounts[0].id,
      categoryId: lazer?.id,
      amount: 120.00,
      description: 'Cinema e pipoca',
      occurredAt: new Date(now.getFullYear(), now.getMonth(), 12),
    },
    {
      type: TransactionType.EXPENSE,
      accountId: accounts[1].id,
      categoryId: assinaturas?.id,
      amount: 49.90,
      description: 'Netflix',
      occurredAt: new Date(now.getFullYear(), now.getMonth(), 15),
    },
    {
      type: TransactionType.EXPENSE,
      accountId: accounts[0].id,
      categoryId: alimentacao?.id,
      amount: 65.00,
      description: 'Padaria',
      occurredAt: new Date(now.getFullYear(), now.getMonth(), 18),
    },
    {
      type: TransactionType.EXPENSE,
      accountId: accounts[1].id,
      categoryId: transporte?.id,
      amount: 200.00,
      description: 'Gasolina',
      occurredAt: new Date(now.getFullYear(), now.getMonth(), 20),
    },
  ]

  let transactionCount = 0
  for (const txData of transactionsData) {
    const existing = await prisma.transaction.findFirst({
      where: {
        userId: user.id,
        description: txData.description,
        occurredAt: {
          gte: monthStart,
          lte: monthEnd,
        },
      },
    })
    if (!existing) {
      await prisma.transaction.create({
        data: {
          ...txData,
          userId: user.id,
          currency: Currency.BRL,
        },
      })
      transactionCount++
    }
  }
  console.log('✅ Transactions created:', transactionCount)

  console.log('\n🎉 Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
