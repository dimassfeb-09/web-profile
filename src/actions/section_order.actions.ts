'use server';

import { SectionOrderService } from '@/src/services/section_order.service';
import { revalidateTag } from 'next/cache';

export async function updateSectionOrdersAction(orders: { section_key: string; order_index: number; is_visible: boolean }[]) {
  try {
    const result = await SectionOrderService.updateOrders(orders);
    
    // As per user request: revalidateTag with 2 arguments
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    revalidateTag('section_orders', 'max' as any); 
    
    return result;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to update section orders';
    return { status: 500, message };
  }
}
