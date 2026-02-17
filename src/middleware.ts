import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "@/lib/session-core";

// Routes that don't require authentication
const publicRoutes = ["/login", "/setup", "/api/auth", "/api/auth/setup"];

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isPublicRoute = publicRoutes.some(route => path.startsWith(route));

  // 1. Get session from cookies
  const session = req.cookies.get("session")?.value;

  // 2. Decrypt and verify session
  let decoded = null;
  if (session) {
    try {
      decoded = await decrypt(session);
      
      // 2.1 Always verify against DB for non-API routes 
      // This prevents redirection loops for revoked sessions
      if (!path.startsWith("/api/")) {
        const verifyRes = await fetch(`${req.nextUrl.origin}/api/auth/verify`, {
          headers: { Cookie: `session=${session}` },
          cache: 'no-store'
        });
        
        if (!verifyRes.ok) {
          decoded = null; // Mark as invalid if DB check fails
        }
      }
    } catch (e) {
      console.error("Session verification failed", e);
    }
  }

  // 3. If it's a public route and we have a valid session, redirect away from auth pages
  if (isPublicRoute) {
    if (decoded && (path === "/login" || path === "/setup")) {
      return NextResponse.redirect(new URL("/", req.nextUrl));
    }
    return NextResponse.next();
  }

  // 4. Redirect to login if not authenticated for protected routes
  if (!decoded) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  return NextResponse.next();
}

// Configure which routes should be processed by the middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
