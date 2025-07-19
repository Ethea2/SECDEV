import User from "@/models/user.models";
import { connectDatabase } from "@/libs/mongodb.libs";
import { NextResponse } from "next/server";


export const GET = async (request: Request) => {
  try {
    connectDatabase();

    const userlist = await User.getUsers();

    return NextResponse.json({
      message: "Successfully fetched users",
      userlist: userlist
    }, { status: 201 });

  } catch (error) {

    return NextResponse.json({
      message: "An error occurred whilst fetchin users"
    }, { status: 500 });
  }
};

export const PATCH = async (request: Request) => {
  try {
    connectDatabase();

    const { username, newUsername, email, password, display_name, role} = await request.json();
    const patchUser = await User.patchUser(username, newUsername, email, password, display_name, role);

    return NextResponse.json({
      message: "Successfully Changed users role",
      User: patchUser
    }, { status: 201 });

  } catch (error) {

    return NextResponse.json({
      message: "An error occurred whilst fetchin users"
    }, { status: 500 });
  }
};