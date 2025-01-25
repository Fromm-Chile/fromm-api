import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from '../controllers/dto/create-category.dto';
import { UpdateCategoryDto } from '../controllers/dto/update-category.dto';
import { ICategoryRepository } from './interfaces/category.repository.interface';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class CategoriesRepository implements ICategoryRepository {
  constructor(private prisma: PrismaService) {}

  create(createCategoryDto: CreateCategoryDto) {
    return 'This action adds a new category';
  }

  findAll() {
    return this.prisma.categories.findMany();
  }

  findOne(id: number) {
    return this.prisma.categories.findUnique({
      where: {
        id,
      },
    });
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }
}
