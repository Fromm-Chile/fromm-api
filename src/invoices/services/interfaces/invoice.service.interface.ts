import { Invoice } from '@prisma/client';
import { CreateInvoiceDto } from 'src/invoices/controllers/dto/create-invoice.dto';
import { UpdateInvoiceDto } from 'src/invoices/controllers/dto/update-invoice.dto';

export interface IInvoicesService {
  create(createInvoiceDto: CreateInvoiceDto): Promise<Invoice>;
  findAll(): string;
  findOne(id: number): string;
  update(id: number, updateInvoiceDto: UpdateInvoiceDto): string;
  remove(id: number): string;
}
