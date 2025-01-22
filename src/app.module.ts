import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { InvoicesModule } from './invoices/invoices.module';
import { UsersModule } from './users/users.module';
import { CategoriesModule } from './categories/categories.module';
import { PrismaModule } from 'prisma/prisma.module';

@Module({
  imports: [
    ProductsModule,
    InvoicesModule,
    UsersModule,
    CategoriesModule,
    PrismaModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
