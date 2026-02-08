import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateBannerDto } from '../dto/create-banner.dto';
import { Banner } from '@prisma/client';
import { IBannersRepository } from '../interfaces/banners.repository.interface';

@Injectable()
export class BannerRepository implements IBannersRepository {
  constructor(private readonly prisma: PrismaService) {}

  createBanner(data: CreateBannerDto): Promise<Banner> {
    return this.prisma.banner.create({
      data,
    });
  }

  findAllBanners(countryId: number): Promise<Banner[]> {
    return this.prisma.banner.findMany({
      where: { countryId },
      orderBy: [{ isActive: 'desc' }, { order: 'asc' }],
    });
  }

  findAllActiveBanners(countryId: number): Promise<Banner[]> {
    return this.prisma.banner.findMany({
      where: { isActive: true, countryId },
      orderBy: {
        order: 'asc',
      },
    });
  }

  findBannerById(id: number): Promise<Banner> {
    return this.prisma.banner.findUnique({
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
