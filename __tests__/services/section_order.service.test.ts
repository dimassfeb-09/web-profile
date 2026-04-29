import { SectionOrderService } from '@/src/services/section_order.service';
import { SectionOrderRepository } from '@/src/repositories/section_order.repository';
import { createSectionOrderData } from '../helpers/factories';

jest.mock('../../src/repositories/section_order.repository');
jest.mock('next/cache', () => ({
  revalidateTag: jest.fn(),
  unstable_cache: jest.fn((fn) => fn),
}));

const MockedRepo = SectionOrderRepository as jest.Mocked<typeof SectionOrderRepository>;

describe('SectionOrderService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => { });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('getAllSections()', () => {
    it('should return all sections', async () => {
      const mockData = [createSectionOrderData()];
      MockedRepo.findAll.mockResolvedValueOnce(mockData);

      const result = await SectionOrderService.getAllSections();

      expect(result.data).toEqual(mockData);
      expect(result.status).toBe(200);
    });

    it('should bypass cache when requested', async () => {
      const mockData = [createSectionOrderData()];
      MockedRepo.findAll.mockResolvedValueOnce(mockData);

      await SectionOrderService.getAllSections(true);

      expect(MockedRepo.findAll).toHaveBeenCalled();
    });

    it('should handle repository errors', async () => {
      MockedRepo.findAll.mockRejectedValueOnce(new Error('Repo Error'));
      
      const result = await SectionOrderService.getAllSections();

      expect(result.status).toBe(500);
      expect(result.message).toBe('Repo Error');
    });

    it('should handle non-Error exceptions', async () => {
      MockedRepo.findAll.mockRejectedValueOnce('String Error');
      const result = await SectionOrderService.getAllSections();
      expect(result.message).toBe('Failed to fetch sections');
    });
  });

  describe('updateOrders()', () => {
    it('should update orders bundle', async () => {
      const orders = [{ section_key: 'about', order_index: 1, is_visible: true }];
      MockedRepo.updateBatch.mockResolvedValueOnce();

      const result = await SectionOrderService.updateOrders(orders);

      expect(MockedRepo.updateBatch).toHaveBeenCalledWith(orders);
      expect(result.status).toBe(200);
    });

    it('should handle repository errors on update', async () => {
      MockedRepo.updateBatch.mockRejectedValueOnce(new Error('Update Error'));
      
      const result = await SectionOrderService.updateOrders([]);

      expect(result.status).toBe(500);
      expect(result.message).toBe('Update Error');
    });

    it('should handle non-Error exceptions on update', async () => {
      MockedRepo.updateBatch.mockRejectedValueOnce({ msg: 'Object Error' });
      const result = await SectionOrderService.updateOrders([]);
      expect(result.message).toBe('Failed to update section orders');
    });
  });
});
