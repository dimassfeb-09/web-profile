import { json } from '@sveltejs/kit';
import { SectionOrderService } from '../../../../services/section_order.service';

export async function PUT({ request }) {
	try {
		const body = await request.json();
		const orders = body.orders;

		if (!Array.isArray(orders) || orders.length === 0) {
			return json({ message: 'Orders array is required' }, { status: 400 });
		}

		const invalid = orders.some(
			(o) =>
				typeof o.section_key !== 'string' ||
				typeof o.order_index !== 'number' ||
				typeof o.is_visible !== 'boolean'
		);
		if (invalid) {
			return json(
				{ message: 'Each order must have section_key (string), order_index (number), is_visible (boolean)' },
				{ status: 400 }
			);
		}

		const result = await SectionOrderService.updateOrders(orders);
		return json({ message: result.message }, { status: result.status });
	} catch (error: unknown) {
		const message = error instanceof Error ? error.message : 'Failed to update section orders';
		return json({ message }, { status: 500 });
	}
}