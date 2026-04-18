import dynamic from "next/dynamic";
import { HomeService } from "@/src/services/home.service";
import { AboutService } from "@/src/services/about.service";
import { SkillService } from "@/src/services/skill.service";
import { ExperienceService } from "@/src/services/experience.service";
import { ProjectService } from "@/src/services/project.service";
import { AchievementService } from "@/src/services/achievement.service";
import { CertificateService } from "@/src/services/certificate.service";
import { ContactService } from "@/src/services/contact.service";

// Static Import for Hero (P1: Fastest LCP)
import HeroSection from "@/src/components/sections/HeroSection";

// Dynamic Imports for Sections Below-the-fold (P2: Code Splitting)
const AboutSection = dynamic(() => import("@/src/components/sections/AboutSection"));
const SkillsSection = dynamic(() => import("@/src/components/sections/SkillsSection"));
const ExperienceSection = dynamic(() => import("@/src/components/sections/ExperienceSection"));
const ProjectsSection = dynamic(() => import("@/src/components/sections/ProjectsSection"));
const AchievementSection = dynamic(() => import("@/src/components/sections/AchievementSection"));
const CertificatesSection = dynamic(() => import("@/src/components/sections/CertificatesSection"));
const ContactSection = dynamic(() => import("@/src/components/sections/ContactSection"));

export default async function Home() {
  // Parallel Data Fetching on Server (P3: TTFB Optimization)
  const [
    homeData,
    aboutData,
    skillsData,
    experienceData,
    projectsData,
    achievementsData,
    certificatesData,
    contactData,
  ] = await Promise.all([
    HomeService.getHomeData(),
    AboutService.getAboutData(),
    SkillService.getAllSkills(),
    ExperienceService.getAllExperiences(),
    ProjectService.getAllProjects(),
    AchievementService.getAllAchievements(),
    CertificateService.getAllCertificates(),
    ContactService.getContactData(),
  ]);

  if (!homeData.data) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <main className="pt-20 xs:pt-24 lg:pt-32 px-6 xs:px-8 md:px-12 lg:px-16 2xl:px-24 max-w-[1920px] mx-auto flex flex-col gap-12 xs:gap-20 lg:gap-24 xl:gap-32 pb-20 xs:pb-32">
      <HeroSection data={homeData.data} />
      
      {aboutData.data && <AboutSection data={aboutData.data} />}
      
      <SkillsSection categories={skillsData.data || []} />
      
      <ExperienceSection experiences={experienceData.data || []} />
      
      <ProjectsSection initialProjects={projectsData.data || []} />
      
      <AchievementSection achievements={achievementsData.data || []} />
      
      <CertificatesSection certificates={certificatesData.data || []} />
      
      {contactData.data && <ContactSection data={contactData.data} />}
    </main>
  );
}