import NextAuth from "next-auth"
import Discord from "next-auth/providers/discord"
import "dotenv/config"
import { upsertUser } from "../../../data/utils"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Discord({
      clientId: process.env.DISCORD_APP_CLIENT_ID,
      clientSecret: process.env.DISCORD_APP_SECRET,
    }),
  ],
  events: {
  },
  callbacks: {
    // 1. Intercept the JWT token creation
    async jwt({ token, account, profile }) {
      // This condition runs only during the initial login event
      if (account?.provider === "discord" && profile) {
        // Force token.sub to become the true numeric Discord ID
        token.sub = profile.id ?? undefined;
      }
      return token;
    },
    // 2. Pass that ID down to the session object
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      try {
        await upsertUser(session.user as any)
      } catch (err) {
        console.error('upsertUser failed', err)
      }
      return session;
    },
  },
})
