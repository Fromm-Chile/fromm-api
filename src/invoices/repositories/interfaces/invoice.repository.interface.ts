import { Invoice, Prisma } from '@prisma/client';

export interface IInvoiceRepository {
  create(invoice: Prisma.InvoiceCreateInput, userId: number): Promise<Invoice>;
  findAll(): string;
  findOne(id: number): string;
  update(id: number): string;
  remove(id: number): string;
}
