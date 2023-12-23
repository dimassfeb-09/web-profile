import CardPortfolio from "../components/CardPortfolio";
import { collection, getDocs } from "@firebase/firestore";
import { db } from "../db/Firebase.ts";
import { useEffect, useState } from "react";
import LoadingScreen from "../components/LoadingScreen.tsx";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/pagination";
import { Autoplay, Pagination } from "swiper/modules";
import { ArrowRightAltOutlined } from "@mui/icons-material";

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
    <div className="mb-20 px-5 sm:px-20">
      <div className="w-min font-bold text-6xl mb-10">
        <div className="text-secondary font-bold">
          <span className="text-black">#</span>Portfolio
          <span className="text-black">.</span>
        </div>
      </div>
      <div>
        <Swiper
          slidesPerView={"auto"}
          spaceBetween={30}
          modules={[Autoplay, Pagination]}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          breakpoints={{
            768: {
              slidesPerView: 3,
            },
            320: {
              slidesPerView: 1,
            },
          }}
          className="mySwiper"
        >
          {portfolios.map(function (object, _) {
            return (
              <SwiperSlide>
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
        <div className="mt-[0.7rem]">
          <span className="font-bold text-secondary">Swipe to Right</span>
          <ArrowRightAltOutlined />
        </div>
      </div>
    </div>
  );
};

export default Portfolio;
