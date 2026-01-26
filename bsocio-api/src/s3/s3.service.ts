import { Injectable } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  HeadObjectCommand,
} from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import {
  GetObjectCommand,
  DeleteObjectCommand,
  ListObjectVersionsCommand,
  DeleteObjectsCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class S3Service {
  private readonly s3: S3Client;
  private readonly bucket: string;
  private readonly region: string;

  constructor(private readonly configService: ConfigService) {
    this.bucket = this.configService.getOrThrow<string>('AWS_BUCKET');
    this.region = this.configService.getOrThrow<string>('AWS_REGION');
    const accessKeyId =
      this.configService.getOrThrow<string>('AWS_ACCESS_KEY_ID');
    const secretAccessKey = this.configService.getOrThrow<string>(
      'AWS_SECRET_ACCESS_KEY',
    );

    this.s3 = new S3Client({
      region: this.region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
  }

  async uploadImage(file: {
    originalname: string;
    buffer: Buffer;
    mimetype: string;
    userId: string;
    agent: string;
    sessionId: string;
  }): Promise<{
    message: string;
    success: boolean;
    status: number;
    data: {
      key: string;
      url: string;
      mimetype: string;
      originalname: string;
    };
  }> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const datePart = new Date()
      .toLocaleDateString('en-GB')
      .split('/')
      .reverse()
      .join('-'); // dd-mm-yyyy
    const safeFileName = `${file.originalname.split('.')[0]}-${timestamp}`;
    const extension = file.originalname.split('.').pop();

    const key = `uploads/agent/${file?.agent || 'medoptimize'}/users/${datePart}/${file.userId || randomUUID()}/${file.sessionId || randomUUID()}/${safeFileName}.${extension}`;

    const result = await this.s3.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      }),
    );

    const url = `https://${this.bucket}.s3.${this.region}.amazonaws.com/${key}`;

    return {
      message: 'File uploaded successfully',
      success: true,
      status: 201,
      data: {
        key,
        url,
        mimetype: file.mimetype,
        originalname: file.originalname,
      },
    };
  }

  async getSignedUrl(key: string): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });

    return getSignedUrl(this.s3, command, { expiresIn: 3600 }); // 30 days expiry
  }

  async getBuffer(key: string): Promise<Buffer> {
    const decoded = decodeURIComponent(key);

    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: decoded,
    });

    const response = await this.s3.send(command);

    // AWS SDK v3 streams → convert to buffer
    const body = await response.Body?.transformToByteArray();
    return Buffer.from(body || []);
  }

  async deleteImage(key: string) {
    const decodedKey = decodeURIComponent(key);

    const command = new DeleteObjectCommand({
      Bucket: this.bucket,
      Key: decodedKey,
    });

    const response = await this.s3.send(command);

    if (response.$metadata.httpStatusCode !== 204) {
      throw new Error('Failed to delete image from S3');
    }

    return {
      success: true,
      message: 'Image deleted successfully',
      status: 200,
    };
  }
}
