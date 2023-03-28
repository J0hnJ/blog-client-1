import { createContext } from "react";
import axios from "axios"

export const authContext = createContext()

export const AuthProvider = ({ children }) => {
    const createAccount = async (data) => {
        try {
            const response = await axios.post(`https://1to21.com/api/auth/login`, data);
            console.log(response);
        } catch (error) {
            console.log(error.response.data);
        }
        // fetch("https://1to21.com/api/auth/login", {
        //     method: "POST",
        //     headers: {
        //         "Content-Type": "application/json",
        //     },
        //     body: JSON.stringify(loginFormDetails)
        // })
        //     .then((res) => { return res.json() })
        //     .then((data) => console.log(data))
    }
    const value = { createAccount };

    return <authContext.Provider value={value}>
        {children}
    </authContext.Provider>
}