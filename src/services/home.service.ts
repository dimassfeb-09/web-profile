import { HomeRepository, HomeData } from '../repositories/home.repository';
import { unstable_cache, revalidateTag } from 'next/cache';

export class HomeService {
  private static getCachedHomeData = unstable_cache(
    async () => HomeRepository.findFirst(),
    ['home_data'],
    { revalidate: 3600, tags: ['home'] }
  );

  static async getHomeData(bypassCache = false) {
    try {
      const home = bypassCache
        ? await HomeRepository.findFirst()
        : await this.getCachedHomeData();
      
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
    revalidateTag('home', 'max');
    return {
      status: 200,
      message: 'Home data updated successfully',
      data: home
    };
  }
}
