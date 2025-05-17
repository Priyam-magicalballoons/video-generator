// app/api/presign/route.ts
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export const dynamic = 'force-dynamic';

const s3 = new S3Client({
  region: process.env.DO_SPACE_REGION!, // e.g., 'blr1'
  endpoint: process.env.DO_SPACE_ENDPOINT, // e.g., 'https://blr1.digitaloceanspaces.com'
  forcePathStyle: false,
  credentials: {
    accessKeyId: process.env.DO_SPACE_KEY!,
    secretAccessKey: process.env.DO_SPACE_SECRET!,
  },
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get('filename')!;
  const type = searchParams.get('type')!;

  const command = new PutObjectCommand({
    Bucket: process.env.DO_SPACE_BUCKET!,
    Key: filename,
    ContentType: type,
    // ❌ REMOVE THIS LINE:
    // ACL: 'public-read',
  });

  const url = await getSignedUrl(s3, command, { expiresIn: 600 });
  return Response.json({ url });
}
