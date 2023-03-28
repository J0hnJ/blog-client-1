import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const authContext = createContext()

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate()
    const [isUserLoggedIn, setIsUserLoggedIn] = useState(false)
    const [tokenDetails, setTokenDetails] = useState({})

    function getToken() {
        setTokenDetails(JSON.parse(window.localStorage.getItem("auth")));
    }

    function logout() {
        window.localStorage.clear()
        setTokenDetails({})
        navigate("/")
        setIsUserLoggedIn(false)
    }

    useEffect(() => {
        if (tokenDetails && tokenDetails.accessToken) {
            setIsUserLoggedIn(true)
        }
    }, [tokenDetails])

    useEffect(() => {
        getToken()
    }, [])

    const obj = {
        isUserLoggedIn,
        getToken,
        tokenDetails,
        logout
    }

    return (
        <authContext.Provider value={obj}>
            {children}
        </authContext.Provider>
    )
}