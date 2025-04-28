import { Injectable } from '@nestjs/common';
import { ContactsRepository } from '../repositories/contacts.repository';
import { UpdateContactDto } from '../controllers/dto/update-dto';
import { UsersService } from '../../users/services/users.service';
import { EmailService } from 'src/emails/emails.service';
import { CreateContactByCountryDto } from '../repositories/interfaces/contact.repository.interfaces';
import { FilterContactDto } from '../controllers/dto/filter-contact-dto';

@Injectable()
export class ContactsService {
  constructor(
    private readonly contactsRepository: ContactsRepository,
    private readonly usersService: UsersService,
    private readonly emailService: EmailService,
  ) {}

  async create(createContactDto: CreateContactByCountryDto) {
    const { countryId, ...contactData } = createContactDto;
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
        countryId: createContactDto.countryId,
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

  async getContactCount(code: string, connectType: string) {
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
      'COTIZADO',
      connectType,
    );
    return {
      totalCount,
      pendingContacts,
      invoiceContacts,
    };
  }

  async getAllContacts(filter: FilterContactDto) {
    const contactos = await this.contactsRepository.findAllContacts(filter);

    const totalPages = await this.contactsRepository.findCountPages(filter);

    return {
      contactos,
      totalPages,
    };
  }

  async findOneContact(id: number) {
    return await this.contactsRepository.findOneContact(id);
  }

  update(id: number, updateContactDto: UpdateContactDto) {
    return this.contactsRepository.update(id, updateContactDto);
  }

  remove(id: number) {
    return this.contactsRepository.remove(id);
  }
}
