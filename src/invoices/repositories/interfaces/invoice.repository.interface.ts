import { Invoice, Prisma } from '@prisma/client';
import { FilterInvoicesDto } from 'src/invoices/controllers/dto/filter-invoice.dto';

export interface IInvoiceRepository {
  create(invoice: Prisma.InvoiceCreateInput, userId: number): Promise<Invoice>;
  findAll(code: string): Promise<Invoice[]>;
  findAllAdmin(filter: FilterInvoicesDto): Promise<Invoice[]>;
  findOne(id: number): Promise<Invoice>;
  update(id: number): string;
  remove(id: number): string;
}
