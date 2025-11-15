import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import type { DefaultHome, ThemePreference, Currency } from "@prisma/client";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email as string,
          },
        });

        if (!user || !user.password) {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          preferredCurrency: user.preferredCurrency,
          defaultHome: user.defaultHome,
          themePreference: user.themePreference,
          emailNotifications: user.emailNotifications,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.preferredCurrency = (user as any).preferredCurrency;
        token.defaultHome = (user as any).defaultHome;
        token.themePreference = (user as any).themePreference;
        token.emailNotifications = (user as any).emailNotifications;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.preferredCurrency = (token.preferredCurrency as Currency) ?? "BRL";
        session.user.defaultHome = (token.defaultHome as DefaultHome) ?? "DASHBOARD";
        session.user.themePreference = (token.themePreference as ThemePreference) ?? "SYSTEM";
        session.user.emailNotifications = (token.emailNotifications as boolean) ?? true;
      }
      return session;
    },
  },
});
