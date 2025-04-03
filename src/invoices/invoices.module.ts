import { Module } from '@nestjs/common';
import { InvoicesService } from './services/invoices.service';
import { InvoicesRepository } from './repositories/invoices.repository';
import { InvoicesController } from './controllers/invoices.controller';
import { UsersModule } from 'src/users/users.module';
import { EmailModule } from 'src/emails/emails.module';
import { ProductsModule } from 'src/products/products.module';
import { InvoicesControllerPeru } from './controllers/invoices.pe.controller';

@Module({
  controllers: [InvoicesController, InvoicesControllerPeru],
  providers: [InvoicesService, InvoicesRepository],
  imports: [UsersModule, EmailModule, ProductsModule],
})
export class InvoicesModule {}
