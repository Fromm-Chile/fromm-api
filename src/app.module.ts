import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { InvoicesModule } from './invoices/invoices.module';
import { UsersModule } from './users/users.module';
import { CategoriesModule } from './categories/categories.module';
import { PrismaModule } from 'prisma/prisma.module';
import { ContactsModule } from './contacts/contacts.module';
import { ConfigModule } from '@nestjs/config';
import { EmailModule } from './emails/emails.module';
import { AuthModule } from './auth/auth.module';
import config from 'config/config';

@Module({
  imports: [
    ProductsModule,
    InvoicesModule,
    UsersModule,
    CategoriesModule,
    PrismaModule,
    ContactsModule,
    EmailModule,
    AuthModule,
    ConfigModule.forRoot({
      load: [config],
      isGlobal: true,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
