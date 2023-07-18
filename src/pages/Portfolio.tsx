import CardPortfolio from "../components/CardPortfolio";
import { collection, getDocs} from "@firebase/firestore";
import {db} from "../db/Firebase.ts";
import {useEffect, useState} from "react";

type Portfolio = {
    title: string;
    image: string;
    github: string;
    playstore?: string;
    tech: string[];
};

const Portfolio = () => {

    const [portfolios, setPortfolios] = useState<Portfolio[]>([]);

    const getPortfolios =  async ()  => {
        const portpoliosRef = collection(db, "portfolio");
        const querySnapshot = await getDocs(portpoliosRef);

        const portopolios : Portfolio[] = [];
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

        setPortfolios(portopolios.reverse());
    }

    useEffect(()=> {
        getPortfolios();
    }, []);



  return (
    <div className="h-screen">
      <div className="pt-28 pb-28 p-5 gap-5 grid md:grid-cols-2 lg:grid-cols-3 overflow-y-auto  auto-rows-auto justify-center">
          {portfolios.map(function(object, i){
              return <CardPortfolio
                  title={object.title}
                  imgPath={object.image}
                  playstore={object.playstore}
                  github={object.github}
                  tech={object.tech}
                  key={i}
              ></CardPortfolio>;
          })}
      </div>
    </div>
  );
};

export default Portfolio;
