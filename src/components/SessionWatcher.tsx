"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function SessionWatcher() {
  const pathname = usePathname();

  useEffect(() => {
    // Routes that don't need watcher
    const publicRoutes = ["/login", "/setup"];
    const isPublic = publicRoutes.some(route => pathname.startsWith(route));
    if (isPublic) return;

    const checkSession = async () => {
      try {
        const res = await fetch("/api/auth/verify", { cache: "no-store" });
        if (!res.ok && res.status === 401) {
          // Session revoked or expired
          window.location.href = "/login?revoked=true";
        }
      } catch (e) {
        // Silently fail network errors to avoid flickering
      }
    };

    // Check every 30 seconds
    const interval = setInterval(checkSession, 30000);
    
    // Also check on window focus (switching back to a tab)
    const handleFocus = () => checkSession();
    window.addEventListener("focus", handleFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", handleFocus);
    };
  }, [pathname]);

  return null;
}
