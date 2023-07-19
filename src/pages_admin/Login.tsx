import {ToastContainer} from "react-toastify";
import React, {useEffect, useState} from "react";

import {Auth, getAuth, signInWithEmailAndPassword, UserCredential} from "@firebase/auth";
import app from "../db/Firebase.ts";
import {useNavigate} from "react-router-dom";
import toastNotify from "../commons/Toast.tsx";
import LoadingScreen from "../components/LoadingScreen.tsx";


const Login = () => {


    const [isLoadingPage, setIsLoadingPage] = useState(true);
    const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();
    const auth: Auth = getAuth(app);

    useEffect(() => {
        auth.onAuthStateChanged(user => {
            if (user) {
                setIsUserAuthenticated(true);
            } else {
                setIsUserAuthenticated(false);
            }

            setTimeout(() => {
                setIsLoadingPage(false);
            }, 1000)

            if (isUserAuthenticated) {
                return navigate('/admin/home');
            }
        });
    }, [navigate, isLoadingPage, isUserAuthenticated]);


    const handleSubmit = async (event: React.FormEvent) => {
        try {
            event.preventDefault();
            const signIn: UserCredential = await signInWithEmailAndPassword(auth, email, password);
            if (signIn.user) {

                setEmail("");
                setEmail("");

                return navigate('/admin/home');
            }
        } catch (error) {
            toastNotify({type: "error", message: `Terjadi kesalahan: ${error}`});
        }
    }


    if (isLoadingPage) {
        return LoadingScreen();
    }

    return (
        <div
            className="flex flex-col justify-center items-center h-screen w-full bg-gradient-to-r from-blue-400 to-blue-700">
            <div className="flex flex-col gap-10 bg-white rounded-lg w-[90%] p-5 sm:w-[40%]">
                <div className="text-6xl font-bold text-center">Masuk</div>
                <form className="flex flex-col gap-3 sm:gap-5" onSubmit={handleSubmit}
                >
                    <div className="flex flex-col gap-1">
                        <label htmlFor="name">Email</label>
                        <input type="email" className="h-12 rounded-sm text-md px-2 border border-solid"
                               placeholder="Masukkan email anda" onChange={(e) => setEmail(e.target.value)}
                               value={email}/>
                    </div>
                    <div className="flex flex-col gap-1">
                        <label htmlFor="email">Kata Sandi</label>
                        <input type="password" className="h-12 rounded-sm text-md px-2 border border-solid"
                               placeholder="Masukkan kata sandi anda" onChange={(e) => setPassword(e.target.value)}
                               value={password}/>
                    </div>
                    <div className="flex justify-center mt-7">
                        <button
                            className="bg-white text-black border border-black hover:bg-black hover:text-white w-[120px] h-10">
                            Masuk
                        </button>
                        <ToastContainer/>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;