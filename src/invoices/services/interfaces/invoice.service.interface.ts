import { OmitType } from '@nestjs/mapped-types';
import { Invoice } from '@prisma/client';
import { CreateInvoiceDto } from 'src/invoices/controllers/dto/create-invoice.dto';
import { FilterInvoicesDto } from 'src/invoices/controllers/dto/filter-invoice.dto';

export class CreateInvoiceByCountryDto extends CreateInvoiceDto {
  countryId: number;
}

export class CreateInvoiceByCountryDtoForAdmin extends OmitType(
  CreateInvoiceDto,
  ['invoiceDetails'],
) {
  countryId: number;
}

export interface IInvoicesService {
  create(createInvoiceDto: CreateInvoiceDto): Promise<Invoice>;
  createByAdmin(
    createInvoiceDto: CreateInvoiceByCountryDto,
    adminUserId: number,
  ): Promise<Invoice>;
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
