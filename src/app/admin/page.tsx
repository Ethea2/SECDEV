"use client"
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { IUser } from "@/types/user.types";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import AdminHeader from "@/components/AdminHeader";

export default function AdminDashboardPage() {
  const { data: session } = useSession();
  //if (!session || session.user.role !== "user") {
  //  return redirect("/unauthorized");
  //}

  const [userList, setUserList] = useState<IUser[]>([]);

  const fetchUsers = async () => {
    const res = await fetch("/api/users");
    const data = await res.json();
    setUserList(data.userlist);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const deleteUser = async (username: string) => {
    await fetch("/api/users", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username })
      }).then(() => {
        fetchUsers();
      })
  };

  const patchUser = async (username: string, role: string) => {
    await fetch("/api/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, role })
    }).then(() => {
      fetchUsers();
    })
  }

  return (
    <main className="flex flex-col min-h-screen bg-gray-100">
      <AdminHeader displayName={session?.user?.display_name} />
      <div className="flex flex-col items-center w-full">
        <h1 className="text-2xl font-bold mb-4 text-gray-900">Users</h1>
        <div className="overflow-x-auto rounded-lg shadow-lg bg-white p-6 w-full max-w-5xl mt-0">
          <table className="min-w-[600px] text-center text-gray-900">
            <thead>
              <tr>
                <th className="px-4 py-2 text-gray-900">Display Name</th>
                <th className="px-4 py-2 text-gray-900">Username</th>
                <th className="px-4 py-2 text-gray-900">Email</th>
                <th className="px-4 py-2 text-gray-900">Role</th>
                <th className="px-4 py-2 text-gray-900">Created At</th>
                <th className="px-4 py-2 text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {userList.map((n) => (
                <tr key={n._id} className="border-b">
                  <td className="px-4 py-2 text-gray-900">{n.display_name}</td>
                  <td className="px-4 py-2 text-gray-900">{n.username}</td>
                  <td className="px-4 py-2 text-gray-900">{n.email}</td>
                  <td className="px-4 py-2 text-gray-900">
                    <select
                      id={n._id}
                      name={n.username}
                      defaultValue={n.role}
                      className="border rounded px-2 py-1 text-gray-900"
                      onChange={e => patchUser(n.username, e.target.value)}
                    >
                      <option value="user">user</option>
                      <option value="manager">manager</option>
                      <option value="admin">admin</option>
                    </select>
                  </td>
                  <td className="px-4 py-2 text-gray-900">{n.createdAt ? new Date(n.createdAt).toLocaleString() : "-"}</td>
                  <td className="px-4 py-2 flex gap-2 justify-center">
                    <button className="rounded-lg bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-white px-3 py-1 hover:scale-105 transition-transform" onClick={() => patchUser(n.username, n.role)}>Submit Change</button>
                    <button className="rounded-lg bg-red-500 text-white px-3 py-1 hover:bg-red-600 transition-colors" onClick={() => deleteUser(n.username)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
