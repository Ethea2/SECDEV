export interface IUser {
  _id?: string
  username: string
  display_name: string
  email: string
  password: string
  role: "admin" | "manager" | "user"
  last_login: Date | null
  createdAt?: Date
  updatedAt?: Date
}
export interface JWTUser {
  id: string
  username: string
  display_name: string
  email: string
}