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
import { UsersAdminModule } from './usersAdmin/usersAdmin.module';
import { InvoiceHistoryModule } from './invoiceHistory/invoiceHistory.module';
import { BannersModule } from './Banners/banners.module';

@Module({
  imports: [
    ProductsModule,
    InvoicesModule,
    UsersModule,
    UsersAdminModule,
    CategoriesModule,
    PrismaModule,
    ContactsModule,
    EmailModule,
    AuthModule,
    BannersModule,
    InvoiceHistoryModule,
    ConfigModule.forRoot({
      load: [config],
      isGlobal: true,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
