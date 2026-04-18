import { HomeRepository } from '@/src/repositories/home.repository';
import { mockQuery } from '../__mocks__/db';
import { createHomeData } from '../helpers/factories';

jest.mock('@/src/lib/db', () => require('../__mocks__/db').default);

describe('HomeRepository', () => {
  describe('findFirst()', () => {
    it('should return home data', async () => {
      const mockData = createHomeData();
      mockQuery.mockResolvedValueOnce({ rows: [mockData] });

      const result = await HomeRepository.findFirst();

      expect(mockQuery).toHaveBeenCalledWith(expect.stringContaining('SELECT badge_text, headline, subheadline, description, cv_url FROM home_section'));
      expect(result).toEqual(mockData);
    });

    it('should return null if no record exists', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [] });
      const result = await HomeRepository.findFirst();
      expect(result).toBeNull();
    });
  });

  describe('update()', () => {
    it('should update home data', async () => {
      const input = createHomeData({ headline: 'New Headline' });
      mockQuery.mockResolvedValueOnce({ rows: [input] });

      const result = await HomeRepository.update(input);

      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE home_section'),
        [input.badge_text, input.headline, input.subheadline, input.description, input.cv_url]
      );
      expect(result).toEqual(input);
    });

    it('should return null if update fails', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [] });
      const result = await HomeRepository.update(createHomeData());
      expect(result).toBeNull();
    });
  });
});
