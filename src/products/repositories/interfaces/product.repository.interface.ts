import { Product } from '@prisma/client';
import { FilterProductsDto } from 'src/products/controllers/dto/filter-product.dto';

export interface IProductsRepository {
  findAll(filter: FilterProductsDto): Promise<Product[]>;
  findOne(id: number): Promise<Product>;
}
