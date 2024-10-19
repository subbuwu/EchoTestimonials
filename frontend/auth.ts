import NextAuth from "next-auth"
import type { NextAuthConfig } from "next-auth"
import Google from "next-auth/providers/google"

const config: NextAuthConfig = {
  providers: [Google],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      if (account?.provider === "google" && account.id_token) {
        try {
          const response = await fetch('http://localhost:8000/auth/google', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              token: account.id_token,
            }),
          });

          if (response.ok) {
            const data = await response.json();
            // Store the custom JWT in the token
            //@ts-ignore
            account.customToken = data.token;
            return true;
          } else {
            return false;
          }
        } catch (error) {
          console.error('Error creating user in backend:', error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, account }) {
      if (account && account.customToken) {
        //@ts-ignore
        token.customToken = account.customToken;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.customToken) {
        session.customToken = token.customToken as string;
        
      }
      return session;
    },
    
  },
}

export const { handlers, signIn, signOut, auth } = NextAuth(config)