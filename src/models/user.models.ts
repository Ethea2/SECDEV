import { IUser, UserRole } from "@/types/user.types";
import { Model, Schema, model, models } from "mongoose"
import bcrypt from "bcrypt"

interface UserModel extends Model<IUser> {
  register(username: string, email: string, password: string, display_name: string): Promise<IUser>
  login(username: string, password: string): Promise<IUser>
  getUsers(): Promise<IUser>
  getUserById(userId: string): Promise<IUser>
  editUser(userId: string, newUsername?: string, displayName?: string, newEmail?: string): Promise<IUser>
  deleteUser(identifier: string): Promise<IUser>
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
    const user = await this.create({ username, email, password: hash, display_name, role: "user" }); // hard coded role user
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
  "editUser",
  async function editUser(userId: string, newUsername?: string, displayName?: string, newEmail?: string) {
    let updateFields: { [key: string]: any } = {};

    if (newUsername != null && newUsername.trim() !== "") {
      // Check if new username already exists (case-insensitive), excluding current user
      const existingUser = await this.findOne({
        username: { $regex: new RegExp(`^${newUsername}$`, 'i') },
        _id: { $ne: userId } // Exclude current user by ID
      });
      if (existingUser) {
        throw new Error('Username already exists');
      }
      updateFields.username = newUsername.toLowerCase();
    }

    if (displayName != null && displayName.trim() !== "") {
      updateFields.display_name = displayName;
    }

    if (newEmail != null && newEmail.trim() !== "") {
      // Check if new email already exists (case-insensitive), excluding current user
      const existingUser = await this.findOne({
        email: { $regex: new RegExp(`^${newEmail}$`, 'i') },
        _id: { $ne: userId } // Exclude current user by ID
      });
      if (existingUser) {
        throw new Error('An account with this email already exists');
      }
      updateFields.email = newEmail.toLowerCase();
    }

    // Only proceed if there are fields to update
    if (Object.keys(updateFields).length === 0) {
      throw new Error("No valid fields provided for update");
    }

    const user = await this.findOneAndUpdate(
      { _id: userId },
      updateFields,
      { new: true }
    );

    if (user != null) {
      return user;
    }
    throw new Error("User not found");
  }
)

userSchema.static(
  "getUserById",
  async function getUserById(userId: string) {
    const user = await this.findById(userId).select('-password -createdAt -updatedAt');
    if (user != null) {
      return user;
    }
    throw new Error("User not found");
  }
)

const User = models.User as unknown as UserModel || model<IUser, UserModel>("User", userSchema);

export default User
