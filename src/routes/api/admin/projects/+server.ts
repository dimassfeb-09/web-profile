import { json } from '@sveltejs/kit';
import { z } from 'zod';
import { ProjectService } from '../../../../services/project.service';

const ProjectSchema = z.object({
	title: z.string().min(1).max(255),
	description: z.string().min(1),
	image_url: z.string().url(),
	features: z.array(z.string()),
	link_url: z.string().url(),
	link_text: z.string().min(1),
});

export async function GET({ url }) {
	try {
		const sort = url.searchParams.get('sort') === 'oldest' ? 'oldest' : 'newest';
		const result = await ProjectService.getAllProjects(true, sort);
		return json(result, { status: result.status });
	} catch (error) {
		console.error('[Admin Project GET] Error:', error);
		return json({ status: 500, message: 'Internal Server Error' }, { status: 500 });
	}
}

export async function POST({ request }) {
	try {
		const body = await request.json();
		const data = ProjectSchema.parse(body);
		const result = await ProjectService.createProject(data);
		return json(result, { status: result.status });
	} catch (error) {
		if (error instanceof z.ZodError) {
			return json({ status: 400, message: error.issues[0].message }, { status: 400 });
		}
		console.error('[Admin Project POST] Error:', error);
		return json({ status: 500, message: 'Internal Server Error' }, { status: 500 });
	}
}
