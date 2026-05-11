/**
 * Session Wrapper Component
 * 
 * A Client Component that provides the NextAuth SessionProvider context.
 * This must be a separate file because the root layout (where it is used) 
 * is a Server Component, and SessionProvider requires a Client Component environment.
 */

"use client";

import { SessionProvider } from "next-auth/react";

export default function SessionWrapper({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
