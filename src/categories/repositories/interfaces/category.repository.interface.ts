import { CreateCategoryDto } from '../../controllers/dto/create-category.dto';
import { UpdateCategoryDto } from '../../controllers/dto/update-category.dto';
import { CategoryEntity } from '../entities/category.entity';

export interface ICategoryRepository {
  create(createCategoryDto: CreateCategoryDto): string;
  findAll(): CategoryEntity[];
  findOne(id: number): string;
  update(id: number, updateCategoryDto: UpdateCategoryDto): string;
  remove(id: number): string;
}
