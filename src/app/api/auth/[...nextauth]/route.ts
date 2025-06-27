// https://medium.com/@kcsanjeeb091/implementing-jwt-based-authentication-with-next-js-v14-and-nextauth-v4-e3efca4b158b

import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";
import { connectDatabase } from "@/libs/mongodb.libs";
import User from "@/models/user.models";

export const authOptions: NextAuthOptions = {

  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: "Username", type: "text", placeholder: "Username or Email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials, req) {
        try {
          connectDatabase();

          const username = credentials?.username || "";
          const password = credentials?.password || "";

          const user = await User.login(username, password);

          // Return as type JWTObject
          return {
            id: user._id?.toString() || "",
            username: user.username,
            display_name: user.display_name,
            email: user.email,
          }
        } catch (e) {
          console.error("Login failed:", e);
          return null;
        }

      }
    })
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/login'
  },
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      token.id = user?.id || token.id;
      token.username = user?.username || token.username;
      token.display_name = user?.display_name || token.display_name;
      token.email = user?.email || token.email;
      return token
    },
    async session({ session, token, user }) {
      session.user = token as any;
      return session;
    },
  },

};

export const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
