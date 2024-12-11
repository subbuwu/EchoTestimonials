import NextAuth from "next-auth"
import type { NextAuthConfig, Session } from "next-auth"
import Google from "next-auth/providers/google"

const config: NextAuthConfig = {
  providers: [Google],
  
  session: {
    strategy: "jwt",
  },
  
  callbacks: {
    async signIn({ account, profile }) {
      if (!account?.provider || !account.id_token || !profile?.email) {
        console.error("Missing required authentication information");
        return false;
      }
      console.log(account)
      try {
        const response = await fetch(`${process.env.BACKEND_AUTH_URL}/auth/google`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            token: account.id_token,
            email: profile.email,
            name: profile.name,
            image: profile.picture
          }),
        });

        if (!response.ok) {
          const errorData = await response.text();
          console.error('Backend authentication failed:', errorData);
          return false;
        }

        const data = await response.json();
        
        account.customToken = data.accessToken;
        account.userId = data.user.userId;

        return true;
      } catch (error) {
        console.error('Authentication process error:', error);
        return false;
      }
    },

    async jwt({ token, account }) {
      if (account?.customToken) {
        token.customToken = account.customToken.toString();
        token.userId = account.userId;
      }
      
      return token;
    },

    async session({ session, token }) {
      if (token.customToken) {
        session.accessToken = token.customToken;
      }
      
      if (token.userId) {
        session.user.userId = token.userId;
      }

      return session;
    },
  },
}

export const { handlers, signIn, signOut, auth } = NextAuth(config)