import { Experience } from "../types/experience";
import ExperienceItem from "../components/experiences/ExperienceItem";
import { useState } from "react";
import supabase from "../utils/supabase";

export default function ExperienceSection() {
  const [experiences, setExperiences] = useState<Experience[]>([]);

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

  const loadExperice = async () => {
    await fetchExperience();
  };

  loadExperice();

  return (
    <div id="experience" className="bg-white">
      <div className="bg-white w-full flex flex-col items-center pt-10 pb-20">
        <h2 className="text-5xl font-bold mb-5 underline decoration-mainAccent">
          Experience
        </h2>

        <div className="relative w-full px-5 sm:px-0 sm:w-3/4 mt-5">
          <div className="absolute left-5 top-0 w-1 bg-gray-300 h-full hidden sm:block"></div>

          {experiences.map((experience: Experience, index: number) => (
            <div key={index} className="flex items-start mb-10 relative">
              <div className="w-10 h-10 flex items-center justify-center bg-mainAccent text-white rounded-full text-lg font-bold z-10">
                {index + 1}
              </div>

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
