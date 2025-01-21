import { Injectable } from '@nestjs/common';
import { CreateProductDto } from '../controllers/dto/create-product.dto';
import { UpdateProductDto } from '../controllers/dto/update-product.dto';
import { IProductsRepository } from './interfaces/product.repository.interface';
import { products } from 'src/data/data';
import { ProductEntity } from './entities/product.entity';

@Injectable()
export class ProductsRepository implements IProductsRepository {
  create(createProductDto: CreateProductDto) {
    return 'This action adds a new product';
  }

  findAll(): ProductEntity[] {
    return products;
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
