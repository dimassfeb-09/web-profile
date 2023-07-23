import {useEffect, useState} from 'react';
import {db} from "../db/Firebase.ts";
import {collection, getDocs} from "@firebase/firestore";
import {Delete, Message} from "@mui/icons-material";
import ModalMessage from "../components/ModalMessage.tsx";

type Message = {
    name: string,
    email: string,
    message: string,
}

const ContactMessage = () => {

    const [messages, setMessages] = useState<Message[]>([]);

    const getMessages = async () => {
        try {
            const collectionReference = collection(db, "message");
            const docs = await getDocs(collectionReference);

            const newMessages: Message[] = [];
            docs.docs.forEach((value) => {
                const message: Message = {
                    name: value.get("name"),
                    email: value.get("email"),
                    message: value.get("message"),
                }
                newMessages.push(message);
            });
            setMessages(newMessages);
        } catch (e) {
            console.log(e);
        }
    }

    useEffect(() => {
        getMessages();
    }, []);

    return (
        <div className="w-[90%] sm:w-[80%] h-screen pt-28  mx-5 flex flex-col gap-5">
            <div>Pesan Masuk</div>
            <table className="border-collapseborder-collapse table-auto border border-slate-500">
                <thead>
                <tr className="table-">
                    <th className="border border-slate-600 p-2 w-[20%]">Nama</th>
                    <th className="border border-slate-600 p-2 w-[70%]">Email</th>
                    <th className="border border-slate-600 p-2 w-[10%]">Aksi</th>
                </tr>
                </thead>
                <tbody>

                {messages.map((value, i) =>
                    <tr key={i}>
                        <td className="border border-slate-600 p-2">{value.name}</td>
                        <td className="border border-slate-600 p-2">{value.email}</td>
                        <td className="border border-slate-600 p-2">
                            <div className="flex text-white justify-evenly">
                                <div className="bg-red-500 p-1 rounded-md"><Delete/></div>
                                <ModalMessage message={value.message}/>
                            </div>
                        </td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    );
};

export default ContactMessage;