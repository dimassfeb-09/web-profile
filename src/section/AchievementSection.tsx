import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import AchievementItem from "../components/achivment/AchivmentItem";
import { Achievement } from "../types/achievement";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import supabase from "../utils/supabase";

const AchievementsSection = () => {
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [achievementData, setAchievementData] = useState<Achievement[]>([]);

  async function fetchAchievement() {
    const { data, error } = await supabase
      .from("achievements")
      .select(`*`)
      .order("id", { ascending: false });

    if (error) {
      console.error("Error fetching achievement:", error);
      return [];
    }

    setAchievementData(data);
  }

  useEffect(() => {
    const loadAchievement = async () => {
      await fetchAchievement();
    };
    loadAchievement();
  }, []);

  return (
    <div id="my-achievement" className="bg-white">
      <div className="w-full flex flex-col items-center pt-10 pb-20">
        <h2 className="text-5xl font-bold mb-5 underline decoration-mainAccent">
          My Achievement
        </h2>

        {/* Swiper Container */}
        <div className="w-full min-h-[400px] px-5 sm:px-0 sm:w-3/4 mt-5">
          <div className="w-full flex justify-end items-center gap-3 text-gray-600 pr-5">
            Swipe to Right ({currentSlide + 1}/{achievementData.length}){" "}
            <ArrowRight />
          </div>

          <Swiper
            pagination={{ dynamicBullets: true }}
            modules={[Pagination]}
            className="mySwiper h-auto"
            onSlideChange={(swiper) => setCurrentSlide(swiper.activeIndex)}
          >
            {achievementData.map((achievement, index) => (
              <SwiperSlide
                key={achievement.id || index}
                className="flex justify-center items-center"
              >
                <AchievementItem
                  achievement={achievement}
                  reverse={index % 2 !== 0}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
};

export default AchievementsSection;
