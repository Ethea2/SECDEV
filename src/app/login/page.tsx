"use client"

import Loader from "@/components/Loader"
import useLogin from "@/hooks/useLogin"
import useRegister from "@/hooks/useRegister"
import { useState } from "react"

const Login = () => {
  const { login, loading } = useLogin()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const submitLogin = async () => {
    await login(username, password)
  }

  return (
    <div className={`flex justify-center items-center w-full h-screen bg-neutral-900`}>
      <div
        className="flex justify-center items-center w-full h-full absolute transition-opacity duration-300"
        style={{
          opacity: loading ? 1 : 0,
          zIndex: loading ? 10 : -10,
          pointerEvents: loading ? 'auto' : 'none',
        }}
      >
        <Loader />
      </div>
      <div className="flex flex-col justify-center items-center bg-neutral-500/20 p-5 border-neutral-500 border-2 gap-3"
        style={{ filter: loading ? 'blur(20px)' : 'none' }}
      >
        <div className="flex justify-center items-center w-full text-blue-200 text-2xl font-bold m-5">
          Log in
        </div>
        <InputContainer>
          <p className="font-bold">Username</p>
          <input onChange={(e) => setUsername(e.target.value)} value={username} className="bg-neutral-500/20 border-neutral-500 border-2 rounded-lg" />
        </InputContainer>
        <InputContainer>
          <p className="font-bold">Password</p>
          <input type="password" onChange={(e) => setPassword(e.target.value)} value={password} className="bg-neutral-500/20 border-neutral-500 border-2 rounded-lg" />
        </InputContainer>
        <div className="group relative w-fit transition-transform duration-300 active:scale-95 mt-5">
          <button className="relative z-10 rounded-lg bg-gradient-to-br from-indigo-500 to-fuchsia-500 p-0.5 duration-300 group-hover:scale-110" onClick={() => {
            submitLogin()
          }}>
            <span className="block rounded-md bg-slate-950 px-4 py-2 font-semibold text-slate-100 duration-300 group-hover:bg-slate-950/50 group-hover:text-slate-50 group-active:bg-slate-950/80">
              Login
            </span>
          </button>
          <span className="pointer-events-none absolute -inset-4 z-0 transform-gpu rounded-2xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 opacity-30 blur-xl transition-all duration-300 group-hover:opacity-90 group-active:opacity-50" />
        </div>
      </div>
    </div>
  )
}

const InputContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex justify-between items-center gap-2 w-full">
      {children}
    </div>
  )
}

export default Login