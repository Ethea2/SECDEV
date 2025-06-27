import User from "@/models/user.models";
import { connectDatabase } from "@/libs/mongodb.libs";
import { NextResponse } from "next/server";

const RESERVED_USERNAMES = [
  'admin', 'administrator', 'root', 'system', 'user', 'test', 'guest',
  'support', 'help', 'api', 'www', 'mail', 'email', 'info', 'contact',
  'about', 'blog', 'news', 'forum', 'chat', 'ftp', 'ssh', 'null', 'undefined'
];

const COMMON_PASSWORDS = [
  'password', '123456', '123456789', 'qwerty', 'abc123', 'password123',
  'admin', 'letmein', 'welcome', 'monkey', '1234567890', 'dragon',
  'master', 'hello', 'login', 'pass', 'admin123', 'administrator',
  'root', 'toor', 'pass123', 'admin1', 'test', 'guest', 'user',
  'demo', 'sample', 'temp', 'temporary', 'changeme', 'newpass',
  'secret', 'password1', 'password12', 'password123', 'passw0rd',
  'p@ssword', 'p@ssw0rd', 'superman', 'batman', 'spiderman',
  'football', 'baseball', 'basketball', 'soccer', 'tennis',
  'hockey', 'golf', 'volleyball', 'swimming', 'running',
  'love', 'sex', 'god', 'money', 'work', 'home', 'family',
  'friend', 'happy', 'birthday', 'christmas', 'summer', 'winter',
  'spring', 'autumn', 'january', 'february', 'march', 'april',
  'may', 'june', 'july', 'august', 'september', 'october',
  'november', 'december', 'monday', 'tuesday', 'wednesday',
  'thursday', 'friday', 'saturday', 'sunday', 'morning',
  'afternoon', 'evening', 'night', 'today', 'tomorrow',
  'yesterday', 'qwertyuiop', 'asdfghjkl', 'zxcvbnm', '1q2w3e4r',
  'a1b2c3d4', 'abcd1234', '1234abcd', 'aa123456', 'password!',
  'password@', 'password#', 'password$', 'password%', 'password^',
  'welcome123', 'welcome!', 'hello123', 'hello!', 'iloveyou'
];

export const POST = async (request: Request) => {
  try {
    connectDatabase();
    const { username, email, password, display_name } = await request.json();

    if (!username || typeof username !== 'string') {
      return NextResponse.json({ message: "Username is required and must be a string." }, { status: 400 });
    }

    const usernameString = username.trim();
    const properUsername = usernameString.toLowerCase();

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

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ message: "Email address is required" }, { status: 400 });
    }

    const emailString = email.trim();

    if (emailString.length === 0) {
      return NextResponse.json({ message: "Email address is required" }, { status: 400 });
    }

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

    if (!password || typeof password !== 'string') {
      return NextResponse.json({ message: "Password is required and must be a string." }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ message: "Password must be at least 8 characters long" }, { status: 400 });
    }

    if (password.length > 128) {
      return NextResponse.json({ message: "Password must not exceed 128 characters" }, { status: 400 });
    }

    if (COMMON_PASSWORDS.includes(password.toLowerCase())) {
      return NextResponse.json({ message: "This password is too common" }, { status: 400 });
    }

    if (password.toLowerCase() === properUsername) {
      return NextResponse.json({ message: "Password cannot be the same as your username" }, { status: 400 });
    }

    const emailLocalPart = emailString.split('@')[0].toLowerCase();
    if (password.toLowerCase() === emailLocalPart) {
      return NextResponse.json({ message: "Password cannot be the same as your email" }, { status: 400 });
    }

    const sequentialPatterns = [
      '123456789', '987654321', 'abcdefghi', 'zyxwvutsr',
      'qwertyuiop', 'poiuytrewq', 'asdfghjkl', 'lkjhgfdsa',
      'zxcvbnm', 'mnbvcxz'
    ];

    for (let pattern of sequentialPatterns) {
      if (password.toLowerCase().includes(pattern)) {
        return NextResponse.json({ message: "Password cannot contain sequential characters" }, { status: 400 });
      }
    }

    for (let i = 0; i <= password.length - 4; i++) {
      const segment = password.slice(i, i + 4);
      let isSequential = true;
      for (let j = 1; j < segment.length; j++) {
        if (segment.charCodeAt(j) !== segment.charCodeAt(j - 1) + 1) {
          isSequential = false;
          break;
        }
      }
      if (isSequential) {
        return NextResponse.json({ message: "Password cannot contain sequential characters" }, { status: 400 });
      }
    }

    for (let i = 0; i <= password.length - 4; i++) {
      const segment = password.slice(i, i + 4);
      let isReverseSequential = true;
      for (let j = 1; j < segment.length; j++) {
        if (segment.charCodeAt(j) !== segment.charCodeAt(j - 1) - 1) {
          isReverseSequential = false;
          break;
        }
      }
      if (isReverseSequential) {
        return NextResponse.json({ message: "Password cannot contain sequential characters" }, { status: 400 });
      }
    }

    if (!display_name || typeof display_name !== 'string') {
      return NextResponse.json({ message: "Display name is required and must be a string." }, { status: 400 });
    }

    if (display_name.trim().length === 0 || display_name.length > 30) {
      return NextResponse.json({ message: "Display name must be 1-30 characters long." }, { status: 400 });
    }

    const user = await User.register(
      properUsername,
      emailString.toLowerCase(),
      password,
      display_name.trim()
    );

    const userResponse = {
      id: user._id,
      username: user.username,
      email: user.email,
      display_name: user.display_name,
      last_login: user.last_login,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };

    return NextResponse.json({
      message: "Successfully Registered!",
      user: userResponse
    }, { status: 201 });

  } catch (error) {
    console.error('Registration error:', error);
    const err = error as Error
    console.log(err.message)

    if (err.message.includes('Username')) {
      return NextResponse.json({ message: "Username already exists" }, { status: 400 });
    }
    if (err.message.includes('email')) {
      return NextResponse.json({ message: "Email already exists" }, { status: 400 });
    }
    if (err.message.includes('E11000') || err.message.includes('duplicate key')) {
      if (err.message.includes('Username')) {
        return NextResponse.json({ message: "Username already exists" }, { status: 400 });
      }
      if (err.message.includes('email')) {
        return NextResponse.json({ message: "Email already exists" }, { status: 400 });
      }
    }

    return NextResponse.json({
      message: "An error occurred during registration. Please try again."
    }, { status: 500 });
  }
};
