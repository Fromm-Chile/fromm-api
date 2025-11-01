import { Banner } from '@prisma/client';
import { CreateBannerDto } from 'src/Banners/dto/create-banner.dto';

export interface IBannersService {
  createBanner(data: CreateBannerDto): Promise<Banner>;
  findAllBanners(countryId: number): Promise<Banner[]>;
  findAllActiveBanners(countryId: number): Promise<Banner[]>;
  findBannerById(id: number): Promise<Banner>;
  updateBannerOrder(id: number, order: number): Promise<void>;
  removeBanner(id: number): Promise<void>;
  activateBanner(id: number): Promise<void>;
}
