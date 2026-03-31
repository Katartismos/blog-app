import { auth } from "./auth";

// This file configures the middleware logic. 
// Note: In standard Next.js, this needs to be exported from 'middleware.ts' 
// to take effect automatically on Edge runtime unless you have a custom setup.

export default auth((_req) => {
  // Session is accessible globally here via req.auth
  // You can add additional global logic here while allowing public access.
});

// We configure a matcher to ensure the middleware runs on application pages
// but skips API routes and static assets so it doesn't block them.
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
