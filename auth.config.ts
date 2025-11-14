import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/auth/login",
    newUser: "/auth/register",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnAuth = nextUrl.pathname.startsWith("/auth");
      const isOnPublic = nextUrl.pathname === "/" || nextUrl.pathname.startsWith("/docs");
      
      // Protected routes
      const protectedRoutes = ["/dashboard", "/transactions", "/settings", "/profile", "/investments"];
      const isOnProtected = protectedRoutes.some(route => nextUrl.pathname.startsWith(route));

      if (isOnProtected) {
        if (isLoggedIn) return true;
        return false; // Redirect to login page
      } else if (isLoggedIn && isOnAuth) {
        return Response.redirect(new URL("/dashboard", nextUrl));
      }
      
      return true;
    },
  },
  providers: [], // Add providers here (will be configured in auth.ts)
} satisfies NextAuthConfig;
