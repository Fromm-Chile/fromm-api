import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesController } from '../categories.controller';
import { CategoriesService } from '../../services/categories.service';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { PrismaService } from 'prisma/prisma.service';
import config from 'config/config';

const mockConfigService = {
  jwtSecret: 'test-secret',
  KEY: 'test-key',
};

const mockCategoriesService = {
  findAll: jest.fn(),
  findAllWithChildren: jest.fn(),
  findOne: jest.fn(),
};

const expectedCategories = [
  {
    id: 1,
    name: 'Category 1',
    parentId: null,
    createdAt: new Date('2023-01-01T00:00:00.000Z'),
    updatedAt: new Date('2023-01-01T00:00:00.000Z'),
  },
  {
    id: 2,
    name: 'Category 2',
    parentId: null,
    createdAt: new Date('2023-01-02T00:00:00.000Z'),
    updatedAt: new Date('2023-01-02T00:00:00.000Z'),
  },
];

describe('CategoriesController', () => {
  let controller: CategoriesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesController],
      providers: [
        JwtService,
        Reflector,
        PrismaService,
        {
          provide: CategoriesService,
          useValue: mockCategoriesService,
        },
        {
          provide: config.KEY,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    controller = module.get<CategoriesController>(CategoriesController);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of categories', async () => {
      mockCategoriesService.findAll.mockResolvedValue(expectedCategories);

      const result = await controller.findAll();

      expect(result).toEqual(expectedCategories);
      expect(mockCategoriesService.findAll).toHaveBeenCalled();
    });
  });

  describe('findAllWithChildren', () => {
    it('should return an array of categories with children', async () => {
      mockCategoriesService.findAllWithChildren.mockResolvedValue(
        expectedCategories,
      );

      const result = await controller.findAllWithChildren();

      expect(result).toEqual(expectedCategories);
      expect(mockCategoriesService.findAllWithChildren).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a category by id', async () => {
      const categoryId = 1;
      mockCategoriesService.findOne.mockResolvedValue(expectedCategories[0]);

      const result = await controller.findOne(categoryId.toString());

      expect(result).toEqual(expectedCategories[0]);
      expect(mockCategoriesService.findOne).toHaveBeenCalledWith(categoryId);
    });
  });
});
