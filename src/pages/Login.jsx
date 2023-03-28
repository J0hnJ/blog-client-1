import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom"
import { authContext } from "../context/authContext";

function Login() {
    const navigate = useNavigate()
    const { isUserLoggedIn, getToken } = useContext(authContext)

    useEffect(() => {
        getToken()
    }), []

    useEffect(()=>{
        isUserLoggedIn && navigate("/")
    },[isUserLoggedIn])

    const [loginFormDetails, setLoginFormDetails] = useState({
        email: "",
        password: ""
    })
    const [error, setError] = useState("")
    function inputHandler(e) {
        setLoginFormDetails({
            ...loginFormDetails,
            [e.target.name]: e.target.value
        })
    }

    async function loginAccount(e) {
        e.preventDefault()
        try {
            setError("")
            const response = await axios.post("https://1to21.com/api/auth/login", loginFormDetails)
            if (response.data.success) {
                navigate("/")
                localStorage.setItem("auth", JSON.stringify(response.data));
            }
        } catch (error) {
            error.response && setError(error.response.data.message);
        }
    }

    return (
        <>
            <section className="bg-gray-50 dark:bg-gray-900">
                <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                    <a href="#" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
                        Login
                    </a>
                    <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                                Sign in to your account
                            </h1>
                            <form className="space-y-4 md:space-y-6" action="#">
                                <div>
                                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                                    <input
                                        onChange={inputHandler}
                                        type="email" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@company.com" required="" />
                                </div>
                                <div>
                                    <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                                    <input
                                        onChange={inputHandler}
                                        type="password" name="password" id="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required="" />
                                </div>
                                <h1 className="my-5 text-red-700">
                                    {error}
                                </h1>
                                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                    onClick={loginAccount}
                                >
                                    Login
                                </button><p className="text-sm font-light text-gray-500 dark:text-gray-400">
                                    Don’t have an account yet?
                                    <Link to="/register" className="font-medium text-primary-600 hover:underline dark:text-primary-500">
                                        Sign up
                                    </Link>
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default Login