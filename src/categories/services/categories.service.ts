import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from '../controllers/dto/create-category.dto';
import { UpdateCategoryDto } from '../controllers/dto/update-category.dto';

@Injectable()
export class CategoriesService {
  create(createCategoryDto: CreateCategoryDto) {
    return 'This action adds a new category';
  }

  findAll() {
    return `This action returns all categories`;
  }

  findOne(id: number) {
    return `This action returns a category with id ${id}`;
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a category with id ${id}`;
  }

  remove(id: number) {
    return `This action removes a category with id ${id}`;
  }
}