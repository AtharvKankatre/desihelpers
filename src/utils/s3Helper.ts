import { S3 } from 'aws-sdk';

export const getWorkPhotoUrls = (bucketName: string, workPhotos: string[]): string[] => {
  const s3 = new S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.NEXT_PUBLIC_AWS_REGION, 
    signatureVersion: 'v4',
  });

  return workPhotos.map((photoKey) => {
    // Remove any protocol part from the photoKey if present
    const cleanKey = photoKey.replace(/^https?:\/\/[^\/]+\//, '');

    // Generate pre-signed URL
    return s3.getSignedUrl('getObject', {
      Bucket: bucketName,
      Key: cleanKey,
      Expires: 60, // URL expiry time in seconds
    });
  });
};
