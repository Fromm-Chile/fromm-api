import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesService } from '../categories.service';
import { CategoriesRepository } from '../../repositories/categories.repository';
import { Category } from '@prisma/client';

const mockCategoriesRepository = {
  findAll: jest.fn(),
  findAllWithChildren: jest.fn(),
  findOne: jest.fn(),
};

const mockCategories: Category[] = [
  {
    id: 1,
    name: 'Electronics',
    parentCategory: null,
    createdAt: new Date('2023-01-01T00:00:00.000Z'),
    updatedAt: new Date('2023-01-01T00:00:00.000Z'),
  },
  {
    id: 2,
    name: 'Smartphones',
    parentCategory: 1,
    createdAt: new Date('2023-01-01T00:00:00.000Z'),
    updatedAt: new Date('2023-01-01T00:00:00.000Z'),
  },
  {
    id: 3,
    name: 'Laptops',
    parentCategory: 1,
    createdAt: new Date('2023-01-01T00:00:00.000Z'),
    updatedAt: new Date('2023-01-01T00:00:00.000Z'),
  },
];

const mockCategoriesWithChildren = [
  {
    id: 1,
    name: 'Electronics',
    parentCategory: null,
    createdAt: new Date('2023-01-01T00:00:00.000Z'),
    updatedAt: new Date('2023-01-01T00:00:00.000Z'),
    other_Categories: [
      {
        id: 2,
        name: 'Smartphones',
        parentCategory: 1,
        createdAt: new Date('2023-01-01T00:00:00.000Z'),
        updatedAt: new Date('2023-01-01T00:00:00.000Z'),
      },
      {
        id: 3,
        name: 'Laptops',
        parentCategory: 1,
        createdAt: new Date('2023-01-01T00:00:00.000Z'),
        updatedAt: new Date('2023-01-01T00:00:00.000Z'),
      },
    ],
  },
];

describe('CategoriesService', () => {
  let service: CategoriesService;
  let repository: CategoriesRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        {
          provide: CategoriesRepository,
          useValue: mockCategoriesRepository,
        },
      ],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
    repository = module.get<CategoriesRepository>(CategoriesRepository);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all categories', async () => {
      mockCategoriesRepository.findAll.mockResolvedValue(mockCategories);

      const result = await service.findAll();

      expect(result).toEqual(mockCategories);
      expect(mockCategoriesRepository.findAll).toHaveBeenCalledWith();
    });

    it('should handle empty categories list', async () => {
      mockCategoriesRepository.findAll.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
      expect(mockCategoriesRepository.findAll).toHaveBeenCalledWith();
    });
  });

  describe('findAllWithChildren', () => {
    it('should return all categories with their children', async () => {
      mockCategoriesRepository.findAllWithChildren.mockResolvedValue(
        mockCategoriesWithChildren,
      );

      const result = await service.findAllWithChildren();

      expect(result).toEqual(mockCategoriesWithChildren);
      expect(
        mockCategoriesRepository.findAllWithChildren,
      ).toHaveBeenCalledWith();
    });

    it('should handle categories without children', async () => {
      const categoriesWithoutChildren = [
        {
          id: 1,
          name: 'Electronics',
          parentCategory: null,
          createdAt: new Date('2023-01-01T00:00:00.000Z'),
          updatedAt: new Date('2023-01-01T00:00:00.000Z'),
          other_Categories: [],
        },
      ];

      mockCategoriesRepository.findAllWithChildren.mockResolvedValue(
        categoriesWithoutChildren,
      );

      const result = await service.findAllWithChildren();

      expect(result).toEqual(categoriesWithoutChildren);
      expect(
        mockCategoriesRepository.findAllWithChildren,
      ).toHaveBeenCalledWith();
    });
  });

  describe('findOne', () => {
    it('should return a category by id', async () => {
      const categoryId = 1;
      const expectedCategory = mockCategories[0];

      mockCategoriesRepository.findOne.mockResolvedValue(expectedCategory);

      const result = await service.findOne(categoryId);

      expect(result).toEqual(expectedCategory);
      expect(mockCategoriesRepository.findOne).toHaveBeenCalledWith(categoryId);
    });

    it('should return null when category is not found', async () => {
      const categoryId = 999;

      mockCategoriesRepository.findOne.mockResolvedValue(null);

      const result = await service.findOne(categoryId);

      expect(result).toBeNull();
      expect(mockCategoriesRepository.findOne).toHaveBeenCalledWith(categoryId);
    });

    it('should handle invalid category id', async () => {
      const invalidId = -1;

      mockCategoriesRepository.findOne.mockResolvedValue(null);

      const result = await service.findOne(invalidId);

      expect(result).toBeNull();
      expect(mockCategoriesRepository.findOne).toHaveBeenCalledWith(invalidId);
    });
  });
});
