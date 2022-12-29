import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { S3 } from 'aws-sdk';

@Injectable()
export class FilesService {
  async uploadFile(
    file: Express.Multer.File,
    url: string,
  ): Promise<{ key: string }> {
    try {
      const s3 = new S3({
        sslEnabled: true,
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      });
      const key = randomUUID();

      const uploadResult = await s3
        .upload({
          Bucket: process.env.AWS_PUBLIC_BUCKET_NAME,
          Body: file.buffer,
          Key: `${url}/${key}-${file.originalname}`,
          ContentType: 'image/jpeg',
        })
        .promise();

      return {
        key: uploadResult.Key,
      };
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async deleteFile(key: string): Promise<boolean> {
    try {
      if (
        key ===
        ('default-background.jpg' || 'default-info.jpg' || 'default-logo.jpg')
      ) {
        return true;
      }
      const s3 = new S3({
        sslEnabled: true,
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      });
      s3.deleteObject(
        {
          Bucket: process.env.AWS_PUBLIC_BUCKET_NAME,
          Key: key,
        },
        (err) => {
          if (err) {
            throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
          }
        },
      );
      return true;
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
