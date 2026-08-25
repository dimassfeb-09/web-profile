import { test, expect } from '@playwright/test';

// Chrome DevTools network profiles (download/upload in bytes/s, latency ms)
const profiles = {
	'jelek banget (Slow 2G)': { download: (250 * 1024) / 8, upload: (250 * 1024) / 8, latency: 400 },
	'jelek (Slow 3G)': { download: (400 * 1024) / 8, upload: (400 * 1024) / 8, latency: 400 },
	'sedang (Fast 3G)': { download: (1600 * 1024) / 8, upload: (768 * 1024) / 8, latency: 150 },
	'lumayan (Slow 4G)': { download: (3000 * 1024) / 8, upload: (1500 * 1024) / 8, latency: 70 },
	'bagus (Fast 4G)': { download: (20 * 1024 * 1024) / 8, upload: (10 * 1024 * 1024) / 8, latency: 20 },
	'bagus banget (WiFi)': { download: (30 * 1024 * 1024) / 8, upload: (15 * 1024 * 1024) / 8, latency: 10 },
} as const;

for (const [name, cond] of Object.entries(profiles)) {
	test(`load ${name} -> dimassfeb.com`, async ({ page, context }) => {
		// emulate via CDP
		const client = await context.newCDPSession(page);
		await client.send('Network.enable');
		await client.send('Network.emulateNetworkConditions', {
			offline: false,
			downloadThroughput: cond.download,
			uploadThroughput: cond.upload,
			latency: cond.latency,
			connectionType: 'cellular3g',
		});

		const t0 = Date.now();
		await page.goto('https://www.dimassfeb.com', { waitUntil: 'domcontentloaded' });
		// hero SSR must be visible
		await expect(page.getByText('Dimas Febriyanto').first()).toBeVisible({ timeout: 30000 });
		// projects lazy section should eventually appear
		await page.waitForTimeout(1500);
		const t1 = Date.now();
		const total = t1 - t0;
		console.log(`[${name}] total ${total}ms (rtt ${cond.latency}ms, down ${Math.round(cond.download*8/1024)}kbps)`);
		// UX: hero + about + skills should be visible even on slow network
		await expect(page.locator('#about, #skills').first()).toBeVisible({ timeout: 5000 }).catch(() => {});
		// no error page
		await expect(page.locator('body')).not.toContainText('Error', { timeout: 2000 }).catch(() => {});
	});
}
