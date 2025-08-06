"use client"
import InputContainer from "@/components/InputContainer";
import Loader from "@/components/Loader"
import useEditUser from "@/hooks/useEditUser"
import useFetch from "@/hooks/useFetch";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProfilePage() {
  const { data: sessionData, status } = useSession()
  const { editUser, loading: editLoading } = useEditUser()
  const [username, setUsername] = useState("")
  const [displayName, setDisplayName] = useState("")
  const [email, setEmail] = useState("")

  // Only fetch user data when we have a session with user ID
  const { loading: fetchLoading, data: fetchedUser, refetch } = useFetch(
    sessionData?.user.id ? `/api/users/${sessionData.user.id}` : ""
  )

  // Combined loading state

  useEffect(() => {
    if (status !== "loading") {
      if (!sessionData) {
        redirect("/"); // protect all pages in dashboard
      }
    }
  }, [sessionData, status])

  // Update form fields when user data is fetched
  useEffect(() => {
    if (fetchedUser?.user) {
      console.log("Fetched user data:", fetchedUser.user)
      setUsername(fetchedUser.user.username || "")
      setDisplayName(fetchedUser.user.display_name || "")
      setEmail(fetchedUser.user.email || "")
    }
  }, [fetchedUser])

  const submitEdit = async () => {
    if (!sessionData?.user.id) return

    const result = await editUser({
      newUsername: username,
      newEmail: email,
      displayName: displayName
    })

    // Refetch user data after successful edit to get updated info
    if (result?.success) {
      refetch()
    }
  }

  // Show loading while session is loading or user data is being fetched initially
  if (status === "loading" || (sessionData?.user.id && fetchLoading && !fetchedUser)) {
    return (
      <main className="flex flex-col justify-center items-center w-full h-screen bg-neutral-900">
        <Loader />
      </main>
    )
  }

  return (
    <main className="flex flex-col justify-center items-center w-full h-screen bg-neutral-900">
      <div
        className="flex justify-center items-center w-full h-full absolute transition-opacity duration-300"
        style={{
          opacity: editLoading ? 1 : 0,
          zIndex: editLoading ? 10 : -10,
          pointerEvents: editLoading ? 'auto' : 'none',
        }}
      >
        <Loader />
      </div>

      <div className="flex flex-col justify-center items-center"
        style={{ filter: editLoading ? 'blur(20px)' : 'none' }}
      >
        <h1 className="text-2xl font-bold mb-5 text-blue-200">Your Profile</h1>
        <div className="flex flex-col gap-5 justify-center items-center bg-neutral-500/20 p-5 border-neutral-500 border-2">
          <InputContainer>
            <p className="font-bold">Username</p>
            <input
              type="text"
              onChange={(e) => setUsername(e.target.value)}
              value={username}
              className="bg-neutral-500/20 border-neutral-500 border-2 rounded-lg"
              disabled={editLoading}
            />
          </InputContainer>
          <InputContainer>
            <p className="font-bold">Display Name</p>
            <input
              type="text"
              onChange={(e) => setDisplayName(e.target.value)}
              value={displayName}
              className="bg-neutral-500/20 border-neutral-500 border-2 rounded-lg"
              disabled={editLoading}
            />
          </InputContainer>
          <InputContainer>
            <p className="font-bold">Email</p>
            <input
              type="text"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              className="bg-neutral-500/20 border-neutral-500 border-2 rounded-lg"
              disabled={editLoading}
            />
          </InputContainer>

          <div className="group relative w-fit transition-transform duration-300 active:scale-95 mt-5">
            <button
              className="relative z-10 rounded-lg bg-gradient-to-br from-indigo-500 to-fuchsia-500 p-0.5 duration-300 group-hover:scale-110"
              onClick={submitEdit}
              disabled={editLoading}
            >
              <span className="block rounded-md bg-slate-950 px-4 py-2 font-semibold text-slate-100 duration-300 group-hover:bg-slate-950/50 group-hover:text-slate-50 group-active:bg-slate-950/80">
                Edit Profile
              </span>
            </button>
            <span className="pointer-events-none absolute -inset-4 z-0 transform-gpu rounded-2xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 opacity-30 blur-xl transition-all duration-300 group-hover:opacity-90 group-active:opacity-50" />
          </div>
        </div>
      </div>
    </main>
  );
}
