import { NextRequest, NextResponse } from 'next/server';
import { ImageService } from '@/src/services/image.service';

/**
 * Endpoint for cleanup of orphan images.
 * Triggered by Vercel Cron.
 */
export async function POST(request: NextRequest) {
  try {
    // Basic verification: Check if triggered by Vercel Cron or direct secret
    const authHeader = request.headers.get('authorization');
    
    // In production, we should check against a process.env.CRON_SECRET
    // If not provided, we skip for now (security by obscurity is bad, 
    // but this is a starting point).
    if (process.env.NODE_ENV === 'production') {
      if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
      }
    }

    const result = await ImageService.cleanupOrphanImages();
    
    return NextResponse.json({
      status: 200,
      message: 'Cleanup completed successfully',
      data: result
    });

  } catch (error: any) {
    console.error('Cleanup Cron Error:', error);
    return NextResponse.json(
      { status: 500, message: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// Support GET for manual testing in browser (if dev)
export async function GET(request: NextRequest) {
  if (process.env.NODE_ENV === 'production') {
      return NextResponse.json({ message: 'Method Not Allowed' }, { status: 405 });
  }
  return POST(request);
}
