import { useEffect, useState } from "react"
import { toast } from "react-toastify"

const useFetch = (url: string) => {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<any>()

  const refetch = async () => {
    setLoading(true)
    try {
      const res = await fetch(url)
      const responseData = await res.json()

      if (!res.ok) {
        console.log(responseData)
        toast(responseData.message || "Something went wrong!", {
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          type: "error",
        })
        setLoading(false)
        return
      }

      setData(responseData)
      setLoading(false)
    } catch (error) {
      console.error("Fetch error:", error)
      toast("Network error occurred!", {
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        type: "error",
      })
      setLoading(false)
    }
  }

  useEffect(() => {
    if (url) {
      refetch()
    }
  }, [url])

  return { loading, data, refetch }
}

export default useFetch
