import { Injectable } from '@nestjs/common';
import { CreateBannerDto } from '../dto/create-banner.dto';
import { BannerRepository } from '../repositories/banners.repository';
import { Banner } from '@prisma/client';
import { IBannersService } from '../interfaces/banners.service.interface';

@Injectable()
export class BannersService implements IBannersService {
  constructor(private readonly bannerRepository: BannerRepository) {}

  createBanner(data: CreateBannerDto): Promise<Banner> {
    return this.bannerRepository.createBanner(data);
  }

  findAllBanners(countryId: number): Promise<Banner[]> {
    return this.bannerRepository.findAllBanners(countryId);
  }

  findAllActiveBanners(countryId: number): Promise<Banner[]> {
    return this.bannerRepository.findAllActiveBanners(countryId);
  }

  findBannerById(id: number): Promise<Banner> {
    return this.bannerRepository.findBannerById(id);
  }

  updateBannerOrder(id: number, order: number): Promise<void> {
    return this.bannerRepository.updateBannerOrder(id, order);
  }

  async removeBanner(id: number): Promise<void> {
    await this.bannerRepository.removeBanner(id);
  }

  async activateBanner(id: number): Promise<void> {
    await this.bannerRepository.activateBanner(id);
  }
}
