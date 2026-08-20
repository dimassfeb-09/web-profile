import { json } from '@sveltejs/kit';
import { z } from 'zod';
import { ProjectService } from '../../../../../services/project.service';

const ProjectSchema = z.object({
	title: z.string().min(1).max(255),
	description: z.string().min(1),
	image_url: z.string().url(),
	features: z.array(z.string()),
	link_url: z.string().url(),
	link_text: z.string().min(1),
	slug: z.string().max(255).optional(),
	long_description: z.string().optional(),
	tech_stack: z.array(z.string()).optional(),
	screenshots: z.array(z.string()).optional(),
	status: z.string().optional(),
	date: z.string().nullable().optional(),
	external_links: z.record(z.string(), z.string()).nullable().optional(),
});

export async function PUT({ params, request }) {
	try {
		const body = await request.json();
		const data = ProjectSchema.partial().parse(body);
		const result = await ProjectService.updateProject(params.id, data);
		return json(result, { status: result.status });
	} catch (error) {
		if (error instanceof z.ZodError) {
			return json({ status: 400, message: error.issues[0].message }, { status: 400 });
		}
		console.error('[Admin Project PUT] Error:', error);
		return json({ status: 500, message: 'Internal Server Error' }, { status: 500 });
	}
}

export async function DELETE({ params }) {
	try {
		const result = await ProjectService.deleteProject(params.id);
		return json(result, { status: result.status });
	} catch (error) {
		console.error('[Admin Project DELETE] Error:', error);
		return json({ status: 500, message: 'Internal Server Error' }, { status: 500 });
	}
}
