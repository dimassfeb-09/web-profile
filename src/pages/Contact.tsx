import React, {useState} from "react";
import {doc, setDoc} from "@firebase/firestore";
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

            if (message.length <= 50) {
                throw "Minimal pesan 50 karakter.";
            }

            const date = new Date();
            await setDoc(doc(db, "message", `${date}`), {
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

    return (
        <>
            <div className="flex flex-col items-center py-14 pt-28 h-screen">
                <div className="flex justify-center text-3xl font-semibold">
                    Kirim Pesan
                </div>
                <form className="flex flex-col gap-3 mt-9 w-[90%] md:w-3/4 lg:w-1/2"
                      onSubmit={onHandleSubmit}>
                    <div className="flex flex-col gap-1">
                        <label htmlFor="name">Nama</label>
                        <input type="name" className="h-12 rounded-sm text-md px-2 border border-solid"
                               placeholder="Masukkan nama anda" value={name} onChange={(e) => {
                            setName(e.target.value)
                        }}/>
                    </div>
                    <div className="flex flex-col gap-1">
                        <label htmlFor="email">Email</label>
                        <input type="email" className="h-12 rounded-sm text-md px-2 border border-solid"
                               placeholder="Masukkan email anda" value={email} onChange={(e) => {
                            setEmail(e.target.value)
                        }}/>
                    </div>
                    <div className="flex flex-col gap-1">
                        <label htmlFor="message">Pesan</label>

                        <textarea className="text-md p-2 border border-solid rounded-sm" name="message" id="message"
                                  cols={20} rows={10}
                                  placeholder="Masukkan pesan anda" value={message} onChange={(e) => {
                            setMessage(e.target.value)
                        }}></textarea>
                    </div>
                    <div className="flex justify-center mt-7">
                        <button
                            className="bg-white text-black border border-black hover:bg-black hover:text-white w-[120px] h-10">
                            Kirim Pesan
                        </button>
                        <ToastContainer/>
                    </div>
                </form>
            </div>
        </>
    )
        ;
};

export default Contact;
