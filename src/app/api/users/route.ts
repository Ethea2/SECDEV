import User from "@/models/user.models";
import { connectDatabase } from "@/libs/mongodb.libs";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/auth.libs";

const RESERVED_USERNAMES = [
  'admin', 'administrator', 'root', 'system', 'user', 'test', 'guest',
  'support', 'help', 'api', 'www', 'mail', 'email', 'info', 'contact',
  'about', 'blog', 'news', 'forum', 'chat', 'ftp', 'ssh', 'null', 'undefined'
];



export const GET = async (request: Request) => {
  try {
    connectDatabase();

    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ message: "Authentication required" }, { status: 401 });
    }

    const isAdmin = session.user.roles.includes('admin');
    if (!isAdmin) {
      return NextResponse.json({ message: "Access denied." }, { status: 403 });
    }

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

export const PUT = async (request: Request) => {
  try {
    connectDatabase();

    const session = await getServerSession(authOptions);
    console.log(session);
    if (!session?.user) {
      return NextResponse.json({ message: "Authentication required" }, { status: 401 });
    }

    const { id, newUsername, newEmail, displayName } = await request.json();

    if (!id || typeof id !== 'string') {
      return NextResponse.json({ message: "User ID is required and must be a string." }, { status: 400 });
    }

    if (id.trim().length === 0) {
      return NextResponse.json({ message: "User ID cannot be empty." }, { status: 400 });
    }

    const isAdmin = session.user.roles.includes('admin');
    const isOwnProfile = session.user.id === id;
    
    if (!isAdmin && !isOwnProfile) {
      return NextResponse.json({ message: "Access denied" }, { status: 403 });
    }

    // Validate username if provided
    if (newUsername !== undefined) {
      if (typeof newUsername !== 'string') {
        return NextResponse.json({ message: "Username must be a string." }, { status: 400 });
      }

      const usernameString = newUsername.trim();
      const properUsername = usernameString.toLowerCase();

      if (usernameString.length > 0) {
        if (properUsername.length < 3 || properUsername.length > 30) {
          return NextResponse.json({ message: "Username must be 3-30 characters long" }, { status: 400 });
        }

        const validCharacterRegex = /^[a-zA-Z0-9_-]+$/;
        if (!validCharacterRegex.test(usernameString)) {
          return NextResponse.json({ message: "Username can only contain letters, numbers, hyphens, and underscores" }, { status: 400 });
        }

        const startsOrEndsWithSpecial = /^[_-]|[_-]$/;
        if (startsOrEndsWithSpecial.test(usernameString)) {
          return NextResponse.json({ message: "Username cannot start or end with special characters" }, { status: 400 });
        }

        if (RESERVED_USERNAMES.includes(properUsername)) {
          return NextResponse.json({ message: "This username is not available" }, { status: 400 });
        }
      }
    }

    // Validate email if provided
    if (newEmail !== undefined) {
      if (typeof newEmail !== 'string') {
        return NextResponse.json({ message: "Email must be a string." }, { status: 400 });
      }

      const emailString = newEmail.trim();

      if (emailString.length > 0) {
        if (emailString.length > 320) {
          return NextResponse.json({ message: "Email address must not exceed 320 characters" }, { status: 400 });
        }

        const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

        if (!emailRegex.test(emailString)) {
          return NextResponse.json({ message: "Please enter a valid email address" }, { status: 400 });
        }

        if (!emailString.includes('@')) {
          return NextResponse.json({ message: "Please enter a valid email address" }, { status: 400 });
        }

        const emailParts = emailString.split('@');
        if (emailParts.length !== 2 || emailParts[1].length === 0) {
          return NextResponse.json({ message: "Please enter a valid email address" }, { status: 400 });
        }

        if (emailString.includes('..')) {
          return NextResponse.json({ message: "Please enter a valid email address" }, { status: 400 });
        }

        const localPart = emailParts[0];
        if (localPart.startsWith('.') || localPart.endsWith('.')) {
          return NextResponse.json({ message: "Please enter a valid email address" }, { status: 400 });
        }
      }
    }

    // Validate display name if provided
    if (displayName !== undefined) {
      if (typeof displayName !== 'string') {
        return NextResponse.json({ message: "Display name must be a string." }, { status: 400 });
      }

      if (displayName.trim().length > 0 && displayName.length > 30) {
        return NextResponse.json({ message: "Display name must not exceed 30 characters." }, { status: 400 });
      }
    }

    // Check if at least one field is being updated
    const hasUpdates = (newUsername !== undefined && newUsername.trim().length > 0) ||
      (newEmail !== undefined && newEmail.trim().length > 0) ||
      (displayName !== undefined && displayName.trim().length > 0);

    if (!hasUpdates) {
      return NextResponse.json({ message: "At least one field must be provided for update" }, { status: 400 });
    }

    // Prepare cleaned values for the update
    const cleanedUsername = newUsername !== undefined && newUsername.trim().length > 0 ? newUsername.trim().toLowerCase() : undefined;
    const cleanedEmail = newEmail !== undefined && newEmail.trim().length > 0 ? newEmail.trim().toLowerCase() : undefined;
    const cleanedDisplayName = displayName !== undefined && displayName.trim().length > 0 ? displayName.trim() : undefined;

    const updatedUser = await User.editUser(id, cleanedUsername, cleanedDisplayName, cleanedEmail);

    const userResponse = {
      id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      display_name: updatedUser.display_name,
      last_login: updatedUser.last_login,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt
    };

    return NextResponse.json({
      message: "User successfully updated",
      user: userResponse
    }, { status: 200 });

  } catch (error) {
    console.error('User update error:', error);
    const err = error as Error;
    console.log(err.message);

    if (err.message.includes('Username already exists')) {
      return NextResponse.json({ message: "Username already exists" }, { status: 400 });
    }
    if (err.message.includes('email already exists')) {
      return NextResponse.json({ message: "Email already exists" }, { status: 400 });
    }
    if (err.message.includes('User not found')) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    if (err.message.includes('No valid fields provided')) {
      return NextResponse.json({ message: "No valid fields provided for update" }, { status: 400 });
    }
    if (err.message.includes('E11000') || err.message.includes('duplicate key')) {
      if (err.message.includes('username')) {
        return NextResponse.json({ message: "Username already exists" }, { status: 400 });
      }
      if (err.message.includes('email')) {
        return NextResponse.json({ message: "Email already exists" }, { status: 400 });
      }
    }

    return NextResponse.json({
      message: "An error occurred while updating the user. Please try again."
    }, { status: 500 });
  }
};

