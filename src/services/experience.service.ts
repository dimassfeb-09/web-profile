import { ExperienceRepository } from '../repositories/experience.repository';
import type { ExperienceData } from '../repositories/experience.repository';
import { cached, revalidateTag } from '$lib/cache';

export class ExperienceService {
	private static getCachedExperiences = (limit?: number, offset?: number) =>
		cached(`experience_v2_${limit}_${offset}`, () => ExperienceRepository.findAll(limit, offset), {
			ttl: 3600,
			tags: ['experience', 'experience_v2'],
		});

	static async getAllExperiences(bypassCache = false, limit?: number, offset?: number) {
		try {
			const experiences = bypassCache
				? await ExperienceRepository.findAll(limit, offset)
				: await this.getCachedExperiences(limit, offset);

			return {
				status: 200,
				message: 'Experiences retrieved successfully',
				data: experiences,
			};
		} catch (error) {
			console.error('Error in ExperienceService.getAllExperiences:', error);
			throw new Error('Failed to fetch experiences');
		}
	}

	static async createExperience(data: ExperienceData) {
		if (data.end_date && new Date(data.end_date) < new Date(data.start_date)) {
			throw new Error('End date cannot be earlier than start date');
		}

		const experience = await ExperienceRepository.create(data);
		revalidateTag('experience');
		return {
			status: 201,
			message: 'Experience created successfully',
			data: experience,
		};
	}

	static async updateExperience(id: number, data: Partial<ExperienceData>) {
		if (data.start_date && data.end_date && new Date(data.end_date) < new Date(data.start_date)) {
			throw new Error('End date cannot be earlier than start date');
		}

		const experience = await ExperienceRepository.update(id, data);
		if (!experience) throw new Error('Experience not found');
		revalidateTag('experience');
		return {
			status: 200,
			message: 'Experience updated successfully',
			data: experience,
		};
	}

	static async deleteExperience(id: number) {
		const success = await ExperienceRepository.delete(id);
		if (!success) throw new Error('Experience not found');
		revalidateTag('experience');
		return {
			status: 200,
			message: 'Experience deleted successfully',
		};
	}
}