import { describe, expect, it } from 'vitest';
import {
	ALLOWED_BUCKETS,
	ALLOWED_MIME_TYPES,
	MAX_FILE_SIZE,
	validateMagicBytes,
	validateUploadFile,
	isValidBucket
} from '$lib/upload';

const jpegHeader = new Uint8Array([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10]);
const pngHeader = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const fakePng = new Uint8Array([0x00, 0x01, 0x02, 0x03]);

describe('validateMagicBytes', () => {
	it('accepts jpeg and png headers', () => {
		expect(validateMagicBytes(jpegHeader, 'image/jpeg')).toBe(true);
		expect(validateMagicBytes(pngHeader, 'image/png')).toBe(true);
	});

	it('rejects content that does not match the declared mime', () => {
		expect(validateMagicBytes(fakePng, 'image/png')).toBe(false);
		expect(validateMagicBytes(jpegHeader, 'image/png')).toBe(false);
	});
});

describe('validateUploadFile', () => {
	it('accepts a valid jpeg under the size limit', () => {
		expect(validateUploadFile(jpegHeader, 'image/jpeg', 10 * 1024)).toBeNull();
	});

	it('rejects an unlisted mime type', () => {
		expect(validateUploadFile(jpegHeader, 'application/pdf', 1024)).toBe('Invalid file type');
	});

	it('rejects files larger than the limit', () => {
		expect(validateUploadFile(jpegHeader, 'image/jpeg', MAX_FILE_SIZE + 1)).toBe('File too large (max 5MB)');
	});

	it('rejects disguised content', () => {
		expect(validateUploadFile(fakePng, 'image/png', 1024)).toContain('Invalid file content');
	});
});

describe('buckets', () => {
	it('allows the configured buckets', () => {
		for (const bucket of ALLOWED_BUCKETS) {
			expect(isValidBucket(bucket)).toBe(true);
		}
		expect(ALLOWED_MIME_TYPES).toContain('image/webp');
		expect(isValidBucket('hack-me')).toBe(false);
	});
});