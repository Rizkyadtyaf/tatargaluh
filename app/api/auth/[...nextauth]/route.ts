import NextAuth, { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/db";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        name: { label: "Name", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          console.log("[NextAuth] Authorize attempt with credentials:", { name: credentials?.name });
          
          if (!credentials?.name || !credentials?.password) {
            console.error("[NextAuth] Missing credentials");
            throw new Error("Missing credentials");
          }

          const user = await prisma.user.findFirst({
            where: {
              name: credentials.name
            }
          });

          console.log("[NextAuth] User found:", user ? { id: user.id, name: user.name, role: user.role } : "No user found");

          if (!user) {
            console.error("[NextAuth] User not found for name:", credentials.name);
            throw new Error("User not found");
          }

          const isPasswordValid = credentials.password === user.password;
          console.log("[NextAuth] Password validation:", isPasswordValid ? "Success" : "Failed");

          if (!isPasswordValid) {
            console.error("[NextAuth] Invalid password for user:", user.name);
            throw new Error("Invalid password");
          }

          console.log("[NextAuth] Authentication successful for user:", user.name);
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          };
        } catch (error) {
          console.error("[NextAuth] Authentication error:", error);
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      console.log("[NextAuth] JWT Callback - Input:", { 
        tokenUserId: token.sub, 
        tokenRole: token.role,
        userId: user?.id,
        userRole: user?.role 
      });
      
      if (user) {
        token.role = user.role;
        console.log("[NextAuth] JWT updated with role:", user.role);
      }
      return token;
    },
    async session({ session, token }) {
      console.log("[NextAuth] Session Callback - Before:", { 
        sessionUser: session?.user,
        tokenRole: token.role
      });
      
      if (session?.user) {
        session.user.role = token.role;
        console.log("[NextAuth] Session updated with role:", token.role);
      }
      
      console.log("[NextAuth] Session Callback - After:", { 
        sessionUserRole: session?.user?.role
      });
      
      return session;
    },
    async redirect({ url, baseUrl }) {
      console.log("[NextAuth] Redirect Callback - Input:", { url, baseUrl });
      
      // Jika URL sudah lengkap, gunakan itu
      if (url.startsWith('http')) {
        console.log("[NextAuth] Using provided URL:", url);
        return url;
      }
      
      // Jika URL adalah path relatif, gabungkan dengan baseUrl
      const redirectUrl = `${baseUrl}${url.startsWith('/') ? url : `/${url}`}`;
      console.log("[NextAuth] Redirecting to:", redirectUrl);
      return redirectUrl;
    }
  },
  pages: {
    signIn: '/admin/login',
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60 // 24 hours
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: true
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
