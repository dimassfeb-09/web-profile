import React from "react";
import Badge from "../ui/badge";
import { Button } from "../ui/button";
import { Tech } from "../../types/tech";
import ShopIcon from "@mui/icons-material/Shop";
import GitHub from "@mui/icons-material/GitHub";
import Language from "@mui/icons-material/Language";

interface ProjectItemProps {
  imgSrc: string;
  title: string;
  techs: Tech[];
  description: string;
  badges: string[];
  githubUrl: string;
  playstoreUrl?: string;
  demoUrl: string;
  reverse?: boolean;
}

const ProjectItem: React.FC<ProjectItemProps> = ({
  imgSrc,
  title,
  techs,
  reverse = false,
  description,
  githubUrl,
  playstoreUrl,
  demoUrl,
}) => {
  return (
    <div
      className={`flex flex-col md:flex-row border min-h-[500px] ${
        reverse ? "md:flex-row-reverse" : ""
      } my-5`}
    >
      <div className="flex flex-col w-full md:w-1/2 gap-5 ">
        <img src={imgSrc} alt={title} draggable={false} />
        <div id="technology" className="flex flex-wrap gap-2 px-5">
          {techs.map((tech) => (
            <Badge
              key={tech.id}
              className="w-fit rounded-full"
              text={tech.name}
            />
          ))}
        </div>
      </div>

      {/* Content Section */}
      <div className="w-full md:w-1/2 flex flex-col justify-between text-justify p-5 gap-5 bg-white h-full">
        {/* Title & Description */}
        <h1 className="text-3xl md:text-4xl font-bold">{title}</h1>
        <div
          className="flex-1 text-xs sm:text-sm"
          dangerouslySetInnerHTML={{ __html: description }}
        />

        {/* Button Section - Aligned at Bottom */}
        <div className="flex gap-5 flex-wrap mt-auto">
          {playstoreUrl && (
            <Button
              onClick={() => window.open(playstoreUrl, "_blank")}
              className="bg-red-500 flex gap-2 text-white"
            >
              <ShopIcon />
              <div>Playstore</div>
            </Button>
          )}

          {githubUrl && (
            <Button
              onClick={() => window.open(githubUrl, "_blank")}
              className="bg-blue-500 flex gap-2 text-white"
            >
              <GitHub />
              <div>View GitHub</div>
            </Button>
          )}

          {demoUrl && (
            <Button
              onClick={() => window.open(demoUrl, "_blank")}
              className="bg-green-500 flex gap-2 text-white"
            >
              <Language />
              <div>View Demo</div>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectItem;
