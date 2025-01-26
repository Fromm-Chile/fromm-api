// filepath: /Users/rexguzman/fromm/fromm-api/src/products/services/interfaces/product.service.interface.ts

import { ProductEntity } from 'src/products/repositories/entities/product.entity';
import { CreateProductDto } from '../../controllers/dto/create-product.dto';
import { UpdateProductDto } from '../../controllers/dto/update-product.dto';
import { Product } from '@prisma/client';

export interface IProductsService {
  create(createProductDto: CreateProductDto): string;
  findAll(): Promise<Product[]>;
  findOne(id: number): string;
  update(id: number, updateProductDto: UpdateProductDto): string;
  remove(id: number): string;
}
