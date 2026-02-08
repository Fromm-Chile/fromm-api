import { Contact } from '@prisma/client';
import { CreateContactByCountryDto } from './contact.repository.interface';
import { FilterContactDto } from '../dto/filter-contact-dto';
import { GetContactsResponseDto } from '../dto/getContacts-response.dto';
import { ContactsCountResponseDto } from '../dto/contactsCount-response.dto';

export interface IContactsService {
  create(createContactDto: CreateContactByCountryDto): Promise<Contact>;
  getContactCount(
    code: string,
    connectType: string,
  ): Promise<ContactsCountResponseDto>;
  getAllContacts(filter: FilterContactDto): Promise<GetContactsResponseDto>;
  getAllContactsByUserId(id: number, code: string): Promise<Contact[]>;
  findOneContact(id: number): Promise<Contact>;
  update(id: number, updateContactDto: Partial<Contact>): Promise<Contact>;
  updateStatus(id: number, statusId: number): Promise<Contact>;
  updateContactType(id: number): Promise<Contact>;
  updateStatusDerivado(id: number, department: string): Promise<Contact>;
  remove(id: number): Promise<Contact>;
}
