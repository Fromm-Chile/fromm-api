import { Invoice, Prisma } from '@prisma/client';
import { FilterInvoicesDto } from 'src/invoices/dto/filter-invoice.dto';

export interface IInvoiceRepository {
  create(invoice: Prisma.InvoiceCreateInput, userId: number): Promise<Invoice>;
  totalCount(code: string): Promise<number>;
  statusCount(code: string, status: string): Promise<number>;
  findAllAdmin(filter: FilterInvoicesDto): Promise<Invoice[]>;
  findOne(id: number): Promise<Invoice>;
  updateStatusEviada(invoiceURL: string, id: number): Promise<Invoice>;
}
