import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { BannersService } from '../services/banners.service';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Public } from 'src/auth/decorators/public.decorator';

@UseGuards(AuthGuard)
@Controller('admin/banners')
export class BannersAdminController {
  constructor(private readonly bannersService: BannersService) {}

  @Roles('AdminChile')
  @Get()
  async getAllBanners() {
    return await this.bannersService.findAllBanners();
  }

  @Roles('AdminChile')
  @Get(':id')
  async getBannerById(@Param('id') id: number) {
    return await this.bannersService.findBannerById(+id);
  }

  @Roles('AdminChile')
  @Put('order')
  async updateBannerOrder(
    @Body('id') id: number,
    @Body('order') order: number,
  ) {
    await this.bannersService.updateBannerOrder(+id, +order);
    return { message: 'Banner order updated successfully' };
  }

  @Roles('AdminChile')
  @Put('remove')
  async removeBanner(@Body('id') id: number) {
    await this.bannersService.removeBanner(+id);
    return { message: 'Banner removed successfully' };
  }

  @Roles('AdminChile')
  @Put('activate')
  async activateBanner(@Body('id') id: number) {
    await this.bannersService.activateBanner(+id);
    return { message: 'Banner activated successfully' };
  }
}
