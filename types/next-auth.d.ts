import type { DefaultSession } from "next-auth";
import type { DefaultHome, ThemePreference, Currency } from "@prisma/client";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      preferredCurrency: Currency;
      defaultHome: DefaultHome;
      themePreference: ThemePreference;
      emailNotifications: boolean;
    } & DefaultSession["user"];
  }

  interface User {
    preferredCurrency?: Currency;
    defaultHome?: DefaultHome;
    themePreference?: ThemePreference;
    emailNotifications?: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    preferredCurrency?: Currency;
    defaultHome?: DefaultHome;
    themePreference?: ThemePreference;
    emailNotifications?: boolean;
  }
}
