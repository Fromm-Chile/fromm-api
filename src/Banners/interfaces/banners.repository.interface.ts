import { Banner } from '@prisma/client';
import { CreateBannerDto } from '../dto/create-banner.dto';

export interface IBannersRepository {
  createBanner(data: CreateBannerDto): Promise<Banner>;
  findAllBanners(countryId: number): Promise<Banner[]>;
  findAllActiveBanners(countryId: number): Promise<Banner[]>;
  findBannerById(id: number): Promise<Banner>;
  updateBannerOrder(id: number, order: number): Promise<void>;
  removeBanner(id: number): Promise<void>;
  activateBanner(id: number): Promise<void>;
}
