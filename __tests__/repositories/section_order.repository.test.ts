import { SectionOrderRepository } from '@/src/repositories/section_order.repository';
import { mockQuery } from '../__mocks__/db';
import { createSectionOrderData } from '../helpers/factories';

jest.mock('@/src/lib/db', () => ({
  __esModule: true,
  default: {
    query: jest.fn(),
    connect: jest.fn(),
  },
}));

import pool from '@/src/lib/db';

const mockedPool = pool as jest.Mocked<any>;

describe('SectionOrderRepository', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll()', () => {
    it('should return all sections ordered by order_index', async () => {
      const mockData = [
        createSectionOrderData({ section_key: 'about', order_index: 1 }),
        createSectionOrderData({ section_key: 'skills', order_index: 2 }),
      ];
      mockedPool.query.mockResolvedValueOnce({ rows: mockData });

      const result = await SectionOrderRepository.findAll();

      expect(mockedPool.query).toHaveBeenCalledWith(expect.stringContaining('ORDER BY order_index ASC'));
      expect(result).toEqual(mockData);
    });
  });

  describe('updateBatch()', () => {
    it('should update sections in a transaction', async () => {
      const mockClient = {
        query: jest.fn(),
        release: jest.fn(),
      };
      mockedPool.connect.mockResolvedValueOnce(mockClient);

      const orders = [
        { section_key: 'about', order_index: 2, is_visible: true },
        { section_key: 'skills', order_index: 1, is_visible: false },
      ];

      await SectionOrderRepository.updateBatch(orders);

      expect(mockClient.query).toHaveBeenCalledWith('BEGIN');
      expect(mockClient.query).toHaveBeenCalledTimes(orders.length + 2); // BEGIN + updates + COMMIT
      expect(mockClient.query).toHaveBeenCalledWith('COMMIT');
      expect(mockClient.release).toHaveBeenCalled();
    });

    it('should rollback on error', async () => {
      const mockClient = {
        query: jest.fn().mockImplementation((query) => {
          if (query.includes('UPDATE')) throw new Error('DB Error');
        }),
        release: jest.fn(),
      };
      mockedPool.connect.mockResolvedValueOnce(mockClient);

      const orders = [{ section_key: 'about', order_index: 1, is_visible: true }];

      await expect(SectionOrderRepository.updateBatch(orders)).rejects.toThrow('DB Error');
      expect(mockClient.query).toHaveBeenCalledWith('ROLLBACK');
      expect(mockClient.release).toHaveBeenCalled();
    });
  });

  describe('toggleVisibility()', () => {
    it('should update visibility for a specific section', async () => {
      mockedPool.query.mockResolvedValueOnce({ rowCount: 1 });

      await SectionOrderRepository.toggleVisibility('about', false);

      expect(mockedPool.query).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE section_orders SET is_visible = $1'),
        [false, 'about']
      );
    });
  });
});
