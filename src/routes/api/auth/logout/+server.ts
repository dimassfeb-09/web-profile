import { json } from '@sveltejs/kit';
import { logout } from '$lib/auth';

export async function POST({ cookies }) {
	await logout(cookies);
	return json({ status: 200, message: 'Logged out successfully' });
}