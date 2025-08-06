import { useRef, useState } from "react"
import { Id, toast } from "react-toastify"

interface EditUserParams {
  newUsername?: string;
  newEmail?: string;
  displayName?: string;
}

const useEditUser = () => {
  const [loading, setLoading] = useState(false)
  const toastID = useRef<Id>(null)

  const editUser = async ({ newUsername, newEmail, displayName }: EditUserParams) => {
    toastID.current = toast.loading("Updating user...")
    setLoading(true)

    if (!newUsername && !newEmail && !displayName) {
      setLoading(false)
      toast.update(toastID.current, {
        render: "At least one field must be provided for update!",
        isLoading: false,
        autoClose: 5000,
        type: "error"
      })
      return
    }

    try {
      const response = await fetch("/api/users", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          newUsername,
          newEmail,
          displayName
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setLoading(false)
        toast.update(toastID.current, {
          render: data.message || "Failed to update user",
          isLoading: false,
          autoClose: 5000,
          type: "error"
        })
        return { success: false, error: data.message }
      }

      setLoading(false)
      toast.update(toastID.current, {
        render: "User successfully updated!",
        isLoading: false,
        type: "success",
        autoClose: 5000,
      })

      return { success: true, user: data.user }

    } catch (error) {
      console.error("Edit user error:", error)
      setLoading(false)
      toast.update(toastID.current, {
        render: "An error occurred while updating the user",
        isLoading: false,
        autoClose: 5000,
        type: "error"
      })
      return { success: false, error: "Network error" }
    }
  }

  return { editUser, loading }
}

export default useEditUser
