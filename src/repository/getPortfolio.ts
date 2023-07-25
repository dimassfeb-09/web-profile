import {collection, getDocs} from "@firebase/firestore";
import {db} from "../db/Firebase.ts";

const getPortfolios = async () => {
    try {
        const portpoliosRef = collection(db, "portfolio");
        const querySnapshot = await getDocs(portpoliosRef);

        const portopolios: Portfolio[] = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const newPortfolio: Portfolio = {
                id: doc.id,
                title: data.title,
                image_path: data.image_path,
                github: data.github,
                playstore: data.playstore,
                tech: data.tech,
            };
            portopolios.push(newPortfolio);
        });

        return portopolios;
    } catch (e) {
        throw e;
    }
}

export default getPortfolios;