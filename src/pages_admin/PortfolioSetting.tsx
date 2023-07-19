import {collection, getDocs} from "@firebase/firestore";
import {db} from "../db/Firebase.ts";
import {useEffect, useState} from "react";
import LoadingScreen from "../components/LoadingScreen.tsx";
import {Edit} from "@mui/icons-material";

type Portfolio = {
    title: string,
    image: string,
    tech: string[],
    github: string,
    playstore?: string,
}

const PortfolioSetting = () => {

    const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
    const [isLoadingPage, setIsLoadingPage] = useState(true);

    const getPortfolios = async () => {
        try {
            const portpoliosRef = collection(db, "portfolio");
            const querySnapshot = await getDocs(portpoliosRef);

            const portopolios: Portfolio[] = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                const newPortfolio: Portfolio = {
                    title: data.title,
                    image: data.image_path,
                    github: data.github,
                    playstore: data.playstore,
                    tech: data.tech,
                };
                portopolios.push(newPortfolio);
            });

            setPortfolios(portopolios);
            setIsLoadingPage(false);
        } catch (e) {
            console.log("error get data");
            console.log(e);
        }
    }

    useEffect(() => {
        getPortfolios();
    }, []);

    if (isLoadingPage) {
        return LoadingScreen();
    }

    return (
        <div className="w-[90%] sm:w-[80%] h-screen pt-28  mx-5 flex flex-col gap-5">
            <div>Pengaturan Portfolio</div>
            <div className="flex flex-col gap-5">
                {portfolios.map(function (object, i) {
                    return <div className="flex justify-between p-3 border" key={i}>
                        <div>{object.title}</div>
                        <Edit></Edit>
                    </div>;
                })}
            </div>
        </div>
    );
};

export default PortfolioSetting;