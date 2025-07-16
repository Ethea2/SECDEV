"use client"
import {useState, useRef, useEffect} from "react"
import { Id, toast } from "react-toastify"


const getUsers = () => {
    const [users, setUsers] = useState([])

    useEffect(() => {
        fetch("/api/users")
        .then((res) => res.json())
        .then((data) => setUsers(data.userlist))
    }, [])

    return users
}

const patchUser = async (username: string, newUsername: string, email: string, password: string, displayName: string, role: string) => {

    try{
        await fetch("/api/users", {
            method: "PATCH",
            body: JSON.stringify({username, newUsername, email, password, displayName, role}),
            headers: {
                "Content-Type": "application/json"
            }
        })
    } catch (e) {
        console.log(e)
    }


    
}

export {getUsers, patchUser}