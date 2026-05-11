/**
 * Authentication Configuration
 * 
 * This file sets up NextAuth with Google as the authentication provider.
 * It exports the necessary handlers and helper functions (signIn, signOut, auth)
 * to be used throughout the application for session management.
 */

import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const { handlers, signIn, signOut, auth } = NextAuth({
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
});
