import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "@/lib/session-core";

// Routes that don't require authentication
const publicRoutes = ["/login", "/setup", "/api/auth", "/api/auth/setup"];

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isPublicRoute = publicRoutes.some(route => path.startsWith(route));

  // 1. Get session from cookies
  const session = req.cookies.get("session")?.value;

  // 2. Decrypt session to verify
  let decoded = null;
  if (session) {
    try {
      decoded = await decrypt(session);
      
      // 2.1 CRITICAL: Verify against DB if it's NOT a public route
      // We use a fetch to our internal verify API because middleware is Edge Runtime
      if (!isPublicRoute) {
        const verifyRes = await fetch(`${req.nextUrl.origin}/api/auth/verify`, {
          headers: { Cookie: `session=${session}` }
        });
        
        if (!verifyRes.ok) {
          decoded = null; // Mark as invalid if DB check fails
        }
      }
    } catch (e) {
      console.error("Failed to decrypt or verify session", e);
    }
  }

  // 3. If it's a public route, just allow it
  // (unless it's /login or /setup and we are already authed)
  if (isPublicRoute) {
    if (decoded && (path === "/login" || path === "/setup")) {
      return NextResponse.redirect(new URL("/", req.nextUrl));
    }
    return NextResponse.next();
  }

  // 4. Redirect to login if not authenticated
  if (!decoded) {
    // We should also check if setup is needed, but we can't easily call internal API here
    // Instead, we'll let the login page handle redirection to setup if it detects no PIN
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
