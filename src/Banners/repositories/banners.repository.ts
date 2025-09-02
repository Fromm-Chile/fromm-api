import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateBannerDto } from '../controllers/dto/create-banner.dto';
import { Banner } from '@prisma/client';

@Injectable()
export class BannerRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createBanner(data: CreateBannerDto): Promise<Banner> {
    return await this.prisma.banner.create({
      data,
    });
  }

  async findAllBanners(countryId: number): Promise<Banner[]> {
    try {
      return await this.prisma.banner.findMany({
        where: { countryId },
        orderBy: [{ isActive: 'desc' }, { order: 'asc' }],
      });
    } catch (error) {
      throw new Error(`Error fetching banners: ${error.message}`);
    }
  }

  async findAllActiveBanners(countryId: number): Promise<Banner[]> {
    return await this.prisma.banner.findMany({
      where: { isActive: true, countryId },
      orderBy: {
        order: 'asc',
      },
    });
  }

  async findBannerById(id: number): Promise<Banner> {
    return await this.prisma.banner.findUnique({
      where: { id },
    });
  }

  async updateBannerOrder(id: number, order: number): Promise<void> {
    await this.prisma.banner.update({
      where: { id },
      data: { order, updatedAt: new Date() },
    });
  }
  async removeBanner(id: number): Promise<void> {
    await this.prisma.banner.update({
      where: { id },
      data: { isActive: false, updatedAt: new Date() },
    });
  }

  async activateBanner(id: number): Promise<void> {
    await this.prisma.banner.update({
      where: { id },
      data: { isActive: true, updatedAt: new Date() },
    });
  }
}
