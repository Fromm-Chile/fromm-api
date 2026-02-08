import { Injectable } from '@nestjs/common';
import { CategoriesRepository } from '../repositories/categories.repository';
import { Category } from '@prisma/client';
import { ICategoriesService } from '../interfaces/categories.service.interface';

@Injectable()
export class CategoriesService implements ICategoriesService {
  constructor(private categoriesRepository: CategoriesRepository) {}

  findAll(): Promise<Category[]> {
    return this.categoriesRepository.findAll();
  }

  async findAllWithChildren(): Promise<Category[]> {
    return await this.categoriesRepository.findAllWithChildren();
  }

  findOne(id: number): Promise<Category | null> {
    return this.categoriesRepository.findOne(id);
  }
}
