import {collection, doc, getDoc} from "@firebase/firestore";
import {db} from "../db/Firebase.ts";
import {useEffect, useState} from "react";
import LoadingScreen from "../components/LoadingScreen.tsx";
import {Email, LibraryBooks} from "@mui/icons-material";

type BerandaType = {
    title: string,
    description: string,
    cv: string,
}

function AdminHome() {

    const [berandaType, setBerandaType] = useState<BerandaType>();
    const [isLoadingPage, setIsLoadingPage] = useState(true);

    const getBerandas = async () => {
        try {
            const collectionRef = collection(db, "settings")
            let documentSnapshot = await getDoc(doc(collectionRef, "beranda"));
            setBerandaType({
                title: documentSnapshot.get("title"),
                description: documentSnapshot.get("description"),
                cv: documentSnapshot.get("cv"),
            })
        } catch (e) {
            console.log(e);
        }
    }

    useEffect(() => {
        getBerandas().then(v => v);
        setTimeout(() => {
            setIsLoadingPage(false);
        }, 300)
    }, []);

    if (isLoadingPage) {
        return LoadingScreen();
    }

    return (
        <div
            className="sm:mb-0 sm:pt-0 h-screen flex flex-col gap-4 justify-center mx-5 md:mx-16 lg:mx-28 xl:mx-28">
            <div className="text-4xl sm:text-4xl md:text-5xl lg:text-6xl font-bold">
                <span>Hi! I am</span>
                <span
                    className="bg-gradient-to-r from-blue-500 to-blue-700 text-transparent bg-clip-text">   {berandaType?.title}.</span>
            </div>
            <div className="text-lg lg:text-xl lg:w-[70%]">
                {berandaType?.description}
            </div>
            <div className="flex gap-4 mt-5 lg:text-lg">
                <a href={berandaType?.cv} target="_block" className="group/cv w-min flex gap-2 items-center">
                    <LibraryBooks/> Resume
                    <span
                        className="h-[0.2em] w-0 absolute duration-500 ease-in-out translate-y-4 bg-gradient-to-r from-blue-500 to-blue-700 group-hover/cv:w-[5.58em]"></span>
                </a>
                <a href="mailto:dimassfeb@gmail.com" target="_block" className="group/cv w-min flex gap-2 items-center">
                    <Email/> dimassfeb@gmail.com
                    <span
                        className="h-[0.2em] w-0 absolute duration-500 ease-in-out translate-y-4 bg-gradient-to-r from-blue-500 to-blue-700 group-hover/cv:w-[12.3em]"></span>
                </a>
            </div>

        </div>
    );
}

export default AdminHome;