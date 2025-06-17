import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Body,
  UseGuards,
} from '@nestjs/common';
import { FilesService } from '../services/files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { Public } from 'src/auth/decorators/public.decorator';
import { FileSizeValidationPipe } from '../pipes/fileSizeValidationPipe';
import { FileTypeValidationPipe } from '../pipes/fileTypeValidationPipe';

@UseGuards(AuthGuard)
@Controller('files')
export class FilesController {
  constructor(private filesService: FilesService) {}

  @Public()
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadBannerImage(
    @UploadedFile(
      new FileSizeValidationPipe(),
      new FileTypeValidationPipe(['image/jpeg', 'image/png', 'image/jpg']),
    )
    file: Express.Multer.File,
    @Body('order') order: number,
  ) {
    await this.filesService.uploadImage(file, +order);
  }
}
