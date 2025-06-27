import { useRouter } from "next/navigation"
import { useRef, useState } from "react"
import { Id, toast } from "react-toastify"
import { signIn } from "next-auth/react";

const useLogin = () => {
  const [loading, setLoading] = useState(false)
  const toastID = useRef<Id>(null)
  const router = useRouter()

  const login = async (username: string, password: string) => {
    toastID.current = toast.loading("Logging in")
    setLoading(true)

    if (username === "" || password === "") {
      setLoading(false)
      toast.update(toastID.current, {
        render: "Please complete the form!",
        isLoading: false,
        autoClose: 5000,
        type: "error"
      })
      return
    }

    const res = await signIn('credentials', {
      redirect: false,
      username,
      password,
    });
    if (res?.error) {
      toast.update(toastID.current, {
        render: "Uh-oh! Something went wrong.",
        isLoading: false,
        autoClose: 5000,
        type: "error"
      })
      setLoading(false)
      return
    }

    setLoading(false)
    toast.update(toastID.current, {
      render: "Successfully logged in!",
      isLoading: false,
      type: "success",
      autoClose: 5000,
    })

    router.push("/dashboard")
  }

  return { login, loading }
}

export default useLogin
