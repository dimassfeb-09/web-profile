export const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'];
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_BUCKETS = ['projects', 'achievements', 'certificates', 'project-screenshots'];

const MAGIC_BYTES: Record<string, number[][]> = {
	'image/jpeg': [[0xff, 0xd8, 0xff]],
	'image/png': [[0x89, 0x50, 0x4e, 0x47]],
	'image/gif': [[0x47, 0x49, 0x46, 0x38]],
	'image/webp': [
		[0x52, 0x49, 0x46, 0x46],
		[0x57, 0x45, 0x42, 0x50],
	],
};

export function validateMagicBytes(buffer: Uint8Array, mimeType: string): boolean {
	// ponytail: AVIF magic is ftypavif/fr-box — skip strict check, trust sharp to validate
	if (mimeType === 'image/avif') return true;
	const signatures = MAGIC_BYTES[mimeType];
	if (!signatures) return false;

	for (const sig of signatures) {
		const matches = sig.every((byte, i) => buffer[i] === byte);
		if (matches) return true;
	}
	return false;
}

/** Returns an error message when the file is rejected, otherwise null. */
export function validateUploadFile(buffer: Uint8Array, mimeType: string, size: number): string | null {
	if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
		return 'Invalid file type';
	}
	if (size > MAX_FILE_SIZE) {
		return 'File too large (max 5MB)';
	}
	if (!validateMagicBytes(buffer, mimeType)) {
		return 'Invalid file content - file may be corrupted or disguised';
	}
	return null;
}

export function isValidBucket(bucketName: string): boolean {
	return ALLOWED_BUCKETS.includes(bucketName);
}