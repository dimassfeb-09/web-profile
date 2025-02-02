import { DefaultLayout } from "../layout/DefaultLayout";
import AchievementsSection from "../section/AchievementSection";
import HomeSection from "../section/HomeSection";
import WhatIDoSection from "../section/WhatIDoSection";
import MyProjectSection from "../section/MyProjectSection";
import ContactSection from "../section/ContactSection";
import ExperienceSection from "../section/ExperienceSection";

export default function IndexPage() {
  return (
    <DefaultLayout>
      <HomeSection />
      <WhatIDoSection />
      <ExperienceSection />
      <MyProjectSection />
      <AchievementsSection />
      <ContactSection />
    </DefaultLayout>
  );
}
