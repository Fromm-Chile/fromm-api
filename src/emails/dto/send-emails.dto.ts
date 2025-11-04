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

  @IsNumber()
  countryId: number;
}
