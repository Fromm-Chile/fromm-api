import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesRepository } from '../categories.repository';
import { PrismaService } from 'prisma/prisma.service';

const mockPrismaService = {
  category: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
  },
};

describe('CategoriesRepository', () => {
  let repository: CategoriesRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesRepository,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    repository = module.get<CategoriesRepository>(CategoriesRepository);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('findAll', () => {
    it('should call prisma.category.findMany and return categories', async () => {
      const expectedCategories = [
        { id: 1, name: 'Category 1', parentId: null },
        { id: 2, name: 'Category 2', parentId: 1 },
      ];
      mockPrismaService.category.findMany.mockResolvedValue(expectedCategories);

      const categories = await repository.findAll();

      expect(mockPrismaService.category.findMany).toHaveBeenCalled();
      expect(categories).toEqual(expectedCategories);
    });
  });

  describe('findOne', () => {
    it('should call prisma.category.findUnique and return a category', async () => {
      const categoryId = 1;
      const expectedCategory = {
        id: categoryId,
        name: 'Category 1',
        parentId: null,
      };
      mockPrismaService.category.findUnique.mockResolvedValue(expectedCategory);

      const category = await repository.findOne(categoryId);

      expect(mockPrismaService.category.findUnique).toHaveBeenCalledWith({
        where: { id: categoryId },
      });
      expect(category).toEqual(expectedCategory);
    });
  });

  describe('findAllWithChildren', () => {
    it('should return categories with their children', async () => {
      const expectedCategories = [
        {
          id: 1,
          name: 'Category 1',
          parentId: null,
          children: [
            { id: 2, name: 'Category 2', parentId: 1 },
            { id: 3, name: 'Category 3', parentId: 1 },
          ],
        },
        {
          id: 4,
          name: 'Category 4',
          parentId: null,
          children: [],
        },
      ];
      mockPrismaService.category.findMany.mockResolvedValue(expectedCategories);

      const categories = await repository.findAllWithChildren();

      expect(mockPrismaService.category.findMany).toHaveBeenCalledWith({
        where: { parentCategory: null },
        include: { other_Categories: true },
      });
      expect(categories).toEqual(expectedCategories);
    });
  });
});
