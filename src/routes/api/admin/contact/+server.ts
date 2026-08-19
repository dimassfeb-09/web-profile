import { json } from '@sveltejs/kit';
import { ContactService } from '../../../../services/contact.service';

export async function GET() {
	try {
		const result = await ContactService.getContactData(true);
		return json(result, { status: result.status });
	} catch (error) {
		console.error('[Admin Contact GET] Error:', error);
		return json({ status: 500, message: 'Internal Server Error' }, { status: 500 });
	}
}

export async function PUT({ request }) {
	try {
		const data = await request.json();
		const result = await ContactService.updateContactData(data);
		return json(result, { status: result.status });
	} catch (error) {
		console.error('[Admin Contact PUT] Error:', error);
		return json({ status: 500, message: 'Internal Server Error' }, { status: 500 });
	}
}
