import { Invoice } from '@prisma/client';
import { CreateInvoiceDto } from 'src/invoices/controllers/dto/create-invoice.dto';
import { UpdateInvoiceDto } from 'src/invoices/controllers/dto/update-invoice.dto';

export class CreateInvoiceByCountryDto extends CreateInvoiceDto {
  countryId: number;
}

export interface IInvoicesService {
  create(createInvoiceDto: CreateInvoiceDto): Promise<Invoice>;
  getInvoices(): Promise<Invoice[]>;
  getOneInvoice(id: number): Promise<Invoice>;
  update(id: number, updateInvoiceDto: UpdateInvoiceDto): string;
  remove(id: number): string;
}
