import NextAuth, { DefaultUser } from "next-auth"

declare module "next-auth" {
  interface User extends DefaultUser {
    id: string,
    username: string,
    display_name: string,
    email: string,
    roles: string[]
  }

  interface AdapterUser extends User {

  }

  interface Session {
    user: {
      id: string,
      username: string,
      display_name: string,
      email: string,
      roles: string[]
    }
  }
}
