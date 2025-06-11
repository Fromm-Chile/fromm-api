import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class FileTypeValidationPipe implements PipeTransform {
  constructor(private readonly allowedTypes: string[]) {}

  transform(value: Express.Multer.File) {
    if (!value) return value; // Allow empty file if needed

    // Check MIME type
    if (!this.allowedTypes.includes(value.mimetype)) {
      throw new BadRequestException(
        `Formato de archivo no permitido. Tipos permitidos: ${this.allowedTypes.join(', ')}`,
      );
    }
    return value;
  }
}
