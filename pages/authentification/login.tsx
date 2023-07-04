import {signIn} from "next-auth/react"
import {useEffect, useState} from "react";
import useGetUserById from "@/hooks/user/useGetUserById";
import {useSession} from "next-auth/react";
import {session} from "next-auth/core/routes";
const Login = () => {

    const user = useGetUserById()
    const [userInfo, setUserInfo] = useState({
        email: "",
        password: ""
    })
    const handleLogin = async (e: any) => {
        e.preventDefault()
        const res: any = await signIn('credentials', {
            redirect: false,
            email: userInfo.email,
            password: userInfo.password,
            callbackUrl: `${window.location.origin}`,
        })

        console.log(res)
    }

    const handleGetById = async (e: any) => {
        e.preventDefault()
        await user.fetchData(3)
    }

    useEffect(() => {
        if (user.data) {
            console.log(user.data)
        }
    }, [user.data])

    return (
        <>
            <form>
                <input onChange={(e) => setUserInfo({...userInfo, email: e.target.value})}/>
                <input onChange={(e) => setUserInfo({...userInfo, password: e.target.value})}/>
                <button onClick={handleLogin}>Login</button>
            </form>
            <button onClick={handleGetById}>GetById</button>

        </>
    )
}

export default Login;