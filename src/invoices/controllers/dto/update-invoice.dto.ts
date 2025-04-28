import { PartialType } from '@nestjs/mapped-types';
import { CreateInvoiceDto } from './create-invoice.dto';
import { IsNumber, IsOptional, ValidateNested } from 'class-validator';

export class UpdateInvoiceDto extends PartialType(CreateInvoiceDto) {
  @IsNumber()
  statusId: number;

  @IsNumber()
  @IsOptional()
  readonly invoiceUrl: string;

  @IsNumber()
  @IsOptional()
  readonly totalAmount: number;
}
