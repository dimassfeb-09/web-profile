import { useEffect, useState } from "react";
import ProjectItem from "../components/projects/ProjectItem";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { DefaultLayout } from "../layout/DefaultLayout";
import supabase from "../utils/supabase";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Button } from "../components/ui/button";
import TechFilter from "../components/TechFilter";

export interface Tech {
  id: number;
  name: string;
}

// Define the type for project data
interface Project {
  id: number; // Assuming there's an id field, change as necessary
  title: string;
  description: string;
  type: string; // Adjust according to your actual data structure
  github_url: string;
  demo_url: string;
  image_url: string;
  portfolio_techs: Tech[];
  created_at: string; // Date as string, or use Date if converted
}

export default function IndexPage() {
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
      return []; // Return an empty array in case of error
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
        id: pt.techs.id, // Ensure this is correctly assigned
        name: pt.techs.name,
      })),
      created_at: portfolio.created_at,
    })) as Project[];

    // Create a Set to hold unique technologies
    const uniqueTechs = new Map<number, Tech>();

    projects.forEach((project) => {
      project.portfolio_techs.forEach((tech) => {
        if (!uniqueTechs.has(tech.id)) {
          uniqueTechs.set(tech.id, tech);
        }
      });
    });

    // Convert the Map back to an array
    const tech: Tech[] = Array.from(uniqueTechs.values());

    setTechs(tech);

    return projects;
  }

  useEffect(() => {
    const loadProjects = async () => {
      const projects = await fetchPortfolios();
      setProjectData(projects); // Store the fetched projects
      setFilteredProjects(projects); // Set fetched projects to state
    };

    loadProjects();
  }, []);

  const handleSelectedTechs = (selected: string[]) => {
    console.log("Selected Technologies: ", selected);

    if (selected.length === 0) {
      // If no tech is selected, show all projects
      setFilteredProjects(projectData);
    } else {
      // Filter projects based on selected technologies
      const filtered = projectData.filter((project) =>
        project.portfolio_techs.some((tech) => selected.includes(tech.name))
      );
      setFilteredProjects(filtered);
    }
  };

  return (
    <DefaultLayout>
      <div
        id="home"
        className="w-full px-20 lg:gap-20 h-screen flex justify-center items-center"
      >
        <div className="flex flex-col">
          <div>
            <h1 className="text-xl">
              Hi, my name is <span className="font-bold">Dimas Febriyanto</span>
            </h1>
            <div className="text-7xl font-bold">I'm a Fullstack developer</div>
            <div className="text-lg mt-5">
              I have skills in web development and mobile development
            </div>
          </div>
          <a
            target="_blank"
            href="https://drive.google.com/file/d/1KQ3D8u_iNdRHrwFAfq-0KV2Y4_vVKxq1/view?usp=sharing"
            className="mt-10"
          >
            <Button variant="default" className="bg-main" onClick={() => {}}>
              Download My CV
            </Button>
          </a>
        </div>
        <Card className="hidden rounded-full h-44 w-44 lg:h-96 lg:w-96 lg:block">
          <img
            src="assets/img/profile.png"
            className="rounded-full"
            alt="My Picture"
          />
        </Card>
      </div>

      <div
        id="what-i-do"
        className="w-full bg-mainAccent flex flex-col gap-20 items-center py-20"
      >
        <div className="text-5xl font-bold mb-5">What I Do</div>
        <div className="grid grid-cols-1 md:grid-cols-2 w-3/4 lg:w-3/4 gap-10">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Mobile Development</CardTitle>
              <CardDescription className="text-lg">
                I specialize in building intuitive and feature-rich mobile
                applications that enhance user engagement. From concept to
                launch, I help you create apps that are tailored to your
                business needs and provide a seamless experience across devices.
                I can work with you to define the key features of your app,
                ensuring it's ready to drive growth and connect with your users
                on a deeper level.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Web Development</CardTitle>
              <CardDescription className="text-lg">
                I specialize in crafting responsive and scalable websites that
                meet modern standards. From initial design to deployment, I
                ensure that your web presence is optimized for both performance
                and user experience. I can work with you to transform your
                vision into a fully functioning website, streamlining the
                development process and delivering a platform that grows with
                your business.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>

      <div id="my-projects" className=" bg-white">
        <div className="bg-white w-full flex flex-col items-center pt-20 pb-20">
          <h2 className="text-5xl font-bold mb-5">My Projects</h2>
          <div className="w-full px-5 sm:px-0 sm:w-3/4 mt-10">
            <TechFilter techs={techs} selectedTech={handleSelectedTechs} />
          </div>
          <div className="w-full px-5 sm:px-0 sm:w-3/4 mt-5">
            {filteredProjects.map((project, index) => (
              <div className="w-full max-w-screen" key={index}>
                <ProjectItem
                  className="border"
                  imgSrc={project.image_url} // Use an appropriate image URL here
                  title={project.title}
                  techs={project.portfolio_techs}
                  badges={["View Project", "View on GitHub", "Live Demo"]} // You can customize buttons
                  description={project.description}
                  reverse={index % 2 !== 0}
                  githubUrl={project.github_url}
                  demoUrl={project.demo_url}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div
        id="contact"
        className="flex flex-col justify-center px-0  items-center w-full gap-0 sm:gap-20 py-20"
      >
        <div className="w-full px-5 sm:w-3/4 lg:w-1/2 sm:px-0">
          <div className="text-5xl font-bold">Tell me about your project</div>
          <div className="mt-10 text-xl text-justify">
            Every project begins with setting goals. If you have a vision, I can
            bring that project to life. After your inquiry, I will respond
            within 2-3 business days with a preliminary proposal for the project
            or with further questions for more details. After that, we can
            schedule an introductory call to discuss your project and see if
            it’s a good fit.
          </div>
        </div>

        <div className="mt-10 w-full px-5 sm:px-0 sm:mt-0 sm:w-3/4 lg:w-1/2">
          <form
            className="flex flex-col gap-5"
            onSubmit={(e) => e.preventDefault()}
          >
            <Input placeholder="Name" />
            <Input placeholder="Email" />
            <Textarea placeholder="Your message" />
            <Button className="bg-main" type="submit">
              Send Message
            </Button>
          </form>
        </div>
      </div>
    </DefaultLayout>
  );
}
