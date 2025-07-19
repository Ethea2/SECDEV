import { useRouter } from "next/navigation"
import { useRef, useState } from "react"
import { Id, toast } from "react-toastify"

const useEditUser = () =>{
    const [loading, setLoading] = useState(false)
    const toastID = useRef<Id>(null)
    const router = useRouter()

    const editUser = async (username: string, password: string, confirm: string) => {
        toastID.current = toast.loading("Loading Edit...")
        setLoading(true)

        if(password !== confirm){
            setLoading(false)
            toast.update(toastID.current, {
                render: "Make sure new password and confirm password is the same.",
                isLoading: false,
                autoClose: 5000,
                type: "error"
            })
            return
        }

        
    }

    return { editUser, loading }
}

export default useEditUser