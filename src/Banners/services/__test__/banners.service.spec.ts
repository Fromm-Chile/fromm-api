import { Test, TestingModule } from '@nestjs/testing';
import { BannersService } from '../banners.service';
import { BannerRepository } from '../../repositories/banners.repository';
import { CreateBannerDto } from '../../controllers/dto/create-banner.dto';
import { Banner } from '@prisma/client';

const mockBannerRepository = {
  createBanner: jest.fn(),
  findAllBanners: jest.fn(),
  findAllActiveBanners: jest.fn(),
  findBannerById: jest.fn(),
  updateBannerOrder: jest.fn(),
  removeBanner: jest.fn(),
  activateBanner: jest.fn(),
};

describe('BannersService', () => {
  let service: BannersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BannersService,
        {
          provide: BannerRepository,
          useValue: mockBannerRepository,
        },
      ],
    }).compile();

    service = module.get<BannersService>(BannersService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createBanner', () => {
    it('should create and return a banner', async () => {
      const dto: CreateBannerDto = {
        name: 'Test Banner',
        url: 'http://example.com',
        order: 1,
        countryId: 1,
      };
      const expectedBanner: Banner = {
        id: 1,
        name: 'Test Banner',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        ...dto,
      };

      mockBannerRepository.createBanner.mockResolvedValue(expectedBanner);

      const result = await service.createBanner(dto);
      expect(result).toEqual(expectedBanner);
      expect(mockBannerRepository.createBanner).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAllBanners', () => {
    it('should return all banners for a country', async () => {
      const countryId = 1;
      const expectedBanners: Banner[] = [
        {
          id: 1,
          name: 'Banner 1',
          url: 'http://example1.com',
          order: 1,
          countryId: 1,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          name: 'Banner 2',
          url: 'http://example2.com',
          order: 2,
          countryId: 1,
          isActive: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockBannerRepository.findAllBanners.mockResolvedValue(expectedBanners);

      const result = await service.findAllBanners(countryId);
      expect(result).toEqual(expectedBanners);
      expect(mockBannerRepository.findAllBanners).toHaveBeenCalledWith(
        countryId,
      );
    });
  });

  describe('findAllActiveBanners', () => {
    it('should return only active banners for a country', async () => {
      const countryId = 1;
      const expectedBanners: Banner[] = [
        {
          id: 1,
          name: 'Active Banner',
          url: 'http://example1.com',
          order: 1,
          countryId: 1,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockBannerRepository.findAllActiveBanners.mockResolvedValue(
        expectedBanners,
      );

      const result = await service.findAllActiveBanners(countryId);
      expect(result).toEqual(expectedBanners);
      expect(mockBannerRepository.findAllActiveBanners).toHaveBeenCalledWith(
        countryId,
      );
    });
  });

  describe('findBannerById', () => {
    it('should return a banner by id', async () => {
      const bannerId = 1;
      const expectedBanner: Banner = {
        id: 1,
        name: 'Test Banner',
        url: 'http://example.com',
        order: 1,
        countryId: 1,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockBannerRepository.findBannerById.mockResolvedValue(expectedBanner);

      const result = await service.findBannerById(bannerId);
      expect(result).toEqual(expectedBanner);
      expect(mockBannerRepository.findBannerById).toHaveBeenCalledWith(
        bannerId,
      );
    });
  });

  describe('updateBannerOrder', () => {
    it('should update banner order', async () => {
      const bannerId = 1;
      const newOrder = 5;

      mockBannerRepository.updateBannerOrder.mockResolvedValue(undefined);

      await service.updateBannerOrder(bannerId, newOrder);
      expect(mockBannerRepository.updateBannerOrder).toHaveBeenCalledWith(
        bannerId,
        newOrder,
      );
    });
  });

  describe('removeBanner', () => {
    it('should remove a banner', async () => {
      const bannerId = 1;

      mockBannerRepository.removeBanner.mockResolvedValue(undefined);

      await service.removeBanner(bannerId);
      expect(mockBannerRepository.removeBanner).toHaveBeenCalledWith(bannerId);
    });
  });

  describe('activateBanner', () => {
    it('should activate a banner', async () => {
      const bannerId = 1;

      mockBannerRepository.activateBanner.mockResolvedValue(undefined);

      await service.activateBanner(bannerId);
      expect(mockBannerRepository.activateBanner).toHaveBeenCalledWith(
        bannerId,
      );
    });
  });
});
