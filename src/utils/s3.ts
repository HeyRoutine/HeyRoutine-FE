import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// S3 클라이언트 생성
const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'ap-northeast-2',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

// Presigned URL 생성 함수
export const createPresignedUrl = async (
  email: string,
  fileName: string,
  fileType: string,
): Promise<{ presignedUrl: string; fileUrl: string }> => {
  const key = `images/${email}/${fileName}`;
  const bucketName = process.env.AWS_S3_BUCKET || 'heyroutine-bucket';

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    ContentType: fileType,
  });

  const presignedUrl = await getSignedUrl(s3Client, command, {
    expiresIn: 3600,
  });
  const fileUrl = `https://${bucketName}.s3.ap-northeast-2.amazonaws.com/${key}`;

  return { presignedUrl, fileUrl };
};

// 이미지 업로드 함수
export const uploadImage = async (
  email: string,
  imageUri: string,
  fileName: string,
  fileType: string = 'image/jpeg',
): Promise<string> => {
  try {
    // 1. Presigned URL 생성
    const { presignedUrl, fileUrl } = await createPresignedUrl(
      email,
      fileName,
      fileType,
    );

    // 2. S3에 직접 업로드
    const uploadResponse = await fetch(presignedUrl, {
      method: 'PUT',
      body: await fetch(imageUri).then((res) => res.blob()),
      headers: { 'Content-Type': fileType },
    });

    if (!uploadResponse.ok) {
      throw new Error('이미지 업로드에 실패했습니다.');
    }

    return fileUrl;
  } catch (error) {
    console.error('S3 업로드 에러:', error);
    throw error;
  }
};

