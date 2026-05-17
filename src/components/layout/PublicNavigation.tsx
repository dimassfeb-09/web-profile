import { HomeService } from "@/src/services/home.service";
import { SectionOrderService } from "@/src/services/section_order.service";
import TopNavBar from "./TopNavBar";

export default async function PublicNavigation() {
  // Fetch data parallelly - this Suspense boundary is isolated
  const [homeData, sectionResult] = await Promise.all([
    HomeService.getHomeData(),
    SectionOrderService.getAllSections(),
  ]);

  const cvUrl = homeData.data?.cv_url || "#";
  const navLinks = (sectionResult.data || [])
    .filter((s) => s.is_visible)
    .sort((a, b) => a.order_index - b.order_index)
    .map((s) => ({
      name: s.section_label,
      href: s.section_key === "blog" ? "/blog" : `#${s.section_key}`,
    }));

  return (
    <>
      <TopNavBar cvUrl={cvUrl} navLinks={navLinks} />
    </>
  );
}
