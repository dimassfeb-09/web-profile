import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/src/lib/auth';
import { BlogService } from '@/src/services/blog.service';
import { BlogData } from '@/src/repositories/blog.repository';

type Params = Promise<{ id: string }>;

export async function GET(request: NextRequest, { params }: { params: Params }) {
  try {
    const { id } = await params;
    const blog = await BlogService.getBlogById(id);
    
    if (!blog) {
      return NextResponse.json({ status: 404, message: 'Blog not found', data: null }, { status: 404 });
    }

    return NextResponse.json({
      status: 200,
      message: 'Success',
      data: blog
    });
  } catch (error: any) {
    return NextResponse.json(
      { status: 500, message: error.message || 'Internal Server Error', data: null },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: { params: Params }) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ status: 401, message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    
    const blog = await BlogService.updateBlog(id, body as Partial<BlogData>);
    
    if (!blog) {
      return NextResponse.json({ status: 404, message: 'Blog not found', data: null }, { status: 404 });
    }

    return NextResponse.json({
      status: 200,
      message: 'Blog updated successfully',
      data: blog
    });

  } catch (error: any) {
    console.error('Update Blog Error:', error);
    return NextResponse.json(
      { status: 500, message: error.message || 'Internal Server Error', data: null },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Params }) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ status: 401, message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const success = await BlogService.deleteBlog(id);
    
    if (!success) {
      return NextResponse.json({ status: 404, message: 'Blog not found', data: null }, { status: 404 });
    }

    return NextResponse.json({
      status: 200,
      message: 'Blog deleted successfully',
      data: null
    });

  } catch (error: any) {
    console.error('Delete Blog Error:', error);
    return NextResponse.json(
      { status: 500, message: error.message || 'Internal Server Error', data: null },
      { status: 500 }
    );
  }
}
