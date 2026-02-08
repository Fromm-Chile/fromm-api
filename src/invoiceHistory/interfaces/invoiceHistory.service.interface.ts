import { InvoiceEventHistory } from '@prisma/client';
import { CreateInvoiceHistoryDto } from '../dto/create-invoiceHistory.dto';

export interface IInvoiceHistoryService {
  create(
    createInvoiceHistoryDto: CreateInvoiceHistoryDto,
  ): Promise<InvoiceEventHistory>;
  findAll(): Promise<InvoiceEventHistory[]>;
  findOne(id: number): Promise<InvoiceEventHistory | null>;
  remove(id: number): Promise<InvoiceEventHistory>;
}
