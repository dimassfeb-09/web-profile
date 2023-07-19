import React, {useEffect, useState} from 'react';
import {ToastContainer} from "react-toastify";
import {collection, doc, getDoc, updateDoc} from "@firebase/firestore";
import {db} from "../db/Firebase.ts";
import toastNotify from "../commons/Toast.tsx";
import LoadingScreen from "../components/LoadingScreen.tsx";

const BerandaSetting = () => {

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [cv, setCV] = useState("");
    const [isLoadingPage, setIsLoadingPage] = useState(false);

    const getBerandaSetting = async () => {
        try {
            setIsLoadingPage(true);
            const collectionRef = collection(db, "settings");
            const docSnap = await getDoc(doc(collectionRef, "beranda"));

            if (docSnap.exists()) {
                setTitle(docSnap.get("title"));
                setDescription(docSnap.get("description"));
                setCV(docSnap.get("cv"));
            }
            setIsLoadingPage(false);
        } catch (e) {
            console.log(e);
        }
    }

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        try {
            setIsLoadingPage(true);
            const collectionRef = collection(db, "settings");
            await updateDoc(doc(collectionRef, "beranda"), {
                title: title,
                description: description,
                cv: cv,
            });
            setTimeout(() => {
                toastNotify({type: "success", message: `Berhasil update`});
                setIsLoadingPage(false);
            }, 500);

            setIsLoadingPage(false);
        } catch (e) {
            return toastNotify({type: "error", message: `Gagal update data! ${e}`})
        }
    }

    useEffect(() => {
        getBerandaSetting();
    }, []);


    if (isLoadingPage) {
        return LoadingScreen();
    }

    return (
        <div className="w-[90%] sm:w-[80%] h-screen pt-28  mx-5 flex flex-col gap-5">
            <form className="flex flex-col gap-3 sm:gap-5" onSubmit={handleSubmit}>
                <div className="flex justify-between items-center">
                    <div>Pengaturan Beranda</div>
                    <div>
                        <button
                            className="bg-blue-600 text-white hover:bg-black hover:text-white w-[120px] h-10">Simpan
                        </button>
                        <ToastContainer/>
                    </div>
                </div>
                <div className="flex flex-col gap-1">
                    <label htmlFor="title">Judul</label>
                    <input type="text" className="h-12 rounded-sm text-md px-2 border border-solid"
                           placeholder="Masukkan judul anda" onChange={(e) => {
                        setTitle(e.target.value)
                    }} value={title}/>
                </div>
                <div className="flex flex-col gap-1">
                    <label htmlFor="description">Deskripsi</label>
                    <textarea className="text-md p-2 border border-solid rounded-sm" name="message" id="message"
                              cols={20} rows={10}
                              placeholder="Masukkan deskripsi anda" onChange={(e) => {
                        setDescription(e.target.value)
                    }} value={description}></textarea>
                </div>
                <div className="flex flex-col gap-1">
                    <label htmlFor="linkedin">CV</label>
                    <input type="text" className="h-12 rounded-sm text-md px-2 border border-solid"
                           placeholder="Masukkan link CV anda" onChange={(e) => {
                        setCV(e.target.value)
                    }} value={cv}/>
                </div>
            </form>
        </div>
    );
};

export default BerandaSetting;