/**
 * Middleware Configuration
 * 
 * This file (proxy.ts) acts as the application's middleware, utilizing NextAuth's 
 * session management. It ensures that the session is accessible globally.
 * 
 * Note: In standard Next.js projects, this logic is typically placed in `middleware.ts`.
 */

import { auth } from "./auth";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default auth((_req) => {
  // Session is accessible globally here via req.auth.
  // This allows for global logic (e.g., redirection, analytics) 
  // while maintaining public access where desired.
});

/**
 * Middleware Matcher Configuration
 * 
 * Defines which routes the middleware should execute on.
 * Currently configured to:
 * - Run on all application pages.
 * - Skip API routes (`/api`).
 * - Skip static assets (`/_next/static`, `/_next/image`).
 * - Skip `favicon.ico`.
 */
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
