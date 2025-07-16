import { getToken } from "next-auth/jwt"
import { NextRequest, NextResponse } from "next/server"

export default function middleware(request: NextRequest) {
  const token = getToken({ req: request, secret: process.env.NEXTAUTH_SECRET! })
  console.log(token)
}


export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:jpg|jpeg|gif|png|svg|ico|webp|js|css|woff|woff2|ttf|eot)).*)',
  ],
}
