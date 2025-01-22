import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from '../controllers/dto/create-category.dto';
import { UpdateCategoryDto } from '../controllers/dto/update-category.dto';
import { CategoryEntity } from './entities/category.entity';
import { ICategoryRepository } from './interfaces/category.repository.interface';

@Injectable()
export class CategoriesRepository implements ICategoryRepository {
  create(createCategoryDto: CreateCategoryDto) {
    return 'This action adds a new category';
  }

  findAll(): CategoryEntity[] {
    return [];
  }

  findOne(id: number) {
    return `This action returns a #${id} category`;
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }
}
