import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/src/lib/auth';
import { StorageService } from '@/src/services/storage.service';
import { BlogImageRepository } from '@/src/repositories/blog_image.repository';
import { BlogRepository } from '@/src/repositories/blog.repository';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const blogId = formData.get('blogId') as string;

    if (!file || !blogId) {
      return NextResponse.json({ message: 'Missing file or blogId' }, { status: 400 });
    }

    // 1. Prepare file details
    const buffer = Buffer.from(await file.arrayBuffer());
    const extension = file.name.split('.').pop() || 'webp';
    const imageId = uuidv4();
    const filePath = `${blogId}/${imageId}.${extension}`;
    const contentType = file.type || 'image/webp';

    // 2. Upload to Supabase Storage
    const publicUrl = await StorageService.uploadFile(filePath, buffer, contentType);

    // 2.5 Ensure Blog exists to satisfy Foreign Key Constraint
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

    // 3. Save to database with 'unused' status
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
    console.error('Upload Error:', error);
    return NextResponse.json(
      { message: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
