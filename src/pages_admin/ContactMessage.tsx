import {useEffect, useState} from 'react';
import {Delete} from "@mui/icons-material";
import {ToastContainer} from "react-toastify";
import getMessages from "../repository/getMessages.ts";
import toastNotify from "../commons/Toast.tsx";
import {deleteDoc, doc} from "@firebase/firestore";
import {db} from "../db/Firebase.ts";


const ContactMessage = () => {

    const [messages, setMessages] = useState<MessageType[]>([]);


    const deletedMessage = async (message: MessageType) => {
        try {
            await deleteDoc(doc(db, "message", message.id));
            const newData = messages.filter(value => value != message);
            setMessages(newData);
            toastNotify({type: "success", message: "Berhasil hapus pesan."});
        } catch (e) {
            toastNotify({type: "error", message: "Gagal hapus pesan."});
        }
    }


    useEffect(() => {
        getMessages().then((value) => {
            setMessages(value);
        });
    }, []);

    return (
        <div className="w-[90%] sm:w-[80%] h-screen pt-28  mx-5 flex flex-col gap-5">
            <div>Pesan Masuk</div>
            <table className="border-collapseborder-collapse table-auto border border-slate-500">
                <thead>
                <tr className="table-">
                    <th className="border border-slate-600 p-2 w-[20%]">Nama</th>
                    <th className="border border-slate-600 p-2 w-[20%]">Email</th>
                    <th className="border border-slate-600 p-2 w-[50%]">Pesan</th>
                    <th className="border border-slate-600 p-2 w-[10%]">Aksi</th>
                </tr>
                </thead>
                <tbody>
                {messages.length == 0 ? <tr className="table-row">
                    <td className="text-center p-2" colSpan={3}>Tidak ada
                        pesan
                    </td>
                </tr> : messages.map((value, i) =>
                    <tr key={i}>
                        <td className="border border-slate-600 p-2 w-[20%]">{value.name}</td>
                        <td className="border border-slate-600 p-2 w-[20%]">{value.email}</td>
                        <td className="border border-slate-600 p-2 w-[50%]">{value.message}</td>
                        <td className="border border-slate-600 p-2 w-[10%]">
                            <div className="flex justify-center items-center ">
                                <div onClick={() => deletedMessage(value)} className="text-red-500"><Delete/></div>
                            </div>
                        </td>
                    </tr>
                )}
                </tbody>
            </table>
            <ToastContainer/>
        </div>
    );
};

export default ContactMessage;