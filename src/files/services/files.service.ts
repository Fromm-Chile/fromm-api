import { Express } from 'express';
import 'multer';
import { ConfigService } from '@nestjs/config';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Injectable, UploadedFile } from '@nestjs/common';
import { BannersService } from 'src/Banners/services/banners.service';

@Injectable()
export class FilesService {
  private s3Client: S3Client;

  constructor(
    private readonly configService: ConfigService,
    private readonly bannersService: BannersService,
  ) {
    this.s3Client = new S3Client({
      endpoint: this.configService.get<string>('R2_ENDPOINT'),
      region: 'auto',
      credentials: {
        accessKeyId: this.configService.get<string>('R2_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get<string>('R2_SECRET_ACCESS_KEY'),
      },
      forcePathStyle: true,
    });
  }

  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    InvoiceId: number,
  ) {
    if (!file) {
      throw new Error('File is missing');
    }

    const key = `${InvoiceId}-${file.originalname}`;
    const publicBucketUrl = this.configService.get<string>(
      'R2_PUBLIC_BUCKET_URL',
    );

    try {
      const command = new PutObjectCommand({
        Bucket: this.configService.get<string>('R2_BUCKET_NAME'),
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      });

      await this.s3Client.send(command);

      const url = `${publicBucketUrl}/${key}`;

      return {
        message: 'File uploaded successfully',
        key: key,
        url: url,
      };
    } catch (error) {
      console.error('Error uploading file:', error);
      throw new Error('Failed to upload file');
    }
  }

  async uploadImage(@UploadedFile() file: Express.Multer.File, order: number) {
    if (!file) {
      throw new Error('File is missing');
    }

    const key = file.originalname;
    const publicBucketUrl = this.configService.get<string>(
      'R2_PUBLIC_BUCKET_URL',
    );

    try {
      const command = new PutObjectCommand({
        Bucket: this.configService.get<string>('R2_BUCKET_NAME'),
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      });

      await this.s3Client.send(command);

      const url = `${publicBucketUrl}/${key}`;

      const uploadedImage = {
        message: 'File uploaded successfully',
        key: key,
        url: url,
      };

      await this.bannersService.createBanner({
        name: file.originalname,
        url,
        order: order,
      });

      return uploadedImage;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw new Error('Failed to upload file');
    }
  }
}
