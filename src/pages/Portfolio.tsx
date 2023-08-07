import CardPortfolio from "../components/CardPortfolio";
import { collection, getDocs } from "@firebase/firestore";
import { db } from "../db/Firebase.ts";
import { useEffect, useState } from "react";
import LoadingScreen from "../components/LoadingScreen.tsx";

const Portfolio = () => {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [isLoadingPage, setIsLoadingPage] = useState(true);

  const getPortfolios = async () => {
    const portpoliosRef = collection(db, "portfolio");
    const querySnapshot = await getDocs(portpoliosRef);

    const portopolios: Portfolio[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const newPortfolio: Portfolio = {
        title: data.title,
        image_path: data.image_path,
        github: data.github,
        playstore: data.playstore,
        tech: data.tech,
        demo_live: data.demo_live,
      };
      portopolios.push(newPortfolio);
    });

    setPortfolios(portopolios.reverse());
  };

  useEffect(() => {
    getPortfolios();
    setTimeout(() => {
      setIsLoadingPage(false);
    }, 200);
  }, []);

  if (isLoadingPage) {
    return LoadingScreen();
  }

  return (
    <div className="h-auto pt-24 lg:pt-28 lg:px-14 xl:px-20">
      <div className="group/portfolio m-5 w-min font-bold text-6xl">
        <div
          className="duration-300 ease-out group-hover/portfolio:translate-x-5 sm:group-hover/portfolio:translate-x-20
                    group-hover/portfolio:bg-gradient-to-r
                    group-hover/portfolio:from-blue-500
                    group-hover/portfolio:to-blue-700
                    group-hover/portfolio:text-transparent
                    group-hover/portfolio:bg-clip-text"
        >
          #Porfolio
        </div>
      </div>
      <div className="p-5 gap-7 xl:gap-10 grid md:grid-cols-2 lg:grid-cols-3 overflow-y-auto  auto-rows-auto justify-center">
        {portfolios.map(function (object, i) {
          return (
            <CardPortfolio
              title={object.title}
              image_path={object.image_path}
              playstore={object.playstore}
              github={object.github}
              tech={object.tech}
              demo_live={object.demo_live}
              key={i}
            ></CardPortfolio>
          );
        })}
      </div>
    </div>
  );
};

export default Portfolio;
