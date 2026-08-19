import { json } from '@sveltejs/kit';
import bcrypt from 'bcryptjs';
import { AdminRepository } from '../../../../repositories/admin.repository';
import { login } from '$lib/auth';
import { checkRateLimit } from '$lib/rateLimit';

export async function POST({ request, cookies, getClientAddress }) {
	try {
		const ip = getClientAddress();
		if (!(await checkRateLimit(ip))) {
			return json(
				{ status: 429, message: 'Too many login attempts. Please try again in 15 minutes.' },
				{ status: 429 }
			);
		}

		const body = await request.json();
		const { email, password } = body ?? {};

		if (!email || !password) {
			return json({ status: 400, message: 'Email and password are required' }, { status: 400 });
		}

		const admin = await AdminRepository.findByEmail(email);

		if (!admin) {
			return json({ status: 401, message: 'Invalid credentials' }, { status: 401 });
		}

		const isPasswordValid = await bcrypt.compare(password, admin.password!);

		if (!isPasswordValid) {
			return json({ status: 401, message: 'Invalid credentials' }, { status: 401 });
		}

		await login(cookies, { id: String(admin.id), email: admin.email });

		return json({ status: 200, message: 'Login successful' });
	} catch (error) {
		console.error('Login error:', error);
		return json({ status: 500, message: 'An internal error occurred' }, { status: 500 });
	}
}