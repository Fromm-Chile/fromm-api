import { Contact, Prisma } from '@prisma/client';
import { CreateContactDto } from 'src/contacts/controllers/dto/create-dto';
import { UpdateContactDto } from 'src/contacts/controllers/dto/update-dto';

export class CreateContactByCountryDto extends CreateContactDto {
  countryId: number;
}

export interface IContactsRepository {
  create(
    contact: Prisma.ContactCreateWithoutUserInput,
    userId: number,
  ): Promise<Contact>;
  findAllContacts(): Promise<Contact[]>;
  findAllServices(): Promise<Contact[]>;
  findOneContact(id: number): Promise<Contact>;
  update(id: number, updateContactDto: UpdateContactDto): Promise<Contact>;
  remove(id: number): Promise<Contact>;
}
