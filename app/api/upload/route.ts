// app/api/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import path from 'path';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

// Allow 10MB file size (optional)
export const config = {
  maxBodySize: "5mb",
};

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get('file') as File;

  if (!file) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  try {
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream({ resource_type: 'image' }, (err, res) => {
        if (err || !res) return reject(err);
        resolve(res);
      }).end(buffer);
    });

    return NextResponse.json({ url: (result as any).secure_url });
  } catch (err) {
    console.error('Upload failed:', err);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { secure_url } = await req.json();

    console.log(secure_url)

    if (!secure_url) {
      return NextResponse.json({ error: 'No secure_url provided' }, { status: 400 });
    }

    // Extract public_id from secure_url
    const url = new URL(secure_url);
    const pathname = url.pathname; // e.g., /v1234567890/folder/image_name.jpg
    const publicIdWithExt = pathname.split('/').slice(2).join('/'); // remove `/v123...` part
    const publicId = publicIdWithExt.replace(path.extname(publicIdWithExt), '');

    console.log(publicId.split("/")[3])
    // Delete the image from Cloudinary
    const result = await cloudinary.uploader.destroy(publicId.split("/")[3]);

    if (result.result !== 'ok') {
      return NextResponse.json({ error: 'Failed to delete image' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Image deleted successfully' });
  } catch (err) {
    console.error('Deletion failed:', err);
    return NextResponse.json({ error: 'Deletion failed' }, { status: 500 });
  }
}
