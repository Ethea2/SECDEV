import { useRouter } from "next/navigation"
import { useRef, useState } from "react"
import { Id, toast } from "react-toastify"

const useRegister = () => {
  const [loading, setLoading] = useState(false)
  const toastID = useRef<Id>(null)
  const router = useRouter()

  const register = async (username: string, email: string, password: string, confirm: string, displayName: string) => {
    toastID.current = toast.loading("Registering new user...")
    setLoading(true)
    // srsly just wanted to see if it's cool or nah (erase this on final submission)
    // await new Promise(resolve => setTimeout(resolve, 2000))

    if (confirm !== password) {
      setLoading(false)
      toast.update(toastID.current, {
        render: "Please make sure password and confirm password is the same.",
        isLoading: false,
        autoClose: 5000,
        type: "error"
      })
      return
    }

    // if (username === "" || email === "" || password === "" || confirm === "" || displayName === "") {
    //   setLoading(false)
    //   toast.update(toastID.current, {
    //     render: "Please complete the form!",
    //     isLoading: false,
    //     autoClose: 5000,
    //     type: "error"
    //   })
    //   return
    // }

    const res = await fetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ username, email, password, display_name: displayName }),
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
      render: "Successfully created an account!",
      isLoading: false,
      type: "success",
      autoClose: 5000,
    })
    router.push("/")
  }

  return { register, loading }
}

export default useRegister
