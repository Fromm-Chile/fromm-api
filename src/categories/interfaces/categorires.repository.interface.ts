import { Category } from '@prisma/client';

export interface ICategoriesRepository {
  findAll(): Promise<Category[]>;
  findAllWithChildren(): Promise<Category[]>;
  findOne(id: number): Promise<Category>;
}
