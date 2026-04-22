import type { NextAuthConfig } from "next-auth"

export const authConfig = {
  trustHost: true,
  secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role
        token.id = (user as any).id || user.id
        token.image = user.image
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        ;(session.user as any).role = token.role
        ;(session.user as any).id = token.id
        session.user.image = token.image as string
      }
      return session
    },
  },
  providers: [],
} satisfies NextAuthConfig
