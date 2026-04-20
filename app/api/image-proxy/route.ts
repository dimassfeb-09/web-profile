import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const CACHE_MAX_AGE = 60 * 60 * 24 * 7; // 7 hari dalam detik

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const imageUrl = searchParams.get('url');

  if (!imageUrl) {
    return NextResponse.json({ error: 'URL required' }, { status: 400 });
  }

  try {
    const url = new URL(imageUrl);
    const allowedHosts = ['atgnqunmelvquqdwkmnq.supabase.co', 'lh3.googleusercontent.com'];
    
    if (!allowedHosts.includes(url.hostname)) {
      return NextResponse.json({ error: 'Domain not allowed' }, { status: 403 });
    }

    const imageResponse = await fetch(imageUrl, {
      next: { revalidate: CACHE_MAX_AGE },
    });

    if (!imageResponse.ok) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }

    const imageBuffer = await imageResponse.arrayBuffer();
    const contentType = imageResponse.headers.get('content-type') || 'image/jpeg';

    // Generate ETag from content hash
    const etag = `"${crypto.createHash('sha256').update(Buffer.from(imageBuffer)).digest('hex').slice(0, 16)}"`;

    // Check If-None-Match for ETag validation
    const ifNoneMatch = request.headers.get('if-none-match');
    if (ifNoneMatch === etag) {
      return new NextResponse(null, {
        status: 304,
        headers: {
          'ETag': etag,
          'Cache-Control': `public, max-age=${CACHE_MAX_AGE}, s-maxage=${CACHE_MAX_AGE}, stale-while-revalidate=86400`,
        },
      });
    }

    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Length': imageBuffer.byteLength.toString(),
        'Cache-Control': `public, max-age=${CACHE_MAX_AGE}, s-maxage=${CACHE_MAX_AGE}, stale-while-revalidate=86400, immutable`,
        'ETag': etag,
        'Last-Modified': new Date().toUTCString(),
        'Vary': 'Accept',
      },
    });
  } catch (error) {
    console.error('Image proxy error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
