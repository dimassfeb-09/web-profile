import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules"; // Ensure correct Swiper import
import "swiper/css";
import "swiper/css/pagination";

import ProjectItem from "../components/projects/ProjectItem";
import TechFilter from "../components/TechFilter";
import { Project } from "../types/project";
import { Tech } from "../types/tech";
import { ArrowRight } from "lucide-react";
import { useState } from "react";

interface MyProjectSectionProps {
  techs: Tech[];
  handleSelectedTechs: (selected: string[]) => void;
  projects: Project[];
}

export default function MyProjectSection(props: MyProjectSectionProps) {
  const { techs, handleSelectedTechs, projects } = props;

  const [currentSlide, setCurrentSlide] = useState<number>(0);

  return (
    <div id="my-projects" className=" bg-white">
      <div className="bg-white w-full flex flex-col items-center pt-10 pb-20">
        <h2 className="text-5xl font-bold mb-5 underline decoration-mainAccent">
          My Projects
        </h2>
        <div className="flex items-center  justify-between w-full px-5 sm:px-0 sm:w-3/4 mt-10">
          <TechFilter techs={techs} selectedTech={handleSelectedTechs} />
          <div className="flex items-center gap-3">
            Swipe to Right ({currentSlide + 1}/{projects.length}) <ArrowRight />
          </div>
        </div>
        <div className="w-full px-5 sm:px-0 sm:w-3/4 mt-5 relative">
          <Swiper
            pagination={{ dynamicBullets: true, clickable: true }}
            modules={[Pagination]}
            className="mySwiper h-auto"
            onSlideChange={(swiper) => setCurrentSlide(swiper.activeIndex)}
          >
            {projects.map((project, index) => (
              <SwiperSlide
                key={project.id}
                className="flex justify-center items-center w-full"
              >
                <div className="w-full">
                  <ProjectItem
                    imgSrc={project.image_url}
                    title={project.title}
                    techs={project.portfolio_techs}
                    badges={["View Project", "View on GitHub", "Live Demo"]}
                    description={project.description}
                    reverse={index % 2 !== 0}
                    githubUrl={project.github_url}
                    demoUrl={project.demo_url}
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Pagination di atas */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 z-10">
            <div className="swiper-pagination"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
