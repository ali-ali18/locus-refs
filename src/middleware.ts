import { getSessionCookie } from "better-auth/cookies";
import { type NextRequest, NextResponse } from "next/server";


export async function middleware(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);
  const pathname = request.nextUrl.pathname;
  const publicRoutes = ["/", "/register"];
  const isAuthApi = pathname.startsWith("/api/auth");

  if (!publicRoutes.includes(pathname) && !isAuthApi && !sessionCookie) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|ico|webp)$).*)",
  ],
};
