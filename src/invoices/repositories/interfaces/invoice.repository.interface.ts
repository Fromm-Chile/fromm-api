import { Invoice, Prisma } from '@prisma/client';
import { FilterInvoicesDto } from 'src/invoices/controllers/dto/filter-invoice.dto';
import { UpdateInvoiceDto } from 'src/invoices/controllers/dto/update-invoice.dto';

export interface IInvoiceRepository {
  create(invoice: Prisma.InvoiceCreateInput, userId: number): Promise<Invoice>;
  totalCount(code: string): Promise<number>;
  statusCount(code: string, status: string): Promise<number>;
  findAllAdmin(filter: FilterInvoicesDto): Promise<Invoice[]>;
  findOne(id: number): Promise<Invoice>;
  updateStatus(dto: UpdateInvoiceDto, id: number): Promise<Invoice>;
  remove(id: number): string;
}
