import { IsString, IsOptional, IsEmail, IsNumber } from 'class-validator';

export class SendEmailDto {
  @IsEmail({}, { each: true })
  recipients: string[];

  @IsString()
  subject: string;

  @IsString()
  html: string;

  @IsOptional()
  @IsString()
  text?: string;
}

export class SendEmailDtoByCountry extends SendEmailDto {
  @IsNumber()
  countryId: number;
}
