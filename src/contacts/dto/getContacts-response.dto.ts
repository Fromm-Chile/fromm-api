import { Contact } from '@prisma/client';
import { IsArray, IsNumber, ValidateNested } from 'class-validator';

export class GetContactsResponseDto {
  @IsArray()
  @ValidateNested({ each: true })
  contactos: Contact[];

  @IsNumber()
  totalPages: number;
}
