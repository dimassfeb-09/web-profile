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
        platform: data.platform,
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
    <div className="dark:bg-darkColor dark:text-white h-auto xl:px-20">
      <div className="group/portfolio m-5 w-min font-bold text-6xl">
        <div className="text-secondary font-bold">
          <span className="text-black">#</span>Portfolio
          <span className="text-black">.</span>
        </div>
      </div>
      <div className="p-5 gap-7 xl:gap-10 grid md:grid-cols-2 lg:grid-cols-3 overflow-y-auto  auto-rows-auto justify-center">
        {portfolios.map(function (object, _) {
          return (
            <CardPortfolio
              title={object.title}
              platform={object.platform}
              image_path={object.image_path}
              playstore={object.playstore}
              github={object.github}
              tech={object.tech}
              demo_live={object.demo_live}
              key={object.title}
            ></CardPortfolio>
          );
        })}
      </div>
    </div>
  );
};

export default Portfolio;
