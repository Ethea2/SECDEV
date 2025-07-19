import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session) return redirect("/unauthorized");

  const { username, email, display_name, roles } = session.user;

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold">Your Profile</h1>
      <div className="mt-4 space-y-2">
        <p><strong>Username:</strong> {username}</p>
        <p><strong>Email:</strong> {email}</p>
        <p><strong>Display Name:</strong> {display_name}</p>
        <p><strong>Role:</strong> {roles}</p>
      </div>
      {/* Optional: Add a form for editing display name/password */}
    </main>
  );
}
