import { ContactRepository, ContactData } from '../repositories/contact.repository';
import { unstable_cache, revalidateTag } from 'next/cache';

export class ContactService {
  private static getCachedContactData = unstable_cache(
    async () => ContactRepository.findFirst(),
    ['contact_data'],
    { revalidate: 3600, tags: ['contact'] }
  );

  static async getContactData(bypassCache = false) {
    try {
      const contact = bypassCache
        ? await ContactRepository.findFirst()
        : await this.getCachedContactData();
      
      if (!contact) {
        return {
          status: 404,
          message: 'Contact data not found',
          data: null
        };
      }
      return {
        status: 200,
        message: 'Contact data retrieved successfully',
        data: contact
      };
    } catch (error) {
      console.error('Error in ContactService.getContactData:', error);
      throw new Error('Failed to fetch contact data');
    }
  }

  static async updateContactData(data: ContactData) {
    const contact = await ContactRepository.update(data);
    if (!contact) throw new Error('Contact data not found');
    revalidateTag('contact', 'max');
    return {
      status: 200,
      message: 'Contact data updated successfully',
      data: contact
    };
  }
}
