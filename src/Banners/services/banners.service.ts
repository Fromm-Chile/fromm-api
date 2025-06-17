import { Injectable } from '@nestjs/common';
import { CreateBannerDto } from '../controllers/dto/create-banner.dto';
import { BannerRepository } from '../repositories/banners.repository';
import { Banner } from '@prisma/client';

@Injectable()
export class BannersService {
  constructor(private readonly bannerRepository: BannerRepository) {}

  async createBanner(data: CreateBannerDto): Promise<Banner> {
    return await this.bannerRepository.createBanner(data);
  }

  async findAllBanners(): Promise<Banner[]> {
    return await this.bannerRepository.findAllBanners();
  }

  async findAllActiveBanners(): Promise<Banner[]> {
    return await this.bannerRepository.findAllActiveBanners();
  }

  async findBannerById(id: number): Promise<Banner> {
    return await this.bannerRepository.findBannerById(id);
  }

  async updateBannerOrder(id: number, order: number): Promise<void> {
    await this.bannerRepository.updateBannerOrder(id, order);
  }

  async removeBanner(id: number): Promise<void> {
    await this.bannerRepository.removeBanner(id);
  }

  async activateBanner(id: number): Promise<void> {
    await this.bannerRepository.activateBanner(id);
  }
}
