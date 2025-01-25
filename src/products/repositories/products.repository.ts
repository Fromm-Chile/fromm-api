import { Injectable } from '@nestjs/common';
import { CreateProductDto } from '../controllers/dto/create-product.dto';
import { UpdateProductDto } from '../controllers/dto/update-product.dto';
import { IProductsRepository } from './interfaces/product.repository.interface';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class ProductsRepository implements IProductsRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(createProductDto: CreateProductDto) {
    return 'This action adds a new product';
  }

  findAll() {
    return `This action returns all products`;
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
