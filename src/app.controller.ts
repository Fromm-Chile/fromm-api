// import {
//   Controller,
//   Post,
//   UploadedFile,
//   UseGuards,
//   UseInterceptors,
// } from '@nestjs/common';
// import { FileInterceptor } from '@nestjs/platform-express';
// import { AuthGuard } from './auth/guards/auth.guard';
// import { Public } from './auth/decorators/public.decorator';
// import { ConfigService } from '@nestjs/config';
// import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

// @UseGuards(AuthGuard)
// @Controller()
// export class AppController {
//   private s3Client: S3Client;
//   constructor(private readonly configService: ConfigService) {
//     this.s3Client = new S3Client({
//       endpoint: this.configService.get<string>('R2_ENDPOINT'),
//       region: 'auto',
//       credentials: {
//         accessKeyId: this.configService.get<string>('R2_ACCESS_KEY_ID'),
//         secretAccessKey: this.configService.get<string>('R2_SECRET_ACCESS_KEY'),
//       },
//       forcePathStyle: true,
//     });
//   }

//   @Public()
//   @Post('upload')
//   @UseInterceptors(FileInterceptor('file'))
//   async uploadFile(@UploadedFile() file: Express.Multer.File) {
//     if (!file) {
//       throw new Error('File is missing');
//     }

//     const key = `${file.originalname}`;

//     try {
//       const command = new PutObjectCommand({
//         Bucket: this.configService.get<string>('R2_BUCKET_NAME'),
//         Key: key,
//         Body: file.buffer,
//         ContentType: file.mimetype,
//       });

//       const result = await this.s3Client.send(command);

//       //   console.log('File uploaded successfully:', result);
//       return {
//         message: 'File uploaded successfully',
//         key: key,
//       };
//     } catch (error) {
//       console.error('Error uploading file:', error);
//       throw new Error('Failed to upload file');
//     }
//   }
// }
