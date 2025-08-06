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
            roles: user.roles
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
    signIn: '/'
  },
  session: { strategy: "jwt" },
  // make cookies have generic name
  cookies: {
    sessionToken: {
      name: 'id',
      options: {
        httpOnly: true,
        sameSite: 'strict',
        path: '/',
        secure: true,
        maxAge: 30 * 24 * 60 * 60, // 30 days
      }
    },
    callbackUrl: {
      name: `callback-url`,
      options: {
      }
    },
    csrfToken: {
      name: `csrf`,
      options: {
      }
    },
    pkceCodeVerifier: {
      name: `code_verifier`,
      options: {
      }
    },
    state: {
      name: `state`,
      options: {
      },
    },
    nonce: {
      name: `nonce`,
      options: {
      },
    },
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.display_name = user.display_name;
        token.email = user.email;
        token.roles = user.roles;
      }
      return token;
    },
    async session({ session, token, user }) {

      session.user = token as any;
      return session;
    },
  },

};
