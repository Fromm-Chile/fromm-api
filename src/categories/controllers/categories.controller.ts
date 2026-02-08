import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { CategoriesService } from '../services/categories.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { Public } from 'src/auth/decorators/public.decorator';
import { Category } from '@prisma/client';

@UseGuards(AuthGuard)
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  findAll(): Promise<Category[]> {
    return this.categoriesService.findAll();
  }

  @Public()
  @Get('subcategories')
  findAllWithChildren(): Promise<Category[]> {
    return this.categoriesService.findAllWithChildren();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Category> {
    return this.categoriesService.findOne(+id);
  }
}
