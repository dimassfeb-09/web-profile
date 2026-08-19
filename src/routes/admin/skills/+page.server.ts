import { SkillService } from '../../../services/skill.service';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const response = await SkillService.getAllSkills(true);

	const mappedData = response.data.map((skill) => ({
		id: skill.id || 0,
		icon: skill.icon,
		title: skill.title,
		skills: skill.skills,
		color_class: skill.color_class,
		delay_class: skill.delay_class
	}));

	return { skills: mappedData };
};