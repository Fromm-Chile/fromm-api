import { Contact, Prisma } from '@prisma/client';
import { CreateContactDto } from 'src/contacts/dto/create-contact-dto';
import { FilterContactDto } from 'src/contacts/dto/filter-contact-dto';
import { UpdateContactDto } from 'src/contacts/dto/update-dto';

export class CreateContactByCountryDto extends CreateContactDto {
  countryId: number;
}

export interface IContactsRepository {
  create(
    contact: Prisma.ContactCreateWithoutUserInput,
    userId: number,
  ): Promise<Contact>;
  findAllContacts(filter: FilterContactDto): Promise<Contact[]>;
  findOneContact(id: number): Promise<Contact>;
  update(id: number, updateContactDto: UpdateContactDto): Promise<Contact>;
  remove(id: number): Promise<Contact>;
}
