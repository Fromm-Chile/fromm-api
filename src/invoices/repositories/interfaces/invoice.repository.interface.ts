import { Invoice, Prisma } from '@prisma/client';

export interface IInvoiceRepository {
  create(invoice: Prisma.InvoiceCreateInput, userId: number): Promise<Invoice>;
  findAll(): Promise<Invoice[]>;
  findOne(id: number): Promise<Invoice>;
  update(id: number): string;
  remove(id: number): string;
}
