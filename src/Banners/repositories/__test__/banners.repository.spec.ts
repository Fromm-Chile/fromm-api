import { Test, TestingModule } from '@nestjs/testing';
import { BannerRepository } from '../banners.repository';
import { PrismaService } from 'prisma/prisma.service';

const mockPrismaService = {
  banner: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
  },
};

const countryId = 1;

const expectedBanners = [
  {
    id: 1,
    name: 'Test Banner 1',
    url: 'http://example.com/1',
    order: 1,
    countryId: countryId,
    isActive: true,
    createdAt: new Date('2023-01-01T00:00:00.000Z'),
    updatedAt: new Date('2023-01-01T00:00:00.000Z'),
  },
  {
    id: 2,
    name: 'Test Banner 2',
    url: 'http://example.com/2',
    order: 2,
    countryId: countryId,
    isActive: false,
    createdAt: new Date('2023-01-02T00:00:00.000Z'),
    updatedAt: new Date('2023-01-02T00:00:00.000Z'),
  },
];

describe('BannersRepository', () => {
  let repository: BannerRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BannerRepository,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
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
      const createdBanner = {
        id: 1,
        ...dto,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockPrismaService.banner.create.mockResolvedValue(createdBanner);

      const result = await repository.createBanner(dto);

      expect(mockPrismaService.banner.create).toHaveBeenCalledWith({
        data: dto,
      });
      expect(result).toEqual(createdBanner);
    });
  });

  describe('findAllBanners', () => {
    it('should return all banners for a country', async () => {
      mockPrismaService.banner.findMany.mockResolvedValue(expectedBanners);

      const result = await repository.findAllBanners(countryId);
      expect(result).toEqual(expectedBanners);
      expect(mockPrismaService.banner.findMany).toHaveBeenCalledWith({
        where: { countryId },
        orderBy: [{ isActive: 'desc' }, { order: 'asc' }],
      });
    });
  });

  describe('findAllActiveBanners', () => {
    it('should return all active banners for a country', async () => {
      mockPrismaService.banner.findMany.mockResolvedValue(expectedBanners);

      const result = await repository.findAllActiveBanners(countryId);
      expect(result).toEqual(expectedBanners);
      expect(mockPrismaService.banner.findMany).toHaveBeenCalledWith({
        where: { isActive: true, countryId },
        orderBy: {
          order: 'asc',
        },
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
      mockPrismaService.banner.findUnique.mockResolvedValue(expectedBanners[0]);

      const result = await repository.findBannerById(1);
      expect(result).toEqual(expectedBanners[0]);
      expect(mockPrismaService.banner.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
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
      await repository.updateBannerOrder(createdBanner.id, 5);
      expect(mockPrismaService.banner.update).toHaveBeenCalledWith({
        where: { id: createdBanner.id },
        data: { order: 5, updatedAt: expect.any(Date) },
      });
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
      expect(mockPrismaService.banner.update).toHaveBeenCalledWith({
        where: { id: createdBanner.id },
        data: { isActive: false, updatedAt: expect.any(Date) },
      });
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
      await repository.activateBanner(createdBanner.id);
      expect(mockPrismaService.banner.update).toHaveBeenCalledWith({
        where: { id: createdBanner.id },
        data: { isActive: true, updatedAt: expect.any(Date) },
      });
    });
  });
});
