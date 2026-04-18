import { HomeRepository, HomeData } from '../repositories/home.repository';
import { getCachedData, clearCache } from '../lib/cache';

export class HomeService {
  static async getHomeData(bypassCache = false) {
    try {
      const home = await getCachedData('home_data', () => HomeRepository.findFirst(), { bypass: bypassCache });
      
      if (!home) {
        return {
          status: 404,
          message: 'Home data not found',
          data: null
        };
      }
      return {
        status: 200,
        message: 'Home data retrieved successfully',
        data: home
      };
    } catch (error) {
      console.error('Error in HomeService.getHomeData:', error);
      throw new Error('Failed to fetch home data');
    }
  }

  static async updateHomeData(data: HomeData) {
    const home = await HomeRepository.update(data);
    if (!home) throw new Error('Home data not found');
    clearCache('home_data');
    return {
      status: 200,
      message: 'Home data updated successfully',
      data: home
    };
  }
}
