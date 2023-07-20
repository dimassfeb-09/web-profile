import {Download, Email, Instagram, LinkedIn} from "@mui/icons-material";
import {collection, doc, getDoc} from "@firebase/firestore";
import {db} from "../db/Firebase.ts";
import {useEffect, useState} from "react";
import LoadingScreen from "../components/LoadingScreen.tsx";

type BerandaType = {
    title: string,
    description: string,
    cv: string,
}

function Home() {

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
        getBerandas();
        setTimeout(() => {
            setIsLoadingPage(false);
        }, 300)
    }, []);

    if (isLoadingPage) {
        return LoadingScreen();
    }


    return (
        <div className="pt-48 mb-28 sm:mb-0 sm:pt-0 h-screen flex flex-col gap-4 justify-center mx-5 md:mx-12 lg:mx-56">
            <div className="text-6xl font-bold">
                Hi, I am <span className="italic underline">{berandaType?.title}.</span>
            </div>
            <div className="text-xl">
                {berandaType?.description}
            </div>
            <div className="mt-5">
                <div>Tertarik dengan saya?</div>
                <div className="flex gap-5 mt-2">
                    <a href="mailto:dimassfeb@gmail.com">
                        <Email></Email>
                    </a>
                    <a
                        href="https://www.instagram.com/errorlog.dimassfeb/"
                        target="_blank"
                    >
                        <Instagram></Instagram>
                    </a>
                    <a
                        href="https://www.linkedin.com/in/dimas-febriyanto-348246205/"
                        target="_blank"
                    >
                        <LinkedIn></LinkedIn>
                    </a>
                </div>
            </div>
            <a
                className="mt-5 p-2 w-max bg-blue-500 text-white rounded-md"
                href={berandaType?.cv}
                target="_block"
            >
                <Download></Download>
                Unduh CV
            </a>
        </div>
    );
}

export default Home;
