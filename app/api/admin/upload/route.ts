import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ status: 400, message: 'No image file uploaded' }, { status: 400 });
    }

    const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = process.env;
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      console.error('Missing Supabase credentials in .env.local');
      return NextResponse.json(
        { status: 500, message: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Clean up environment variables to avoid formatting issues (trailing slashes, spaces)
    const cleanUrl = SUPABASE_URL.trim().replace(/\/$/, '');
    const cleanKey = SUPABASE_SERVICE_ROLE_KEY.trim();

    // Clean up filename and append timestamp
    const ext = file.name.split('.').pop();
    const uniqueFileName = `${Date.now()}.${ext}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Supabase via REST API
    const uploadUrl = `${cleanUrl}/storage/v1/object/projects/${uniqueFileName}`;

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
      const errorText = await uploadRes.text();
      console.error('Supabase REST error:', errorText);
      throw new Error('Failed to upload to storage');
    }

    // Return the public URL
    const publicUrl = `${cleanUrl}/storage/v1/object/public/projects/${uniqueFileName}`;

    return NextResponse.json({
      status: 200,
      message: 'Upload successful',
      data: { url: publicUrl }
    });

  } catch (error: any) {
    console.error('Upload API Error:', error);
    return NextResponse.json({ status: 500, message: error.message }, { status: 500 });
  }
}
