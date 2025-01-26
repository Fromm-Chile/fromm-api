import { Category } from '@prisma/client';
import { CreateCategoryDto } from '../../controllers/dto/create-category.dto';
import { UpdateCategoryDto } from '../../controllers/dto/update-category.dto';

export interface ICategoryRepository {
  create(createCategoryDto: CreateCategoryDto): string;
  findAll(): Promise<Category[]>;
  findAllWithChildren(): Promise<Category[]>;
  findOne(id: number): Promise<Category>;
  update(id: number, updateCategoryDto: UpdateCategoryDto): string;
  remove(id: number): string;
}
