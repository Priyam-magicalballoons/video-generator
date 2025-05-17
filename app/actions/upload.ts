// app/actions/upload.ts
'use server';

import { s3 } from '@/lib/s3';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { revalidatePath } from 'next/cache';

export async function uploadFile(formData: FormData) {
  const file = formData.get('file') as File;
  if (!file) return { success: false, message: 'No file selected.' };

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const fileName = `${Date.now()}-${file.name}`;

  const command = new PutObjectCommand({
    Bucket: process.env.DO_SPACE_BUCKET!,
    Key: fileName,
    Body: buffer,
    ContentType: file.type,
    ACL: 'public-read',
  });

  await s3.send(command);

  const url = `${process.env.DO_SPACE_ENDPOINT}/${process.env.DO_SPACE_BUCKET}/${fileName}`;

//   revalidatePath('/'); 
  return { success: true, url };
}
