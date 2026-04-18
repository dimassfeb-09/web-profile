import { Suspense } from "react";
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

// Dynamic Imports for Sections Below-the-fold
const AboutSection = dynamic(() => import("@/src/components/sections/AboutSection"));
const SkillsSection = dynamic(() => import("@/src/components/sections/SkillsSection"));
const ExperienceSection = dynamic(() => import("@/src/components/sections/ExperienceSection"));
const ProjectsSection = dynamic(() => import("@/src/components/sections/ProjectsSection"));
const AchievementSection = dynamic(() => import("@/src/components/sections/AchievementSection"));
const CertificatesSection = dynamic(() => import("@/src/components/sections/CertificatesSection"));
const ContactSection = dynamic(() => import("@/src/components/sections/ContactSection"));

// Skeleton Fallback
const SectionSkeleton = () => (
  <div className="w-full h-64 xs:h-80 lg:h-96 bg-surface-container-low/50 animate-pulse rounded-[2rem] border border-outline-variant/10" />
);

// Async Wrappers for Streaming
async function AboutSectionWrapper() {
  const aboutData = await AboutService.getAboutData();
  return aboutData.data ? <AboutSection data={aboutData.data} /> : null;
}

async function SkillsSectionWrapper() {
  const skillsData = await SkillService.getAllSkills();
  return <SkillsSection categories={skillsData.data || []} />;
}

async function ExperienceSectionWrapper() {
  const experienceData = await ExperienceService.getAllExperiences();
  return <ExperienceSection experiences={experienceData.data || []} />;
}

async function ProjectsSectionWrapper() {
  const projectsData = await ProjectService.getAllProjects();
  return <ProjectsSection initialProjects={projectsData.data || []} />;
}

async function AchievementSectionWrapper() {
  const achievementsData = await AchievementService.getAllAchievements();
  return <AchievementSection achievements={achievementsData.data || []} />;
}

async function CertificatesSectionWrapper() {
  const certificatesData = await CertificateService.getAllCertificates();
  return <CertificatesSection certificates={certificatesData.data || []} />;
}

async function ContactSectionWrapper() {
  const contactData = await ContactService.getContactData();
  return contactData.data ? <ContactSection data={contactData.data} /> : null;
}

export default async function Home() {
  // Fetch only Hero data first (P1: Fastest TTFB for LCP)
  const homeData = await HomeService.getHomeData();

  if (!homeData.data) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <main className="pt-20 xs:pt-24 lg:pt-32 px-6 xs:px-8 md:px-12 lg:px-16 2xl:px-24 max-w-[1920px] mx-auto flex flex-col gap-12 xs:gap-20 lg:gap-24 xl:gap-32 pb-20 xs:pb-32">
      <HeroSection data={homeData.data} />
      
      <div id="about">
        <Suspense fallback={<SectionSkeleton />}>
          <AboutSectionWrapper />
        </Suspense>
      </div>
      
      <div id="skills">
        <Suspense fallback={<SectionSkeleton />}>
          <SkillsSectionWrapper />
        </Suspense>
      </div>
      
      <div id="experience">
        <Suspense fallback={<SectionSkeleton />}>
          <ExperienceSectionWrapper />
        </Suspense>
      </div>
      
      <div id="projects">
        <Suspense fallback={<SectionSkeleton />}>
          <ProjectsSectionWrapper />
        </Suspense>
      </div>
      
      <div id="achievements">
        <Suspense fallback={<SectionSkeleton />}>
          <AchievementSectionWrapper />
        </Suspense>
      </div>
      
      <div id="certificates">
        <Suspense fallback={<SectionSkeleton />}>
          <CertificatesSectionWrapper />
        </Suspense>
      </div>
      
      <div id="contact">
        <Suspense fallback={<SectionSkeleton />}>
          <ContactSectionWrapper />
        </Suspense>
      </div>
    </main>
  );
}