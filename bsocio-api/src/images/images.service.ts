import { Injectable } from '@nestjs/common';
import { S3Service } from 'src/s3/s3.service';

@Injectable()
export class ImagesService {
  constructor(private readonly s3Service: S3Service) {}

  async uploadImage(payload: {
    originalname: string;
    buffer: Buffer;
    mimetype: string;
    userId?: string;
    agent?: string;
    sessionId?: string;
  }) {
    return this.s3Service.uploadImage(payload as any);
  }

  async getSignedUrl(key: string) {
    return this.s3Service.getSignedUrl(key);
  }

  async getBuffer(key: string) {
    return this.s3Service.getBuffer(key);
  }

  async deleteImage(key: string) {
    return this.s3Service.deleteImage(key);
  }
}
