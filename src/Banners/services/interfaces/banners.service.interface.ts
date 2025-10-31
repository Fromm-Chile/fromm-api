import { CreateBannerDto } from 'src/Banners/controllers/dto/create-banner.dto';

export interface IBannersService {
  createBanner(data: CreateBannerDto): Promise<any>;
  findAllBanners(countryId: number): Promise<any[]>;
  findAllActiveBanners(countryId: number): Promise<any[]>;
  findBannerById(id: number): Promise<any>;
  updateBannerOrder(id: number, order: number): Promise<void>;
  removeBanner(id: number): Promise<void>;
  activateBanner(id: number): Promise<void>;
}
