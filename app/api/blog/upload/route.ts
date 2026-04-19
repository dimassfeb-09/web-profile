import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/src/lib/auth';
import { StorageService } from '@/src/services/storage.service';
import { BlogImageRepository } from '@/src/repositories/blog_image.repository';
import { BlogRepository } from '@/src/repositories/blog.repository';
import { v4 as uuidv4 } from 'uuid';

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(request: NextRequest) {
  try {
    await requireAuth();
    
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const blogId = formData.get('blogId') as string;

    if (!file || !blogId) {
      return NextResponse.json({ message: 'Missing file or blogId' }, { status: 400 });
    }

    // 1. Validate File Type
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json({ message: 'Invalid file type' }, { status: 400 });
    }

    // 2. Validate File Size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ message: 'File too large (max 5MB)' }, { status: 400 });
    }

    // 3. Prepare file details with secure extension
    const MIME_TO_EXT: Record<string, string> = {
      'image/jpeg': 'jpg', 'image/png': 'png',
      'image/webp': 'webp', 'image/gif': 'gif',
    };
    const buffer = Buffer.from(await file.arrayBuffer());
    const extension = MIME_TO_EXT[file.type] || 'webp';
    const imageId = uuidv4();
    const filePath = `${blogId}/${imageId}.${extension}`;
    const contentType = file.type || 'image/webp';

    // 4. Upload to Supabase Storage
    const publicUrl = await StorageService.uploadFile(filePath, buffer, contentType);

    // 5. Ensure Blog exists to satisfy Foreign Key Constraint
    const existingBlog = await BlogRepository.findById(blogId);
    if (!existingBlog) {
      await BlogRepository.create({
        id: blogId,
        title: 'Draft Post',
        slug: `draft-${blogId}`,
        content: {},
        is_published: false
      });
    }

    // 6. Save to database with 'unused' status
    await BlogImageRepository.create({
      blog_id: blogId,
      file_path: filePath,
      storage_url: publicUrl,
      status: 'unused'
    });

    return NextResponse.json({ 
      url: publicUrl,
      id: imageId
    });

  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    console.error('Blog Upload Error:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
