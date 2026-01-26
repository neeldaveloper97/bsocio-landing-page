export class ImageEntity {
  id?: string;
  key: string;
  url: string;
  mimetype?: string;
  originalname?: string;
  createdAt?: Date;
}

export type ImageDTO = Omit<ImageEntity, 'id' | 'createdAt'>;
