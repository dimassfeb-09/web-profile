import { AboutRepository } from '@/src/repositories/about.repository';
import { mockQuery } from '../__mocks__/db';
import { createAboutData } from '../helpers/factories';

jest.mock('@/src/lib/db', () => require('../__mocks__/db').default);

describe('AboutRepository', () => {
  describe('findFirst()', () => {
    it('should return the first record', async () => {
      const mockData = createAboutData();
      mockQuery.mockResolvedValueOnce({ rows: [mockData] });

      const result = await AboutRepository.findFirst();

      expect(mockQuery).toHaveBeenCalledWith(expect.stringContaining('SELECT headline, paragraphs FROM about_section'));
      expect(result).toEqual(mockData);
    });

    it('should return null if no record exists', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [] });
      const result = await AboutRepository.findFirst();
      expect(result).toBeNull();
    });
  });

  describe('update()', () => {
    it('should update the singleton record', async () => {
      const input = createAboutData({ headline: 'Updated' });
      mockQuery.mockResolvedValueOnce({ rows: [input] });

      const result = await AboutRepository.update(input);

      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE about_section'),
        [input.headline, input.paragraphs]
      );
      expect(result).toEqual(input);
    });

    it('should return null if update fails', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [] });
      const result = await AboutRepository.update(createAboutData());
      expect(result).toBeNull();
    });
  });
});
