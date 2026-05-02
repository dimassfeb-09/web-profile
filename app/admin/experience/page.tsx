import { ExperienceService } from "@/src/services/experience.service";
import ExperienceClient from "./ExperienceClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Experience Management | Admin",
};

export default async function ExperienceManagementPage() {
  // Fetch data directly from the service (Server-side)
  const response = await ExperienceService.getAllExperiences(true);

  // Map data to ensure serializable types and fix TypeScript 'id: undefined' warnings
  const mappedData = response.data.map((exp) => ({
    id: exp.id || 0,
    role: exp.role,
    company: exp.company,
    start_date:
      exp.start_date instanceof Date
        ? exp.start_date.toISOString()
        : exp.start_date,
    end_date:
      exp.end_date instanceof Date ? exp.end_date.toISOString() : exp.end_date,
    description: exp.description,
    tags: exp.tags || [],
  }));

  return <ExperienceClient initialData={mappedData} />;
}
