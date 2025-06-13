import User from "@/models/user.models";
import { connectDatabase } from "@/libs/mongodb.libs";
import { NextResponse } from "next/server";

export const POST = async (request: Request) => {
  // username: string, email: string, password: string, display_name: string
  try {
    connectDatabase()
    const { username, email, password, display_name } = await request.json()
    const user = await User.register(username, email, password, display_name)

    return NextResponse.json({ message: "Successfully Registered!", user }, { status: 200 })
  } catch (e) {
    const err = e as Error
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
