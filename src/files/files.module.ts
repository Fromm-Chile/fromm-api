import { Module } from '@nestjs/common';
import { FilesService } from './services/files.service';
import { ConfigModule } from '@nestjs/config';
import { BannersModule } from 'src/Banners/banners.module';
import { AuthModule } from 'src/auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { FilesController } from './controllers/files.controller';

@Module({
  imports: [ConfigModule, BannersModule, AuthModule],
  controllers: [FilesController],
  providers: [
    FilesService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
  exports: [FilesService],
})
export class FilesModule {}
