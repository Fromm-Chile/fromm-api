import { Test, TestingModule } from '@nestjs/testing';
import { BannersAdminController } from '../banners.admin.controller';
import { BannersService } from '../../services/banners.service';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../../../../prisma/prisma.service';
import { Banner } from '@prisma/client';
import config from '../../../../config/config';

const mockBannersService = {
  findAllBanners: jest.fn(),
  findBannerById: jest.fn(),
  updateBannerOrder: jest.fn(),
  removeBanner: jest.fn(),
  activateBanner: jest.fn(),
};

const mockConfigService = {
  jwtSecret: 'test-secret',
  KEY: 'test-key',
};

const expectedBanners: Banner[] = [
  {
    id: 1,
    name: 'Test Banner',
    url: 'http://example.com',
    order: 1,
    countryId: 1,
    isActive: true,
    createdAt: new Date('2023-01-01T00:00:00.000Z'),
    updatedAt: new Date('2023-01-01T00:00:00.000Z'),
  },
];

describe('BannersAdminController', () => {
  let controller: BannersAdminController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BannersAdminController],
      providers: [
        JwtService,
        Reflector,
        PrismaService,
        {
          provide: BannersService,
          useValue: mockBannersService,
        },
        {
          provide: config.KEY,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    controller = module.get<BannersAdminController>(BannersAdminController);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAllBanners', () => {
    it('should return all banners for a country', async () => {
      const countryId = 1;

      mockBannersService.findAllBanners.mockResolvedValue(expectedBanners);

      const result = await controller.getAllBanners(countryId);

      expect(result).toEqual(expectedBanners);
      expect(mockBannersService.findAllBanners).toHaveBeenCalledWith(countryId);
    });
  });

  describe('getBannerById', () => {
    it('should return a banner by id', async () => {
      const bannerId = 1;

      mockBannersService.findBannerById.mockResolvedValue(expectedBanners[0]);

      const result = await controller.getBannerById(bannerId);

      expect(result).toEqual(expectedBanners[0]);
      expect(mockBannersService.findBannerById).toHaveBeenCalledWith(bannerId);
    });
  });

  describe('updateBannerOrder', () => {
    it('should call updateBannerOrder on the BannersService and return success message', async () => {
      const id = 1;
      const order = 2;

      mockBannersService.updateBannerOrder.mockResolvedValue(undefined);

      const result = await controller.updateBannerOrder(id, order);

      expect(mockBannersService.updateBannerOrder).toHaveBeenCalledWith(
        id,
        order,
      );
      expect(result).toEqual({ message: 'Banner order updated successfully' });
    });
  });

  describe('removeBanner', () => {
    it('should call removeBanner on the BannersService and return success message', async () => {
      const id = 1;

      mockBannersService.removeBanner.mockResolvedValue(undefined);

      const result = await controller.removeBanner(id);

      expect(mockBannersService.removeBanner).toHaveBeenCalledWith(id);
      expect(result).toEqual({ message: 'Banner removed successfully' });
    });
  });

  describe('activateBanner', () => {
    it('should call activateBanner on the BannersService and return success message', async () => {
      const id = 1;

      mockBannersService.activateBanner.mockResolvedValue(undefined);

      const result = await controller.activateBanner(id);

      expect(mockBannersService.activateBanner).toHaveBeenCalledWith(id);
      expect(result).toEqual({ message: 'Banner activated successfully' });
    });
  });
});
