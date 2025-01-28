import { Injectable } from '@nestjs/common';
import { CreateProductDto } from '../controllers/dto/create-product.dto';
import { UpdateProductDto } from '../controllers/dto/update-product.dto';
import { IProductsRepository } from './interfaces/product.repository.interface';
import { PrismaService } from 'prisma/prisma.service';
import { FilterProductsDto } from '../controllers/dto/filter-product.dto';

@Injectable()
export class ProductsRepository implements IProductsRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(createProductDto: CreateProductDto) {
    return 'This action adds a new product';
  }

  async findAll(filter: FilterProductsDto) {
    console.log("category", filter.categoryId);
    const products = await this.prisma.product.findMany({
      where: { categoryId: filter.categoryId && +filter.categoryId },
      include: {
        image: true,
      },
    });
    console.log(products.forEach((product) => console.log(product.id)));
    products.map((product) => {
      product.jsonDetails = JSON.parse(product.jsonDetails);
      return product;
    });
    return products;
  }

  async findAllByCategory(categoryId: number) {
    const products = await this.prisma.product.findMany({
      where: {
        categoryId,
      },
      include: {
        image: true,
      },
    });
    products.map((product) => {
      product.jsonDetails = JSON.parse(product.jsonDetails);
      return product;
    });
    return products;
  }

  async findOne(id: number) {
    const product = await this.prisma.product.findFirst({
      where: {
        id,
      },
      include: {
        image: true,
      },
    });
    product.jsonDetails = JSON.parse(product.jsonDetails);
    return product;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
