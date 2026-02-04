import { PartialType } from '@nestjs/mapped-types';
import { CreateInvoiceDto } from './create-invoice.dto';
import { IsNumber, IsOptional } from 'class-validator';

export class UpdateInvoiceDto extends PartialType(CreateInvoiceDto) {
  @IsNumber()
  @IsOptional()
  readonly totalAmount: number;
}
