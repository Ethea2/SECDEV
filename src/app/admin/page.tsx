"use client"
import {getUsers, patchUser} from "@/hooks/useFetch"
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { IUser } from "@/types/user.types";


export default function AdminDashboardPage() {
  //const session = await getServerSession(authOptions);
  //if (!session || session.user.role !== "user") {
  //  return redirect("/unauthorized");
  //}

  const userList: IUser[] = getUsers();


  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4 text-gray-900">Admin Dashboard</h1>
      <p className="mb-6 text-gray-900">Users</p>
      <div className="overflow-x-auto rounded-lg shadow-lg bg-white p-6">
        <table className="min-w-[600px] text-center text-gray-900">
          <thead>
            <tr>
              <th className="px-4 py-2 text-gray-900">Display Name</th>
              <th className="px-4 py-2 text-gray-900">Username</th>
              <th className="px-4 py-2 text-gray-900">Email</th>
              <th className="px-4 py-2 text-gray-900">Role</th>
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
                  >
                    <option value="user">user</option>
                    <option value="manager">manager</option>
                    <option value="admin">admin</option>
                  </select>
                </td>
                <td className="px-4 py-2 flex gap-2 justify-center">
                  <button className="rounded-lg bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-white px-3 py-1 hover:scale-105 transition-transform">Submit Change</button>
                  <button className="rounded-lg bg-red-500 text-white px-3 py-1 hover:bg-red-600 transition-colors">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
