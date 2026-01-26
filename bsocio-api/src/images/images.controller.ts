import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Body,
  Get,
  Query,
  Res,
  Delete,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { Response } from 'express';
import type { Multer } from 'multer';
import { ImagesService } from './images.service';
import {
  ApiTags,
  ApiOperation,
  ApiConsumes,
  ApiBody,
  ApiResponse,
  ApiBadRequestResponse,
  ApiOkResponse,
} from '@nestjs/swagger';

@ApiTags('Images')
@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Post()
  @ApiOperation({ summary: 'Upload an image to S3' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
        userId: { type: 'string' },
        agent: { type: 'string' },
        sessionId: { type: 'string' },
      },
      required: ['file'],
    },
  })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'File uploaded' })
  @ApiBadRequestResponse({ description: 'No file uploaded or invalid request' })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    }),
  )
  async upload(
    @UploadedFile() file: Multer.File,
    @Body() body: { userId?: string; agent?: string; sessionId?: string },
  ) {
    if (!file || !file.buffer) {
      return {
        success: false,
        status: HttpStatus.BAD_REQUEST,
        message: 'No file uploaded',
      };
    }

    const result = await this.imagesService.uploadImage({
      originalname: file.originalname,
      buffer: file.buffer,
      mimetype: file.mimetype,
      userId: body?.userId,
      agent: body?.agent,
      sessionId: body?.sessionId,
    });

    return result;
  }

  @Get('signed-url')
  @ApiOperation({ summary: 'Get a presigned GET URL for an S3 object' })
  @ApiOkResponse({ description: 'Signed URL returned' })
  @ApiBadRequestResponse({ description: 'Missing key query param' })
  async signedUrl(@Query('key') key: string) {
    if (!key) {
      return {
        success: false,
        status: HttpStatus.BAD_REQUEST,
        message: 'key query param required',
      };
    }

    const url = await this.imagesService.getSignedUrl(key);
    return { success: true, status: HttpStatus.OK, data: { url } };
  }

  @Get('raw')
  @ApiOperation({ summary: 'Return raw image bytes from S3' })
  @ApiBadRequestResponse({ description: 'Missing key query param' })
  async raw(@Query('key') key: string, @Res() res: Response) {
    if (!key) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: 'key required' });
    }

    const buffer = await this.imagesService.getBuffer(key);
    // best-effort: let client infer content-type
    res.setHeader('Content-Disposition', 'inline');
    return res.status(HttpStatus.OK).send(buffer);
  }

  @Delete()
  @ApiOperation({ summary: 'Delete an image from S3 by key' })
  @ApiOkResponse({ description: 'Image deleted' })
  @ApiBadRequestResponse({ description: 'Missing key query param' })
  async remove(@Query('key') key: string) {
    if (!key) {
      return {
        success: false,
        status: HttpStatus.BAD_REQUEST,
        message: 'key required',
      };
    }

    const result = await this.imagesService.deleteImage(key);
    return result;
  }
}
