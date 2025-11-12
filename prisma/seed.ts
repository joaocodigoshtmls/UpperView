import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const user = await prisma.user.upsert({
    where: { email: 'demo@local' },
    update: {},
    create: { email: 'demo@local', name: 'Demo' },
  })

  const institutions = [
    { name: 'Mercado Pago', slug: 'mercado-pago' },
    { name: 'Sicredi', slug: 'sicredi' },
    { name: 'BTG Pactual', slug: 'btg-pactual' },
    { name: 'C6 Bank', slug: 'c6-bank' },
  ]
  for (const inst of institutions) {
    await prisma.institution.upsert({
      where: { slug: inst.slug },
      update: {},
      create: inst,
    })
  }

  const defaultCats = [
    'Alimentação','Transporte','Moradia','Educação','Saúde',
    'Lazer','Assinaturas','Impostos','Investimentos','Transferências'
  ]
  for (const name of defaultCats) {
    await prisma.category.upsert({
      where: { userId_name: { userId: user.id, name } },
      update: {},
      create: { userId: user.id, name, isDefault: true },
    })
  }
}

main().finally(() => prisma.$disconnect())
