import React from "react";
import { formattedDate } from "../../utils/formattedDate";

interface AchievementItemProps {
  className?: string;
  imgSrc: string;
  title: string;
  reverse: boolean;
  description: string;
  createdAt: string;
}

const AchievementItem: React.FC<AchievementItemProps> = ({
  className,
  imgSrc,
  title,
  reverse,
  description,
  createdAt,
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
        <h1 className="text-3xl md:text-4xl font-bold">{title}</h1>
        <div dangerouslySetInnerHTML={{ __html: description }} />
        <div>{formattedDate(createdAt)}</div>
      </div>
    </div>
  );
};

export default AchievementItem;
