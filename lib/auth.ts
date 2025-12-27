import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { db } from "./db";
import type { UserRole } from "@prisma/client";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string | null;
      image: string | null;
      roles: UserRole[];
    };
  }

  interface User {
    roles: UserRole[];
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  adapter: PrismaAdapter(db) as any,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log("[AUTH] Authorize called with email:", credentials?.email);

        if (!credentials?.email || !credentials?.password) {
          console.log("[AUTH] Missing email or password");
          return null;
        }

        try {
          console.log("[AUTH] Looking up user in database...");
          const user = await db.user.findUnique({
            where: { email: credentials.email as string },
          });

          console.log("[AUTH] User found:", user ? { id: user.id, email: user.email, hasPassword: !!user.passwordHash } : "null");

          if (!user || !user.passwordHash) {
            console.log("[AUTH] User not found or no password hash");
            return null;
          }

          console.log("[AUTH] Comparing passwords...");
          const isValid = await bcrypt.compare(
            credentials.password as string,
            user.passwordHash
          );

          console.log("[AUTH] Password valid:", isValid);

          if (!isValid) {
            console.log("[AUTH] Invalid password");
            return null;
          }

          console.log("[AUTH] Login successful for:", user.email);
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
            roles: user.roles,
          };
        } catch (error) {
          console.error("[AUTH] Error during authorization:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.roles = user.roles;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.roles = token.roles as UserRole[];
      }
      return session;
    },
  },
});

// Helper to check if user has specific role
export function hasRole(roles: UserRole[], role: UserRole): boolean {
  return roles.includes(role);
}

export function isAdmin(roles: UserRole[]): boolean {
  return hasRole(roles, "ADMIN");
}

export function isPhotographer(roles: UserRole[]): boolean {
  return hasRole(roles, "PHOTOGRAPHER");
}

export function isBuyer(roles: UserRole[]): boolean {
  return hasRole(roles, "BUYER");
}

export function isSpecialist(roles: UserRole[]): boolean {
  return hasRole(roles, "SPECIALIST");
}
