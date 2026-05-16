import { DashboardService } from "@/src/services/dashboard.service";
import DashboardClient from "./DashboardClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Dashboard | Admin",
};

export default async function DashboardPage() {
  const stats = await DashboardService.getStats();

  return <DashboardClient stats={stats} />;
}
