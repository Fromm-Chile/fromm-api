import { IsNumber, Validate } from 'class-validator';
import { GetInvoicesResponseDto } from './get-invoices-response.dto';
import { Type } from 'class-transformer';

export class GetInvoicesAndCountResponseDto {
  @Type(() => GetInvoicesResponseDto)
  @Validate(GetInvoicesResponseDto, { each: true })
  cotizaciones: GetInvoicesResponseDto[];

  @IsNumber()
  totalCount: number;
}
