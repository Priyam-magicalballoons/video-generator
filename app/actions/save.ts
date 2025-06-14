'use server';

import {
  S3Client,
  ListObjectsV2Command,
  GetObjectCommand,
  ListObjectsV2CommandOutput,
} from '@aws-sdk/client-s3';
import { createWriteStream } from 'fs';
import fs from 'fs/promises';
import path from 'path';
import { pipeline } from 'stream';
import { promisify } from 'util';

const streamPipeline = promisify(pipeline);



const spacesEndpoint = 'https://blr1.digitaloceanspaces.com'; // Update region if needed

const s3 = new S3Client({
  region: 'blr1', // any valid value works
  endpoint: spacesEndpoint,
  credentials: {
    accessKeyId: 'DO801PPZDN6JCWLP73TK',
    secretAccessKey: 'lmhFZWZ67/tM/JO5Vh2oym+tURy6GVOydR27MZ5Fc+M',
  },
});

export async function downloadFolderFromSpaces(bucket: string, prefix: string) {
  const allKeys: string[] = [];

  // 1. Recursively list all objects under the prefix
  let continuationToken: string | undefined = undefined;
  do {
    const listCommand = new ListObjectsV2Command({
      Bucket: bucket,
      Prefix: prefix,
      ContinuationToken: continuationToken,
    });

    
const response = await s3.send(listCommand) as ListObjectsV2CommandOutput;
continuationToken = response.NextContinuationToken;

    if (response.Contents) {
      for (const item of response.Contents) {
        if (item.Key && !item.Key.endsWith('/')) {
          allKeys.push(item.Key);
        }
      }
    }
  } while (continuationToken);

  if (allKeys.length === 0) {
    throw new Error('No files found under that folder.');
  }

  // 2. Download each file and preserve folder structure
  for (const key of allKeys) {
    const getObjectCommand = new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    });

    const object = await s3.send(getObjectCommand);

    // local path mirrors full key path
    const localPath = path.join(process.cwd(), 'public', key);

    const localDir = path.dirname(localPath);

    console.log(localPath)
    console.log("dir",localDir)

    // create folders as needed
    await fs.mkdir(localDir, { recursive: true });

    // write file
    await streamPipeline(
      object.Body as NodeJS.ReadableStream,
      createWriteStream(localPath)
    );
  }

  return {
    success: true,
    message: `Downloaded ${allKeys.length} files from '${prefix}' to /tmp`,
  };
}
