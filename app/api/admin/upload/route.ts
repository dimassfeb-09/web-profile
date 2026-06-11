import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/src/lib/auth';

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_BUCKETS = ['projects', 'achievements', 'certificates', 'project-screenshots'];

// Magic bytes untuk validasi tipe file (file signature)
const MAGIC_BYTES: Record<string, number[][]> = {
  'image/jpeg': [[0xFF, 0xD8, 0xFF]],
  'image/png': [[0x89, 0x50, 0x4E, 0x47]],
  'image/gif': [[0x47, 0x49, 0x46, 0x38]],
  'image/webp': [[0x52, 0x49, 0x46, 0x46], [0x57, 0x45, 0x42, 0x50]], // RIFF....WEBP
};

/**
 * Validasi magic bytes untuk memastikan file sesuai dengan MIME type
 */
function validateMagicBytes(buffer: Buffer, mimeType: string): boolean {
  const signatures = MAGIC_BYTES[mimeType];
  if (!signatures) return false;

  for (const sig of signatures) {
    const matches = sig.every((byte, i) => buffer[i] === byte);
    if (matches) return true;
  }
  return false;
}

export async function POST(request: NextRequest) {
  try {
    await requireAuth();
    
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ status: 400, message: 'No image file uploaded' }, { status: 400 });
    }

    // 1. Validate File Type
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json({ status: 400, message: 'Invalid file type' }, { status: 400 });
    }

    // 2. Validate File Size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ status: 400, message: 'File too large (max 5MB)' }, { status: 400 });
    }

    // 3. Validate Magic Bytes (file signature)
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    if (!validateMagicBytes(buffer, file.type)) {
      return NextResponse.json({ status: 400, message: 'Invalid file content - file may be corrupted or disguised' }, { status: 400 });
    }

    // 4. Get and Whitelist Bucket
    const { searchParams } = new URL(request.url);
    const bucketName = searchParams.get('bucket') || 'projects';
    if (!ALLOWED_BUCKETS.includes(bucketName)) {
      return NextResponse.json({ status: 400, message: 'Invalid bucket' }, { status: 400 });
    }

    const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = process.env;
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      console.error('Missing Supabase credentials');
      return NextResponse.json({ status: 500, message: 'Server configuration error' }, { status: 500 });
    }

    const cleanUrl = SUPABASE_URL.trim().replace(/\/$/, '');
    const cleanKey = SUPABASE_SERVICE_ROLE_KEY.trim();

    // Secure Extension Handling
    const MIME_TO_EXT: Record<string, string> = {
      'image/jpeg': 'jpg', 'image/png': 'png',
      'image/webp': 'webp', 'image/gif': 'gif',
    };
    const ext = MIME_TO_EXT[file.type] || 'webp';
    const uniqueFileName = `${Date.now()}.${ext}`;

    // Generate hash for integrity tracking
    const crypto = await import('crypto');
    const hash = crypto.createHash('sha256').update(buffer).digest('hex').slice(0, 8);

    const uploadUrl = `${cleanUrl}/storage/v1/object/${bucketName}/${uniqueFileName}`;

    const uploadRes = await fetch(uploadUrl, {
      method: 'POST',
      headers: {
        'apikey': cleanKey,
        'Authorization': `Bearer ${cleanKey}`,
        'Content-Type': file.type,
        'x-upsert': 'false'
      },
      body: buffer
    });

    if (!uploadRes.ok) {
      throw new Error('Storage upload failed');
    }

    const publicUrl = `${cleanUrl}/storage/v1/object/public/${bucketName}/${uniqueFileName}`;

    return NextResponse.json({
      status: 200,
      message: 'Upload successful',
      data: { url: publicUrl, hash }
    });

  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ status: 401, message: 'Unauthorized' }, { status: 401 });
    }
    console.error('[Admin Upload] Error:', error);
    return NextResponse.json({ status: 500, message: 'Internal Server Error' }, { status: 500 });
  }
}
