import { IsNumber, IsOptional, IsString } from 'class-validator';

export class FilterContactDto {
  @IsString()
  @IsOptional()
  contactType: string;

  @IsString()
  @IsOptional()
  code: string;

  @IsNumber()
  @IsOptional()
  page: number;

  @IsNumber()
  @IsOptional()
  limit: number;

  @IsString()
  @IsOptional()
  status: string;

  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  idOrder: string;
}
