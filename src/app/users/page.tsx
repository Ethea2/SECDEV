// src/app/users/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function UserManagementPage() {
  const session = await getServerSession(authOptions);
  const allowedRoles = ["admin", "manager"];

  if (!session || !allowedRoles.includes(session.user.role)) {
    return redirect("/unauthorized");
  }

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold">User Management</h1>
      <p className="mt-2 text-gray-600">Manage user accounts and roles</p>
      {/* Add user list + edit functionality */}
    </main>
  );
}
