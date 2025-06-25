"use client"

import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import { ToastContainer, Zoom } from "react-toastify";
import { Geist, Geist_Mono } from "next/font/google";
import "react-toastify/ReactToastify.css"
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
  session
}: Readonly<{
  children: React.ReactNode;
  session: any | null;
}>) {
  return (
    <html lang="en">
      <SessionProvider session={session}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ToastContainer
          position="bottom-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
          transition={Zoom}
        />
        {children}

      </body>
      </SessionProvider>
    </html>
  );
}
