import { Invoice } from '@prisma/client';
import { CreateInvoiceDto } from 'src/invoices/controllers/dto/create-invoice.dto';
import { FilterInvoicesDto } from 'src/invoices/controllers/dto/filter-invoice.dto';
import { GetInvoicesResponseDto } from 'src/invoices/controllers/dto/response.dto';
import { UpdateInvoiceDto } from 'src/invoices/controllers/dto/update-invoice.dto';

export class CreateInvoiceByCountryDto extends CreateInvoiceDto {
  countryId: number;
}

export interface IInvoicesService {
  create(createInvoiceDto: CreateInvoiceDto): Promise<Invoice>;
  getInvoices(code: string): Promise<any>;
  getInvoicesAdmin(filter: FilterInvoicesDto): Promise<{
    cotizaciones: Invoice[];
    totalPages: number;
  }>;
  getOneInvoice(id: number): Promise<Invoice>;
  updateStatusEnviada(
    file: Express.Multer.File,
    id: number,
    adminUserId: number,
    comment: string,
  ): Promise<Invoice>;
  remove(id: number): string;
}
