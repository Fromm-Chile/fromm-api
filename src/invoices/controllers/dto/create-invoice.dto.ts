import {
  IsInt,
  IsArray,
  ValidateNested,
  IsNotEmpty,
  ArrayMinSize,
  IsString,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

class CreateInvoiceDetailDto {
  @IsInt()
  @IsNotEmpty()
  readonly productId: number;

  @IsInt()
  @IsNotEmpty()
  readonly quantity: number;

  @IsString()
  @IsOptional()
  readonly name: string;
}

export class CreateInvoiceDto {
  @IsString()
  readonly email: string;

  @IsString()
  readonly name: string;

  @IsOptional()
  @IsString()
  readonly phone: string;

  @IsOptional()
  @IsString()
  readonly company: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateInvoiceDetailDto)
  readonly invoiceDetails: CreateInvoiceDetailDto[];
}
