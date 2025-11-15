import { auth } from "@/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getDefaultHomePath } from "@/lib/routes";

const protectedRoutes = ["/dashboard", "/transactions", "/settings", "/perfil"];
const authRoutes = ["/login", "/cadastro"];

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  // If trying to access protected route without auth, redirect to login
  if (isProtectedRoute && !isLoggedIn) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If logged in and trying to access auth pages, redirect to default home
  if (isAuthRoute && isLoggedIn) {
    const defaultHome = req.auth?.user?.defaultHome;
    const homePath = getDefaultHomePath(defaultHome);
    return NextResponse.redirect(new URL(homePath, req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
