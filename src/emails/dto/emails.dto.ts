import { IsString, IsOptional, IsEmail } from 'class-validator';
import { CreateContactDto } from 'src/contacts/controllers/dto/create-dto';

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

export class SendContactEmailDto {
  @IsEmail({}, { each: true })
  recipients: string[];
  contactDto: CreateContactDto;
}
