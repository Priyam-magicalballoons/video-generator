import { NextRequest, NextResponse } from 'next/server';
import { uploadToDigitalOcean } from '@/app/actions/savePosterToDb';
import { Buffer } from 'buffer';

export async function POST(req: NextRequest) {
  try {
    const { base64, filename, contentType, folderPath } = await req.json();

    const fileBuffer = Buffer.from(base64, 'base64');

    const result = await uploadToDigitalOcean({
      bucket: 'video-storage-bucket2',
      folderPath,
      filename,
      fileBuffer,
      contentType,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
