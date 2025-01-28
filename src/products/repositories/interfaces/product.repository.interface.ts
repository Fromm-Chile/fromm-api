// filepath: /Users/rexguzman/fromm/fromm-api/src/products/services/interfaces/product.service.interface.ts

import { Product } from '@prisma/client';
import { CreateProductDto } from '../../controllers/dto/create-product.dto';
import { UpdateProductDto } from '../../controllers/dto/update-product.dto';
import { FilterProductsDto } from 'src/products/controllers/dto/filter-product.dto';

export interface IProductsRepository {
  create(createProductDto: CreateProductDto): string;
  findAll(filter: FilterProductsDto): Promise<Product[]>;
  findOne(id: number): Promise<Product>;
  update(id: number, updateProductDto: UpdateProductDto): string;
  remove(id: number): string;
}
