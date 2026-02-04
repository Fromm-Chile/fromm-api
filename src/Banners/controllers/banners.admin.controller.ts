import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { BannersService } from '../services/banners.service';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Banner } from '@prisma/client';

@UseGuards(AuthGuard)
@Controller('admin/banners')
export class BannersAdminController {
  constructor(private readonly bannersService: BannersService) {}

  @Roles('AdminChile', 'AdminPeru')
  @Get()
  getAllBanners(@Query('countryId') countryId: number): Promise<Banner[]> {
    return this.bannersService.findAllBanners(+countryId);
  }

  @Roles('AdminChile', 'AdminPeru')
  @Get(':id')
  getBannerById(@Param('id') id: number): Promise<Banner> {
    return this.bannersService.findBannerById(+id);
  }

  @Roles('AdminChile', 'AdminPeru')
  @Put('order')
  async updateBannerOrder(
    @Body('id') id: number,
    @Body('order') order: number,
  ): Promise<{ message: string }> {
    await this.bannersService.updateBannerOrder(+id, +order);
    return { message: 'Banner order updated successfully' };
  }

  @Roles('AdminChile', 'AdminPeru')
  @Put('remove')
  async removeBanner(@Body('id') id: number): Promise<{ message: string }> {
    await this.bannersService.removeBanner(+id);
    return { message: 'Banner removed successfully' };
  }

  @Roles('AdminChile', 'AdminPeru')
  @Put('activate')
  async activateBanner(@Body('id') id: number): Promise<{ message: string }> {
    await this.bannersService.activateBanner(+id);
    return { message: 'Banner activated successfully' };
  }
}
