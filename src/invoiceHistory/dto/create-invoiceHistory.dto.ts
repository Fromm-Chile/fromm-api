import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateInvoiceHistoryDto {
  @IsNumber()
  invoiceId: number;

  @IsNumber()
  adminUserId: number;

  @IsString()
  status: string;

  @IsString()
  @IsOptional()
  comment?: string;

  @IsDate()
  @IsOptional()
  createdAt?: Date;
}
