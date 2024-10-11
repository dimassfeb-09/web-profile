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
import { cn } from "../lib/utils";
import { Button } from "../components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import {
  CommandList,
  CommandInput,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "cmdk";
import { ChevronsUpDown, Command, Check } from "lucide-react";

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
  const [techs, setTechs] = useState<Tech[]>([]);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

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
        id: pt.techs.id,
        name: pt.techs.name,
      })),
      created_at: portfolio.created_at,
    })) as Project[];

    const tech: Tech[] = projects.flatMap((project) => {
      return project.portfolio_techs.flatMap((techContainer) => techContainer);
    });

    setTechs(tech);

    return projects;
  }

  useEffect(() => {
    const loadProjects = async () => {
      const projects = await fetchPortfolios();
      setProjectData(projects); // Set fetched projects to state
    };

    loadProjects();
  }, []);

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
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="noShadow"
                role="combobox"
                aria-expanded={open}
                className="w-[200px] justify-between"
              >
                {value
                  ? techs.find((tech) => tech.name === value)?.name
                  : "Select framework..."}
                <ChevronsUpDown
                  color="black"
                  className="ml-2 h-4 w-4 shrink-0"
                />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] !border-0 p-0 font-bold">
              <Command>
                <CommandList>
                  <CommandInput placeholder="Search framework..." />
                  <CommandEmpty>No framework found.</CommandEmpty>
                  <CommandGroup>
                    {techs.map((tech) => (
                      <CommandItem
                        key={tech.name}
                        value={tech.name}
                        onSelect={(currentValue) => {
                          setValue(currentValue === value ? "" : currentValue);
                          setOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            value === tech.name ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {tech.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <div className="w-full mt-10">
            {projectData.map((project, index) => (
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

        <div className="mt-10 w-full px-5 sm:px-0 sm:mt-0 sm:w-3/4 lg:w-1/2 grid grid-cols-2 gap-5">
          <Input
            placeholder="Input your name"
            className={cn(
              "flex text-text cursor-pointer items-center rounded-base border-2 border-border dark:border-darkBorder bg-white px-4 py-2 text-sm font-base shadow-light dark:shadow-dark transition-all hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none dark:hover:shadow-none"
            )}
          />
          <Input
            placeholder="Input your email"
            className={cn(
              "flex text-text cursor-pointer items-center rounded-base border-2 border-border dark:border-darkBorder bg-white px-4 py-2 text-sm font-base shadow-light dark:shadow-dark transition-all hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none dark:hover:shadow-none"
            )}
          />
          <Input
            placeholder="Project Type"
            className={cn(
              "flex text-text cursor-pointer items-center rounded-base border-2 border-border dark:border-darkBorder bg-white px-4 py-2 text-sm font-base shadow-light dark:shadow-dark transition-all hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none dark:hover:shadow-none"
            )}
          />
          <Input
            placeholder="Budget"
            className={cn(
              "flex text-text cursor-pointer items-center rounded-base border-2 border-border dark:border-darkBorder bg-white px-4 py-2 text-sm font-base shadow-light dark:shadow-dark transition-all hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none dark:hover:shadow-none"
            )}
          />
          <Textarea
            className={cn(
              "col-span-2 flex text-text cursor-pointer items-center rounded-base border-2 border-border dark:border-darkBorder bg-white px-4 py-2 text-sm font-base shadow-light dark:shadow-dark transition-all hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none dark:hover:shadow-none"
            )}
            placeholder="Additional details..."
          />

          <Button className="w-fit px-20" onClick={() => {}}>
            Send
          </Button>
        </div>
      </div>
    </DefaultLayout>
  );
}
