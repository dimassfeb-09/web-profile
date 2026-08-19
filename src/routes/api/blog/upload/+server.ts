import { json } from '@sveltejs/kit';
import { requireAuth } from '$lib/auth';
import { StorageService } from '../../../../services/storage.service';
import { BlogImageRepository } from '../../../../repositories/blog_image.repository';
import { BlogRepository } from '../../../../repositories/blog.repository';
import { v4 as uuidv4 } from 'uuid';

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST({ request, cookies }) {
	try {
		await requireAuth(cookies);

		const formData = await request.formData();
		const file = formData.get('file');
		const blogId = formData.get('blogId') as string;

		if (!file || !(file instanceof File) || !blogId) {
			return json({ message: 'Missing file or blogId' }, { status: 400 });
		}

		if (!ALLOWED_MIME_TYPES.includes(file.type)) {
			return json({ message: 'Invalid file type' }, { status: 400 });
		}

		if (file.size > MAX_FILE_SIZE) {
			return json({ message: 'File too large (max 5MB)' }, { status: 400 });
		}

		const MIME_TO_EXT: Record<string, string> = {
			'image/jpeg': 'jpg',
			'image/png': 'png',
			'image/webp': 'webp',
			'image/gif': 'gif'
		};

		const buffer = Buffer.from(await file.arrayBuffer());
		const extension = MIME_TO_EXT[file.type] || 'webp';
		const imageId = uuidv4();
		const filePath = `${blogId}/${imageId}.${extension}`;
		const contentType = file.type || 'image/webp';

		const publicUrl = await StorageService.uploadFile(filePath, buffer, contentType);

		const existingBlog = await BlogRepository.findById(blogId);
		if (!existingBlog) {
			await BlogRepository.create({
				id: blogId,
				title: 'Draft Post',
				slug: `draft-${blogId}`,
				content: {},
				is_published: false
			});
		}

		await BlogImageRepository.create({
			blog_id: blogId,
			file_path: filePath,
			storage_url: publicUrl,
			status: 'unused'
		});

		return json({ url: publicUrl, id: imageId });
	} catch (error) {
		console.error('Blog Upload Error:', error);
		return json(
			{ message: error instanceof Error ? error.message : 'Internal Server Error' },
			{ status: 500 }
		);
	}
}