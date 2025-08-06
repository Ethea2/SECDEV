"use client";

import AdminHeader from "@/components/AdminHeader";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation'

const PERMISSIONS = [
  { key: "view_users", name: "View Users", description: "Can view user list" },
  { key: "edit_users", name: "Edit Users", description: "Can edit user details and roles" },
  { key: "delete_users", name: "Delete Users", description: "Can delete users" },
  { key: "view_reports", name: "View Reports", description: "Can view system reports" },
  { key: "manage_permissions", name: "Manage Permissions", description: "Can manage permissions" },
];

type Role = "admin" | "manager" | "user";
type RolePermissions = Record<Role, string[]>;

const ROLES: Role[] = ["admin", "manager", "user"];

// Dummy initial state for which roles have which permissions
const initialRolePermissions: RolePermissions = {
  admin: ["view_users", "edit_users", "delete_users", "view_reports", "manage_permissions"],
  manager: ["view_users", "view_reports"],
  user: [],
};

export default function PermissionsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [rolePermissions, setRolePermissions] = useState<RolePermissions>(initialRolePermissions);
  
  useEffect(() => {
    if (status === "loading") return; // Still loading
    if (!session) {
      router.push("/login");
    }
    if (!session || !session.user.roles.includes("admin")) {
      router.push("/dashboard");
    }
  }, [session, status, router]);

  // Show loading state while session is being fetched
  if (status === "loading") {
    return <div>Loading...</div>;
  }

  // Don't render the main content if user is not authorized
  if (!session || !session.user.roles.includes("admin")) {
    return null;
  }

  const handleCheck = (role: Role, permKey: string) => {
    setRolePermissions(prev => {
      const hasPerm = prev[role].includes(permKey);
      return {
        ...prev,
        [role]: hasPerm
          ? prev[role].filter((p: string) => p !== permKey)
          : [...prev[role], permKey],
      };
    });
    // TODO: Call backend to persist change
  };

  const savePermissions = async () => {
    // Dummy fetch request to backend
    await fetch("/api/permissions/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(rolePermissions),
    });
    // Optionally show a success message here
  };

  return (
    <main className="flex flex-col min-h-screen bg-gray-100 items-center">
      <AdminHeader displayName={session?.user?.display_name} />
      <h1 className="text-2xl font-bold mb-6 text-gray-900 mt-8">Permissions</h1>
      <div className="flex flex-wrap gap-8 justify-center w-full max-w-6xl">
        {ROLES.map(role => (
          <div key={role} className="bg-white rounded-lg shadow-lg p-6 w-80 flex flex-col items-center">
            <h2 className="text-xl font-semibold mb-4 capitalize text-indigo-700">{role}</h2>
            <ul className="w-full">
              {PERMISSIONS.map(perm => (
                <li key={perm.key} className="flex items-center justify-between mb-3">
                  <span className="text-gray-900">{perm.name}</span>
                  <input
                    type="checkbox"
                    checked={rolePermissions[role].includes(perm.key)}
                    onChange={() => handleCheck(role, perm.key)}
                    className="accent-indigo-600 w-5 h-5"
                  />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <button
        className="mt-10 px-8 py-3 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition-colors text-lg font-semibold"
        onClick={savePermissions}
      >
        Save
      </button>
    </main>
  );
} 