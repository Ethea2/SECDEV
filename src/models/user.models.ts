import { IUser } from "@/types/user.types";
import { Model, Schema, model, models } from "mongoose"
import bcrypt from "bcrypt"

interface UserModel extends Model<IUser> {
  register(username: string, email: string, password: string, display_name: string): Promise<IUser>
  login(username: string, password: string): Promise<IUser>
  getUsers(): Promise<IUser>
  patchUser(username: string, newUsername: string, email: string, password: string, displayName: string, role: string): Promise<IUser>
}

const userSchema = new Schema<IUser, UserModel>({
  username: {
    type: String,
    required: true,
    unique: true,
    maxlength: 30
  },
  email: {
    type: String,
    required: true,
    unique: true,
    maxlength: 320
  },
  password: {
    type: String,
    required: true,
    maxlength: 255
  },
  display_name: {
    type: String,
    required: true,
    maxlength: 30
  },
  role: {
    type: String,
    enum: ["admin", "manager", "user"],
    default: "user",
    required: true
  },
  last_login: {
    type: Date,
    default: null
  }
}, { timestamps: true })

userSchema.static(
  "register",
  async function register(username: string, email: string, password: string, display_name: string) {
    const existingUser = await this.findOne({
      $or: [
        { username: { $regex: new RegExp(`^${username}$`, 'i') } },
        { email: { $regex: new RegExp(`^${email}$`, 'i') } }
      ]
    });

    if (existingUser) {
      if (existingUser.username.toLowerCase() === username.toLowerCase()) {
        throw new Error('Username already exists');
      }
      if (existingUser.email.toLowerCase() === email.toLowerCase()) {
        throw new Error('An account with this email already exists');
      }
    }

    const salt = await bcrypt.genSalt(12);
    const hash = await bcrypt.hash(password, salt);
    const user = await this.create({ username, email, password: hash, display_name, role: "user"}); // hard coded role user

    return user;
  }
)

userSchema.static(
  "login",
  async function login(username: string, password: string) {
    const userLowerCase = username.toLowerCase()
    let user = await this.findOne({ username: userLowerCase })//replace username with userLowerCase
    if (user == null) {
      user = await this.findOne({ email: userLowerCase })//replace username with userLowerCase
    }

    if (user != null) {
      const isMatch = await bcrypt.compare(password, user.password)
      if (isMatch) {
        return user
      }
    }

    throw new Error("Invalid username/email or password")

  }
)

userSchema.static(
  "getUsers",
  async function getUsers() {
    let user = await this.find({})
    if (user != null) {
      return user
    }
    throw new Error("No users found")
  }
)

userSchema.static(
  "patchUser",
  async function patchUser(username: string, newUsername: string, email: string, password: string, displayName: string, role: string) {


    let newUser: { [key: string]: any } = {};
    if (newUsername != null) newUser.username = newUsername
    if (email != null) newUser.email = email
    if (password != null) newUser.password = password
    if (displayName != null) newUser.displayName = displayName
    if (role != null) newUser.role = role
  
    let user = await this.findOneAndUpdate({username: username.toLowerCase()}, newUser, {new : true})
    if (user != null) {
      return user
    }
    throw new Error("No user found")
    

  }
)

const User = models.User as unknown as UserModel || model<IUser, UserModel>("User", userSchema);

export default User