export const PATCH = async (request: Request) => {
  try {
    connectDatabase();

    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ message: "Authentication required" }, { status: 401 });
    }

    const isAdmin = session.user.roles.includes('admin');
    if (!isAdmin) {
      return NextResponse.json({ message: "Access denied" }, { status: 403 });
    }

    const { username, role } = await request.json();

    if (!username || typeof username !== 'string') {
      return NextResponse.json({ message: "Username is required and must be a string." }, { status: 400 });
    }

    if (!role || typeof role !== 'string') {
      return NextResponse.json({ message: "Role is required and must be a string." }, { status: 400 });
    }

    const validRoles = ['user', 'manager', 'admin'];
    if (!validRoles.includes(role)) {
      return NextResponse.json({ message: "Invalid role. Must be 'user', 'manager', or 'admin'." }, { status: 400 });
    }

    const updatedUser = await User.findOneAndUpdate(
      { username },
      { 
        role: role,
        roles: [role]
      },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "User role successfully updated",
      user: {
        id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        display_name: updatedUser.display_name,
        role: updatedUser.role,
        roles: updatedUser.roles
      }
    }, { status: 200 });

  } catch (error) {
    console.error('User role update error:', error);
    return NextResponse.json({
      message: "An error occurred while updating user role"
    }, { status: 500 });
  }
};

export const DELETE = async (request: Request) => {
  try {
    connectDatabase();

    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ message: "Authentication required" }, { status: 401 });
    }

    const isAdmin = session.user.roles.includes('admin');
    if (!isAdmin) {
      return NextResponse.json({ message: "Access denied. Only administrators can delete users." }, { status: 403 });
    }

    const { username } = await request.json();
    const deletedUser = await User.findOneAndDelete({ username });
    return NextResponse.json({
      message: "Successfully deleted user",
      user: deletedUser
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({
      message: "An error occurred while deleting user"
    }, { status: 500 });
  }
};
