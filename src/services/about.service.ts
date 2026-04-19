import { AboutRepository, AboutData } from '../repositories/about.repository';
import { unstable_cache, revalidateTag } from 'next/cache';

export class AboutService {
  private static getCachedAboutData = unstable_cache(
    async () => AboutRepository.findFirst(),
    ['about_data'],
    { revalidate: 3600, tags: ['about'] }
  );

  static async getAboutData(bypassCache = false) {
    try {
      const about = bypassCache
        ? await AboutRepository.findFirst()
        : await this.getCachedAboutData();
      
      if (!about) {
        return {
          status: 404,
          message: 'About data not found',
          data: null
        };
      }
      return {
        status: 200,
        message: 'About data retrieved successfully',
        data: about
      };
    } catch (error) {
      console.error('Error in AboutService.getAboutData:', error);
      throw new Error('Failed to fetch about data');
    }
  }

  static async updateAboutData(data: AboutData) {
    const about = await AboutRepository.update(data);
    if (!about) throw new Error('About data not found');
    revalidateTag('about', 'max');
    return {
      status: 200,
      message: 'About data updated successfully',
      data: about
    };
  }
}
