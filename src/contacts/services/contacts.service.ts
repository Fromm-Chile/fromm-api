import { Injectable } from '@nestjs/common';
import { ContactsRepository } from '../repositories/contacts.repository';
import { UpdateContactDto } from '../dto/update-dto';
import { EmailService } from 'src/emails/services/emails.service';
import { UsersService } from '../../users/services/users.service';
import { CreateContactByCountryDto } from '../interfaces/contact.repository.interface';
import { FilterContactDto } from '../dto/filter-contact-dto';
import { Contact } from '@prisma/client';
import { ContactsCountResponseDto } from '../dto/contactsCount-response.dto';
import { GetContactsResponseDto } from '../dto/getContacts-response.dto';
import { IContactsService } from '../interfaces/contact.service.interface';

@Injectable()
export class ContactsService implements IContactsService {
  constructor(
    private readonly contactsRepository: ContactsRepository,
    private readonly usersService: UsersService,
    private readonly emailService: EmailService,
  ) {}

  async create(createContactDto: CreateContactByCountryDto): Promise<Contact> {
    const { countryId, rucPeru, ...contactData } = createContactDto;
    let user = await this.usersService.findOneByEmail(
      createContactDto.email,
      countryId,
    );

    if (!user) {
      user = await this.usersService.create({
        email: createContactDto.email,
        name: createContactDto.name,
        phone: createContactDto.phone,
        company: createContactDto.company,
        rucPeru,
        countryId,
      });
    }
    const newContact = await this.contactsRepository.create(
      contactData,
      user.id,
    );

    await this.emailService.sendContactEmail(createContactDto, newContact.id);

    await this.emailService.sendContactConfirmationUser(user, newContact.id);

    return newContact;
  }

  async getContactCount(
    code: string,
    connectType: string,
  ): Promise<ContactsCountResponseDto> {
    const totalCount = await this.contactsRepository.totalCount(
      code,
      connectType,
    );
    const pendingContacts = await this.contactsRepository.statusCount(
      code,
      'PENDIENTE',
      connectType,
    );
    const invoiceContacts = await this.contactsRepository.statusCount(
      code,
      'COTIZACIÓN',
      connectType,
    );
    const endedContacts = await this.contactsRepository.statusCount(
      code,
      'FINALIZADO',
      connectType,
    );
    return {
      totalCount,
      pendingContacts,
      invoiceContacts,
      endedContacts,
    };
  }

  async getAllContacts(
    filter: FilterContactDto,
  ): Promise<GetContactsResponseDto> {
    const contactos = await this.contactsRepository.findAllContacts(filter);

    const totalPages = await this.contactsRepository.findCountPages(filter);

    return {
      contactos,
      totalPages,
    };
  }

  getAllContactsByUserId(id: number, code: string): Promise<Contact[]> {
    return this.contactsRepository.findContactsByUserId(+id, code);
  }

  findOneContact(id: number): Promise<Contact> {
    return this.contactsRepository.findOneContact(id);
  }

  update(id: number, updateContactDto: UpdateContactDto): Promise<Contact> {
    return this.contactsRepository.update(id, updateContactDto);
  }

  updateStatus(id: number, statusId: number): Promise<Contact> {
    return this.contactsRepository.updateStatus(id, statusId);
  }

  updateContactType(id: number): Promise<Contact> {
    return this.contactsRepository.updateContactType(+id);
  }

  async updateStatusDerivado(id: number, department: string): Promise<Contact> {
    const contact = await this.contactsRepository.findOneContact(id);
    const departmentMessage = `${contact.message} - Derivado a ${department}`;
    return await this.contactsRepository.updateStatusDerivado(
      id,
      departmentMessage,
    );
  }

  remove(id: number): Promise<Contact> {
    return this.contactsRepository.remove(id);
  }
}
