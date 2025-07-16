import { IUser, UserRole } from "@/types/user.types";
import { Model, Schema, model, models } from "mongoose"
import bcrypt from "bcrypt"

interface UserModel extends Model<IUser> {
  register(username: string, email: string, password: string, display_name: string): Promise<IUser>
  login(username: string, password: string): Promise<IUser>
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
  last_login: {
    type: Date,
    default: null
  },
  roles: {
    type: [String],
    default: [UserRole.USER],
    enum: Object.values(UserRole),
    required: true
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
    const user = await this.create({ username, email, password: hash, display_name });
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
        user.last_login = new Date()
        await user.save()

        return user
      }
    }

    throw new Error("Invalid username/email or password")

  }
)

const User = models.User as unknown as UserModel || model<IUser, UserModel>("User", userSchema);

export default User
