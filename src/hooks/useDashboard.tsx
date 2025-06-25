import { useRouter } from "next/navigation"

const useDashboard = () =>{
    const router = useRouter()
    let decodedCookie = document.cookie;
    let cookie = decodedCookie.split(';');
    
    for(let i =0; i< cookie.length; i++){
        let c = cookie[i];
        while (c.charAt(0) == ' '){
            c = c.substring(1)
        }

        if(c.indexOf("username=")==0){
            router.push("/login")
        }
    }
}

export default useDashboard