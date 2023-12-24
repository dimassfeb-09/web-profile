import CardPortfolio from "../components/CardPortfolio";
import { collection, getDocs } from "@firebase/firestore";
import { db } from "../db/Firebase.ts";
import { useEffect, useState } from "react";
import LoadingScreen from "../components/LoadingScreen.tsx";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/pagination";
import { Autoplay, Pagination, FreeMode } from "swiper/modules";

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
    <div className="mb-20 sm:px-20">
      <div className="w-min font-bold text-6xl mb-10  px-5">
        <div className="text-secondary font-bold">
          <span className="text-black">#</span>Portfolio
          <span className="text-black">.</span>
        </div>
      </div>
      <div>
        <Swiper
          modules={[Autoplay, FreeMode, Pagination]}
          freeMode={true}
          pagination={{
            clickable: true,
          }}
          breakpoints={{
            900: {
              slidesPerView: 3,
            },
            700: {
              slidesPerView: 2,
            },
            320: {
              slidesPerView: 1,
            },
          }}
          className="mySwiper"
        >
          {portfolios.map(function (object, _) {
            return (
              <SwiperSlide className="mb-12 px-5">
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
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </div>
  );
};

export default Portfolio;
