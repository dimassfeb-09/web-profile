import { SectionOrderService } from '../../../services/section_order.service';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const result = await SectionOrderService.getAllSections(true);

	return {
		sections: result.data ?? []
	};
};