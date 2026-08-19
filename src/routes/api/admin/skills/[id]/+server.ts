import { json } from '@sveltejs/kit';
import { z } from 'zod';
import { SkillService } from '../../../../../services/skill.service';

const SkillSchema = z.object({
	icon: z.string().min(1),
	title: z.string().min(1).max(100),
	skills: z.array(z.string().min(1)),
	color_class: z.string().min(1),
	delay_class: z.string().min(1),
});

export async function PUT({ params, request }) {
	try {
		const body = await request.json();
		const data = SkillSchema.partial().parse(body);
		const result = await SkillService.updateSkill(parseInt(params.id), data);
		return json(result, { status: result.status });
	} catch (error) {
		if (error instanceof z.ZodError) {
			return json({ status: 400, message: error.issues[0].message }, { status: 400 });
		}
		console.error('[Admin Skill PUT] Error:', error);
		return json({ status: 500, message: 'Internal Server Error' }, { status: 500 });
	}
}

export async function DELETE({ params }) {
	try {
		const result = await SkillService.deleteSkill(parseInt(params.id));
		return json(result, { status: result.status });
	} catch (error) {
		console.error('[Admin Skill DELETE] Error:', error);
		return json({ status: 500, message: 'Internal Server Error' }, { status: 500 });
	}
}
