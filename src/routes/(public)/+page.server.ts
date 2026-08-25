import { HomeService } from '../../services/home.service';
import { SectionOrderService } from '../../services/section_order.service';
import { AboutService } from '../../services/about.service';
import { ContactService } from '../../services/contact.service';
import { SkillService } from '../../services/skill.service';

export const config = {
	isr: {
		expiration: 3600
	}
};

export async function load() {
	const [homeData, sectionOrderResult, aboutData, contactResult, skillsResult] = await Promise.all([
		HomeService.getHomeData(),
		SectionOrderService.getAllSections(),
		AboutService.getAboutData(),
		ContactService.getContactData(),
		SkillService.getAllSkills(),
	]);

	if (!homeData.data) {
		throw new Error('Home data not found');
	}

	const visibleSections = (sectionOrderResult.data || [])
		.filter((s) => s.is_visible)
		.sort((a, b) => a.order_index - b.order_index);

	return {
		homeData: homeData.data,
		visibleSections,
		aboutData: aboutData.data,
		contactData: contactResult.data,
		skillsData: skillsResult.data || []
	};
}