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
import { FileSizeValidationPipe } from '../pipes/fileSizeValidationPipe';
import { FileTypeValidationPipe } from '../pipes/fileTypeValidationPipe';
import { Roles } from 'src/auth/decorators/roles.decorator';

@UseGuards(AuthGuard)
@Controller('files')
export class FilesController {
  constructor(private filesService: FilesService) {}

  @Roles('AdminChile', 'AdminPeru')
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadBannerImage(
    @UploadedFile(
      new FileSizeValidationPipe(),
      new FileTypeValidationPipe(['image/jpeg', 'image/png', 'image/jpg']),
    )
    file: Express.Multer.File,
    @Body('order') order: number,
    @Body('countryId') countryId: number,
  ) {
    await this.filesService.uploadImage(file, +order, +countryId);
  }
}
