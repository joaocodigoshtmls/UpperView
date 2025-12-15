import { prisma } from './prisma';

let cachedUserId: string | null = null;

export async function getUserId(): Promise<string> {
  const demoEmail = process.env.DEMO_USER_EMAIL || 'demo@local';

  if (cachedUserId) {
    return cachedUserId;
  }

  const user = await prisma.user.findUnique({
    where: { email: demoEmail },
    select: { id: true },
  });

  if (!user) {
    throw new Error(`Demo user not found: ${demoEmail}. Run: npm run db:seed`);
  }

  cachedUserId = user.id;
  return user.id;
}
