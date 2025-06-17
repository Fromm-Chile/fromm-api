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

  async findAllBanners(): Promise<Banner[]> {
    return await this.prisma.banner.findMany({
      orderBy: [{ isActive: 'desc' }, { order: 'asc' }],
    });
  }

  async findAllActiveBanners(): Promise<Banner[]> {
    return await this.prisma.banner.findMany({
      where: { isActive: true },
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
