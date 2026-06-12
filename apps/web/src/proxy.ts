import { getSessionCookie } from "better-auth/cookies";
import { type NextRequest, NextResponse } from "next/server";

export async function proxy(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);
  const pathname = request.nextUrl.pathname;
  const publicExactRoutes = ["/", "/login", "/register"];
  const publicPrefixRoutes = ["/docs"];

  const isPublicRoute =
    publicExactRoutes.includes(pathname) ||
    publicPrefixRoutes.some(
      (route) => pathname === route || pathname.startsWith(`${route}/`),
    );
  const isInvitePage = pathname.startsWith("/invite/");
  const isAuthApi =
    pathname.startsWith("/api/auth/") || pathname === "/api/auth";

  if (!isPublicRoute && !isAuthApi && !isInvitePage && !sessionCookie) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|ico|webp)$).*)",
  ],
};
