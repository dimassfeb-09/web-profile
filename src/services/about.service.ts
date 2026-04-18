import { AboutRepository, AboutData } from '../repositories/about.repository';
import { getCachedData, clearCache } from '../lib/cache';

export class AboutService {
  static async getAboutData(bypassCache = false) {
    try {
      const about = await getCachedData('about_data', () => AboutRepository.findFirst(), { bypass: bypassCache });
      
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
    clearCache('about_data');
    return {
      status: 200,
      message: 'About data updated successfully',
      data: about
    };
  }
}
