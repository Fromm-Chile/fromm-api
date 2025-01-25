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

  async findAll() {
    return await this.prisma.category.findMany();
  }

  async findAllWithChildren() {
    return await this.prisma.category.findMany({include: {other_Categories: true}});
  }

  findOne(id: number) {
    return this.prisma.category.findUnique({
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
