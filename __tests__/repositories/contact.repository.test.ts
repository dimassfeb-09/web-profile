import { ContactRepository } from '@/src/repositories/contact.repository';
import { mockQuery } from '../__mocks__/db';
import { createContactData } from '../helpers/factories';

jest.mock('@/src/lib/db', () => require('../__mocks__/db').default);

describe('ContactRepository', () => {
  describe('findFirst()', () => {
    it('should return contact data', async () => {
      const mockData = createContactData();
      mockQuery.mockResolvedValueOnce({ rows: [mockData] });

      const result = await ContactRepository.findFirst();

      expect(mockQuery).toHaveBeenCalledWith(expect.stringContaining('SELECT headline, description, email, linkedin_url FROM contact_section'));
      expect(result).toEqual(mockData);
    });

    it('should return null if no record exists', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [] });
      const result = await ContactRepository.findFirst();
      expect(result).toBeNull();
    });
  });

  describe('update()', () => {
    it('should update contact data', async () => {
      const input = createContactData({ email: 'new@example.com' });
      mockQuery.mockResolvedValueOnce({ rows: [input] });

      const result = await ContactRepository.update(input);

      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE contact_section'),
        [input.headline, input.description, input.email, input.linkedin_url]
      );
      expect(result).toEqual(input);
    });

    it('should return null if update fails', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [] });
      const result = await ContactRepository.update(createContactData());
      expect(result).toBeNull();
    });
  });
});
