import { Test, TestingModule } from '@nestjs/testing';
import { BannerRepository } from '../banners.repository';
import { PrismaService } from 'prisma/prisma.service';

describe('BannersRepository', () => {
  let repository: BannerRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BannerRepository, PrismaService],
    }).compile();

    repository = module.get<BannerRepository>(BannerRepository);
  });
  jest.clearAllMocks();

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('createBanner', () => {
    it('should create a banner', async () => {
      const dto = {
        name: 'Test Banner',
        url: 'http://example.com',
        order: 1,
        countryId: 1,
      };
      const result = await repository.createBanner(dto);
      expect(result).toEqual(expect.objectContaining(dto));
    });
  });

  describe('findAllBanners', () => {
    it('should return all banners for a country', async () => {
      const countryId = 1;
      const result = await repository.findAllBanners(countryId);
      expect(Array.isArray(result)).toBe(true);
      result.forEach((banner) => {
        expect(banner.countryId).toBe(countryId);
      });
    });
  });

  describe('findAllActiveBanners', () => {
    it('should return all active banners for a country', async () => {
      const countryId = 1;
      const result = await repository.findAllActiveBanners(countryId);
      expect(Array.isArray(result)).toBe(true);
      result.forEach((banner) => {
        expect(banner.countryId).toBe(countryId);
        expect(banner.isActive).toBe(true);
      });
    });
  });

  describe('findBannerById', () => {
    it('should return a banner by id', async () => {
      const dto = {
        name: 'Test Banner',
        url: 'http://example.com',
        order: 1,
        countryId: 1,
      };
      const createdBanner = await repository.createBanner(dto);
      const result = await repository.findBannerById(createdBanner.id);
      expect(result).toEqual(createdBanner);
    });
  });

  describe('updateBannerOrder', () => {
    it('should update the order of a banner', async () => {
      const dto = {
        name: 'Test Banner',
        url: 'http://example.com',
        order: 1,
        countryId: 1,
      };
      const createdBanner = await repository.createBanner(dto);
      const newOrder = 5;
      await repository.updateBannerOrder(createdBanner.id, newOrder);
      const updatedBanner = await repository.findBannerById(createdBanner.id);
      expect(updatedBanner.order).toBe(newOrder);
    });
  });

  describe('removeBanner', () => {
    it('should deactivate a banner', async () => {
      const dto = {
        name: 'Test Banner',
        url: 'http://example.com',
        order: 1,
        countryId: 1,
      };
      const createdBanner = await repository.createBanner(dto);
      await repository.removeBanner(createdBanner.id);
      const updatedBanner = await repository.findBannerById(createdBanner.id);
      expect(updatedBanner.isActive).toBe(false);
    });
  });

  describe('activateBanner', () => {
    it('should activate a banner', async () => {
      const dto = {
        name: 'Test Banner',
        url: 'http://example.com',
        order: 1,
        countryId: 1,
      };
      const createdBanner = await repository.createBanner(dto);
      await repository.removeBanner(createdBanner.id);
      await repository.activateBanner(createdBanner.id);
      const updatedBanner = await repository.findBannerById(createdBanner.id);
      expect(updatedBanner.isActive).toBe(true);
    });
  });
});
