import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules"; // Ensure correct Swiper import
import "swiper/css";
import "swiper/css/pagination";

import ProjectItem from "../components/projects/ProjectItem";
import TechFilter from "../components/TechFilter";
import { Project } from "../types/project";
import { Tech } from "../types/tech";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import supabase from "../utils/supabase";

export default function MyProjectSection() {
  const [currentSlide, setCurrentSlide] = useState<number>(0);

  const [projectData, setProjectData] = useState<Project[]>([]);

  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [techs, setTechs] = useState<Tech[]>([]);

  async function fetchPortfolios(): Promise<Project[]> {
    const { data, error } = await supabase
      .from("portfolios")
      .select(
        ` 
        *, 
        portfolio_techs (
          tech_id, 
          techs (
            id, 
            name
          )
        )
      `
      )
      .order("id", { ascending: false });

    if (error) {
      console.error("Error fetching portfolios:", error);
      return [];
    }

    const projects = data.map((portfolio: any) => ({
      id: portfolio.id,
      title: portfolio.title,
      description: portfolio.description,
      type: portfolio.type,
      playstoreUrl: portfolio.playstore_url,
      github_url: portfolio.github_url,
      demo_url: portfolio.demo_url,
      image_url: portfolio.image_url,
      portfolio_techs: portfolio.portfolio_techs.map((pt: any) => ({
        id: pt.techs.id,
        name: pt.techs.name,
      })),
      created_at: portfolio.created_at,
    })) as Project[];

    const uniqueTechs = new Map<number, Tech>();

    projects.forEach((project) => {
      project.portfolio_techs.forEach((tech) => {
        if (!uniqueTechs.has(tech.id)) {
          uniqueTechs.set(tech.id, tech);
        }
      });
    });

    const tech: Tech[] = Array.from(uniqueTechs.values());

    setTechs(tech);

    return projects;
  }

  const handleSelectedTechs = (selected: string[]) => {
    if (selected.length === 0) {
      setFilteredProjects(projectData);
    } else {
      const filtered = projectData.filter((project) =>
        project.portfolio_techs.some((tech) => selected.includes(tech.name))
      );
      setFilteredProjects(filtered);
    }
  };

  useEffect(() => {
    const loadProjects = async () => {
      const projects = await fetchPortfolios();
      setProjectData(projects);
      setFilteredProjects(projects);
    };

    loadProjects();
  }, []);

  return (
    <div id="my-projects" className=" bg-white">
      <div className="bg-white w-full flex flex-col items-center pt-10 pb-20">
        <h2 className="text-5xl font-bold mb-5 underline decoration-mainAccent">
          My Projects
        </h2>
        <div className="flex items-center  justify-between w-full px-5 sm:px-0 sm:w-3/4 mt-10">
          <TechFilter techs={techs} selectedTech={handleSelectedTechs} />
          <div className="flex items-center gap-3">
            Swipe to Right ({currentSlide + 1}/{filteredProjects.length}){" "}
            <ArrowRight />
          </div>
        </div>
        <div className="w-full px-5 sm:px-0 sm:w-3/4 mt-5 relative">
          <Swiper
            pagination={{ dynamicBullets: true, clickable: true }}
            modules={[Pagination]}
            className="mySwiper h-auto"
            onSlideChange={(swiper) => setCurrentSlide(swiper.activeIndex)}
          >
            {filteredProjects.map((project, index) => (
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
                    playstoreUrl={project.playstoreUrl}
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
