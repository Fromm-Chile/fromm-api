import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { ICategoriesRepository } from '../interfaces/categorires.repository.interface';

@Injectable()
export class CategoriesRepository implements ICategoriesRepository {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return await this.prisma.category.findMany();
  }

  async findAllWithChildren() {
    return await this.prisma.category.findMany({
      where: { parentCategory: null },
      include: { other_Categories: true },
    });
  }

  findOne(id: number) {
    return this.prisma.category.findUnique({
      where: {
        id,
      },
    });
  }
}
