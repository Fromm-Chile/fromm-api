import { Module } from '@nestjs/common';
import { BannersAdminController } from './controllers/banners.admin.controller';
import { BannersService } from './services/banners.service';
import { BannerRepository } from './repositories/banners.repository';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { AuthModule } from 'src/auth/auth.module';
import { BannersController } from './controllers/banners.controller';

@Module({
  imports: [AuthModule],
  controllers: [BannersAdminController, BannersController],
  providers: [
    BannersService,
    BannerRepository,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
  exports: [BannersService],
})
export class BannersModule {}
