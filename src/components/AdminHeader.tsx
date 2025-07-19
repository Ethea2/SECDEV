import Link from "next/link";
import { signOut } from "next-auth/react";

export default function AdminHeader({ displayName }: { displayName?: string }) {
  return (
    <header className="flex items-center justify-between w-full px-8 py-4 bg-white shadow mb-6">
      <div className="flex items-center gap-8">
        <span className="text-lg font-semibold text-gray-900">
          {displayName ? `Welcome, ${displayName}` : "Admin Dashboard"}
        </span>
        <nav className="flex gap-4">
          <Link href="/admin" className="text-indigo-600 hover:underline">Users</Link>
          <Link href="/admin/permissions" className="text-indigo-600 hover:underline">Permissions</Link>
        </nav>
      </div>
      <button onClick={() => signOut()} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors">Logout</button>
    </header>
  );
} 