import { Contact } from '@prisma/client';
import { CreateContactDto } from 'src/contacts/controllers/dto/create-dto';
import { UpdateContactDto } from 'src/contacts/controllers/dto/update-dto';

export interface IContactsRepository {
  create(createContactDto: CreateContactDto): Promise<Contact>;
  findAllContacts(): Promise<Contact[]>;
  findAllServices(): Promise<Contact[]>;
  findOneContact(id: number): Promise<Contact>;
  update(id: number, updateContactDto: UpdateContactDto): Promise<Contact>;
  remove(id: number): Promise<Contact>;
}
