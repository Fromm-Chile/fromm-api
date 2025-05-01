import { Module } from '@nestjs/common';
import { InvoicesService } from './services/invoices.service';
import { InvoicesRepository } from './repositories/invoices.repository';
import { InvoicesController } from './controllers/invoices.controller';
import { UsersModule } from 'src/users/users.module';
import { EmailModule } from 'src/emails/emails.module';
import { ProductsModule } from 'src/products/products.module';
import { InvoicesControllerPeru } from './controllers/invoices.pe.controller';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from 'src/auth/auth.module';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { InvoicesAdminController } from './controllers/invoices.admin.controller';
import { InvoiceHistoryModule } from 'src/invoiceHistory/invoiceHistory.module';
import { FilesModule } from 'src/files/files.module';

@Module({
  controllers: [
    InvoicesController,
    InvoicesControllerPeru,
    InvoicesAdminController,
  ],
  providers: [
    InvoicesService,
    InvoicesRepository,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
  imports: [
    UsersModule,
    EmailModule,
    ProductsModule,
    AuthModule,
    InvoiceHistoryModule,
    FilesModule,
  ],
})
export class InvoicesModule {}
