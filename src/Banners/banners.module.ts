import { Module } from '@nestjs/common';
import { BannersController } from './controllers/banners.controller';
import { BannersService } from './services/banners.service';
import { BannerRepository } from './repositories/banners.repository';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [BannersController],
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
