import { Test, TestingModule } from '@nestjs/testing';
import { BannersController } from '../banners.controller';
import { BannersService } from '../../services/banners.service';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../../../../prisma/prisma.service';
import { Banner } from '@prisma/client';
import config from '../../../../config/config';

const mockBannersService = {
  findAllActiveBanners: jest.fn(),
  findBannerById: jest.fn(),
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

describe('BannersController', () => {
  let controller: BannersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BannersController],
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

    controller = module.get<BannersController>(BannersController);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAllActiveBanners', () => {
    it('should return an array of active banners', async () => {
      mockBannersService.findAllActiveBanners.mockResolvedValue(
        expectedBanners,
      );

      const result = await controller.getAllActiveBanners();
      expect(result).toEqual(expectedBanners);
      expect(mockBannersService.findAllActiveBanners).toHaveBeenCalled();
    });
  });
});
