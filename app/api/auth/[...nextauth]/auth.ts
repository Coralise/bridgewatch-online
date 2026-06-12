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
  callbacks: {
    // 1. Validate the user and handle database upsert ONCE during login
    async signIn({ user, account, profile }) {
      if (account?.provider === "discord" && profile && user) {
        try {
          // Sync profile details to Supabase only on successful authentication
          await upsertUser({
            id: profile.id, // Ensure your utility expects the string ID
            name: user.name,
            image: user.image
          } as any);
        } catch (err) {
          console.error('upsertUser failed during sign in event:', err);
          // Return false here if you want to block login if DB write fails, 
          // or leave true to allow them in anyway.
        }
      }
      return true;
    },

    // 2. Intercept the JWT token creation
    async jwt({ token, account, profile }) {
      if (account?.provider === "discord" && profile) {
        token.sub = profile.id ?? undefined;
      }
      return token;
    },

    // 3. Pass that ID down to the session object (Lightweight & fast)
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      // Removed the database call from here to stop the infinite sync spam!
      return session;
    },
  },
})