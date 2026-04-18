import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/src/lib/auth';
import { BlogService } from '@/src/services/blog.service';
import { BlogData } from '@/src/repositories/blog.repository';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const onlyPublished = searchParams.get('published') === 'true';
    
    const blogs = await BlogService.getAllBlogs(onlyPublished);
    return NextResponse.json({
      status: 200,
      message: 'Success',
      data: blogs
    });
  } catch (error: any) {
    return NextResponse.json(
      { status: 500, message: error.message || 'Internal Server Error', data: null },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ status: 401, message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    
    // Simple validation (can be enhanced with zod)
    if (!body.id || !body.title || !body.slug || !body.content) {
      return NextResponse.json({ status: 400, message: 'Missing required fields' }, { status: 400 });
    }

    const blog = await BlogService.createBlog(body as BlogData);
    
    return NextResponse.json({
      status: 201,
      message: 'Blog created successfully',
      data: blog
    }, { status: 201 });

  } catch (error: any) {
    console.error('Create Blog Error:', error);
    return NextResponse.json(
      { status: 500, message: error.message || 'Internal Server Error', data: null },
      { status: 500 }
    );
  }
}
