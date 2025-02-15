// filepath: /Users/rexguzman/fromm/fromm-api/src/products/services/interfaces/product.service.interface.ts

import { FilterProductsDto } from 'src/products/controllers/dto/filter-product.dto';
import { CreateProductDto } from '../../controllers/dto/create-product.dto';
import { UpdateProductDto } from '../../controllers/dto/update-product.dto';

type ProductType = {
  id: number;
  slug: string;
  srcImg: string[];
  alt: string;
  categoryId: number;
  name: string;
  subtitle: string;
  desc?: string;
  jsonDetails?: string;
};

export interface IProductsService {
  create(createProductDto: CreateProductDto): string;
  findAll(
    filter: FilterProductsDto,
  ): Promise<{ products: ProductType[]; totalPages: number }>;
  findOne(id: number): Promise<ProductType>;
  update(id: number, updateProductDto: UpdateProductDto): string;
  remove(id: number): string;
}
