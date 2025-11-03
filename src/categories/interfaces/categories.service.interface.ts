import { Category } from '@prisma/client';

export interface ICategoriesService {
  findAll(): Promise<Category[]>;
  findAllWithChildren(): Promise<Category[]>;
  findOne(id: number): Promise<Category | null>;
}
