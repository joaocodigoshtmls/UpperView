import { prisma } from './prisma';

export async function getUserId(): Promise<string> {
  const demoEmail = process.env.DEMO_USER_EMAIL || 'demo@local';
  const user = await prisma.user.findUnique({
    where: { email: demoEmail },
    select: { id: true },
  });
  
  if (!user) {
    throw new Error(`Demo user not found: ${demoEmail}. Run: npm run db:seed`);
  }
  
  return user.id;
}
