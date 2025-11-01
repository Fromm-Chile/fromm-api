import { Controller, Get, UseGuards } from '@nestjs/common';
import { BannersService } from '../services/banners.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { Public } from 'src/auth/decorators/public.decorator';
import { Banner } from '@prisma/client';

@UseGuards(AuthGuard)
@Controller('banners')
export class BannersController {
  constructor(private readonly bannersService: BannersService) {}

  @Public()
  @Get('active')
  getAllActiveBanners(): Promise<Banner[]> {
    return this.bannersService.findAllActiveBanners(1);
  }
}
