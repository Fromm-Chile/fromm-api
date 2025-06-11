import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class FileSizeValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    const maxSize = 4 * 1024 * 1024;
    if (value && value.size > maxSize) {
      throw new BadRequestException(
        `File size should not exceed ${maxSize / (1024 * 1024)} MB`,
      );
    }
    return value;
  }
}
