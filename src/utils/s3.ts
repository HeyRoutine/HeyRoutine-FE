import AWS from 'aws-sdk';
import {
  AWS_REGION,
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  AWS_S3_BUCKET,
} from '@env';

// AWS 설정
AWS.config.update({
  region: AWS_REGION || 'ap-northeast-2',
  accessKeyId: AWS_ACCESS_KEY_ID || '',
  secretAccessKey: AWS_SECRET_ACCESS_KEY || '',
});

const s3 = new AWS.S3();
const bucketName = AWS_S3_BUCKET || 'heyroutine-bucket';

// Presigned URL 생성 함수
export const createPresignedUrl = async (
  email: string,
  fileName: string,
  fileType: string,
): Promise<{ presignedUrl: string; fileUrl: string }> => {
  const key = `images/${email}/${fileName}`;

  const params = {
    Bucket: bucketName,
    Key: key,
    ContentType: fileType,
    Expires: 3600, // 1시간
  };

  const presignedUrl = await s3.getSignedUrlPromise('putObject', params);
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
