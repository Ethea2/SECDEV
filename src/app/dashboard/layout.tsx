"use client"

import React, {useEffect} from "react";
import { useSession, signOut } from "next-auth/react";
import { redirect } from "next/navigation";


export default function DashboardLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    
    const { data, status} = useSession()

    useEffect(()=> {
        if(status !== "loading"){
            if (!data) {
                redirect("/login"); // protect all pages in dashboard
            }
        }
        console.log(data);
    }, [data, status])
    return <section>
        <div className="h-screen w-full bg-neutral-900 text-neutral-50">
            <header className="flex items-center justify-between px-8 py-4 bg-neutral-800 shadow">
            <h1 className="text-xl font-bold">
                {`Hello, ${data?.user?.display_name}`}
            </h1>
            <button
                onClick={() => signOut({ callbackUrl: '/login' })}
                className="rounded bg-red-500 px-4 py-2 text-white font-semibold hover:bg-red-600 transition"
            >
                Logout
            </button>
            </header>
        {children}
        </div>
    </section>
  }