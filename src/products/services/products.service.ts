import { Injectable } from '@nestjs/common';
import { CreateProductDto } from '../controllers/dto/create-product.dto';
import { UpdateProductDto } from '../controllers/dto/update-product.dto';
import { IProductsService } from './interfaces/product.service.interface';
import { ProductsRepository } from '../repositories/products.repository';
import { FilterProductsDto } from '../controllers/dto/filter-product.dto';

@Injectable()
export class ProductsService implements IProductsService {
  constructor(private readonly productRepository: ProductsRepository) {}
  create(createProductDto: CreateProductDto) {
    return 'This action adds a new product';
  }

  async findAll(filter: FilterProductsDto) {
    console.log("filter", filter);
    const products = await this.productRepository.findAll(filter);
    const productObject = products.map((product) => {
      return {
        id: product.id,
        slug: product.slug,
        srcImg: product.image.map((image) => image.url),
        alt: product.alt,
        categoryId: product.categoryId,
        name: product.name,
        subtitle: product.subtitle,
        jsonDetails: product.jsonDetails,
      };
    });

    return productObject;
  }

  async findAllByCategory(categoryId: number) {
    const products = await this.productRepository.findAllByCategory(categoryId);
    const productObject = products.map((product) => {
      return {
        id: product.id,
        slug: product.slug,
        srcImg: product.image.map((image) => image.url),
        alt: product.alt,
        categoryId: product.categoryId,
        name: product.name,
        subtitle: product.subtitle,
        jsonDetails: product.jsonDetails,
      };
    });

    return productObject;
  }

  async findOne(id: number) {
    const product = await this.productRepository.findOne(id);
    return {
      id: product.id,
      slug: product.slug,
      srcImg: product.image.map((image) => image.url),
      alt: product.alt,
      categoryId: product.categoryId,
      name: product.name,
      subtitle: product.subtitle,
      desc: product.desc,
      jsonDetails: product.jsonDetails,
    };
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
