import { ContactRepository, ContactData } from '../repositories/contact.repository';
import { getCachedData, clearCache } from '../lib/cache';

export class ContactService {
  static async getContactData(bypassCache = false) {
    try {
      const contact = await getCachedData('contact_data', () => ContactRepository.findFirst(), { bypass: bypassCache });
      
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
    clearCache('contact_data');
    return {
      status: 200,
      message: 'Contact data updated successfully',
      data: contact
    };
  }
}
