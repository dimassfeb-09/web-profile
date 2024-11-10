import React from "react";
import Badge from "../ui/badge";
import { Tech } from "../../pages";
import { Button } from "../ui/button";

interface ProjectItemProps {
  className?: string;
  imgSrc: string;
  title: string;
  techs: Tech[];
  description: string;
  badges: string[]; // Optional badges/buttons
  githubUrl: string; // URL for GitHub
  demoUrl: string; // URL for Demo
  reverse?: boolean; // Add a reverse prop to alternate layout
}

const ProjectItem: React.FC<ProjectItemProps> = ({
  className,
  imgSrc,
  title,
  techs,
  reverse = false,
  description,
  githubUrl,
  demoUrl,
}) => {
  return (
    <div
      className={`flex flex-col md:flex-row ${className} ${
        reverse ? "md:flex-row-reverse" : ""
      } my-5`}
    >
      <img
        className="w-full md:w-1/2 h-auto object-cover"
        src={imgSrc}
        alt={title}
        draggable={false}
      />
      <div className="w-full md:w-1/2 flex flex-col justify-center text-justify p-5 gap-5 bg-white">
        <div id="technology" className="flex flex-wrap gap-2">
          {techs.map((tech) => (
            <Badge
              key={tech.id}
              className="w-fit rounded-full"
              text={tech.name}
            />
          ))}
        </div>

        <h1 className="text-3xl md:text-4xl font-bold">{title}</h1>
        <div dangerouslySetInnerHTML={{ __html: description }} />
        <div className="flex gap-5 flex-wrap">
          {githubUrl && (
            <Button
              onClick={() => window.open(githubUrl, "_blank")}
              className="bg-blue-500 text-white"
            >
              View GitHub
            </Button>
          )}
          {demoUrl && (
            <Button
              onClick={() => window.open(demoUrl, "_blank")}
              className="bg-green-500 text-white"
            >
              View Demo
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectItem;
