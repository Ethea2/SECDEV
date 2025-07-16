"use client"
import {getUsers, patchUser} from "@/hooks/useFetch"
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";



export default function AdminDashboardPage() {
  //const session = await getServerSession(authOptions);
  //if (!session || session.user.role !== "user") {
  //  return redirect("/unauthorized");
  //}

  const userList = getUsers()


  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <p className="mt-2 text-gray-600">Welcome, {/*session.user.display_name*/"test"}!</p>
      {<table>
          <tbody>
          {userList.map(n => (
            <tr key={n._id}>
              <td>{n.display_name}</td>
              <td>{n.username}</td>
              <td>{n.email}</td>
              <td> 
                <select id={n} name={n.role} size="3" multiple>
                  <option value="user">user</option>
                  <option value="manager">manager</option>
                  <option value="admin">admin</option>
                </select>
                <button className="relative z-10 rounded-lg bg-gradient-to-br from-indigo-500 to-fuchsia-500 p-0.5 duration-300 group-hover:scale-110">Submit Change</button>
              </td>
            </tr>
          ))}
          </tbody>
        </table>}
    </main>
  );
}
