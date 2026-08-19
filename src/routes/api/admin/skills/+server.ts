import { json } from '@sveltejs/kit';
import { z } from 'zod';
import { SkillService } from '../../../../services/skill.service';

const SkillSchema = z.object({
	icon: z.string().min(1),
	title: z.string().min(1).max(100),
	skills: z.array(z.string().min(1)),
	color_class: z.string().min(1),
	delay_class: z.string().min(1),
});

export async function GET() {
	try {
		const result = await SkillService.getAllSkills(true);
		return json(result, { status: result.status });
	} catch (error) {
		console.error('[Admin Skill GET] Error:', error);
		return json({ status: 500, message: 'Internal Server Error' }, { status: 500 });
	}
}

export async function POST({ request }) {
	try {
		const body = await request.json();
		const data = SkillSchema.parse(body);
		const result = await SkillService.createSkill(data);
		return json(result, { status: result.status });
	} catch (error) {
		if (error instanceof z.ZodError) {
			return json({ status: 400, message: error.issues[0].message }, { status: 400 });
		}
		console.error('[Admin Skill POST] Error:', error);
		return json({ status: 500, message: 'Internal Server Error' }, { status: 500 });
	}
}
