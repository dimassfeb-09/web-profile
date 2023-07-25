import React, {useEffect, useState} from "react";
import {addDoc, collection} from "@firebase/firestore";
import {db} from "../db/Firebase.ts";
import {ToastContainer} from "react-toastify";
import toastNotify from "../commons/Toast.tsx";


const Contact = () => {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    const onHandleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        try {

            if (name == "") {
                throw "Nama tidak boleh kosong";
            } else if (email == "") {
                throw "Email tidak boleh kosong";
            } else if (message == "") {
                throw "Pesan tidak boleh kosong";
            } else if (message.length <= 50) {
                throw "Minimal pesan 50 karakter";
            }

            const date = new Date();
            await addDoc(collection(db, "message"), {
                name: name,
                email: email,
                message: message,
                created_at: date,
            });

            setEmail("");
            setName("");
            setMessage("");

            toastNotify({type: "success", message: "Berhasil kirim pesan"});

            return;
        } catch (error) {
            toastNotify({type: "error", message: `Terjadi kesalahan: ${error}`});
            return;
        }
        //
    };
    const isDisabledSubmit = (): boolean => {
        if (name == "") return true;
        if (email == "") return true;
        if (message == "") return true;
        if (message.length < 50) return true;

        return false;
    }

    useEffect(() => {

    }, [])


    return (
        <>
            <div className="flex flex-col items-center py-14 pt-28 h-screen">
                <div className="flex justify-center text-3xl font-semibold">
                    Kirim Pesan
                </div>
                <form className="flex flex-col gap-3 mt-9 w-[90%] md:w-3/4 lg:w-1/2"
                      onSubmit={onHandleSubmit}>
                    <div className="flex flex-col gap-1">
                        <label htmlFor="name" className="required">Nama</label>
                        <input type="name" className="h-12 rounded-sm text-md px-2 border border-solid"
                               placeholder="Masukkan nama anda" value={name} onChange={(e) => {
                            setName(e.target.value)
                        }}/>
                    </div>
                    <div className="flex flex-col gap-1">
                        <label htmlFor="email" className="required">Email</label>
                        <input type="email" className="h-12 rounded-sm text-md px-2 border border-solid"
                               placeholder="Masukkan email anda" value={email} onChange={(e) => {
                            setEmail(e.target.value)
                        }}/>
                    </div>
                    <div className={`flex flex-col gap-1 `}>
                        <label htmlFor="message" className="required">Pesan</label>

                        <textarea
                            className='text-md p-2 border rounded-sm focus:border-red-500 text-black'
                            name="message"
                            id="message"
                            cols={20} rows={10}
                            placeholder="Masukkan pesan anda" value={message} onChange={(e) => {
                            setMessage(e.target.value)
                        }}></textarea>
                        <div className={`flex justify-between ${message.length < 50 ? 'text-red-500' : ''}`}>
                            <div>{message.length}/50
                            </div>
                            <div>Minimal 50 karakter</div>
                        </div>
                    </div>
                    <div className="flex justify-center mt-7">
                        <div className="group/btn hover:bg-teal-400">
                            <button
                                className={`bg-white text-black border border-black w-[120px] h-10 ${isDisabledSubmit() ? 'bg-gray-200 text-gray-400 border-gray-200' : 'hover:bg-black hover:text-white'}`}
                                disabled={isDisabledSubmit()}>
                                Kirim Pesan
                            </button>
                            <span
                                className={`${isDisabledSubmit() ? 'absolute' : 'hidden'} invisible -translate-y-7 -translate-x-24 text-white rounded-sm bg-gray-800 px-1 group-hover/btn:visible`}>Disabled</span>
                        </div>
                        <ToastContainer/>
                    </div>
                </form>
            </div>
        </>
    )
        ;
};

export default Contact;
