import { Controller, Get, UseGuards } from '@nestjs/common';
import { BannersService } from '../services/banners.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { Public } from 'src/auth/decorators/public.decorator';
import { Banner } from '@prisma/client';
import { Country } from 'src/assets/enums';

@UseGuards(AuthGuard)
@Controller('pe/banners')
export class BannersControllerPeru {
  constructor(private readonly bannersService: BannersService) {}

  @Public()
  @Get('active')
  getAllActiveBanners(): Promise<Banner[]> {
    return this.bannersService.findAllActiveBanners(Country.PE);
  }
}
