import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3Client = new S3Client({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
  region: process.env.NEXT_PUBLIC_AWS_REGION,
});

export const getWorkPhotoUrls = async (bucketName: string, workPhotos: string[]): Promise<string[]> => {
  const urls = await Promise.all(
    workPhotos.map(async (photoKey) => {
      // Remove any protocol part from the photoKey if present
      const cleanKey = photoKey.replace(/^https?:\/\/[^\/]+\//, '');

      const command = new GetObjectCommand({
        Bucket: bucketName,
        Key: cleanKey,
      });

      // Generate pre-signed URL (expires in 60 seconds)
      return await getSignedUrl(s3Client, command, { expiresIn: 60 });
    })
  );

  return urls;
};

