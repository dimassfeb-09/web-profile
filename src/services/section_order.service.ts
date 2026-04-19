import { unstable_cache } from 'next/cache';
import { SectionOrderRepository, SectionOrder } from '../repositories/section_order.repository';

export class SectionOrderService {
  static async getAllSections(bypassCache = false): Promise<{ data: SectionOrder[] | null; message: string; status: number }> {
    try {
      const fetcher = bypassCache 
        ? () => SectionOrderRepository.findAll()
        : unstable_cache(
            () => SectionOrderRepository.findAll(),
            ['section_orders_all'],
            { revalidate: 3600, tags: ['section_orders'] }
          );

      const data = await fetcher();
      return { data, message: 'Sections fetched successfully', status: 200 };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to fetch sections';
      return { data: null, message, status: 500 };
    }
  }

  static async updateOrders(orders: { section_key: string; order_index: number; is_visible: boolean }[]): Promise<{ message: string; status: number }> {
    try {
      await SectionOrderRepository.updateBatch(orders);
      return { message: 'Section orders updated successfully', status: 200 };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to update section orders';
      return { message, status: 500 };
    }
  }
}
