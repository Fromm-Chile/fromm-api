import { Controller, Get, UseGuards } from '@nestjs/common';
import { BannersService } from '../services/banners.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { Public } from 'src/auth/decorators/public.decorator';

@UseGuards(AuthGuard)
@Controller('pe/banners')
export class BannersControllerPeru {
  constructor(private readonly bannersService: BannersService) {}

  @Public()
  @Get('active')
  async getAllActiveBanners() {
    return await this.bannersService.findAllActiveBanners(2);
  }
}
