import type { JSONContent } from '@tiptap/core';

// ponytail: nag author saat publish (H2, gambar, alt) — mesin tidak boleh mengarang heading sendiri
export function seoWarnings(content: Record<string, unknown>): string[] {
	let words = 0;
	let h2 = 0;
	let imgs = 0;
	let imgsNoAlt = 0;

	const stack: JSONContent[] = [content as JSONContent];
	while (stack.length) {
		const node = stack.pop()!;
		if (node.type === 'heading' && node.attrs?.level === 2) h2++;
		if (node.type === 'image') {
			imgs++;
			if (!node.attrs?.alt) imgsNoAlt++;
		}
		if (node.type === 'text' && typeof node.text === 'string') {
			words += node.text.trim().split(/\s+/).filter(Boolean).length;
		}
		if (Array.isArray(node.content)) stack.push(...(node.content as JSONContent[]));
	}

	const warns: string[] = [];
	if (words > 500 && h2 === 0) {
		warns.push(
			`• Artikel ${words} kata tanpa H2. Tambah subheading per subtopik — penting untuk snippet, passage ranking & sitasi AI.`
		);
	}
	if (imgs === 0 && words > 300) {
		warns.push('• Tanpa gambar. Tambah 1 screenshot + alt deskriptif (otomatis jadi og:image).');
	} else if (imgsNoAlt > 0) {
		warns.push(`• ${imgsNoAlt} gambar tanpa alt text.`);
	}
	return warns;
}

// return true = lanjut publish
export function confirmSeoPublish(content: Record<string, unknown>): boolean {
	const warns = seoWarnings(content);
	if (warns.length === 0) return true;
	return confirm(`SEO check:\n${warns.join('\n')}\n\nTetap publish?`);
}
