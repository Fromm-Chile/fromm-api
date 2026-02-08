import { IsNumber, IsString } from 'class-validator';

export class FilterInvoicesDto {
  @IsString()
  status?: string;

  @IsNumber()
  page?: number;

  @IsString()
  name?: string;

  @IsString()
  code?: string;

  @IsNumber()
  limit?: number;

  @IsString()
  idOrder?: string;
}
