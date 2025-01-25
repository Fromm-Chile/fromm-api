import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from '../controllers/dto/create-category.dto';
import { UpdateCategoryDto } from '../controllers/dto/update-category.dto';
import { CategoriesRepository } from '../repositories/categories.repository';

@Injectable()
export class CategoriesService {
  constructor(private categoriesRepository: CategoriesRepository) {}

  create(createCategoryDto: CreateCategoryDto) {
    return 'This action adds a new category';
  }

  findAll() {
    return this.categoriesRepository.findAll();
  }

  findOne(id: number) {
    return this.categoriesRepository.findOne(id);
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a category with id ${id}`;
  }

  remove(id: number) {
    return `This action removes a category with id ${id}`;
  }
}
