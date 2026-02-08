import { IsNumber } from 'class-validator';

export class ContactsCountResponseDto {
  @IsNumber()
  totalCount: number;

  @IsNumber()
  pendingContacts: number;

  @IsNumber()
  invoiceContacts: number;

  @IsNumber()
  endedContacts: number;
}
