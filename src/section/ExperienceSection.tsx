import { Experience } from "../types/experience";
import ExperienceItem from "../components/experiences/ExperienceItem";

export default function ExperienceSection({
  experiences,
}: {
  experiences: Experience[];
}) {
  return (
    <div id="experience" className="bg-white">
      <div className="bg-white w-full flex flex-col items-center pt-10 pb-20">
        <h2 className="text-5xl font-bold mb-5 underline decoration-mainAccent">
          Experience
        </h2>

        <div className="relative w-full px-5 sm:px-0 sm:w-3/4 mt-5">
          {/* Stepper Line */}
          <div className="absolute left-5 top-0 w-1 bg-gray-300 h-full hidden sm:block"></div>

          {/* Stepper Items */}
          {experiences.map((experience: Experience, index: number) => (
            <div key={index} className="flex items-start mb-10 relative">
              {/* Stepper Circle */}
              <div className="w-10 h-10 flex items-center justify-center bg-mainAccent text-white rounded-full text-lg font-bold z-10">
                {index + 1}
              </div>

              {/* Stepper Content */}
              <div className="ml-6 sm:ml-12 w-full">
                <ExperienceItem experience={experience} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
