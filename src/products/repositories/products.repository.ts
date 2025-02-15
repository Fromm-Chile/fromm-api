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
    const products = await this.prisma.product.findMany({
      skip: filter.page * 9 || 0,
      take: 9,
      where: {
        categoryId: filter.categoryId && +filter.categoryId,
        name: {
          contains: filter.name,
        },
      },
      include: {
        images: true,
      },
    });
    products.map((product) => {
      product.jsonDetails = JSON.parse(product.jsonDetails);
      return product;
    });
    return products;
  }

  async findCountPages(filter: FilterProductsDto) {
    const count = await this.prisma.product.count({
      where: {
        categoryId: filter.categoryId && +filter.categoryId,
        name: {
          contains: filter.name,
        },
      },
    });

    return Math.ceil(count / 9);
  }

  async findAllByCategory(categoryId: number) {
    const products = await this.prisma.product.findMany({
      where: {
        categoryId,
      },
      include: {
        images: true,
      },
    });
    products.map((product) => {
      product.jsonDetails = JSON.parse(product.jsonDetails);
      return product;
    });
    return products;
  }

  async findOne(id: number) {
    const product = await this.prisma.product.findUnique({
      where: {
        id,
      },
      include: {
        images: true,
      },
    });
    product.jsonDetails = JSON.parse(product.jsonDetails);
    return product;
  }

  async findMany(ids: number[]) {
    const products = await this.prisma.product.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
    return products;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
