import { DashboardService } from '../../../services/dashboard.service';

export async function load() {
	return {
		stats: await DashboardService.getStats()
	};
}