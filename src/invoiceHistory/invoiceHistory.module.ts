import { Module } from '@nestjs/common';
import { InvoiceHistoryService } from './services/invoiceHistory.service';
import { InvoiceHistoryRepository } from './repositories/invoiceHistory.repository';

@Module({
  controllers: [],
  providers: [InvoiceHistoryService, InvoiceHistoryRepository],
  exports: [InvoiceHistoryService],
})
export class InvoiceHistoryModule {}
