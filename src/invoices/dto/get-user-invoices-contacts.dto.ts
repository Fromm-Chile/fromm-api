import { Contact, Invoice } from '@prisma/client';
import { IsArray } from 'class-validator';

export class GetInvoicesAndContactsResponseDto {
  @IsArray()
  invoices: Invoice[];

  @IsArray()
  contacts: Contact[];
}
