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
    const cronSecret = process.env.CRON_SECRET;
    
    // Always check for secret if configured, or if in production
    if (cronSecret || process.env.NODE_ENV === 'production') {
      if (authHeader !== `Bearer ${cronSecret}`) {
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
