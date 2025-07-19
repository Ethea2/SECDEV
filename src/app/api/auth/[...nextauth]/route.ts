// https://medium.com/@kcsanjeeb091/implementing-jwt-based-authentication-with-next-js-v14-and-nextauth-v4-e3efca4b158b

import { authOptions } from "@/libs/auth.libs";
import NextAuth from "next-auth";




export const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
