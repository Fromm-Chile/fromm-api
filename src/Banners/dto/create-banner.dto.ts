import { IsString, IsNotEmpty, IsUrl, IsNumber } from 'class-validator';

export class CreateBannerDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsUrl()
  url: string;

  @IsNotEmpty()
  @IsNumber()
  order: number;

  @IsNotEmpty()
  @IsNumber()
  countryId: number;
}
