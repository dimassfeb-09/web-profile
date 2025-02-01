import { useEffect, useState } from "react";

import { DefaultLayout } from "../layout/DefaultLayout";
import supabase from "../utils/supabase";
import AchievementsSection from "../section/AchievementSection";
import { Achievement } from "../types/Achievement";
import { Project } from "../types/project";
import { Tech } from "../types/tech";
import HomeSection from "../section/HomeSection";
import WhatIDoSection from "../section/WhatIDoSection";
import MyProjectSection from "../section/MyProjectSection";
import ContactSection from "../section/ContactSection";
import { Experience } from "../types/experience";
import ExperienceSection from "../section/ExperienceSection";

export default function IndexPage() {
  const [projectData, setProjectData] = useState<Project[]>([]);
  const [achievementData, setAchievementData] = useState<Achievement[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);

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

  async function fetchExperience() {
    const { data, error } = await supabase
      .from("experiences")
      .select(`*`)
      .order("id", { ascending: false });

    if (error) {
      console.error("Error fetching achievement:", error);
      return [];
    }

    setExperiences(data);
  }

  useEffect(() => {
    const loadProjects = async () => {
      const projects = await fetchPortfolios();
      setProjectData(projects);
      setFilteredProjects(projects);
    };

    const loadAchievement = async () => {
      await fetchAchievement();
    };

    const loadExperice = async () => {
      await fetchExperience();
    };

    loadProjects();
    loadAchievement();
    loadExperice();

    console.log(achievementData);
  }, []);

  const handleSelectedTechs = (selected: string[]) => {
    console.log("Selected Technologies: ", selected);

    if (selected.length === 0) {
      setFilteredProjects(projectData);
    } else {
      const filtered = projectData.filter((project) =>
        project.portfolio_techs.some((tech) => selected.includes(tech.name))
      );
      setFilteredProjects(filtered);
    }
  };

  return (
    <DefaultLayout>
      <HomeSection />
      <WhatIDoSection />
      <ExperienceSection experiences={experiences} />
      <MyProjectSection
        handleSelectedTechs={handleSelectedTechs}
        projects={filteredProjects}
        techs={techs}
      />
      <AchievementsSection achievementData={achievementData} />
      <ContactSection />
    </DefaultLayout>
  );
}
