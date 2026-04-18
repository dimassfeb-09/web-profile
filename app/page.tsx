import HeroSection from "@/src/components/sections/HeroSection";
import AboutSection from "@/src/components/sections/AboutSection";
import SkillsSection from "@/src/components/sections/SkillsSection";
import ExperienceSection from "@/src/components/sections/ExperienceSection";
import ProjectsSection from "@/src/components/sections/ProjectsSection";
import AchievementSection from "@/src/components/sections/AchievementSection";
import CertificatesSection from "@/src/components/sections/CertificatesSection";
import ContactSection from "@/src/components/sections/ContactSection";

export default function Home() {
  return (
    <main className="pt-20 xs:pt-24 lg:pt-32 px-6 xs:px-8 md:px-12 lg:px-16 2xl:px-24 max-w-[1920px] mx-auto flex flex-col gap-12 xs:gap-20 lg:gap-24 xl:gap-32 pb-20 xs:pb-32">
      <HeroSection />
      <AboutSection />
      <SkillsSection />
      <ExperienceSection />
      <ProjectsSection />
      <AchievementSection />
      <CertificatesSection />
      <ContactSection />
    </main>
  );
}