import { useRouter } from "next/navigation"
import { useRef, useState } from "react"
import { Id, toast } from "react-toastify"

const useLogin = () => {
  const [loading, setLoading] = useState(false)
  const toastID = useRef<Id>(null)
  const router = useRouter()

  const login = async (username: string, password: string) => {
    toastID.current = toast.loading("Logging in")
    setLoading(true)
    // srsly just wanted to see if it's cool or nah (erase this on final submission)
    await new Promise(resolve => setTimeout(resolve, 2000))

    if (username === ""  || password === "") {
      setLoading(false)
      toast.update(toastID.current, {
        render: "Please complete the form!",
        isLoading: false,
        autoClose: 5000,
        type: "error"
      })
      return
    }

    const res = await fetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password}),
      headers: {
        "Content-Type": "application/json"
      }
    })

    const json = await res.json()
    if (!res.ok) {
      setLoading(false)
      toast.update(toastID.current, {
        render: json.message,
        isLoading: false,
        type: "error",
        autoClose: 5000,
      })
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
