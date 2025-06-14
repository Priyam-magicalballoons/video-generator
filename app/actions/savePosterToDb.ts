'use server';

import {
  S3Client,
  PutObjectCommand,
} from '@aws-sdk/client-s3';
import { Buffer } from 'buffer';

const s3 = new S3Client({
  region: 'blr1', // or your Space region like nyc3, sgp1, etc.
  endpoint: 'https://blr1.digitaloceanspaces.com',
  credentials: {
    accessKeyId: process.env.DO_SPACE_KEY!,
    secretAccessKey: process.env.DO_SPACE_SECRET!,
  },
});

interface UploadOptions {
  bucket: string;         // your Space name
  folderPath: string;     // e.g. "doctors/DrA"
  filename: string;       // e.g. "photo.jpg"
  fileBuffer: Buffer;     // file data
  contentType?: string;   // optional: 'image/jpeg', 'application/pdf', etc.
}

export async function uploadToDigitalOcean({
  bucket,
  folderPath,
  filename,
  fileBuffer,
  contentType = 'image/png',
}: UploadOptions) {
  try {
    const fullKey = `${folderPath}/${filename}.png`; // e.g., doctors/DrA/photo.jpg

    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: fullKey,
      Body: fileBuffer,
      ContentType: contentType,
      ACL: 'public-read', // Optional: make file publicly accessible
    });


    await s3.send(command);

    return {
      success: true,
      url: `https://${bucket}.blr1.digitaloceanspaces.com/${fullKey}`,
      key: fullKey,
    };
  } catch (err) {
    console.error('Upload error:', err);
    return {
      success: false,
      error: 'Failed to upload file to DigitalOcean Spaces',
    };
  }
}
