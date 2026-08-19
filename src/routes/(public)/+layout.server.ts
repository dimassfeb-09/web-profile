import { HomeService } from '../../services/home.service';
import { SectionOrderService } from '../../services/section_order.service';
import { ContactService } from '../../services/contact.service';

export async function load() {
	const [homeResult, sectionResult, contactResult] = await Promise.all([
		HomeService.getHomeData(),
		SectionOrderService.getAllSections(),
		ContactService.getContactData(),
	]);

	const cvUrl = homeResult.data?.cv_url || '#';
	const navLinks = (sectionResult.data || [])
		.filter((s) => s.is_visible)
		.sort((a, b) => a.order_index - b.order_index)
		.map((s) => ({
			name: s.section_label,
			href: s.section_key === 'blog' ? '/blog' : `#${s.section_key}`,
		}));

	return {
		cvUrl,
		navLinks,
		footerData: contactResult.data || undefined,
	};
}