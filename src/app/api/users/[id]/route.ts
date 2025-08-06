import User from "@/models/user.models";
import { connectDatabase } from "@/libs/mongodb.libs";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/auth.libs";

export const GET = async (request: Request, { params }: { params: Promise<{ id: string }> }) => {
  try {
    connectDatabase();

    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ message: "Authentication required" }, { status: 401 });
    }

    // Await the params promise in Next.js 15
    const { id } = await params;

    // Validate ID parameter
    if (!id || typeof id !== 'string') {
      return NextResponse.json({ message: "User ID is required and must be a string." }, { status: 400 });
    }

    if (id.trim().length === 0) {
      return NextResponse.json({ message: "User ID cannot be empty." }, { status: 400 });
    }

    // Validate MongoDB ObjectId format
    const objectIdRegex = /^[0-9a-fA-F]{24}$/;
    if (!objectIdRegex.test(id)) {
      return NextResponse.json({ message: "Invalid user ID format." }, { status: 400 });
    }

    // Authorization check: Users can only access their own data unless they're admin
    const isAdmin = session.user.roles.includes('admin');
    const isOwnProfile = session.user.id === id;
    
    if (!isAdmin && !isOwnProfile) {
      return NextResponse.json({ message: "Access denied" }, { status: 403 });
    }

    const user = await User.getUserById(id);

    const userResponse = {
      id: user._id,
      username: user.username,
      email: user.email,
      display_name: user.display_name,
      role: user.role,
      roles: user.roles,
      last_login: user.last_login
    };

    return NextResponse.json({
      message: "User found successfully",
      user: userResponse
    }, { status: 200 });

  } catch (error) {
    console.error('Get user error:', error);
    const err = error as Error;
    console.log(err.message);

    if (err.message.includes('User not found')) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    if (err.message.includes('Cast to ObjectId failed')) {
      return NextResponse.json({ message: "Invalid user ID format" }, { status: 400 });
    }

    return NextResponse.json({
      message: "An error occurred while fetching the user. Please try again."
    }, { status: 500 });
  }
};
