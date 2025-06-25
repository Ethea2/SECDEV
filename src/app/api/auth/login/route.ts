import User from "@/models/user.models";
import { connectDatabase } from "@/libs/mongodb.libs";
import { NextResponse } from "next/server";

export const POST = async (request: Request) => {
  // username: string, email: string, password: string, display_name: string
  try {
    connectDatabase()
    const { username, password} = await request.json()
    const user = await User.login(username, password)

    return NextResponse.json({ message: "Successfully logged in!", user }, { status: 200 })
  } catch (e) {
    const err = e as Error
    return NextResponse.json({ message: err.message }, { status: 401 })
  }
}