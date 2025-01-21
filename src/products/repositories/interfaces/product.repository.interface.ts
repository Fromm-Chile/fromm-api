// filepath: /Users/rexguzman/fromm/fromm-api/src/products/services/interfaces/product.service.interface.ts

import { CreateProductDto } from '../../controllers/dto/create-product.dto';
import { UpdateProductDto } from '../../controllers/dto/update-product.dto';
import { ProductEntity } from '../entities/product.entity';

export interface IProductsRepository {
  create(createProductDto: CreateProductDto): string;
  findAll(): ProductEntity[];
  findOne(id: number): string;
  update(id: number, updateProductDto: UpdateProductDto): string;
  remove(id: number): string;
}