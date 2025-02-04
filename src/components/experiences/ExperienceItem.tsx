import { Experience } from "../../types/experience";
import { formattedDate } from "../../utils/formattedDate";
import "./ExperienceItem.tsx.css";

interface ExperienceItemProps {
  experience: Experience;
}

const ExperienceItem = ({ experience }: ExperienceItemProps) => {
  return (
    <div className="w-full flex flex-col justify-center text-justify gap-5 bg-white">
      <h1 className="text-3xl md:text-4xl font-bold text-start">
        {experience.company_name}
      </h1>

      <div>
        {formattedDate(experience.start_date)} -{" "}
        {experience.end_date ? formattedDate(experience.end_date) : "Saat Ini"}
      </div>

      <p
        className="text-5xl"
        dangerouslySetInnerHTML={{ __html: experience.description }}
      ></p>
    </div>
  );
};

export default ExperienceItem;
