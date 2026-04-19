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
import { BlogService } from "@/src/services/blog.service";

// Static Import for Hero (P1: Fastest LCP)
import HeroSection from "@/src/components/sections/HeroSection";

import { SectionOrderService } from "@/src/services/section_order.service";

// Dynamic Imports for Sections
const AboutSection = dynamic(() => import("@/src/components/sections/AboutSection"));
const SkillsSection = dynamic(() => import("@/src/components/sections/SkillsSection"));
const ExperienceSection = dynamic(() => import("@/src/components/sections/ExperienceSection"));
const ProjectsSection = dynamic(() => import("@/src/components/sections/ProjectsSection"));
const AchievementSection = dynamic(() => import("@/src/components/sections/AchievementSection"));
const CertificatesSection = dynamic(() => import("@/src/components/sections/CertificatesSection"));
const ContactSection = dynamic(() => import("@/src/components/sections/ContactSection"));
const BlogSection = dynamic(() => import("@/src/components/sections/BlogSection"));

// Mapping components to keys
const SECTION_COMPONENTS: Record<string, React.ComponentType<any>> = {
  about: AboutSectionWrapper,
  skills: SkillsSectionWrapper,
  experience: ExperienceSectionWrapper,
  projects: ProjectsSectionWrapper,
  achievements: AchievementSectionWrapper,
  certificates: CertificatesSectionWrapper,
  blog: BlogSectionWrapper,
  contact: ContactSectionWrapper,
};

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

async function ProjectsSectionWrapper({ sort }: { sort: 'newest' | 'oldest' }) {
  const projectsData = await ProjectService.getAllProjects(false, sort);
  return <ProjectsSection initialProjects={projectsData.data || []} />;
}

async function AchievementSectionWrapper({ sort }: { sort: 'newest' | 'oldest' }) {
  const achievementsData = await AchievementService.getAllAchievements(false, sort);
  return <AchievementSection achievements={achievementsData.data || []} />;
}

async function CertificatesSectionWrapper({ sort }: { sort: 'newest' | 'oldest' }) {
  const certificatesData = await CertificateService.getAllCertificates(false, sort);
  return <CertificatesSection certificates={certificatesData.data || []} />;
}

async function ContactSectionWrapper() {
  const contactData = await ContactService.getContactData();
  return contactData.data ? <ContactSection data={contactData.data} /> : null;
}

async function BlogSectionWrapper() {
  const { blogs } = await BlogService.getAllBlogs({ onlyPublished: true });
  return <BlogSection blogs={blogs || []} />;
}

export default async function Home(props: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const sort = (searchParams.sort === 'oldest' ? 'oldest' : 'newest') as 'newest' | 'oldest';

  // Fetch all parallel requirements
  const [homeData, sectionOrderResult] = await Promise.all([
    HomeService.getHomeData(),
    SectionOrderService.getAllSections()
  ]);

  if (!homeData.data) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  // Filter and sort visible sections
  const visibleSections = (sectionOrderResult.data || [])
    .filter(s => s.is_visible)
    .sort((a, b) => a.order_index - b.order_index);

  return (
    <main className="pt-20 xs:pt-24 lg:pt-32 px-6 xs:px-8 md:px-12 lg:px-16 2xl:px-24 max-w-[1920px] mx-auto flex flex-col gap-12 xs:gap-20 lg:gap-24 xl:gap-32 pb-20 xs:pb-32">
      <HeroSection data={homeData.data} />
      
      {visibleSections.map((section) => {
        const Component = SECTION_COMPONENTS[section.section_key];
        if (!Component) return null;

        return (
          <div key={section.section_key} id={section.section_key}>
            <Suspense fallback={<SectionSkeleton />}>
              <Component sort={sort} />
            </Suspense>
          </div>
        );
      })}
    </main>
  );
}